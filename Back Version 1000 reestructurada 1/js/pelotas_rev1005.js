// Revisión: 1005 - 2025-05-08 03:00 GMT-3

class Pelota {
  constructor(x, y, radio = 20) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.destino = { x, y };
  }

  actualizar() {
    const dx = this.destino.x - this.x;
    const dy = this.destino.y - this.y;
    const velocidad = 0.05;

    this.x += dx * velocidad;
    this.y += dy * velocidad;
  }

  dibujar(ctx) {
    const grad = ctx.createRadialGradient(
      this.x, this.y, this.radio * 0.1,
      this.x, this.y, this.radio
    );
    grad.addColorStop(0, "#ff4444");
    grad.addColorStop(1, "#880000");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radio, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const pelotas = [new Pelota(400, 300)];

// Revisión: 1005 - 2025-05-08 03:00 GMT-3
