/**
 * Capa de Repositorio - Maneja el acceso a datos y persistencia
 * Responsabilidades:
 * - Acceso a archivos de alineamiento
 * - Gestión de metadatos
 * - Cache de datos
 */
class ServicioDatosAlineamiento {
    constructor() {
        this.cache = new Map();
        this.archivosDisponibles = [
            "NC_002018_NC_002019.aln",
            "NC_002017_NC_002022.aln",
            "NC_002210_NC_002211.aln",
            "NC_006311_NC_006312.aln",
            "NC_007370_NC_007371.aln",
            "NC_026424_NC_026425.aln",
            "NC_036617_NC_036618.aln",
            "NC_002020_NC_002021.aln",
            "NC_004906_NC_004908.aln",
            "NC_007357_NC_007358.aln",
            "NC_007372_NC_007373.aln",
            "NC_026426_NC_026427.aln",
            "NC_036619_NC_036620.aln",
            "NC_002023_NC_002016.aln",
            "NC_004907_NC_004905.aln",
            "NC_007359_NC_007360.aln",
            "NC_007374_NC_007375.aln",
            "NC_026432_NC_026433.aln",
            "NC_036621_NC_026431.aln",
            "NC_002204_NC_002207.aln",
            "NC_004909_NC_004910.aln",
            "NC_007362_NC_007363.aln",
            "NC_007376_NC_007377.aln",
            "NC_026433_NC_026434.aln",
            "ON527433_ON527434.aln",
            "NC_002205_NC_002206.aln",
            "NC_004911_NC_004912.aln",
            "NC_007364_NC_006306.aln",
            "NC_007378_NC_007380.aln",
            "NC_026435_NC_026436.aln",
            "ON527531_ON527532.aln",
            "NC_002208_NC_002209.aln",
            "NC_006307_NC_006308.aln",
            "NC_007366_NC_007367.aln",
            "NC_007381_NC_007382.aln",
            "NC_026437_NC_026438.aln",
            "NC_006309_NC_006310.aln",
            "NC_007368_NC_007369.aln",
            "NC_026422_NC_026423.aln",
            "NC_036615_NC_036616.aln",
        ];
        this.modelosDisponibles = ["EdgeAlign", "MLP", "NeedlemanWunsch"];
    }

    /**
     * Obtiene todos los archivos de alineamiento disponibles
     * @returns {Array} Lista de archivos disponibles
     */
    obtenerArchivosDisponibles() {
        return this.archivosDisponibles;
    }

    /**
     * Obtiene todos los modelos disponibles
     * @returns {Array} Lista de modelos disponibles
     */
    obtenerModelosDisponibles() {
        return this.modelosDisponibles;
    }

    /**
     * Verifica si un archivo está disponible
     * @param {string} nombreArchivo - Nombre del archivo
     * @returns {boolean} True si el archivo está disponible
     */
    archivoDisponible(nombreArchivo) {
        return this.archivosDisponibles.includes(nombreArchivo);
    }

    /**
     * Verifica si un modelo está disponible
     * @param {string} nombreModelo - Nombre del modelo
     * @returns {boolean} True si el modelo está disponible
     */
    modeloDisponible(nombreModelo) {
        return this.modelosDisponibles.includes(nombreModelo);
    }

    /**
     * Carga un archivo desde el servidor
     * @param {string} rutaArchivo - Ruta del archivo
     * @returns {Promise<string>} Contenido del archivo
     */
    async cargarArchivo(rutaArchivo) {
        const claveCache = rutaArchivo;
        
        // Verificar cache primero
        if (this.cache.has(claveCache)) {
            return this.cache.get(claveCache);
        }

        try {
            const respuesta = await fetch(rutaArchivo);
            if (!respuesta.ok) {
                throw new Error(`Error HTTP! estado: ${respuesta.status}`);
            }
            
            const contenido = await respuesta.text();
            
            // Guardar en cache
            this.cache.set(claveCache, contenido);
            
            return contenido;
        } catch (error) {
            console.error(`Error al cargar archivo ${rutaArchivo}:`, error);
            throw error;
        }
    }

    /**
     * Carga un archivo usando jQuery (para compatibilidad)
     * @param {string} rutaArchivo - Ruta del archivo
     * @returns {Promise<string>} Contenido del archivo
     */
    cargarArchivoConJQuery(rutaArchivo) {
        return new Promise((resolve, reject) => {
            $.get(rutaArchivo)
                .done((contenido) => {
                    this.cache.set(rutaArchivo, contenido);
                    resolve(contenido);
                })
                .fail((jqXHR, estadoTexto, errorLanzado) => {
                    reject(new Error(`Error al cargar ${rutaArchivo}: ${estadoTexto}`));
                });
        });
    }

    /**
     * Obtiene metadatos de un archivo
     * @param {string} nombreArchivo - Nombre del archivo
     * @returns {Object} Metadatos del archivo
     */
    obtenerMetadatosArchivo(nombreArchivo) {
        const modelos = this.obtenerModelosDisponibles();
        const metadatos = {
            nombreArchivo: nombreArchivo,
            modelosDisponibles: [],
            totalModelos: modelos.length,
            ultimaModificacion: null,
            tamanoArchivo: null
        };

        // Verificar qué modelos tienen este archivo
        modelos.forEach(modelo => {
            const rutaArchivo = `data/${modelo}/${nombreArchivo}`;
            // En una implementación real, aquí se verificaría si el archivo existe
            metadatos.modelosDisponibles.push(modelo);
        });

        return metadatos;
    }

    /**
     * Obtiene estadísticas de todos los archivos
     * @returns {Object} Estadísticas de archivos
     */
    obtenerEstadisticasArchivos() {
        const estadisticas = {
            archivosTotales: this.archivosDisponibles.length,
            modelosTotales: this.modelosDisponibles.length,
            archivosPorModelo: {},
            coberturaModelo: {}
        };

        // Calcular cobertura por modelo
        this.modelosDisponibles.forEach(modelo => {
            let contadorArchivos = 0;
            this.archivosDisponibles.forEach(archivo => {
                // En una implementación real, aquí se verificaría si el archivo existe
                contadorArchivos++;
            });
            estadisticas.archivosPorModelo[modelo] = contadorArchivos;
            estadisticas.coberturaModelo[modelo] = (contadorArchivos / this.archivosDisponibles.length) * 100;
        });

        return estadisticas;
    }

    /**
     * Limpia el cache
     */
    limpiarCache() {
        this.cache.clear();
    }

    /**
     * Obtiene información del cache
     * @returns {Object} Información del cache
     */
    obtenerInformacionCache() {
        return {
            tamano: this.cache.size,
            claves: Array.from(this.cache.keys()),
            usoMemoria: this.estimarUsoMemoria()
        };
    }

    /**
     * Estima el uso de memoria del cache
     * @returns {number} Uso de memoria en bytes
     */
    estimarUsoMemoria() {
        let tamanoTotal = 0;
        for (const [clave, valor] of this.cache) {
            tamanoTotal += clave.length * 2; // UTF-16
            tamanoTotal += valor.length * 2; // UTF-16
        }
        return tamanoTotal;
    }

    /**
     * Pre-carga archivos para mejorar el rendimiento
     * @param {Array} nombresArchivos - Lista de nombres de archivos a pre-cargar
     */
    async precargarArchivos(nombresArchivos) {
        const promesasPrecarga = nombresArchivos.map(nombreArchivo => {
            const modelos = this.obtenerModelosDisponibles();
            return modelos.map(modelo => {
                const rutaArchivo = `data/${modelo}/${nombreArchivo}`;
                return this.cargarArchivo(rutaArchivo).catch(error => {
                    console.warn(`Error al precargar ${rutaArchivo}:`, error);
                });
            });
        });

        await Promise.all(promesasPrecarga.flat());
    }

    /**
     * Exporta metadatos de archivos
     * @returns {Object} Metadatos exportables
     */
    exportarMetadatos() {
        return {
            archivosDisponibles: this.archivosDisponibles,
            modelosDisponibles: this.modelosDisponibles,
            estadisticasArchivos: this.obtenerEstadisticasArchivos(),
            informacionCache: this.obtenerInformacionCache(),
            marcaTiempoExportacion: new Date().toISOString()
        };
    }
} 