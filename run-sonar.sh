#!/bin/bash

# Script para ejecutar análisis de SonarQube
# Autor: SA Visualizer Team
# Fecha: $(date)

echo "🚀 Iniciando análisis de SonarQube para SA Visualizer..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Verificar si sonar-scanner está instalado
if ! command -v sonar-scanner &> /dev/null; then
    echo "⚠️  SonarQube Scanner no está instalado."
    echo "📥 Instalando SonarQube Scanner..."
    
    # Para Windows (PowerShell)
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "🔧 Instalando para Windows..."
        # Aquí puedes agregar comandos específicos para Windows
        echo "Por favor, instala sonar-scanner manualmente desde: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/"
    else
        # Para Linux/macOS
        wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip
        unzip sonar-scanner-cli-4.7.0.2747-linux.zip
        sudo mv sonar-scanner-4.7.0.2747-linux /opt/sonar-scanner
        export PATH=$PATH:/opt/sonar-scanner/bin
        echo 'export PATH=$PATH:/opt/sonar-scanner/bin' >> ~/.bashrc
    fi
fi

# Iniciar SonarQube con Docker Compose
echo "🐳 Iniciando SonarQube con Docker Compose..."
docker-compose up -d

# Esperar a que SonarQube esté listo
echo "⏳ Esperando a que SonarQube esté listo..."
until curl -s http://localhost:9000/api/system/status | grep -q "UP"; do
    echo "⏳ SonarQube aún no está listo, esperando..."
    sleep 10
done

echo "✅ SonarQube está listo!"

# Crear token de acceso (opcional)
echo "🔑 Configurando token de acceso..."
echo "Por favor, ve a http://localhost:9000 y crea un token de acceso."
echo "Usuario por defecto: admin"
echo "Contraseña por defecto: admin"

# Ejecutar análisis
echo "🔍 Ejecutando análisis de código..."
sonar-scanner \
    -Dsonar.projectKey=sa-visualizer \
    -Dsonar.sources=js \
    -Dsonar.host.url=http://localhost:9000 \
    -Dsonar.login=admin \
    -Dsonar.password=admin

echo "✅ Análisis completado!"
echo "📊 Ve a http://localhost:9000 para ver los resultados"
echo ""
echo "🛑 Para detener SonarQube, ejecuta: docker-compose down" 