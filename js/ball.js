// Sistema de pelota
let posX = 0, posY = 0;
let angulo = 0;
let radioPelota = 0;
let centroPelotaX = 0;
let centroPelotaY = 0;

function dibujarBall() {
    if (!configGrid) return;
    
    ctxBall.clearRect(0, 0, canvasBall.width, canvasBall.height);
    
    const espacioEntreBarrotes = configGrid.tamCuadrado;
    const grosor = configGrid.grosorLinea;
    const diametro = espacioEntreBarrotes - grosor - 6;
    const radio = diametro / 2;
    radioPelota = radio;
    
    centroPelotaX = canvasBall.width / 2;
    centroPelotaY = canvasBall.height / 2;
    
    // Obtener el ángulo actual de rotación
    const anguloActual = ballMovement.updateRotation();
    
    // Guardar el estado actual del contexto
    ctxBall.save();
    
    // Mover al centro de la pelota y rotar
    ctxBall.translate(centroPelotaX, centroPelotaY);
    ctxBall.rotate(anguloActual);
    
    const gradX = radio * 0.66;
    const gradY = -radio * 0.33;
    
    const grad = ctxBall.createRadialGradient(
        gradX, gradY, 2,
        0, 0, radio
    );
    
    grad.addColorStop(0, "#ffaaaa");
    grad.addColorStop(0.5, "#ff5050");
    grad.addColorStop(1, "#800000");
    
    ctxBall.fillStyle = grad;
    ctxBall.beginPath();
    ctxBall.arc(0, 0, radio, 0, 2 * Math.PI);
    ctxBall.fill();
    
    // Restaurar el estado del contexto
    ctxBall.restore();
}

function actualizarPosicionBall(nuevaX, nuevaY) {
    posX = nuevaX;
    posY = nuevaY;
    dibujarBall();
}

// Exportar funciones necesarias
window.actualizarPosicionBall = actualizarPosicionBall;
window.radioPelota = radioPelota; 