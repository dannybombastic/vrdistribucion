#!/usr/bin/env python3
"""
Script para cambiar entre entorno de desarrollo (local) y producción (S3)
Cambia automáticamente las rutas /static por las rutas de S3 y viceversa
"""

import os
import re
import argparse
import glob
from pathlib import Path

# Configuración de rutas
LOCAL_STATIC = "/static"
S3_STATIC = "https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion"

# Extensiones de archivos a procesar
FILE_EXTENSIONS = ['*.html', '*.css', '*.js']

# Directorios a procesar (excluir el propio directorio static)
SEARCH_DIRECTORIES = [
    ".",
    "aparador",
    "cotizaciones", 
    "gallery",
    "portafolio",
    "webdesigncancun",
    "errorpage",
    "cookie-consent"
]

def find_files_to_process():
    """Encuentra todos los archivos HTML, CSS y JS que necesitan ser procesados"""
    files_to_process = []
    
    for directory in SEARCH_DIRECTORIES:
        if os.path.exists(directory):
            for extension in FILE_EXTENSIONS:
                pattern = os.path.join(directory, "**", extension)
                files_to_process.extend(glob.glob(pattern, recursive=True))
                
                # También buscar archivos en el directorio raíz
                pattern = os.path.join(directory, extension)
                files_to_process.extend(glob.glob(pattern))
    
    # Remover duplicados y archivos en el directorio static
    unique_files = []
    for file_path in set(files_to_process):
        if not file_path.startswith('static/'):
            unique_files.append(file_path)
    
    return sorted(unique_files)

def detect_current_environment(file_path):
    """Detecta si el archivo está usando rutas locales o S3"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if S3_STATIC in content:
            return "production"
        elif LOCAL_STATIC in content:
            return "development"
        else:
            return "unknown"
    except Exception as e:
        print(f"Error leyendo {file_path}: {e}")
        return "error"

def switch_to_production(file_path):
    """Cambia las rutas locales a rutas S3"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar y reemplazar todas las ocurrencias de /static
        # Usar regex para ser más preciso
        pattern = r'(["\'])/static/'
        replacement = r'\1' + S3_STATIC + '/'
        
        new_content = re.sub(pattern, replacement, content)
        
        # También manejar casos sin comillas (menos común pero posible)
        pattern2 = r'(?<=[^"\'])/static/'
        replacement2 = S3_STATIC + '/'
        new_content = re.sub(pattern2, replacement2, new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error procesando {file_path}: {e}")
        return False

def switch_to_development(file_path):
    """Cambia las rutas S3 a rutas locales"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Reemplazar rutas S3 con rutas locales
        new_content = content.replace(S3_STATIC, LOCAL_STATIC)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error procesando {file_path}: {e}")
        return False

def analyze_environment():
    """Analiza el entorno actual de todos los archivos"""
    files = find_files_to_process()
    environments = {}
    
    for file_path in files:
        env = detect_current_environment(file_path)
        if env not in environments:
            environments[env] = []
        environments[env].append(file_path)
    
    return environments

def main():
    parser = argparse.ArgumentParser(description='Cambiar entre entorno local y S3')
    parser.add_argument('mode', choices=['production', 'development', 'status'], 
                       help='Modo: production (S3), development (local), o status (analizar)')
    parser.add_argument('--dry-run', action='store_true', 
                       help='Mostrar qué archivos se cambiarían sin hacer cambios')
    
    args = parser.parse_args()
    
    if args.mode == 'status':
        print("🔍 Analizando entorno actual...")
        environments = analyze_environment()
        
        for env, files in environments.items():
            if env == "production":
                print(f"\n📦 Archivos en PRODUCCIÓN (S3): {len(files)}")
            elif env == "development": 
                print(f"\n🛠️  Archivos en DESARROLLO (local): {len(files)}")
            elif env == "unknown":
                print(f"\n❓ Archivos sin rutas static: {len(files)}")
            elif env == "error":
                print(f"\n❌ Archivos con errores: {len(files)}")
            
            if len(files) <= 10:
                for file_path in files:
                    print(f"   - {file_path}")
            else:
                for file_path in files[:10]:
                    print(f"   - {file_path}")
                print(f"   ... y {len(files) - 10} archivos más")
        return
    
    files = find_files_to_process()
    print(f"🔍 Encontrados {len(files)} archivos para procesar")
    
    if args.dry_run:
        print("\n🎭 MODO DRY-RUN - No se harán cambios reales\n")
    
    changed_files = 0
    
    for file_path in files:
        current_env = detect_current_environment(file_path)
        
        if args.mode == 'production' and current_env == 'development':
            if args.dry_run:
                print(f"🔄 Cambiaría a S3: {file_path}")
                changed_files += 1
            else:
                if switch_to_production(file_path):
                    print(f"✅ Cambiado a S3: {file_path}")
                    changed_files += 1
                    
        elif args.mode == 'development' and current_env == 'production':
            if args.dry_run:
                print(f"🔄 Cambiaría a local: {file_path}")
                changed_files += 1
            else:
                if switch_to_development(file_path):
                    print(f"✅ Cambiado a local: {file_path}")
                    changed_files += 1
        elif current_env == args.mode:
            print(f"⏭️  Ya está en {args.mode}: {file_path}")
        elif current_env == 'unknown':
            print(f"⚪ Sin rutas static: {file_path}")
    
    if args.dry_run:
        print(f"\n🎭 Se cambiarían {changed_files} archivos")
    else:
        print(f"\n🎉 Cambiados {changed_files} archivos exitosamente")
        
        if args.mode == 'production':
            print("📦 Entorno cambiado a PRODUCCIÓN (S3)")
        else:
            print("🛠️  Entorno cambiado a DESARROLLO (local)")

if __name__ == "__main__":
    main()
