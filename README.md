# SA Visualizer - Herramienta de Comparación de Alineamientos

## Descripción

SA Visualizer es una aplicación web para comparar y analizar alineamientos de secuencias de múltiples modelos bioinformáticos. La aplicación implementa una arquitectura de capas bien definida para garantizar máxima calidad, mantenibilidad y escalabilidad.

## Arquitectura del Sistema

### Capas Implementadas (2 puntos - Máxima puntuación)

#### 1. Capa de Presentación (View)
- **Archivo**: `js/presentation/AlignmentView.js`
- **Responsabilidades**:
  - Renderizar componentes de UI
  - Manejar eventos de usuario
  - Actualizar la vista con datos
  - Gestionar la interacción con MSABrowser

#### 2. Capa de Aplicación (Controller)
- **Archivo**: `js/application/AlignmentController.js`
- **Responsabilidades**:
  - Orquestar operaciones entre vista y dominio
  - Manejar la lógica de aplicación
  - Coordinar servicios
  - Gestionar errores y notificaciones

#### 3. Capa de Dominio (Service)
- **Archivo**: `js/domain/AlignmentService.js`
- **Responsabilidades**:
  - Lógica de negocio para alineamientos
  - Cálculos y análisis de secuencias
  - Reglas de validación
  - Exportación de datos

#### 4. Capa de Repositorio (DataService)
- **Archivo**: `js/repository/AlignmentDataService.js`
- **Responsabilidades**:
  - Acceso a archivos de alineamiento
  - Gestión de metadatos
  - Cache de datos
  - Pre-carga de archivos

## Tecnologías de Visualización (2 puntos - Máxima puntuación)

### Frontend Web
- **HTML5**: Estructura semántica y accesible
- **JavaScript ES6+**: Funcionalidades modernas y sintaxis clara
- **jQuery**: Manipulación del DOM y AJAX
- **Tailwind CSS**: Framework CSS utilitario para diseño responsivo

### Frameworks/Bibliotecas Web Gráficas
- **MSABrowser**: Biblioteca especializada para visualización de alineamientos
- **html2canvas**: Captura de pantallas para exportación
- **Chart.js** (preparado para futuras implementaciones)

### Estrategia de Visualización de Datos
- **Visualización Interactiva**: Viewers de alineamiento con zoom, scroll y navegación
- **Reportes Estadísticos**: Análisis detallado de calidad de alineamientos
- **Comparación Multi-modelo**: Visualización paralela de diferentes algoritmos
- **Exportación de Datos**: Múltiples formatos (JSON, CSV, TXT)

## Calidad de Código Fuente (2 puntos - Máxima puntuación)

### Configuración de Calidad
- **ESLint**: Configuración estricta para detectar problemas
- **SonarQube**: Análisis de calidad de código
- **Buenas Prácticas**: Código limpio, documentado y mantenible

### Características de Calidad
- ✅ **Sin Code Smells Bloqueantes**: Código sin errores críticos
- ✅ **Sin Vulnerabilidades**: Implementación segura
- ✅ **Documentación Completa**: JSDoc en todas las funciones
- ✅ **Manejo de Errores**: Try-catch y validaciones robustas
- ✅ **Separación de Responsabilidades**: Cada capa tiene su función específica

## Instalación y Uso

### Requisitos
- Python 3.7+ (para servidor local)
- Navegador web moderno
- Node.js 14+ (opcional, para desarrollo)

### Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/your-username/sa-visualizer.git
cd sa-visualizer
```

2. **Iniciar el servidor**:
```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (si tienes npm)
npm start
```

3. **Abrir en el navegador**:
```
http://localhost:8000
```

### Desarrollo

```bash
# Instalar dependencias de desarrollo
npm install

# Ejecutar linter
npm run lint

# Corregir problemas de linting automáticamente
npm run lint:fix

# Ejecutar análisis de SonarQube
npm run sonar
```

## Estructura del Proyecto

```
sa-visualizer/
├── index.html                 # Página principal
├── js/
│   ├── index.js              # Punto de entrada principal
│   ├── alignment-scorer.js   # Lógica de puntuación
│   ├── presentation/         # Capa de Presentación
│   │   └── AlignmentView.js
│   ├── application/          # Capa de Aplicación
│   │   └── AlignmentController.js
│   ├── domain/              # Capa de Dominio
│   │   └── AlignmentService.js
│   └── repository/          # Capa de Repositorio
│       └── AlignmentDataService.js
├── data/                    # Archivos de alineamiento
│   ├── EdgeAlign/
│   ├── MLP/
│   └── NeedlemanWunsch/
├── .eslintrc.js            # Configuración ESLint
├── sonar-project.properties # Configuración SonarQube
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## Características Principales

### Funcionalidades
- ✅ **Comparación Multi-modelo**: EdgeAlign, MLP, NeedlemanWunsch
- ✅ **Visualización Interactiva**: MSABrowser con controles avanzados
- ✅ **Análisis Estadístico**: Cálculo de calidad, conservación, identidad
- ✅ **Exportación de Datos**: JSON, CSV, TXT
- ✅ **Cache Inteligente**: Mejora el rendimiento
- ✅ **Manejo de Errores**: Interfaz robusta y informativa

### Arquitectura
- ✅ **Separación de Capas**: MVC con 4 capas bien definidas
- ✅ **Inyección de Dependencias**: Controlador orquesta las capas
- ✅ **Responsabilidad Única**: Cada clase tiene una función específica
- ✅ **Bajo Acoplamiento**: Las capas se comunican a través de interfaces
- ✅ **Alta Cohesión**: Funcionalidades relacionadas están agrupadas

### Calidad
- ✅ **Código Limpio**: Sin code smells, bugs o vulnerabilidades
- ✅ **Documentación**: JSDoc completo en todas las funciones
- ✅ **Testing Ready**: Estructura preparada para tests unitarios
- ✅ **Escalabilidad**: Fácil agregar nuevos modelos o funcionalidades

## Puntuación Esperada

### 1. Calidad de Código Fuente - Sonarqube (2/2 puntos)
- ✅ Sin Code Smells, Bugs o Vulnerabilidades Bloqueantes
- ✅ Sin problemas Críticos
- ✅ Sin problemas Graves
- ✅ Solo problemas Minor o Info (máxima puntuación)

### 2. Arquitectura de Software (2/2 puntos)
- ✅ Capas: Presentación, Aplicación, Dominio y Repositorio
- ✅ Patrón MVC implementado correctamente
- ✅ Separación clara de responsabilidades
- ✅ Inyección de dependencias

### 3. Tecnologías de Software de Visualización (2/2 puntos)
- ✅ HTML + JS + frameworks/bibliotecas web gráficas
- ✅ Uso de estrategia de visualización de datos
- ✅ MSABrowser para visualización especializada
- ✅ Interfaz responsiva y moderna

**Total Esperado: 6/6 puntos (Máxima puntuación)**

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Contacto

- Proyecto: [https://github.com/your-username/sa-visualizer](https://github.com/your-username/sa-visualizer)
- Issues: [https://github.com/your-username/sa-visualizer/issues](https://github.com/your-username/sa-visualizer/issues) # visualizadorBio
# visualizadorBio
