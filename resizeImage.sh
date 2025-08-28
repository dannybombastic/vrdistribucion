#!/usr/bin/env bash
set -euo pipefail

# =======================
# Configuración por defecto
# =======================
JPEG_QUALITY="${JPEG_QUALITY:-75}"   # 0-100
WEBP_QUALITY="${WEBP_QUALITY:-75}"   # 0-100
AVIF_QUALITY="${AVIF_QUALITY:-35}"   # 0-63 (menor = mejor calidad en AV1)
MAX_PARALLEL="${MAX_PARALLEL:-4}"    # procesos en paralelo
DEBUG="${DEBUG:-0}"                   # 1=imprime "Procesando:" y comandos
DRY_RUN="${DRY_RUN:-0}"              # 1=NO modifica nada, solo lista

# =======================
# Entrada
# =======================
[[ $# -ge 1 ]] || { echo "Uso: $0 <directorio_raiz>"; exit 1; }
ROOT="$1"; [[ -d "$ROOT" ]] || { echo "No existe el directorio: $ROOT" >&2; exit 1; }

# =======================
# Utilidades comunes
# =======================
have() { command -v "$1" >/dev/null 2>&1 || [[ -x "/opt/mozjpeg/bin/$1" ]]; }
run_cmd() {
  local bin="$1"; shift
  (( DEBUG )) && echo "[CMD] $bin $*"
  (( DRY_RUN )) && return 0
  if command -v "$bin" >/dev/null 2>&1; then "$bin" "$@"
  elif [[ -x "/opt/mozjpeg/bin/$bin" ]]; then "/opt/mozjpeg/bin/$bin" "$@"
  else return 127; fi
}
logp() { echo "Procesando: $1"; }

# =======================
# Detección de herramientas
# =======================
JPEG_IMPL="none"
if have cjpeg && have jpegtran; then
  JPEG_IMPL="mozjpeg"        # cjpeg + jpegtran (preferido)
elif have cjpeg; then
  JPEG_IMPL="cjpeg_only"     # solo cjpeg (sin jpegtran)
elif have jpegoptim; then
  JPEG_IMPL="jpegoptim"
elif have convert; then
  JPEG_IMPL="imagemagick"
fi

PNG_IMPL="none"
if have pngquant; then
  PNG_IMPL="pngquant"
elif have zopflipng; then
  PNG_IMPL="zopflipng"
elif have optipng; then
  PNG_IMPL="optipng"
elif have convert; then
  PNG_IMPL="imagemagick"
fi

WEBP_OK=false; AVIF_OK=false
have cwebp && WEBP_OK=true
have avifenc && AVIF_OK=true

(( DEBUG )) && echo "[DEBUG] JPEG_IMPL=$JPEG_IMPL  PNG_IMPL=$PNG_IMPL  WEBP_OK=$WEBP_OK  AVIF_OK=$AVIF_OK"

# =======================
# Funciones de trabajo
# =======================
optimize_jpeg_inplace() {
  local f="$1" tmp
  case "$JPEG_IMPL" in
    mozjpeg)
      tmp="${f}.tmp.jpg"
      # OJO: sin "--" antes del archivo
      run_cmd cjpeg -quality "$JPEG_QUALITY" -progressive -optimize -outfile "$tmp" "$f"
      run_cmd jpegtran -copy none -optimize -progressive -outfile "$f" "$tmp"
      [[ $DRY_RUN -eq 1 ]] || rm -f "$tmp"
      ;;
    cjpeg_only)
      tmp="${f}.tmp.jpg"
      run_cmd cjpeg -quality "$JPEG_QUALITY" -progressive -optimize -outfile "$tmp" "$f"
      (( DRY_RUN )) || mv -f "$tmp" "$f"
      ;;
    jpegoptim)
      run_cmd jpegoptim --strip-all --all-progressive -m"$JPEG_QUALITY" -- "$f" >/dev/null || true
      ;;
    imagemagick)
      tmp="${f}.tmp.jpg"
      run_cmd convert "$f" -strip -interlace Plane -sampling-factor 4:2:0 -quality "$JPEG_QUALITY" "$tmp"
      (( DRY_RUN )) || mv -f "$tmp" "$f"
      ;;
    *)
      echo "Aviso: no hay optimizador JPEG disponible para $f" >&2
      ;;
  esac
}

optimize_png_inplace() {
  local f="$1" tmp
  case "$PNG_IMPL" in
    pngquant)
      run_cmd pngquant --force --skip-if-larger --strip --ext .png 256 -- "$f" >/dev/null || true
      ;;
    zopflipng)
      tmp="${f}.tmp.png"
      run_cmd zopflipng -y -m --lossy_transparent -- "$f" "$tmp"
      (( DRY_RUN )) || mv -f "$tmp" "$f"
      ;;
    optipng)
      run_cmd optipng -o7 -strip all -- "$f" >/dev/null || true
      ;;
    imagemagick)
      tmp="${f}.tmp.png"
      run_cmd convert "$f" -strip "$tmp"
      (( DRY_RUN )) || mv -f "$tmp" "$f"
      ;;
    *)
      echo "Aviso: no hay optimizador PNG disponible para $f" >&2
      ;;
  esac
}

make_webp() {
  $WEBP_OK || return 0
  local src="$1" out="${src%.*}.webp"
  if [[ ! -f "$out" || "$src" -nt "$out" ]]; then
    run_cmd cwebp -quiet -q "$WEBP_QUALITY" -m 6 -mt -metadata none "$src" -o "$out" >/dev/null || {
      echo "Error creando WebP de $src" >&2
    }
  fi
}

make_avif() {
  $AVIF_OK || return 0
  local src="$1" out="${src%.*}.avif"
  if [[ ! -f "$out" || "$src" -nt "$out" ]]; then
    # Línea compatible con libavif avifenc "antiguo" (sin --passthrough-*)
    run_cmd avifenc -j all --codec aom --min 0 --max "$AVIF_QUALITY" --speed 6 "$src" "$out" >/dev/null || {
      echo "Error creando AVIF de $src" >&2
    }
  fi
}

export -f optimize_jpeg_inplace optimize_png_inplace make_webp make_avif run_cmd logp
export JPEG_IMPL PNG_IMPL WEBP_OK AVIF_OK JPEG_QUALITY WEBP_QUALITY AVIF_QUALITY DEBUG DRY_RUN

# =======================
# Recorrido (JPG/JPEG/PNG)
# =======================
find "$ROOT" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 \
| xargs -0 -I{} -P "${MAX_PARALLEL}" bash -c '
  f="{}"; ext="${f##*.}"; shopt -s nocasematch
  [[ "$DEBUG" == "1" ]] && logp "$f"
  if [[ "$ext" =~ ^jpe?g$ ]]; then
    optimize_jpeg_inplace "$f"
  elif [[ "$ext" =~ ^png$ ]]; then
    optimize_png_inplace "$f"
  fi
  make_webp "$f"
  make_avif "$f"
'

echo "✔ Listo."
