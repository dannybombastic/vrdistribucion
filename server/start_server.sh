#!/bin/bash
# Startup script para VR Distribución Backend en producción

# Variables de entorno
export ENV=production
export PORT=8000

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Función para verificar si el servidor está ejecutándose
check_server() {
    curl -f http://localhost:$PORT/docs > /dev/null 2>&1
    return $?
}

# Función para iniciar el servidor
start_server() {
    log "🚀 Iniciando VR Distribución Backend..."
    
    cd "$(dirname "$0")"
    
    # Verificar que existe el archivo .env
    if [ ! -f ".env" ]; then
        log "❌ ERROR: Archivo .env no encontrado"
        log "📝 Crea el archivo .env con las variables necesarias"
        exit 1
    fi
    
    # Activar entorno virtual si existe
    if [ -d "venv" ]; then
        log "⚡ Activando entorno virtual..."
        source venv/bin/activate
    fi
    
    # Verificar dependencias
    log "📋 Verificando dependencias..."
    pip check > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        log "📦 Instalando dependencias faltantes..."
        pip install -r requirements.txt
    fi
    
    # Iniciar servidor
    log "🌐 Servidor disponible en http://localhost:$PORT"
    log "📚 Documentación API en http://localhost:$PORT/docs"
    
    # Usar gunicorn en producción para mejor performance
    if command -v gunicorn > /dev/null 2>&1; then
        log "🚀 Iniciando con Gunicorn (producción)..."
        gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
    else
        log "🔧 Iniciando con Uvicorn (desarrollo)..."
        python app.py
    fi
}

# Función para detener el servidor
stop_server() {
    log "🛑 Deteniendo servidor..."
    pkill -f "gunicorn\|uvicorn\|python.*app.py"
    log "✅ Servidor detenido"
}

# Función para reiniciar el servidor
restart_server() {
    log "🔄 Reiniciando servidor..."
    stop_server
    sleep 2
    start_server
}

# Función para mostrar el estado
status_server() {
    if check_server; then
        log "✅ Servidor ejecutándose en puerto $PORT"
    else
        log "❌ Servidor no está ejecutándose"
    fi
}

# Función para mostrar logs
show_logs() {
    log "📋 Mostrando logs del sistema..."
    journalctl -u vrdistribucion-backend -f
}

# Menu principal
case "${1:-start}" in
    start)
        if check_server; then
            log "⚠️  Servidor ya está ejecutándose"
            status_server
        else
            start_server
        fi
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Comandos disponibles:"
        echo "  start   - Iniciar el servidor"
        echo "  stop    - Detener el servidor"
        echo "  restart - Reiniciar el servidor"
        echo "  status  - Mostrar estado del servidor"
        echo "  logs    - Mostrar logs en tiempo real"
        exit 1
        ;;
esac
