// Revisión: 1008 - 2025-05-08 04:15 GMT-3

class Pelota {
  constructor(x, y, configReja) {
    this.x = x;
    this.y = y;
    this.destino = { x, y };
    this.actualizarRadio(configReja);
  }

  actualizarRadio(configReja) {
    const tamDisponible = configReja.tamCuadrado - configReja.grosorLinea;
    this.radio = tamDisponible * 0.75 * 0.5;
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
      this.x, this.y, this.radio * 0.2,
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

let pelotas = [];

// Revisión: 1008 - 2025-05-08 04:15 GMT-3
