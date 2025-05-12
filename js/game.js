// Lógica principal del juego
let gameState = {
    isRunning: false,
    score: 0,
    level: 1
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

function gameLoop() {
    if (!gameState.isRunning) return;
    
    // Aquí irá la lógica principal del juego
    // Por ahora solo actualizamos la posición de la pelota
    actualizarPosicionBall(
        canvasPrincipal.width / 2,
        canvasPrincipal.height / 2
    );
    
    // Solicitar siguiente frame
    requestAnimationFrame(gameLoop);
}

// Event listeners para el juego
window.addEventListener("DOMContentLoaded", () => {
    initGame();
});

// Exportar funciones necesarias
window.initGame = initGame; 