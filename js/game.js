    }
};

function initGame() {
    // Inicializar estado del juego
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.level = 1;
    
    // Posicionar pelota en el centro
    const centerX = canvasPrincipal.width / 2;
    const centerY = canvasPrincipal.height / 2;
    actualizarPosicionBall(centerX, centerY);
    
    // Iniciar bucle del juego
    gameLoop();
}

function updateGameState() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - gameState.stateStartTime;
    
    // Verificar si es momento de cambiar de estado
    if (elapsedTime >= gameState.stateDuration[gameState.currentState]) {
        console.log("Cambiando de estado a:", gameState.currentState === 'cubierto' ? 'descubierto' : 'cubierto');
        
        // Cambiar al estado opuesto
        gameState.currentState = gameState.currentState === 'cubierto' ? 'descubierto' : 'cubierto';
        gameState.stateStartTime = currentTime;
        
        // Actualizar intersecciones con el movimiento de la reja
        actualizarIntersecciones();
        
        if (gameState.currentState === 'cubierto') {
            // Obtener una intersección aleatoria y establecerla como destino
            const destino = obtenerInterseccionAleatoria();
            console.log("Nuevo destino:", destino);
            ballMovement.setTarget(destino.x, destino.y);
        }
    }
}

function gameLoop() {
    if (!gameState.isRunning) return;
    
    // Actualizar estado del juego
    updateGameState();
    
    // Actualizar posición de la pelota
    const posicion = ballMovement.updateMovement();
    console.log("Posición actual:", posicion);
    actualizarPosicionBall(posicion.x, posicion.y);
    
    // Actualizar rotación
    const angulo = ballMovement.updateRotation();
    
    // Renderizar frame
    render();
    
    // Solicitar siguiente frame
    requestAnimationFrame(gameLoop);
}

// Event listeners para el juego
window.addEventListener("DOMContentLoaded", () => {
    initGame();
});

// Exportar funciones necesarias
window.initGame = initGame; // Lógica principal del juego
