// Revisión: 1012 - 2025-05-08 04:50 GMT-3

class MotorFondo {
  constructor(canvas, cantidadEstrellas = 100) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.estrellas = [];

    const ancho = canvas.width;
    const alto = canvas.height;

    for (let i = 0; i < cantidadEstrellas; i++) {
      this.estrellas.push({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  dibujar(ctx) {
    const ancho = this.canvas.width;
    const alto = this.canvas.height;

    ctx.fillStyle = "#000011";
    ctx.fillRect(0, 0, ancho, alto);

    for (const estrella of this.estrellas) {
      ctx.fillStyle = `rgba(255, 255, 255, ${estrella.alpha})`;
      ctx.beginPath();
      ctx.arc(estrella.x, estrella.y, estrella.r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

let fondoActivo = null;

window.MotorFondo = MotorFondo;
window.fondoActivo = fondoActivo;

// Revisión: 1012 - 2025-05-08 04:50 GMT-3
