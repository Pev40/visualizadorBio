/**
 * Punto de entrada principal de la aplicación
 * Implementa el patrón MVC con capas bien definidas:
 * - Presentación (Vista)
 * - Aplicación (Controlador)
 * - Dominio (Servicio)
 * - Repositorio (ServicioDatos)
 */

// Inicialización de la aplicación cuando el DOM esté listo
$(document).ready(function () {
    try {
        console.log('🚀 Iniciando aplicación con arquitectura de capas...');
        
        // Verificar que todas las clases estén disponibles
        if (typeof ServicioDatosAlineamiento === 'undefined') {
            throw new Error('ServicioDatosAlineamiento no está disponible');
        }
        if (typeof ServicioAlineamiento === 'undefined') {
            throw new Error('ServicioAlineamiento no está disponible');
        }
        if (typeof VistaAlineamiento === 'undefined') {
            throw new Error('VistaAlineamiento no está disponible');
        }
        if (typeof ControladorAlineamiento === 'undefined') {
            throw new Error('ControladorAlineamiento no está disponible');
        }
        
        // Crear instancias de las capas
        console.log('📦 Creando instancias de las capas...');
        const servicioDatos = new ServicioDatosAlineamiento();
        const servicioAlineamiento = new ServicioAlineamiento();
        const vista = new VistaAlineamiento();
        const controlador = new ControladorAlineamiento();

        // Inicializar el controlador con sus dependencias
        console.log('🔧 Inicializando controlador...');
        controlador.inicializar(vista, servicioAlineamiento, servicioDatos);

        // Configurar funcionalidades adicionales
        console.log('⚙️ Configurando funcionalidades adicionales...');
        configurarCaracteristicasAdicionales(controlador, servicioDatos);

        console.log('✅ Aplicación inicializada correctamente con arquitectura de capas');
        
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        mostrarMensajeError('Error al inicializar la aplicación: ' + error.message);
    }
});

/**
 * Configura funcionalidades adicionales de la aplicación
 * @param {ControladorAlineamiento} controlador - Controlador principal
 * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
 */
function configurarCaracteristicasAdicionales(controlador, servicioDatos) {
    // Botón para exportar datos
    configurarBotonExportar(controlador);
    
    // Botón para limpiar cache
    configurarBotonCache(servicioDatos);
    
    // Botón para mostrar estadísticas
    configurarBotonEstadisticas(servicioDatos);
    
    // Pre-carga de archivos para mejor rendimiento
    precargarArchivosComunes(servicioDatos);
}

/**
 * Configura el botón de exportación
 * @param {ControladorAlineamiento} controlador - Controlador principal
 */
function configurarBotonExportar(controlador) {
    const htmlExportar = `
        <button id="export-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
            Exportar Datos
        </button>
    `;
    
    $('.container.mx-auto.px-6.py-8').prepend(`
        <div class="bg-white p-4 rounded-lg shadow-md mb-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Herramientas</h3>
                <div class="flex space-x-2">
                    ${htmlExportar}
                    <button id="cache-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Limpiar Cache
                    </button>
                    <button id="stats-btn" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                        Estadísticas
                    </button>
                </div>
            </div>
        </div>
    `);

    $('#export-btn').on('click', () => {
        const archivoSeleccionado = $('#file-select').val();
        if (archivoSeleccionado) {
            controlador.exportarAlineamiento(archivoSeleccionado, 'json');
        }
    });
}

/**
 * Configura el botón de cache
 * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
 */
function configurarBotonCache(servicioDatos) {
    $('#cache-btn').on('click', () => {
        servicioDatos.limpiarCache();
        mostrarNotificacion('Cache limpiado correctamente', 'exito');
    });
}

/**
 * Configura el botón de estadísticas
 * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
 */
function configurarBotonEstadisticas(servicioDatos) {
    $('#stats-btn').on('click', () => {
        const estadisticas = servicioDatos.obtenerEstadisticasArchivos();
        const informacionCache = servicioDatos.obtenerInformacionCache();
        
        const htmlEstadisticas = `
            <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Estadísticas del Sistema</h3>
                        <div class="space-y-2">
                            <p><strong>Archivos totales:</strong> ${estadisticas.archivosTotales}</p>
                            <p><strong>Modelos disponibles:</strong> ${estadisticas.modelosTotales}</p>
                            <p><strong>Elementos en cache:</strong> ${informacionCache.tamano}</p>
                            <p><strong>Uso de memoria:</strong> ${(informacionCache.usoMemoria / 1024).toFixed(2)} KB</p>
                        </div>
                        <div class="mt-4">
                            <h4 class="font-medium">Cobertura por modelo:</h4>
                            ${Object.entries(estadisticas.coberturaModelo).map(([modelo, cobertura]) => 
                                `<p>${modelo}: ${cobertura.toFixed(1)}%</p>`
                            ).join('')}
                        </div>
                        <div class="mt-4 flex justify-end">
                            <button id="close-stats" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(htmlEstadisticas);
        
        $('#close-stats').on('click', () => {
            $('.fixed.inset-0').remove();
        });
    });
}

/**
 * Pre-carga archivos comunes para mejorar el rendimiento
 * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
 */
function precargarArchivosComunes(servicioDatos) {
    const archivosComunes = ['NC_002018_NC_002019.aln', 'NC_002017_NC_002022.aln'];
    
    setTimeout(() => {
        servicioDatos.precargarArchivos(archivosComunes).then(() => {
            console.log('Archivos comunes pre-cargados');
        }).catch(error => {
            console.warn('Error al pre-cargar archivos:', error);
        });
    }, 1000);
}

/**
 * Muestra una notificación al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = $(`
        <div class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            tipo === 'error' ? 'bg-red-500 text-white' :
            tipo === 'exito' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
        }">
            ${mensaje}
        </div>
    `);
    
    $('body').append(notificacion);
    
    setTimeout(() => {
        notificacion.fadeOut(() => notificacion.remove());
    }, 3000);
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarMensajeError(mensaje) {
    const htmlError = `
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mt-4">Error</h3>
                    <p class="text-sm text-gray-500 mt-2">${mensaje}</p>
                    <div class="mt-4">
                        <button id="close-error" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(htmlError);
    
    $('#close-error').on('click', () => {
        $('.fixed.inset-0').remove();
    });
}
