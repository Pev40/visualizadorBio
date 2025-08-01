# Script para crear un token de autenticacion en SonarQube
# Autor: SA Visualizer Team

Write-Host "Creando token de autenticacion en SonarQube..." -ForegroundColor Green

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

# Crear token usando la API de SonarQube
Write-Host "Generando token..." -ForegroundColor Yellow
try {
    $body = @{
        name = "sa-visualizer-token"
        login = "admin"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:9000/api/user_tokens/generate" -Method Post -Body $body -Headers $headers -TimeoutSec 10
    
    $token = $tokenResponse.token
    Write-Host "Token creado exitosamente: $token" -ForegroundColor Green
    
    # Actualizar el archivo sonar-project.properties
    Write-Host "Actualizando archivo sonar-project.properties..." -ForegroundColor Yellow
    
    $propertiesContent = Get-Content "sonar-project.properties" -Raw
    $propertiesContent = $propertiesContent -replace "sonar\.login=admin", ""
    $propertiesContent = $propertiesContent -replace "sonar\.password=.*", ""
    $propertiesContent = $propertiesContent + "`nsonar.token=$token"
    
    Set-Content "sonar-project.properties" $propertiesContent -Encoding UTF8
    
    Write-Host "Archivo sonar-project.properties actualizado con el token" -ForegroundColor Green
    Write-Host "Ahora puedes ejecutar el analisis con: .\run-analysis-properties.ps1" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error al crear el token. Verifica que:" -ForegroundColor Red
    Write-Host "1. SonarQube este ejecutandose en http://localhost:9000" -ForegroundColor Yellow
    Write-Host "2. Las credenciales admin/admin funcionen" -ForegroundColor Yellow
    Write-Host "3. Tengas permisos para crear tokens" -ForegroundColor Yellow
    
    Write-Host "Puedes crear el token manualmente en:" -ForegroundColor Cyan
    Write-Host "http://localhost:9000/account/security" -ForegroundColor White
} 