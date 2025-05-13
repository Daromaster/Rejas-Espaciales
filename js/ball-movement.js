// Sistema de movimiento de la pelota
let ballMovement = {
    config: {
        // Configuración de rotación
        rotationSpeed: 0.005,    // Velocidad de rotación en radianes por frame (reducida a la mitad)
        currentAngle: 0,        // Ángulo actual
        lastTime: 0,            // Último tiempo de actualización
        isInitialized: false,
        targetPosition: null,   // Posición objetivo
        isMoving: false,        // Indicador de movimiento activo
        currentPosition: { x: 0, y: 0 }, // Posición actual
        speed: 5,               // Velocidad de movimiento
    },

    // x Inicializar el sistema
    init: function() {
        this.config.lastTime = performance.now();
        this.config.currentAngle = 0;
        this.config.isInitialized = true;
        console.log("Sistema de movimiento de pelota inicializado");
    },

    // Actualizar la rotación (primer algoritmo de movimiento)
    updateRotation: function() {
        if (!this.config.isInitialized) {
            this.init();
        }

        const currentTime = performance.now();
        const deltaTime = Math.min(currentTime - this.config.lastTime, 100);
        this.config.lastTime = currentTime;

        // Actualizar el ángulo
        this.config.currentAngle += this.config.rotationSpeed * deltaTime;
        
        // Mantener el ángulo entre 0 y 2π
        if (this.config.currentAngle >= Math.PI * 2) {
            this.config.currentAngle -= Math.PI * 2;
        }

        return this.config.currentAngle;
    },

    // Obtener el ángulo actual
    getCurrentAngle: function() {
        if (!this.config.isInitialized) {
            this.init();
        }
        return this.config.currentAngle;
    },

    // Establecer nuevo destino
    setTarget: function(x, y) {
        console.log("Estableciendo nuevo destino:", x, y);
        this.config.targetPosition = { x, y };
        this.config.isMoving = true;
    },

    // Actualizar movimiento suave
    updateMovement: function() {
        if (!this.config.isInitialized) {
            this.init();
        }

        if (!this.config.isMoving) {
            console.log("No hay movimiento activo");
            return this.config.currentPosition;
        }

        const dx = this.config.targetPosition.x - this.config.currentPosition.x;
        const dy = this.config.targetPosition.y - this.config.currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        console.log("Distancia al destino:", distance);

        // Si estamos muy cerca del destino, consideramos que llegamos
        if (distance < this.config.speed) {
            console.log("Llegamos al destino");
            this.config.currentPosition = { ...this.config.targetPosition };
            this.config.isMoving = false;
            return this.config.currentPosition;
        }

        // Movimiento suave
        const ratio = this.config.speed / distance;
        this.config.currentPosition.x += dx * ratio;
        this.config.currentPosition.y += dy * ratio;

// Sistema de movimiento de la pelota
let ballMovement = {
    config: {
        // Configuración de rotación
        rotationSpeed: 0.005,    // Velocidad de rotación en radianes por frame (reducida a la mitad)
        currentAngle: 0,        // Ángulo actual
        lastTime: 0,            // Último tiempo de actualización
        isInitialized: false
    },

    // Inicializar el sistema
    init: function() {
        this.config.lastTime = performance.now();
        this.config.currentAngle = 0;
        this.config.isInitialized = true;
        console.log("Sistema de movimiento de pelota inicializado");
    },

    // Actualizar la rotación (primer algoritmo de movimiento)
    updateRotation: function() {
        if (!this.config.isInitialized) {
            this.init();
        }

        const currentTime = performance.now();
        const deltaTime = Math.min(currentTime - this.config.lastTime, 100);
        this.config.lastTime = currentTime;

        // Actualizar el ángulo
        this.config.currentAngle += this.config.rotationSpeed * deltaTime;
        
        // Mantener el ángulo entre 0 y 2π
        if (this.config.currentAngle >= Math.PI * 2) {
            this.config.currentAngle -= Math.PI * 2;
        }

        return this.config.currentAngle;
    },

    // Obtener el ángulo actual
    getCurrentAngle: function() {
        if (!this.config.isInitialized) {
            this.init();
        }
        return this.config.currentAngle;
    }

    // Aquí se agregarán más algoritmos de movimiento
    // Por ejemplo:
    // updatePhysics: function() { ... }
    // updateCollision: function() { ... }
    // etc.
};

// Exportar al scope global
window.ballMovement = ballMovement; 