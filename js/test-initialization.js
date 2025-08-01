/**
 * Archivo de prueba para verificar la inicialización de las clases
 * Se ejecuta antes del archivo principal para detectar problemas
 */

console.log('=== Verificación de Inicialización ===');

// Verificar que jQuery esté disponible
if (typeof $ !== 'undefined') {
    console.log('✅ jQuery cargado correctamente');
} else {
    console.error('❌ jQuery no está disponible');
}

// Verificar que MSABrowser esté disponible
if (typeof MSABrowser !== 'undefined') {
    console.log('✅ MSABrowser cargado correctamente');
} else {
    console.error('❌ MSABrowser no está disponible');
}

// Verificar que EvaluadorAlineamiento esté disponible
if (typeof EvaluadorAlineamiento !== 'undefined') {
    console.log('✅ EvaluadorAlineamiento cargado correctamente');
} else {
    console.error('❌ EvaluadorAlineamiento no está disponible');
}

// Verificar que las clases de la arquitectura estén disponibles
if (typeof ServicioDatosAlineamiento !== 'undefined') {
    console.log('✅ ServicioDatosAlineamiento cargado correctamente');
    
    // Probar la instanciación
    try {
        const servicioDatos = new ServicioDatosAlineamiento();
        console.log('✅ ServicioDatosAlineamiento se puede instanciar');
        console.log('📁 Archivos disponibles:', servicioDatos.obtenerArchivosDisponibles().length);
        console.log('🔧 Modelos disponibles:', servicioDatos.obtenerModelosDisponibles().length);
    } catch (error) {
        console.error('❌ Error al instanciar ServicioDatosAlineamiento:', error);
    }
} else {
    console.error('❌ ServicioDatosAlineamiento no está disponible');
}

if (typeof ServicioAlineamiento !== 'undefined') {
    console.log('✅ ServicioAlineamiento cargado correctamente');
    
    try {
        const servicioAlineamiento = new ServicioAlineamiento();
        console.log('✅ ServicioAlineamiento se puede instanciar');
    } catch (error) {
        console.error('❌ Error al instanciar ServicioAlineamiento:', error);
    }
} else {
    console.error('❌ ServicioAlineamiento no está disponible');
}

if (typeof VistaAlineamiento !== 'undefined') {
    console.log('✅ VistaAlineamiento cargado correctamente');
    
    try {
        const vista = new VistaAlineamiento();
        console.log('✅ VistaAlineamiento se puede instanciar');
    } catch (error) {
        console.error('❌ Error al instanciar VistaAlineamiento:', error);
    }
} else {
    console.error('❌ VistaAlineamiento no está disponible');
}

if (typeof ControladorAlineamiento !== 'undefined') {
    console.log('✅ ControladorAlineamiento cargado correctamente');
    
    try {
        const controlador = new ControladorAlineamiento();
        console.log('✅ ControladorAlineamiento se puede instanciar');
    } catch (error) {
        console.error('❌ Error al instanciar ControladorAlineamiento:', error);
    }
} else {
    console.error('❌ ControladorAlineamiento no está disponible');
}

console.log('=== Fin de Verificación ==='); 