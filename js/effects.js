// Sistema de efectos y disparos

function initEffects() {
    // Inicialización de efectos
    // Por ahora no hay nada que inicializar
}

function dibujarEffects() {
    // Limpiar canvas de efectos
    ctxEffects.clearRect(0, 0, canvasEffects.width, canvasEffects.height);
    // Por ahora está vacío, se usará para disparos y otros efectos
}

// Exportar funciones necesarias
window.initEffects = initEffects;
window.dibujarEffects = dibujarEffects; 