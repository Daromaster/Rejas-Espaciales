// Test de edición - Comentario simple
// Segunda prueba de comentario
// Lógica principal del juego
let gameState = {
    isRunning: false,
    score: 0,
    level: 1,
    currentState: "covered", // Estado inicial: cubierto
    stateTime: 0,           // Tiempo en el estado actual
    coveredDuration: 1000,  // segundos en estado cubierto
    uncoveredDuration: 1000, // segundos en estado descubierto
    lastFrameTime: 0,       // Último tiempo de frame para control preciso
    frameCount: 0           // Contador de frames para debugging
};

function initGame() {
    // Inicializar estado del juego
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.level = 1;
    gameState.currentState = "covered"; // Asegurar que el estado inicial sea "covered"
    gameState.stateTime = 0;
    
    // Inicializar posición de la pelota en el centro del canvas (o donde se decida)
    const centerX = canvasBall.width / 2;
    const centerY = canvasBall.height / 2;
    ballMovement.config.currentPosition = { x: centerX, y: centerY };
    actualizarPosicionBall(centerX, centerY); // Dibuja la pelota en su posición inicial

    // Seleccionar y establecer el primer objetivo cubierto inmediatamente
    const primerObjetivoCubierto = ballMovement.selectRandomCoveredTarget();
    
    if (window.IS_LOCAL_ENVIRONMENT) { // Solo dibujar punto de depuración en entorno local
        if (primerObjetivoCubierto) {
            dibujarPuntoDestino(primerObjetivoCubierto, "yellow");
        } else {
            console.error("No se pudo seleccionar un primer objetivo cubierto en initGame para depuración.");
            if (ctxBorrador) ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height);
        }
    } else {
        // En producción, asegurarse de que la capa de borrador esté limpia al inicio
        if (ctxBorrador) ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height);
    }
    
    gameState.lastFrameTime = performance.now();
    gameState.frameCount = 0;
    
    // Iniciar bucle del juego unificado
    gameLoop();
}

// Función para dibujar un punto de depuración en el canvasBorrador
function dibujarPuntoDestino(targetInfo, color) {
    // Verificar si estamos en entorno local y si hay un canvasBorrador
    if (!window.IS_LOCAL_ENVIRONMENT || !ctxBorrador) {
        if (ctxBorrador) ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height); // Limpiar si no es local
        return; // No dibujar nada si no es local o no hay contexto
    }

    if (!targetInfo) {
        ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height); // Limpiar si no hay target
        return;
    }

    let puntoActualizado = null;
    if (targetInfo.tipo === "celda" && typeof window.getCentroCeldaActualizado === 'function') {
        puntoActualizado = window.getCentroCeldaActualizado(targetInfo.indiceCelda);
    } else if (targetInfo.tipo === "interseccion" && typeof window.getInterseccionActualizada === 'function') {
        puntoActualizado = window.getInterseccionActualizada(targetInfo.indiceInterseccion);
    }

    ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height); // Limpiar capa borrador siempre antes de dibujar

    if (puntoActualizado) {
        ctxBorrador.beginPath();
        ctxBorrador.arc(puntoActualizado.x, puntoActualizado.y, 5, 0, 2 * Math.PI);
        ctxBorrador.fillStyle = color;
        ctxBorrador.fill();
    } else {
        // console.warn("No se pudo obtener la posición actualizada para el punto de depuración:", targetInfo);
    }
}

function gameLoop() {
    if (!gameState.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - gameState.lastFrameTime;
    gameState.lastFrameTime = currentTime;
    gameState.frameCount++;

    // Solo incrementar el tiempo si la pelota está en el destino
    if (ballMovement.isAtDestination()) {
        gameState.stateTime += deltaTime; // Usar tiempo real en lugar de valor fijo
        
        // Log cada 500ms
        if (gameState.frameCount % 30 === 0) {
            console.log(`=== Estado del tiempo ===`);
            console.log(`Estado actual: ${gameState.currentState}`);
            console.log(`Tiempo acumulado: ${Math.floor(gameState.stateTime)}ms`);
            console.log(`Duración objetivo: ${gameState.currentState === "covered" ? gameState.coveredDuration : gameState.uncoveredDuration}ms`);
            console.log(`Frames en este estado: ${gameState.frameCount}`);
            console.log(`Delta time: ${deltaTime.toFixed(2)}ms`);
        }
    } else {
        if (gameState.frameCount % 60 === 0) {
            console.log("No acumulando tiempo - Pelota en tránsito");
        }
    }
    
    let currentTargetForDebugging = ballMovement.config.currentTarget;

    // Cambio de estado solo si la pelota ha estado suficiente tiempo en el destino
    if (gameState.currentState === "covered" && gameState.stateTime >= gameState.coveredDuration) {
        console.log("\n=== Cambio a estado DESCUBIERTO ===");
        console.log(`Tiempo final en cubierto: ${Math.floor(gameState.stateTime)}ms`);
        console.log(`Frames totales en estado: ${gameState.frameCount}`);
        
        gameState.currentState = "uncovered";
        gameState.stateTime = 0;
        gameState.frameCount = 0;
        ballMovement.selectRandomUncoveredTarget();
        ballMovement.resetTimeAtDestination();
        currentTargetForDebugging = ballMovement.config.currentTarget;
        
    } else if (gameState.currentState === "uncovered" && gameState.stateTime >= gameState.uncoveredDuration) {
        console.log("\n=== Cambio a estado CUBIERTO ===");
        console.log(`Tiempo final en descubierto: ${Math.floor(gameState.stateTime)}ms`);
        console.log(`Frames totales en estado: ${gameState.frameCount}`);
        
        gameState.currentState = "covered";
        gameState.stateTime = 0;
        gameState.frameCount = 0;
        ballMovement.selectRandomCoveredTarget();
        ballMovement.resetTimeAtDestination();
        currentTargetForDebugging = ballMovement.config.currentTarget;
    }
    
    // Dibujar el punto de depuración solo en entorno local
    if (window.IS_LOCAL_ENVIRONMENT) {
        if (currentTargetForDebugging) {
            const color = gameState.currentState === "covered" ? "yellow" : "red";
            dibujarPuntoDestino(currentTargetForDebugging, color);
        } else {
            if (ctxBorrador) ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height);
        }
    } else {
        // En producción, asegurarse de que la capa de borrador esté siempre limpia
        if (ctxBorrador) ctxBorrador.clearRect(0, 0, canvasBorrador.width, canvasBorrador.height);
    }

    // Actualizar posición de la pelota según el estado
    let newPosition;
    
    if (gameState.currentState === "covered") {
        newPosition = ballMovement.moveToCoveredTarget();
    } else { // Estado descubierto
        newPosition = ballMovement.moveToUncoveredTarget();
    }

    if (newPosition) {
        actualizarPosicionBall(newPosition.x, newPosition.y);
    }
    
    if (typeof render === 'function') {
        render();
    } else {
        console.error("Función render() no encontrada.");
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners para el juego
window.addEventListener("DOMContentLoaded", () => {
    // initRenderer() DEBE llamarse antes que initGame() para que los canvas estén listos.
    // Asumiendo que initRenderer() es llamado por su propio DOMContentLoaded en renderer.js
    // y ese script se carga antes que game.js, o se llama explícitamente.
    initGame(); 
});

// Exportar funciones necesarias
window.initGame = initGame; 