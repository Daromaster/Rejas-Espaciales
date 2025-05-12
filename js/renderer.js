// Sistema de renderizado con canvas virtuales
let canvasPrincipal, ctxPrincipal;
let canvasFondo, ctxFondo;
let canvasBall, ctxBall;
let canvasGrid, ctxGrid;
let canvasEffects, ctxEffects;

function initRenderer() {
    // Inicialización de canvas principal
    canvasPrincipal = document.getElementById("canvas-juego");
    if (!canvasPrincipal) {
        console.error("No se encontró el canvas principal");
        return;
    }
    ctxPrincipal = canvasPrincipal.getContext("2d");

    // Canvas virtuales
    canvasFondo = document.createElement("canvas");
    ctxFondo = canvasFondo.getContext("2d");

    canvasBall = document.createElement("canvas");
    ctxBall = canvasBall.getContext("2d");

    canvasGrid = document.createElement("canvas");
    ctxGrid = canvasGrid.getContext("2d");

    canvasEffects = document.createElement("canvas");
    ctxEffects = canvasEffects.getContext("2d");

    // Inicializar capa de efectos
    if (typeof initEffects === 'function') {
        initEffects();
    }

    // Inicializar sistema de movimiento de la reja
    if (typeof initGrid === 'function') {
        initGrid();
    }

    // Inicializar fondo
    if (typeof initFondo === 'function') {
        initFondo();
    }

    // Exportar variables de canvas al scope global
    window.canvasPrincipal = canvasPrincipal;
    window.ctxPrincipal = ctxPrincipal;
    window.canvasFondo = canvasFondo;
    window.ctxFondo = ctxFondo;
    window.canvasBall = canvasBall;
    window.ctxBall = ctxBall;
    window.canvasGrid = canvasGrid;
    window.ctxGrid = ctxGrid;
    window.canvasEffects = canvasEffects;
    window.ctxEffects = ctxEffects;

    ajustarCanvasYCapas();
}

function ajustarCanvasYCapas() {
    const zonaJuego = document.getElementById("zona-juego");
    if (!zonaJuego) {
        console.error("No se encontró la zona de juego");
        return;
    }

    const width = zonaJuego.offsetWidth;
    const height = zonaJuego.offsetHeight;

    // Asegurar que width y height sean números finitos
    if (!isFinite(width) || !isFinite(height)) {
        console.error("Dimensiones inválidas de la zona de juego");
        return;
    }

    // Ajustar tamaño de todos los canvas
    for (const canvas of [canvasPrincipal, canvasFondo, canvasBall, canvasGrid, canvasEffects]) {
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    // Reinicializar configGrid
    if (typeof calcularConfiguracionGrid === 'function') {
        configGrid = calcularConfiguracionGrid(width, height);
    }

    // Reinicializar el fondo cuando cambia el tamaño
    if (typeof configFondo !== 'undefined') {
        configFondo.isInitialized = false;
    }

    // Inicializar capas
    if (typeof dibujarFondo === 'function') dibujarFondo();
    if (typeof dibujarBall === 'function') dibujarBall();
    if (typeof dibujarGrid === 'function') dibujarGrid();
    if (typeof dibujarEffects === 'function') dibujarEffects();
}

function render() {
    // Limpiar canvas principal
    ctxPrincipal.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
    ctxPrincipal.globalCompositeOperation = 'source-over';

    // Actualizar y dibujar capas en orden (de atrás hacia adelante)
    if (typeof dibujarFondo === 'function') dibujarFondo();
    if (typeof dibujarBall === 'function') dibujarBall();
    if (typeof dibujarGrid === 'function') dibujarGrid();
    if (typeof dibujarEffects === 'function') dibujarEffects();

    // Copiar capas al canvas principal
    ctxPrincipal.drawImage(canvasFondo, 0, 0, canvasPrincipal.width, canvasPrincipal.height);    // 1. Fondo estrellado
    ctxPrincipal.drawImage(canvasBall, 0, 0, canvasPrincipal.width, canvasPrincipal.height);     // 2. Pelota
    ctxPrincipal.drawImage(canvasGrid, 0, 0, canvasPrincipal.width, canvasPrincipal.height);     // 3. Reja
    ctxPrincipal.drawImage(canvasEffects, 0, 0, canvasPrincipal.width, canvasPrincipal.height);  // 4. Efectos y disparos

    // Solicitar siguiente frame
    requestAnimationFrame(render);
}

// Event listeners
window.addEventListener("DOMContentLoaded", () => {
    initRenderer();
    render();
});

window.addEventListener("resize", () => {
    ajustarCanvasYCapas();
    console.log("Redibujado por resize.");
}); 