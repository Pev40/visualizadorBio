# Configuración de SonarQube con Docker

Este documento explica cómo configurar y ejecutar SonarQube para el proyecto SA Visualizer usando Docker.

## 📋 Prerrequisitos

1. **Docker Desktop** instalado
2. **Docker Compose** (incluido con Docker Desktop)
3. **SonarQube Scanner** (opcional, se puede descargar automáticamente)

## 🚀 Instalación Rápida

### Para Windows (PowerShell)

```powershell
# Ejecutar el script de PowerShell
.\run-sonar.ps1
```

### Para Linux/macOS (Bash)

```bash
# Dar permisos de ejecución al script
chmod +x run-sonar.sh

# Ejecutar el script
./run-sonar.sh
```

## 🔧 Configuración Manual

### 1. Iniciar SonarQube

```bash
# Iniciar los contenedores
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
```

### 2. Acceder a SonarQube

- **URL**: http://localhost:9000
- **Usuario**: admin
- **Contraseña**: admin

### 3. Instalar SonarQube Scanner

#### Windows
1. Descargar desde: https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/
2. Extraer en `C:\sonar-scanner`
3. Agregar `C:\sonar-scanner\bin` al PATH

#### Linux/macOS
```bash
# Descargar e instalar
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.7.0.2747-linux.zip
unzip sonar-scanner-cli-4.7.0.2747-linux.zip
sudo mv sonar-scanner-4.7.0.2747-linux /opt/sonar-scanner
export PATH=$PATH:/opt/sonar-scanner/bin
```

### 4. Ejecutar Análisis

```bash
# Desde el directorio del proyecto
sonar-scanner \
    -Dsonar.projectKey=sa-visualizer \
    -Dsonar.sources=js \
    -Dsonar.host.url=http://localhost:9000 \
    -Dsonar.login=admin \
    -Dsonar.password=admin
```

## 📊 Configuración del Proyecto

### Archivo `sonar-project.properties`

```properties
# Configuración del proyecto
sonar.projectKey=sa-visualizer
sonar.projectName=SA Visualizer
sonar.projectVersion=1.0

# Fuentes del código
sonar.sources=js
sonar.sourceEncoding=UTF-8

# Configuración de pruebas
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js
sonar.test.inclusions=**/*.test.js,**/*.spec.js

# Configuración de calidad
sonar.qualitygate.wait=true

# Exclusiones
sonar.exclusions=**/node_modules/**,**/coverage/**,**/*.min.js
```

## 🐳 Comandos Docker Útiles

```bash
# Iniciar SonarQube
docker-compose up -d

# Ver logs
docker-compose logs -f sonarqube

# Detener SonarQube
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar
docker-compose restart
```

## 🔍 Verificar Estado

```bash
# Verificar que SonarQube esté funcionando
curl http://localhost:9000/api/system/status

# Verificar contenedores
docker-compose ps
```

## 📈 Métricas Analizadas

SonarQube analizará las siguientes métricas en tu código JavaScript:

- **Cobertura de código**
- **Duplicaciones**
- **Complejidad ciclomática**
- **Deuda técnica**
- **Vulnerabilidades de seguridad**
- **Code smells**
- **Bugs**

## 🛠️ Solución de Problemas

### Error: Puerto 9000 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "9001:9000"  # Usar puerto 9001 en lugar de 9000
```

### Error: Memoria insuficiente
```bash
# Agregar al docker-compose.yml
environment:
  - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
```

### Error: SonarQube no inicia
```bash
# Verificar logs
docker-compose logs sonarqube

# Reiniciar
docker-compose restart
```

## 📚 Recursos Adicionales

- [Documentación oficial de SonarQube](https://docs.sonarqube.org/)
- [Guía de análisis de JavaScript](https://docs.sonarqube.org/latest/analysis/languages/javascript/)
- [Configuración de Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## 🤝 Contribución

Para mejorar la configuración de SonarQube:

1. Actualiza el archivo `sonar-project.properties`
2. Modifica los scripts según sea necesario
3. Documenta los cambios en este archivo 