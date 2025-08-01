/**
 * Capa de Aplicación - Coordina la lógica de negocio y la presentación
 * Responsabilidades:
 * - Orquestar operaciones entre vista y dominio
 * - Manejar la lógica de aplicación
 * - Coordinar servicios
 */
class ControladorAlineamiento {
    constructor() {
        this.vista = null;
        this.servicioAlineamiento = null;
        this.servicioDatos = null;
    }

    /**
     * Inicializa el controlador con sus dependencias
     * @param {VistaAlineamiento} vista - Instancia de la vista
     * @param {ServicioAlineamiento} servicioAlineamiento - Servicio de alineamiento
     * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
     */
    inicializar(vista, servicioAlineamiento, servicioDatos) {
        this.vista = vista;
        this.servicioAlineamiento = servicioAlineamiento;
        this.servicioDatos = servicioDatos;
        
        this.vista.inicializar(servicioDatos);
        this.configurarEventosGlobales();
    }

    /**
     * Configura eventos globales de la aplicación
     */
    configurarEventosGlobales() {
        // Evento para desplazamiento sincronizado
        $(document).on('desplazar-a-variacion', () => {
            this.vista.desplazarAVariacion();
        });

        // Evento para recargar datos
        $(document).on('recargar-alineamientos', (event, nombreArchivo) => {
            this.cargarAlineamiento(nombreArchivo);
        });
    }

    /**
     * Carga un alineamiento específico
     * @param {string} nombreArchivo - Nombre del archivo a cargar
     */
    cargarAlineamiento(nombreArchivo) {
        try {
            // Validar que el archivo existe
            if (!this.servicioDatos.archivoDisponible(nombreArchivo)) {
                throw new Error(`Archivo ${nombreArchivo} no está disponible`);
            }

            // Cargar el alineamiento a través de la vista
            this.vista.cargarAlineamiento(nombreArchivo);
            
            // Registrar la acción
            this.registrarAccion('alineamiento_cargado', { nombreArchivo });
            
        } catch (error) {
            console.error('Error al cargar alineamiento:', error);
            this.manejarError(error);
        }
    }

    /**
     * Obtiene estadísticas de un alineamiento
     * @param {string} modelo - Modelo del alineamiento
     * @param {string} fasta - Datos FASTA
     * @returns {Object} Estadísticas del alineamiento
     */
    obtenerEstadisticasAlineamiento(modelo, fasta) {
        try {
            return this.servicioAlineamiento.calcularEstadisticas(modelo, fasta);
        } catch (error) {
            console.error(`Error al calcular estadísticas para ${modelo}:`, error);
            throw error;
        }
    }

    /**
     * Compara alineamientos entre modelos
     * @param {string} nombreArchivo - Nombre del archivo
     * @returns {Object} Resultados de la comparación
     */
    compararAlineamientos(nombreArchivo) {
        try {
            const modelos = this.servicioDatos.obtenerModelosDisponibles();
            const comparaciones = {};

            modelos.forEach(modelo => {
                const rutaArchivo = `data/${modelo}/${nombreArchivo}`;
                const fasta = this.servicioDatos.cargarArchivo(rutaArchivo);
                if (fasta) {
                    comparaciones[modelo] = this.servicioAlineamiento.calcularEstadisticas(modelo, fasta);
                }
            });

            return comparaciones;
        } catch (error) {
            console.error('Error al comparar alineamientos:', error);
            throw error;
        }
    }

    /**
     * Exporta datos del alineamiento
     * @param {string} nombreArchivo - Nombre del archivo
     * @param {string} formato - Formato de exportación
     */
    exportarAlineamiento(nombreArchivo, formato = 'json') {
        try {
            const datos = this.compararAlineamientos(nombreArchivo);
            this.servicioAlineamiento.exportarDatos(datos, formato);
        } catch (error) {
            console.error('Error al exportar alineamiento:', error);
            this.manejarError(error);
        }
    }

    /**
     * Maneja errores de la aplicación
     * @param {Error} error - Error a manejar
     */
    manejarError(error) {
        // Log del error
        console.error('Error de aplicación:', error);
        
        // Mostrar notificación al usuario
        this.mostrarNotificacion('Error: ' + error.message, 'error');
    }

    /**
     * Muestra una notificación al usuario
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} tipo - Tipo de notificación (exito, error, advertencia)
     */
    mostrarNotificacion(mensaje, tipo = 'info') {
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
     * Registra una acción para análisis
     * @param {string} accion - Acción realizada
     * @param {Object} datos - Datos adicionales
     */
    registrarAccion(accion, datos = {}) {
        const entradaLog = {
            marcaTiempo: new Date().toISOString(),
            accion: accion,
            datos: datos,
            agenteUsuario: navigator.userAgent
        };
        
        console.log('Acción del usuario:', entradaLog);
        // Aquí se podría enviar a un servicio de analytics
    }
} 