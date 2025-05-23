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

// Exportar gameState al objeto window para que sea accesible desde otros módulos
window.gameState = gameState;

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
            // Usar la nueva función del módulo borrador
            if (typeof setBorradorTargetPoint === 'function') {
                setBorradorTargetPoint(primerObjetivoCubierto);
            }
        }
    }
    
    gameState.lastFrameTime = performance.now();
    gameState.frameCount = 0;
    
    // Iniciar bucle del juego unificado
    gameLoop();
}

// Función para reiniciar el juego
function resetGame() {
    console.log("Reiniciando juego...");
    
    // Detener el bucle del juego actual
    gameState.isRunning = false;
    
    // Limpiar todos los disparos activos
    if (window.shootingSystem) {
        window.shootingSystem.shots = [];
        
        // Reiniciar el sistema de tiempo si la función está disponible
        if (typeof window.resetGameTime === 'function') {
            window.resetGameTime();
        }
    }
    
    // Pequeña pausa para asegurar que todo se detiene correctamente
    setTimeout(() => {
        // Reiniciar variables del juego
        gameState.score = 0;
        gameState.level = 1;
        gameState.currentState = "covered";
        gameState.stateTime = 0;
        gameState.frameCount = 0;
        
        // Reiniciar posición de la pelota
        const centerX = canvasBall.width / 2;
        const centerY = canvasBall.height / 2;
        ballMovement.config.currentPosition = { x: centerX, y: centerY };
        actualizarPosicionBall(centerX, centerY);
        
        // Reiniciar el color de la pelota
        if (typeof window.resetBallColor === 'function') {
            window.resetBallColor();
        }
        
        // Reiniciar sistemas relacionados
        if (typeof window.ballMovement.resetMovement === 'function') {
            window.ballMovement.resetMovement();
        } else {
            // Fallback si no existe la función específica
            ballMovement.config.currentTarget = null;
            ballMovement.config.timeAtDestination = 0;
        }
        
        // Reiniciar dirección de movimiento de la pelota
        if (window.ballMovement.config.direction) {
            window.ballMovement.config.direction = { x: 0, y: 0 };
        }
        
        // Actualizar la puntuación en pantalla
        if (typeof window.updateScoreDisplay === 'function') {
            window.updateScoreDisplay();
        }
        
        // Iniciar el juego de nuevo
        gameState.isRunning = true;
        gameState.lastFrameTime = performance.now();
        
        // Seleccionar nuevo objetivo cubierto
        const nuevoObjetivo = ballMovement.selectRandomCoveredTarget();
        
        if (window.IS_LOCAL_ENVIRONMENT && typeof setBorradorTargetPoint === 'function') {
            if (nuevoObjetivo) {
                setBorradorTargetPoint(nuevoObjetivo);
            }
        }
        
        // Reiniciar el loop
        requestAnimationFrame(gameLoop);
        
        console.log("¡Juego reiniciado!");
    }, 100);
}

// Exportar la función de reinicio
window.resetGame = resetGame;

function gameLoop() {
    if (!gameState.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - gameState.lastFrameTime;
    gameState.lastFrameTime = currentTime;
    gameState.frameCount++;

    // Actualizar métricas de rendimiento si está disponible el sistema
    if (window.shootingSystem && window.shootingSystem.performanceMonitor) {
        const perfMon = window.shootingSystem.performanceMonitor;
        
        // Actualizar datos del frame actual para medición más precisa
        if (typeof updatePerformanceMetrics === 'function') {
            updatePerformanceMetrics();
        } else {
            // Método alternativo si la función específica no está disponible
            const frameDelta = currentTime - perfMon.lastFrameTime;
            perfMon.lastFrameTime = currentTime;
            
            // Verificar que el deltaTime no sea demasiado grande (por ejemplo, después de cambio de pestaña)
            if (frameDelta < 100) {
                // Calcular FPS actual y añadir al historial
                const currentFPS = 1000 / frameDelta;
                perfMon.frameRates.push(currentFPS);
                if (perfMon.frameRates.length > perfMon.samplingSize) {
                    perfMon.frameRates.shift();
                }
            }
        }
    }

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
    
    // Actualizar posición de la pelota según el estado
    let newPosition;
    
    if (gameState.currentState === "covered") {
        newPosition = ballMovement.moveToCoveredTarget();
    } else { // Estado descubierto
        newPosition = ballMovement.moveToUncoveredTarget();
    }

    if (newPosition) {
        actualizarPosicionBall(newPosition.x, newPosition.y);
        
        // Detectar estado real de la pelota usando el detector
        if (window.ballStateDetector) {
            const detectedMathState = window.ballStateDetector.detectStateMathematically(newPosition);
            const detectedPixelState = window.ballStateDetector.detectStateByPixels(newPosition);
            const detectedState = window.ballStateDetector.detectState(newPosition);
            
            // Actualizar los indicadores de estado en la capa de borrador
            if (typeof setBorradorStateIndicators === 'function') {
                setBorradorStateIndicators(detectedMathState, detectedPixelState);
            }
            
            // Opcional: log cada 60 frames para no saturar la consola
            if (gameState.frameCount % 60 === 0) {
                console.log(`Estado detectado: ${detectedState}`);
            }
        }
    }
    
    // Actualizar punto de destino en la capa borrador (solo en entorno local)
    if (window.IS_LOCAL_ENVIRONMENT && typeof setBorradorTargetPoint === 'function') {
        if (currentTargetForDebugging) {
            setBorradorTargetPoint(currentTargetForDebugging);
        }
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