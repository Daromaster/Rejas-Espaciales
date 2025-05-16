// Sistema de efectos y disparos

// Configuración del sistema de disparos
const shootingSystem = {
    isActive: false,            // ¿Hay un disparo activo?
    startTime: 0,               // Tiempo en que se inició el disparo
    duration: 200,              // Duración en milisegundos (reducida a 200ms para mayor velocidad)
    cooldown: 250,              // Tiempo de espera entre disparos (reducido a 250ms para mayor frecuencia)
    lastShootTime: 0,           // Último momento en que se realizó un disparo
    startColor: 'rgba(255, 136, 0, 1)',    // Color naranja para el inicio del disparo
    endColor: 'rgba(225, 0, 255,0.7)',        // Color rojo para el final del disparo
    shots: [],                  // Array para almacenar los disparos activos
    startWidth: 10,             // Ancho del disparo en el origen (10 píxeles)
    endWidth: 2                 // Ancho del disparo en el destino (2 píxeles)
};

function initEffects() {
    // Inicialización de efectos
    console.log("Sistema de efectos inicializado");
    
    // Configurar listener para la tecla espacio (disparo)
    window.addEventListener('keydown', handleKeyDown);
    
    // Reiniciar el sistema de disparos
    shootingSystem.isActive = false;
    shootingSystem.shots = [];
}

function handleKeyDown(event) {
    // Detectar si se presionó la tecla espaciadora
    if (event.code === 'Space' || event.key === ' ') {
        tryToShoot();
    }
}

function tryToShoot() {
    const currentTime = performance.now();
    
    // Verificar si podemos disparar (cooldown)
    if (currentTime - shootingSystem.lastShootTime < shootingSystem.cooldown) {
        return; // Todavía en cooldown, no podemos disparar
    }
    
    // Crear un nuevo disparo
    createShot();
    
    // Actualizar tiempo del último disparo
    shootingSystem.lastShootTime = currentTime;
    shootingSystem.isActive = true;
    shootingSystem.startTime = currentTime;
}

function createShot() {
    // Obtener dimensiones del canvas
    const canvasWidth = canvasEffects.width;
    const canvasHeight = canvasEffects.height;
    
    // Calcular posiciones de origen de los disparos
    
    // Puntos de origen (1/10 desde abajo y 1/10 desde los laterales)
    const yStart = canvasHeight - canvasHeight * 0.1; // 1/10 inferior del canvas
    const leftXStart = canvasWidth * 0.1; // 1/10 izquierdo del ancho
    const rightXStart = canvasWidth * 0.9; // 9/10 (simetría) del ancho
    
    // Obtener la posición actual de la pelota (destino de los disparos)
    let targetX = canvasWidth / 2;  // Valor por defecto: centro del canvas
    let targetY = canvasHeight / 2; // Valor por defecto: centro del canvas
    
    // Si existe la posición de la pelota, usarla como destino
    if (window.ballMovement && window.ballMovement.config && window.ballMovement.config.currentPosition) {
        targetX = window.ballMovement.config.currentPosition.x;
        targetY = window.ballMovement.config.currentPosition.y;
    }
    
    // Desplazamiento del destino para evitar que las líneas se crucen
    const offsetDestino = 5; // 5 píxeles de separación
    
    // Crear puntos de destino desplazados a 5 píxeles a cada lado del centro de la pelota
    // Simplificamos a desplazamiento horizontal para mayor claridad visual
    const leftTargetX = targetX - offsetDestino; // 5px a la izquierda del centro de la pelota
    const leftTargetY = targetY;
    
    const rightTargetX = targetX + offsetDestino; // 5px a la derecha del centro de la pelota
    const rightTargetY = targetY;
    
    // Crear los dos disparos con destinos ligeramente separados
    const newShots = [
        {
            startX: leftXStart,
            startY: yStart,
            endX: leftTargetX,
            endY: leftTargetY,
            createdAt: performance.now()
        },
        {
            startX: rightXStart,
            startY: yStart,
            endX: rightTargetX,
            endY: rightTargetY,
            createdAt: performance.now()
        }
    ];
    
    // Añadir los nuevos disparos al array
    shootingSystem.shots.push(...newShots);
    
    console.log("¡Disparo creado hacia la pelota!");
}

function dibujarEffects() {
    // Limpiar canvas de efectos
    ctxEffects.clearRect(0, 0, canvasEffects.width, canvasEffects.height);
    
    // Verificar si hay disparos activos y dibujarlos
    const currentTime = performance.now();
    
    // Filtrar y dibujar sólo los disparos que aún están activos
    shootingSystem.shots = shootingSystem.shots.filter(shot => {
        const shotAge = currentTime - shot.createdAt;
        
        // Si el disparo es reciente, dibujarlo
        if (shotAge <= shootingSystem.duration) {
            drawShot(shot);
            return true; // Mantener en el array
        }
        
        return false; // Eliminar del array (disparo expirado)
    });
    
    // Actualizar estado general de disparos
    if (shootingSystem.shots.length === 0) {
        shootingSystem.isActive = false;
    }
}

function drawShot(shot) {
    // Dibujar un disparo con forma cónica y gradiente de naranja a rojo
    
    // Crear un gradiente lineal desde el origen al destino del disparo
    const gradient = ctxEffects.createLinearGradient(
        shot.startX, shot.startY, 
        shot.endX, shot.endY
    );
    
    // Definir los colores del gradiente
    gradient.addColorStop(0, shootingSystem.startColor);  // Naranja en el origen
    gradient.addColorStop(1, shootingSystem.endColor);    // Rojo en el destino
    
    // Usar el gradiente como color de relleno
    ctxEffects.fillStyle = gradient;
    
    // Calcular el ángulo del disparo
    const dx = shot.endX - shot.startX;
    const dy = shot.endY - shot.startY;
    const angle = Math.atan2(dy, dx);
    
    // Ángulos perpendiculares para calcular los bordes del cono
    const perpAngle1 = angle + Math.PI/2;
    const perpAngle2 = angle - Math.PI/2;
    
    // Mitad del ancho en origen y destino
    const startHalfWidth = shootingSystem.startWidth / 2;
    const endHalfWidth = shootingSystem.endWidth / 2;
    
    // Calcular los 4 puntos del cono
    const startPoint1 = {
        x: shot.startX + Math.cos(perpAngle1) * startHalfWidth,
        y: shot.startY + Math.sin(perpAngle1) * startHalfWidth
    };
    
    const startPoint2 = {
        x: shot.startX + Math.cos(perpAngle2) * startHalfWidth,
        y: shot.startY + Math.sin(perpAngle2) * startHalfWidth
    };
    
    const endPoint1 = {
        x: shot.endX + Math.cos(perpAngle1) * endHalfWidth,
        y: shot.endY + Math.sin(perpAngle1) * endHalfWidth
    };
    
    const endPoint2 = {
        x: shot.endX + Math.cos(perpAngle2) * endHalfWidth,
        y: shot.endY + Math.sin(perpAngle2) * endHalfWidth
    };
    
    // Dibujar el polígono cónico
    ctxEffects.beginPath();
    ctxEffects.moveTo(startPoint1.x, startPoint1.y);
    ctxEffects.lineTo(endPoint1.x, endPoint1.y);
    ctxEffects.lineTo(endPoint2.x, endPoint2.y);
    ctxEffects.lineTo(startPoint2.x, startPoint2.y);
    ctxEffects.closePath();
    ctxEffects.fill();
    
    // Opcional: agregar un borde al cono
    ctxEffects.strokeStyle = 'rgba(255, 255, 255, 1)';  // Borde blanco
    ctxEffects.lineWidth = 0.5;
    ctxEffects.stroke();
    
    // Añadir brillo interior (opcional para efecto más intenso)
    const innerGradient = ctxEffects.createLinearGradient(
        shot.startX, shot.startY, 
        shot.endX, shot.endY
    );
    innerGradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');  // Amarillo semitransparente en origen
    innerGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');      // Rojo transparente en destino
    
    // Dibujar un cono más estrecho en el interior para el brillo
    const innerStartWidth = startHalfWidth * 0.6;
    const innerEndWidth = endHalfWidth * 0.6;
    
    const innerStartPoint1 = {
        x: shot.startX + Math.cos(perpAngle1) * innerStartWidth,
        y: shot.startY + Math.sin(perpAngle1) * innerStartWidth
    };
    
    const innerStartPoint2 = {
        x: shot.startX + Math.cos(perpAngle2) * innerStartWidth,
        y: shot.startY + Math.sin(perpAngle2) * innerStartWidth
    };
    
    const innerEndPoint1 = {
        x: shot.endX + Math.cos(perpAngle1) * innerEndWidth,
        y: shot.endY + Math.sin(perpAngle1) * innerEndWidth
    };
    
    const innerEndPoint2 = {
        x: shot.endX + Math.cos(perpAngle2) * innerEndWidth,
        y: shot.endY + Math.sin(perpAngle2) * innerEndWidth
    };
    
    ctxEffects.fillStyle = innerGradient;
    ctxEffects.beginPath();
    ctxEffects.moveTo(innerStartPoint1.x, innerStartPoint1.y);
    ctxEffects.lineTo(innerEndPoint1.x, innerEndPoint1.y);
    ctxEffects.lineTo(innerEndPoint2.x, innerEndPoint2.y);
    ctxEffects.lineTo(innerStartPoint2.x, innerStartPoint2.y);
    ctxEffects.closePath();
    ctxEffects.fill();
}

// Exportar funciones necesarias
window.initEffects = initEffects;
window.dibujarEffects = dibujarEffects; 