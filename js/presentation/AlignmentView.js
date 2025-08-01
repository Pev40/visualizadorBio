/**
 * Capa de Presentación - Maneja la interfaz de usuario y la interacción
 * Responsabilidades:
 * - Renderizar componentes de UI
 * - Manejar eventos de usuario
 * - Actualizar la vista con datos
 */
class VistaAlineamiento {
    constructor() {
        this.contenedor = $("#alignments-container");
        this.selectorArchivo = $("#file-select");
        this.visualizadores = {};
        this.servicioDatos = null;
    }

    /**
     * Inicializa la vista y configura los eventos
     * @param {ServicioDatosAlineamiento} servicioDatos - Servicio de datos
     */
    inicializar(servicioDatos) {
        this.servicioDatos = servicioDatos;
        this.configurarSelectorArchivos();
        this.configurarEscuchadoresEventos();
    }

    /**
     * Configura el selector de archivos
     */
    configurarSelectorArchivos() {
        const archivosAlineamiento = this.servicioDatos.obtenerArchivosDisponibles();
        
        if (archivosAlineamiento.length > 0) {
            archivosAlineamiento.forEach((archivo) => {
                this.selectorArchivo.append(`<option value="${archivo}">${archivo}</option>`);
            });
            
            // Cargar el primer archivo por defecto
            this.cargarAlineamiento(archivosAlineamiento[0]);
        } else {
            this.selectorArchivo.append("<option>No hay archivos de alineamiento disponibles</option>");
        }
    }

    /**
     * Configura los escuchadores de eventos
     */
    configurarEscuchadoresEventos() {
        this.selectorArchivo.on("change", (event) => {
            const archivoSeleccionado = $(event.target).val();
            this.cargarAlineamiento(archivoSeleccionado);
        });
    }

    /**
     * Carga un alineamiento específico
     * @param {string} nombreArchivo - Nombre del archivo a cargar
     */
    cargarAlineamiento(nombreArchivo) {
        if (!nombreArchivo) return;
        
        this.limpiarContenedor();
        this.visualizadores = {};

        const modelos = this.servicioDatos.obtenerModelosDisponibles();
        
        modelos.forEach((modelo) => {
            this.crearTarjetaModelo(modelo);
            this.cargarAlineamientoModelo(modelo, nombreArchivo);
        });
    }

    /**
     * Limpia el contenedor principal
     */
    limpiarContenedor() {
        this.contenedor.empty();
    }

    /**
     * Crea una tarjeta para un modelo específico
     * @param {string} modelo - Nombre del modelo
     */
    crearTarjetaModelo(modelo) {
        const htmlTarjeta = `
            <div id="tarjeta-para-${modelo}" class="bg-white p-6 rounded-lg shadow-lg">
                <h3 class="text-xl font-bold mb-4 text-gray-800">Resultados de ${modelo}</h3>
                <div id="visualizador-msa-${modelo}" class="msa-viewer-container">
                    <p class="text-gray-500 p-4">Cargando alineamiento para el modelo ${modelo}...</p>
                </div>
                <div id="reporte-msa-${modelo}" class="mt-4"></div>
            </div>
        `;
        this.contenedor.append(htmlTarjeta);
    }

    /**
     * Carga el alineamiento para un modelo específico
     * @param {string} modelo - Nombre del modelo
     * @param {string} nombreArchivo - Nombre del archivo
     */
    cargarAlineamientoModelo(modelo, nombreArchivo) {
        const rutaArchivo = `data/${modelo}/${nombreArchivo}`;
        const contenedorVisualizador = $(`#visualizador-msa-${modelo}`);
        const contenedorReporte = $(`#reporte-msa-${modelo}`);

        $.get(rutaArchivo, (fasta) => {
            this.renderizarAlineamiento(modelo, fasta, contenedorVisualizador, contenedorReporte);
        }).fail(() => {
            this.mostrarError(modelo, contenedorVisualizador);
        });
    }

    /**
     * Renderiza el alineamiento
     * @param {string} modelo - Nombre del modelo
     * @param {string} fasta - Datos FASTA
     * @param {jQuery} contenedorVisualizador - Contenedor del visualizador
     * @param {jQuery} contenedorReporte - Contenedor del reporte
     */
    renderizarAlineamiento(modelo, fasta, contenedorVisualizador, contenedorReporte) {
        contenedorVisualizador.empty();

        const anotaciones = [];
        const alteraciones = [];

        this.visualizadores[modelo] = new MSABrowser({
            id: `visualizador-msa-${modelo}`,
            msa: MSAProcessor({ fasta: fasta, hasConsensus: true }),
            annotations: anotaciones,
            alterations: alteraciones,
            colorSchema: "clustal",
        });

        this.generarReporte(modelo, fasta, contenedorReporte);
    }

    /**
     * Genera el reporte de estadísticas
     * @param {string} modelo - Nombre del modelo
     * @param {string} fasta - Datos FASTA
     * @param {jQuery} contenedorReporte - Contenedor del reporte
     */
    generarReporte(modelo, fasta, contenedorReporte) {
        const evaluador = new EvaluadorAlineamiento();
        try {
            const secuencias = evaluador.parsearFASTA(fasta);
            const estadisticas = evaluador.calcularEstadisticasMSA(secuencias);
            const htmlReporte = evaluador.generarReporteHTML(estadisticas);
            contenedorReporte.html(htmlReporte);
        } catch (error) {
            console.error(`Error al calcular puntaje para ${modelo}:`, error);
            contenedorReporte.html(
                `<div class="p-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
                    <p><strong>Error al calcular el puntaje:</strong> ${error.message}</p>
                </div>`
            );
        }
    }

    /**
     * Muestra un error cuando no se puede cargar el archivo
     * @param {string} modelo - Nombre del modelo
     * @param {jQuery} contenedorVisualizador - Contenedor del visualizador
     */
    mostrarError(modelo, contenedorVisualizador) {
        contenedorVisualizador.html(
            `<div class="p-4 text-center text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p>Alineamiento no disponible para el modelo <strong>${modelo}</strong>.</p>
            </div>`
        );
    }

    /**
     * Desplaza todos los visualizadores a una posición específica
     */
    desplazarAVariacion() {
        Object.values(this.visualizadores).forEach((instanciaVisualizador) => {
            if (instanciaVisualizador && typeof instanciaVisualizador.scrollToPosition === "function") {
                instanciaVisualizador.scrollToPosition(1, 5);
            }
        });
    }
} 