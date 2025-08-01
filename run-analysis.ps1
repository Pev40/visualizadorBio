# Script para ejecutar solo el analisis de SonarQube usando Docker
# Autor: SA Visualizer Team

Write-Host "Ejecutando analisis de SonarQube usando Docker..." -ForegroundColor Green

# Verificar que SonarQube este funcionando
try {
    $response = Invoke-RestMethod -Uri "http://localhost:9000/api/system/status" -Method Get -TimeoutSec 5
    if ($response.status -eq "UP") {
        Write-Host "SonarQube esta funcionando correctamente" -ForegroundColor Green
    } else {
        Write-Host "SonarQube no esta listo. Ejecuta primero: docker-compose up -d" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "No se puede conectar a SonarQube. Asegurate de que este ejecutandose en http://localhost:9000" -ForegroundColor Red
    exit 1
}

# Obtener la ruta actual del proyecto
$projectPath = (Get-Location).Path
Write-Host "Analizando proyecto en: $projectPath" -ForegroundColor Cyan

# Ejecutar analisis usando Docker
Write-Host "Iniciando analisis..." -ForegroundColor Green
try {
    docker run --rm `
        -e SONAR_HOST_URL="http://host.docker.internal:9000" `
        -e SONAR_LOGIN="admin" `
        -e SONAR_PASSWORD="AvuW4GRSGQa@Sha" `
        -e SONAR_TOKEN="" `
        -v "${projectPath}:/usr/src" `
        sonarsource/sonar-scanner-cli:latest
    
    Write-Host "Analisis completado exitosamente!" -ForegroundColor Green
    Write-Host "Ve a http://localhost:9000 para ver los resultados" -ForegroundColor Cyan
} catch {
    Write-Host "Error al ejecutar el analisis." -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "1. SonarQube este ejecutandose en http://localhost:9000" -ForegroundColor Yellow
    Write-Host "2. Docker este funcionando correctamente" -ForegroundColor Yellow
    Write-Host "3. El archivo sonar-project.properties este presente" -ForegroundColor Yellow
} 