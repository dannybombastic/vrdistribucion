# Scripts de Cambio de Entorno - VR Distribución

Este repositorio incluye scripts para cambiar automáticamente entre entorno de desarrollo (local) y producción (S3).

## 🔧 Scripts Disponibles

### 1. `switch_environment.py` (Script Principal)
Script completo en Python con todas las funcionalidades.

```bash
# Ver estado actual
python3 switch_environment.py status

# Cambiar a producción (S3)
python3 switch_environment.py production

# Cambiar a desarrollo (local)
python3 switch_environment.py development

# Ver qué cambiaría sin aplicar (dry-run)
python3 switch_environment.py production --dry-run
python3 switch_environment.py development --dry-run
```

### 2. `quick_switch.sh` (Script Rápido)
Script de bash para uso rápido con comandos más cortos.

```bash
# Ver estado actual
./quick_switch.sh status

# Cambiar a S3 (producción)
./quick_switch.sh s3

# Cambiar a local (desarrollo)
./quick_switch.sh local

# Ver cambios sin aplicar
./quick_switch.sh dry s3
./quick_switch.sh dry local
```

## 📁 Archivos Procesados

Los scripts procesan automáticamente:
- ✅ Archivos HTML en todas las carpetas
- ✅ Archivos CSS 
- ✅ Archivos JS
- ❌ Excluye la carpeta `static/` (contiene los assets)

### Directorios incluidos:
- Raíz del proyecto (`index.html`)
- `aparador/`
- `cotizaciones/`
- `gallery/`
- `portafolio/`
- `webdesigncancun/`
- `errorpage/`
- `cookie-consent/`

## 🔄 Qué Hace

### Modo Producción (S3):
Cambia: `/static/...` → `https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/...`

### Modo Desarrollo (Local):
Cambia: `https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/...` → `/static/...`

## 📋 Ejemplos de Uso

### Flujo típico de desarrollo:
```bash
# 1. Verificar estado actual
./quick_switch.sh status

# 2. Trabajar en local
./quick_switch.sh local

# 3. Antes de subir a producción, verificar cambios
./quick_switch.sh dry s3

# 4. Cambiar a producción
./quick_switch.sh s3

# 5. Después del deploy, volver a local para seguir desarrollando
./quick_switch.sh local
```

## ⚙️ Características

- 🔍 **Análisis inteligente**: Detecta automáticamente el entorno actual
- 🎭 **Modo dry-run**: Ve los cambios antes de aplicarlos
- 📊 **Reporte detallado**: Muestra qué archivos se procesaron
- 🛡️ **Seguro**: No modifica archivos en la carpeta `static/`
- 🎯 **Preciso**: Usa regex para cambios exactos

## 🚨 Notas Importantes

1. **Siempre usar local para desarrollo**: Las rutas `/static/` funcionan con el servidor local
2. **S3 solo para producción**: Las rutas de S3 son para el sitio web publicado
3. **Hacer backup**: Aunque es seguro, siempre puedes usar `git` para revertir cambios
4. **Verificar antes de deploy**: Usa `status` para confirmar que todo está en modo S3

## 🎯 Aliases Disponibles

### Para desarrollo:
- `local`
- `dev` 
- `development`

### Para producción:
- `s3`
- `prod`
- `production`

### Para verificar:
- `status`
- `check`
