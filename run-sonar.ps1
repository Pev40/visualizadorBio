# Script PowerShell para ejecutar analisis de SonarQube
# Autor: SA Visualizer Team

Write-Host "Iniciando analisis de SonarQube para SA Visualizer..." -ForegroundColor Green

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

# Verificar si sonar-scanner esta instalado
$scannerInstalled = $false
try {
    sonar-scanner --version | Out-Null
    Write-Host "SonarQube Scanner esta instalado" -ForegroundColor Green
    $scannerInstalled = $true
} catch {
    Write-Host "SonarQube Scanner no esta instalado." -ForegroundColor Yellow
    Write-Host "Por favor, instala sonar-scanner manualmente desde:" -ForegroundColor Cyan
    Write-Host "https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/" -ForegroundColor Cyan
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

# Ejecutar analisis solo si el scanner esta instalado
if ($scannerInstalled) {
    Write-Host "Ejecutando analisis de codigo..." -ForegroundColor Green
    try {
        sonar-scanner -Dsonar.projectKey=sa-visualizer -Dsonar.sources=js -Dsonar.host.url=http://localhost:9000 -Dsonar.login=admin -Dsonar.password=admin
        Write-Host "Analisis completado!" -ForegroundColor Green
        Write-Host "Ve a http://localhost:9000 para ver los resultados" -ForegroundColor Cyan
    } catch {
        Write-Host "Error al ejecutar el analisis. Verifica que sonar-scanner este instalado." -ForegroundColor Red
        Write-Host "Puedes ejecutar el analisis manualmente mas tarde con: sonar-scanner" -ForegroundColor Yellow
    }
} else {
    Write-Host "SonarQube esta ejecutandose pero no se pudo ejecutar el analisis automaticamente." -ForegroundColor Yellow
    Write-Host "Instala sonar-scanner y ejecuta manualmente: sonar-scanner" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Para detener SonarQube, ejecuta: docker-compose down" -ForegroundColor Yellow
Write-Host "Para ver logs: docker-compose logs -f sonarqube" -ForegroundColor Yellow 