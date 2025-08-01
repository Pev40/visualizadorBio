# Script PowerShell para ejecutar analisis de SonarQube usando Docker
# Autor: SA Visualizer Team

Write-Host "Iniciando analisis de SonarQube para SA Visualizer usando Docker..." -ForegroundColor Green

# Verificar si Docker esta instalado
try {
    docker --version | Out-Null
    Write-Host "Docker esta instalado" -ForegroundColor Green
} catch {
    Write-Host "Docker no esta instalado. Por favor, instala Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Verificar si Docker Compose esta instalado
try {
    docker-compose --version | Out-Null
    Write-Host "Docker Compose esta instalado" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose no esta instalado. Por favor, instala Docker Compose primero." -ForegroundColor Red
    exit 1
}

# Iniciar SonarQube con Docker Compose
Write-Host "Iniciando SonarQube con Docker Compose..." -ForegroundColor Green
try {
    docker-compose up -d
    Write-Host "Contenedores iniciados correctamente" -ForegroundColor Green
} catch {
    Write-Host "Error al iniciar los contenedores" -ForegroundColor Red
    exit 1
}

# Esperar a que SonarQube este listo
Write-Host "Esperando a que SonarQube este listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:9000/api/system/status" -Method Get -TimeoutSec 5
        if ($response.status -eq "UP") {
            Write-Host "SonarQube esta listo!" -ForegroundColor Green
            break
        }
    } catch {
        if ($attempt -ge $maxAttempts) {
            Write-Host "Timeout: SonarQube no se inicio en el tiempo esperado" -ForegroundColor Red
            Write-Host "Verifica los logs con: docker-compose logs sonarqube" -ForegroundColor Yellow
            exit 1
        }
        Write-Host "SonarQube aun no esta listo, esperando... (intento $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
} while ($true)

# Mostrar informacion de acceso
Write-Host "Informacion de acceso:" -ForegroundColor Cyan
Write-Host "URL: http://localhost:9000" -ForegroundColor White
Write-Host "Usuario: admin" -ForegroundColor White
Write-Host "Contrasena: admin" -ForegroundColor White

# Crear token de autenticacion
Write-Host "Creando token de autenticacion..." -ForegroundColor Green
try {
    # Obtener token usando la API de SonarQube
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:9000/api/user_tokens/generate" -Method Post -Headers @{
        "Content-Type" = "application/x-www-form-urlencoded"
    } -Body "name=sa-visualizer-token&login=admin" -TimeoutSec 10
    
    $authToken = $tokenResponse.token
    Write-Host "Token creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "No se pudo crear el token automaticamente. Usando credenciales por defecto." -ForegroundColor Yellow
    $authToken = "admin"
}

# Ejecutar analisis usando Docker
Write-Host "Ejecutando analisis de codigo usando Docker..." -ForegroundColor Green
try {
    # Obtener la ruta actual del proyecto
    $projectPath = (Get-Location).Path
    
    # Ejecutar sonar-scanner desde Docker
    docker run --rm `
        -e SONAR_HOST_URL="http://host.docker.internal:9000" `
        -e SONAR_LOGIN="admin" `
        -e SONAR_PASSWORD="admin" `
        -v "${projectPath}:/usr/src" `
        sonarsource/sonar-scanner-cli:latest
    
    Write-Host "Analisis completado!" -ForegroundColor Green
    Write-Host "Ve a http://localhost:9000 para ver los resultados" -ForegroundColor Cyan
} catch {
    Write-Host "Error al ejecutar el analisis." -ForegroundColor Red
    Write-Host "Verifica que SonarQube este funcionando correctamente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para detener SonarQube, ejecuta: docker-compose down" -ForegroundColor Yellow
Write-Host "Para ver logs: docker-compose logs -f sonarqube" -ForegroundColor Yellow 