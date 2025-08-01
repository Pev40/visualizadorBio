/**
 * Evaluador de Alineamiento - Calcula métricas de calidad de alineamiento
 * Para alineamientos de secuencias de ADN
 */

class EvaluadorAlineamiento {
  constructor() {
    // Parámetros de puntuación por defecto para ADN
    this.puntuacionCoincidencia = 2;
    this.puntuacionNoCoincidencia = -1;
    this.penalizacionGap = -2;
    this.penalizacionExtensionGap = -0.5;
  }

  /**
   * Parsea alineamiento en formato FASTA para extraer secuencias
   * @param {string} contenidoFASTA - Contenido FASTA crudo
   * @returns {Array} Array de objetos {id, secuencia}
   */
  parsearFASTA(contenidoFASTA) {
    const secuencias = [];
    const lineas = contenidoFASTA.split("\n");
    let secuenciaActual = null;

    for (let linea of lineas) {
      linea = linea.trim();
      if (linea.startsWith(">")) {
        if (secuenciaActual) {
          secuencias.push(secuenciaActual);
        }
        secuenciaActual = {
          id: linea.substring(1),
          secuencia: "",
        };
      } else if (linea && secuenciaActual) {
        secuenciaActual.secuencia += linea;
      }
    }

    if (secuenciaActual) {
      secuencias.push(secuenciaActual);
    }

    return secuencias;
  }

  /**
   * Calcula puntuación de alineamiento por pares
   * @param {string} seq1 - Primera secuencia (con gaps)
   * @param {string} seq2 - Segunda secuencia (con gaps)
   * @returns {Object} Desglose de puntuación
   */
  calcularPuntuacionPares(seq1, seq2) {
    if (seq1.length !== seq2.length) {
      throw new Error(
        "Las secuencias deben tener la misma longitud para puntuación de alineamiento"
      );
    }

    let coincidencias = 0;
    let noCoincidencias = 0;
    let gaps = 0;
    let puntuacion = 0;
    let corridasGaps = 0;
    let enGap = false;

    for (let i = 0; i < seq1.length; i++) {
      const char1 = seq1[i].toUpperCase();
      const char2 = seq2[i].toUpperCase();

      if (char1 === "-" || char2 === "-") {
        gaps++;
        if (!enGap) {
          puntuacion += this.penalizacionGap;
          corridasGaps++;
          enGap = true;
        } else {
          puntuacion += this.penalizacionExtensionGap;
        }
      } else {
        enGap = false;
        if (char1 === char2) {
          coincidencias++;
          puntuacion += this.puntuacionCoincidencia;
        } else {
          noCoincidencias++;
          puntuacion += this.puntuacionNoCoincidencia;
        }
      }
    }

    const identidad = (coincidencias / (coincidencias + noCoincidencias + gaps)) * 100;
    const similitud = (coincidencias / (seq1.length - gaps)) * 100;

    return {
      puntuacion: puntuacion,
      coincidencias: coincidencias,
      noCoincidencias: noCoincidencias,
      gaps: gaps,
      corridasGaps: corridasGaps,
      identidad: parseFloat(identidad.toFixed(2)),
      similitud: parseFloat(similitud.toFixed(2)),
      longitud: seq1.length,
    };
  }

  /**
   * Calcula estadísticas de alineamiento múltiple de secuencias
   * @param {Array} secuencias - Array de objetos de secuencia
   * @returns {Object} Estadísticas MSA
   */
  calcularEstadisticasMSA(secuencias) {
    if (secuencias.length < 2) {
      throw new Error("Se necesitan al menos 2 secuencias para puntuación MSA");
    }

    const longitudAlineamiento = secuencias[0].secuencia.length;
    const numSecuencias = secuencias.length;

    // Verificar que todas las secuencias tengan la misma longitud
    for (let seq of secuencias) {
      if (seq.secuencia.length !== longitudAlineamiento) {
        throw new Error("Todas las secuencias deben tener la misma longitud en MSA");
      }
    }

    let posicionesConservadas = 0;
    let puntuacionTotal = 0;
    let puntuacionesPares = [];

    // Calcular conservación por posición
    for (let pos = 0; pos < longitudAlineamiento; pos++) {
      const chars = secuencias.map((seq) => seq.secuencia[pos].toUpperCase());
      const charsUnicos = new Set(chars.filter((c) => c !== "-"));

      if (charsUnicos.size === 1 && !charsUnicos.has("-")) {
        posicionesConservadas++;
      }
    }

    // Calcular todas las puntuaciones por pares
    for (let i = 0; i < numSecuencias; i++) {
      for (let j = i + 1; j < numSecuencias; j++) {
        const puntuacionPar = this.calcularPuntuacionPares(
          secuencias[i].secuencia,
          secuencias[j].secuencia
        );
        puntuacionesPares.push(puntuacionPar);
        puntuacionTotal += puntuacionPar.puntuacion;
      }
    }

    const identidadPromedio =
      puntuacionesPares.reduce((sum, ps) => sum + ps.identidad, 0) /
      puntuacionesPares.length;
    const puntuacionPromedio = puntuacionTotal / puntuacionesPares.length;
    const conservacion = (posicionesConservadas / longitudAlineamiento) * 100;

    return {
      numSecuencias: numSecuencias,
      longitudAlineamiento: longitudAlineamiento,
      posicionesConservadas: posicionesConservadas,
      conservacion: parseFloat(conservacion.toFixed(2)),
      puntuacionPromedio: parseFloat(puntuacionPromedio.toFixed(2)),
      identidadPromedio: parseFloat(identidadPromedio.toFixed(2)),
      puntuacionesPares: puntuacionesPares,
      totalPares: puntuacionesPares.length,
    };
  }

  /**
   * Genera reporte HTML de estadísticas de alineamiento
   * @param {Object} estadisticas - Estadísticas de calcularEstadisticasMSA
   * @returns {string} Reporte HTML
   */
  generarReporteHTML(estadisticas) {
    const html = `
            <div style="background-color: #f8f9fa; padding: 15px; margin: 10px 0; border: 1px solid #dee2e6; border-radius: 4px;">
                <h4>Reporte de Calidad de Alineamiento</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <strong>Estadísticas Básicas:</strong>
                        <ul style="margin: 5px 0;">
                            <li>Número de secuencias: ${estadisticas.numSecuencias}</li>
                            <li>Longitud de alineamiento: ${estadisticas.longitudAlineamiento}</li>
                            <li>Posiciones conservadas: ${
                              estadisticas.posicionesConservadas
                            }</li>
                            <li>Conservación: ${estadisticas.conservacion}%</li>
                        </ul>
                    </div>
                    <div>
                        <strong>Métricas de Calidad:</strong>
                        <ul style="margin: 5px 0;">
                            <li>Puntuación promedio: ${estadisticas.puntuacionPromedio}</li>
                            <li>Identidad promedio: ${estadisticas.identidadPromedio}%</li>
                            <li>Comparaciones por pares: ${estadisticas.totalPares}</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <strong>Evaluación de Calidad:</strong>
                    <span style="color: ${this.obtenerColorCalidad(
                      estadisticas.identidadPromedio
                    )}; font-weight: bold;">
                        ${this.obtenerEtiquetaCalidad(estadisticas.identidadPromedio)}
                    </span>
                </div>
            </div>
        `;
    return html;
  }

  /**
   * Obtiene color de calidad basado en porcentaje de identidad
   */
  obtenerColorCalidad(identidad) {
    if (identidad >= 80) return "#28a745";
    if (identidad >= 60) return "#ffc107";
    if (identidad >= 40) return "#fd7e14";
    return "#dc3545";
  }

  /**
   * Obtiene etiqueta de calidad basada en porcentaje de identidad
   */
  obtenerEtiquetaCalidad(identidad) {
    if (identidad >= 80) return "Excelente";
    if (identidad >= 60) return "Bueno";
    if (identidad >= 40) return "Regular";
    return "Pobre";
  }

  /**
   * Establece parámetros de puntuación personalizados
   * @param {Object} parametros - {puntuacionCoincidencia, puntuacionNoCoincidencia, penalizacionGap, penalizacionExtensionGap}
   */
  establecerParametros(parametros) {
    if (parametros.puntuacionCoincidencia !== undefined) this.puntuacionCoincidencia = parametros.puntuacionCoincidencia;
    if (parametros.puntuacionNoCoincidencia !== undefined)
      this.puntuacionNoCoincidencia = parametros.puntuacionNoCoincidencia;
    if (parametros.penalizacionGap !== undefined) this.penalizacionGap = parametros.penalizacionGap;
    if (parametros.penalizacionExtensionGap !== undefined)
      this.penalizacionExtensionGap = parametros.penalizacionExtensionGap;
  }
}

// Hacerlo disponible globalmente y como módulo
if (typeof window !== "undefined") {
  window.EvaluadorAlineamiento = EvaluadorAlineamiento;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = EvaluadorAlineamiento;
}
