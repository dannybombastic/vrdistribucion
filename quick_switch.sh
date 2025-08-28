#!/bin/bash

# Script rápido para cambiar entre desarrollo y producción
# Uso: ./quick_switch.sh [local|s3|status]

case "$1" in
    "local"|"dev"|"development")
        echo "🛠️  Cambiando a entorno de DESARROLLO (local)..."
        python3 switch_environment.py development
        ;;
    "s3"|"prod"|"production")
        echo "📦 Cambiando a entorno de PRODUCCIÓN (S3)..."
        python3 switch_environment.py production
        ;;
    "status"|"check")
        echo "🔍 Verificando entorno actual..."
        python3 switch_environment.py status
        ;;
    "help"|"--help"|"-h")
        ./examples.sh
        ;;
    "dry"|"dry-run")
        if [ "$2" == "local" ] || [ "$2" == "dev" ]; then
            echo "🎭 DRY-RUN: Cambios a desarrollo..."
            python3 switch_environment.py development --dry-run
        elif [ "$2" == "s3" ] || [ "$2" == "prod" ]; then
            echo "🎭 DRY-RUN: Cambios a producción..."
            python3 switch_environment.py production --dry-run
        else
            echo "❌ Especifica: dry local o dry s3"
        fi
        ;;
    *)
        echo "🔧 VR Distribución - Switch de Entorno"
        echo ""
        echo "Uso:"
        echo "  ./quick_switch.sh local    - Cambiar a desarrollo (rutas /static)"
        echo "  ./quick_switch.sh s3       - Cambiar a producción (rutas S3)"
        echo "  ./quick_switch.sh status   - Ver entorno actual"
        echo "  ./quick_switch.sh help     - Ver ejemplos detallados"
        echo "  ./quick_switch.sh dry s3   - Ver qué cambiaría a S3 (sin aplicar)"
        echo "  ./quick_switch.sh dry local - Ver qué cambiaría a local (sin aplicar)"
        echo ""
        echo "Aliases disponibles:"
        echo "  local, dev, development"
        echo "  s3, prod, production"
        echo "  status, check"
        ;;
esac
