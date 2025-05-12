// Sistema de reja
let configGrid;

function calcularConfiguracionGrid(width, height) {
    // Usar la dimensión menor del canvas como referencia
    const dimensionMenor = Math.min(width, height);
    const altoZonaReja = dimensionMenor * 0.6;
    const tamCuadrado = altoZonaReja / 4;
  
    // Calcular cantidad de cuadrados horizontales
    const cantidadCuadradosHoriz = Math.floor((width * 0.6) / tamCuadrado);
    const anchoRejaReal = (cantidadCuadradosHoriz + 1) * tamCuadrado;
  
    // Calcular márgenes para centrar
    const margenX = (width - anchoRejaReal) / 2;
    const margenY = (height - altoZonaReja) / 2;

    // Calcular grosor de línea proporcional
    // Para un canvas de 800px de altura menor, el grosor será 24px (doble del anterior)
    // Entonces la proporción es 24/800 = 0.03 (3% de la dimensión menor)
    const grosorLinea = Math.max(8, Math.floor(dimensionMenor * 0.03));
  
    return {
        baseX: margenX,
        baseY: margenY,
        tamCuadrado: tamCuadrado,
        cantidadHoriz: cantidadCuadradosHoriz,
        cantidadVert: 3,
        grosorLinea: grosorLinea,
        // Mantener compatibilidad con el sistema anterior
        numCeldasX: cantidadCuadradosHoriz,
        numCeldasY: 3,
        cellSize: tamCuadrado,
        gridWidth: anchoRejaReal,
        gridHeight: altoZonaReja,
        offsetX: margenX,
        offsetY: margenY
    };
}

function dibujarGrid() {
    if (!configGrid) {
        configGrid = calcularConfiguracionGrid(canvasGrid.width, canvasGrid.height);
    }

    const {
        baseX,
        baseY,
        tamCuadrado,
        cantidadHoriz,
        cantidadVert,
        grosorLinea
    } = configGrid;
    
    ctxGrid.clearRect(0, 0, canvasGrid.width, canvasGrid.height);
    ctxGrid.lineWidth = grosorLinea;
    
    // Obtener el offset del movimiento
    const offset = gridMovement.update();
    
    // Dibujar líneas horizontales
    for (let i = 0.5; i <= cantidadVert + 0.5; i++) {
        const y = baseY + i * tamCuadrado + offset.y;
        const grad = ctxGrid.createLinearGradient(0, y - grosorLinea/2, 0, y + grosorLinea/2);
        grad.addColorStop(0, "#004050");
        grad.addColorStop(0.5, "#00ffff");
        grad.addColorStop(1, "#004050");
        ctxGrid.strokeStyle = grad;
        ctxGrid.beginPath();
        ctxGrid.moveTo(baseX + offset.x, y);
        ctxGrid.lineTo(baseX + (cantidadHoriz + 1) * tamCuadrado + offset.x, y);
        ctxGrid.stroke();
    }
    
    // Dibujar líneas verticales
    for (let j = 0.5; j <= cantidadHoriz + 0.5; j++) {
        const x = baseX + j * tamCuadrado + offset.x;
        const grad = ctxGrid.createLinearGradient(x - grosorLinea/2, 0, x + grosorLinea/2, 0);
        grad.addColorStop(0, "#004050");
        grad.addColorStop(0.5, "#00ffff");
        grad.addColorStop(1, "#004050");
        ctxGrid.strokeStyle = grad;
        ctxGrid.beginPath();
        ctxGrid.moveTo(x, baseY + offset.y);
        ctxGrid.lineTo(x, baseY + 4 * tamCuadrado + offset.y);
        ctxGrid.stroke();
    }
}

// Inicializar el sistema de movimiento
function initGrid() {
    gridMovement.init();
}

// Función para obtener las coordenadas de una celda
function obtenerCelda(x, y) {
    if (!configGrid) {
        configGrid = calcularConfiguracionGrid(canvasGrid.width, canvasGrid.height);
    }

    const { tamCuadrado, baseX, baseY } = configGrid;
    const offset = gridMovement.getCurrentOffset();
    
    const celdaX = Math.floor((x - baseX - offset.x) / tamCuadrado);
    const celdaY = Math.floor((y - baseY - offset.y) / tamCuadrado);
    
    if (celdaX < 0 || celdaX >= configGrid.cantidadHoriz ||
        celdaY < 0 || celdaY >= configGrid.cantidadVert) {
        return null;
    }
    
    return {
        x: celdaX,
        y: celdaY,
        cxCentro: baseX + (celdaX + 0.5) * tamCuadrado + offset.x,
        cyCentro: baseY + (celdaY + 0.5) * tamCuadrado + offset.y
    };
}

// Exportar funciones necesarias
window.dibujarGrid = dibujarGrid;
window.obtenerCelda = obtenerCelda;
window.initGrid = initGrid; 