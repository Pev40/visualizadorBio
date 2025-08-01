/**
 * Capa de Dominio - Contiene la lógica de negocio y reglas del dominio
 * Responsabilidades:
 * - Lógica de negocio para alineamientos
 * - Cálculos y análisis de secuencias
 * - Reglas de validación
 */
class ServicioAlineamiento {
    constructor() {
        this.evaluador = new EvaluadorAlineamiento();
    }

    /**
     * Calcula estadísticas para un alineamiento
     * @param {string} modelo - Modelo del alineamiento
     * @param {string} fasta - Datos FASTA
     * @returns {Object} Estadísticas calculadas
     */
    calcularEstadisticas(modelo, fasta) {
        try {
            const secuencias = this.evaluador.parsearFASTA(fasta);
            const estadisticas = this.evaluador.calcularEstadisticasMSA(secuencias);
            
            return {
                modelo: modelo,
                secuencias: secuencias.length,
                longitud: secuencias[0] ? secuencias[0].length : 0,
                estadisticas: estadisticas,
                calidad: this.calcularPuntajeCalidad(estadisticas),
                marcaTiempo: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Error al calcular estadísticas para ${modelo}: ${error.message}`);
        }
    }

    /**
     * Calcula un puntaje de calidad basado en las estadísticas
     * @param {Object} estadisticas - Estadísticas del alineamiento
     * @returns {number} Puntaje de calidad (0-100)
     */
    calcularPuntajeCalidad(estadisticas) {
        let puntaje = 0;
        
        // Factor de conservación
        if (estadisticas.conservacion) {
            puntaje += estadisticas.conservacion * 30;
        }
        
        // Factor de identidad
        if (estadisticas.identidad) {
            puntaje += estadisticas.identidad * 25;
        }
        
        // Factor de similitud
        if (estadisticas.similitud) {
            puntaje += estadisticas.similitud * 25;
        }
        
        // Factor de gaps
        if (estadisticas.porcentajeGaps !== undefined) {
            puntaje += Math.max(0, 20 - estadisticas.porcentajeGaps);
        }
        
        return Math.min(100, Math.max(0, puntaje));
    }

    /**
     * Valida un archivo FASTA
     * @param {string} fasta - Datos FASTA
     * @returns {Object} Resultado de la validación
     */
    validarFASTA(fasta) {
        const errores = [];
        const advertencias = [];
        
        if (!fasta || fasta.trim() === '') {
            errores.push('El archivo FASTA está vacío');
            return { esValido: false, errores, advertencias };
        }
        
        const lineas = fasta.split('\n');
        let contadorSecuencias = 0;
        let longitudTotal = 0;
        const longitudes = new Set();
        
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            
            if (linea.startsWith('>')) {
                contadorSecuencias++;
                
                // Validar nombre de secuencia
                if (linea.length < 2) {
                    errores.push(`Línea ${i + 1}: Nombre de secuencia inválido`);
                }
            } else if (linea.length > 0) {
                // Validar caracteres de secuencia
                const caracteresInvalidos = linea.match(/[^ACGTUacgtuNnXx-]/g);
                if (caracteresInvalidos) {
                    advertencias.push(`Línea ${i + 1}: Caracteres no estándar encontrados: ${caracteresInvalidos.join(', ')}`);
                }
                
                longitudTotal += linea.length;
                longitudes.add(linea.length);
            }
        }
        
        // Validar número de secuencias
        if (contadorSecuencias < 2) {
            errores.push('Se requieren al menos 2 secuencias para un alineamiento');
        }
        
        // Validar longitud consistente
        if (longitudes.size > 1) {
            errores.push('Todas las secuencias deben tener la misma longitud');
        }
        
        return {
            esValido: errores.length === 0,
            errores,
            advertencias,
            contadorSecuencias,
            longitudTotal,
            longitudPromedio: longitudTotal / contadorSecuencias
        };
    }

    /**
     * Compara dos alineamientos
     * @param {Object} alineamiento1 - Primer alineamiento
     * @param {Object} alineamiento2 - Segundo alineamiento
     * @returns {Object} Resultado de la comparación
     */
    compararAlineamientos(alineamiento1, alineamiento2) {
        const comparacion = {
            diferenciaCalidad: alineamiento1.calidad - alineamiento2.calidad,
            diferenciaConservacion: (alineamiento1.estadisticas.conservacion || 0) - (alineamiento2.estadisticas.conservacion || 0),
            diferenciaIdentidad: (alineamiento1.estadisticas.identidad || 0) - (alineamiento2.estadisticas.identidad || 0),
            diferenciaSimilitud: (alineamiento1.estadisticas.similitud || 0) - (alineamiento2.estadisticas.similitud || 0),
            mejorAlineamiento: alineamiento1.calidad > alineamiento2.calidad ? alineamiento1.modelo : alineamiento2.modelo
        };
        
        return comparacion;
    }

    /**
     * Exporta datos en diferentes formatos
     * @param {Object} datos - Datos a exportar
     * @param {string} formato - Formato de exportación
     */
    exportarDatos(datos, formato = 'json') {
        switch (formato.toLowerCase()) {
            case 'json':
                this.exportarComoJSON(datos);
                break;
            case 'csv':
                this.exportarComoCSV(datos);
                break;
            case 'txt':
                this.exportarComoTXT(datos);
                break;
            default:
                throw new Error(`Formato de exportación no soportado: ${formato}`);
        }
    }

    /**
     * Exporta datos como JSON
     * @param {Object} datos - Datos a exportar
     */
    exportarComoJSON(datos) {
        const datosJSON = JSON.stringify(datos, null, 2);
        this.descargarArchivo(datosJSON, 'datos-alineamiento.json', 'application/json');
    }

    /**
     * Exporta datos como CSV
     * @param {Object} datos - Datos a exportar
     */
    exportarComoCSV(datos) {
        let contenidoCSV = 'Modelo,Calidad,Conservacion,Identidad,Similitud,PorcentajeGaps\n';
        
        Object.values(datos).forEach(item => {
            contenidoCSV += `${item.modelo},${item.calidad},${item.estadisticas.conservacion || 0},${item.estadisticas.identidad || 0},${item.estadisticas.similitud || 0},${item.estadisticas.porcentajeGaps || 0}\n`;
        });
        
        this.descargarArchivo(contenidoCSV, 'datos-alineamiento.csv', 'text/csv');
    }

    /**
     * Exporta datos como TXT
     * @param {Object} datos - Datos a exportar
     */
    exportarComoTXT(datos) {
        let contenidoTXT = 'REPORTE DE ALINEAMIENTOS\n';
        contenidoTXT += '========================\n\n';
        
        Object.values(datos).forEach(item => {
            contenidoTXT += `Modelo: ${item.modelo}\n`;
            contenidoTXT += `Calidad: ${item.calidad.toFixed(2)}%\n`;
            contenidoTXT += `Conservación: ${(item.estadisticas.conservacion || 0).toFixed(2)}%\n`;
            contenidoTXT += `Identidad: ${(item.estadisticas.identidad || 0).toFixed(2)}%\n`;
            contenidoTXT += `Similitud: ${(item.estadisticas.similitud || 0).toFixed(2)}%\n`;
            contenidoTXT += `Gaps: ${(item.estadisticas.porcentajeGaps || 0).toFixed(2)}%\n\n`;
        });
        
        this.descargarArchivo(contenidoTXT, 'reporte-alineamiento.txt', 'text/plain');
    }

    /**
     * Descarga un archivo
     * @param {string} contenido - Contenido del archivo
     * @param {string} nombreArchivo - Nombre del archivo
     * @param {string} tipoMIME - Tipo MIME
     */
    descargarArchivo(contenido, nombreArchivo, tipoMIME) {
        const blob = new Blob([contenido], { type: tipoMIME });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
} 