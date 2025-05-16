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
    
    // Usar las coordenadas actuales de la pelota en lugar del centro del canvas
    centroPelotaX = posX;
    centroPelotaY = posY;
    
    // Obtener el ángulo actual de rotación
    const anguloActual = ballMovement.updateRotation();
    
    // Guardar el estado actual del contexto
    ctxBall.save();
    
    // Mover a la posición actual de la pelota y rotar
    ctxBall.translate(centroPelotaX, centroPelotaY);
    ctxBall.rotate(anguloActual);
    
    // Definir desplazamiento para el brillo (para dar efecto 3D)
    const gradX = radio * 0.25;
    const gradY = -radio * 0.25;
    
    // Crear un gradiente radial desplazado para efecto de luz/sombra
    const grad = ctxBall.createRadialGradient(
        gradX, gradY, 0,
        gradX, gradY, radio * 2
    );
    
    // Definir colores del gradiente (del centro hacia afuera)
    grad.addColorStop(0, "rgba(255, 170, 170, 1)"); // Color claro para el brillo
    grad.addColorStop(0.5, "rgb(218, 28, 28)");  // Color intermedio
    grad.addColorStop(1, "rgba(128, 0, 0, 1)");     // Color oscuro para el borde
    
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