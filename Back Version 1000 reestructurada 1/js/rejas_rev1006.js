// Revisión: 1006 - 2025-05-08 03:15 GMT-3

class MotorReja {
  constructor() {
    this.interseccionesBase = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.tiempo = 0;
  }

  actualizar(delta) {
    this.tiempo += delta;
    this.offsetX = Math.sin(this.tiempo / 1000) * 5;
    this.offsetY = Math.cos(this.tiempo / 1000) * 5;
  }

  getOffset() {
    return { x: this.offsetX, y: this.offsetY };
  }

  getInterseccionesActuales() {
    return this.interseccionesBase.map(p => ({
      x: p.x + this.offsetX,
      y: p.y + this.offsetY
    }));
  }

  getZonasCubiertas() {
    return [];
  }

  getCeldasDescubiertas() {
    return [];
  }
}

class MotorRejaCuadriculada extends MotorReja {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.ctx = null;

    const dimension = Math.min(canvas.width, canvas.height);
    this.cantModulos = 12;
    this.tamModulo = dimension / this.cantModulos;

    this.cantidadColumnas = Math.floor(canvas.width / this.tamModulo);
    this.cantidadFilas = Math.floor(canvas.height / this.tamModulo);

    this.margenX = (canvas.width - this.cantidadColumnas * this.tamModulo) / 2;
    this.margenY = (canvas.height - this.cantidadFilas * this.tamModulo) / 2;

    this.interseccionesBase = [];
    for (let i = 0; i <= this.cantidadColumnas; i++) {
      for (let j = 0; j <= this.cantidadFilas; j++) {
        this.interseccionesBase.push({
          x: this.margenX + i * this.tamModulo,
          y: this.margenY + j * this.tamModulo
        });
      }
    }
  }

  dibujar(ctx) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i <= this.cantidadColumnas; i++) {
      const x = this.margenX + i * this.tamModulo + this.offsetX;
      const grad = ctx.createLinearGradient(x - 10, 0, x + 10, 0);
      grad.addColorStop(0, "rgba(200,200,200,0.8)");
      grad.addColorStop(0.5, "rgba(50,50,50,1)");
      grad.addColorStop(1, "rgba(200,200,200,0.8)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (let j = 0; j <= this.cantidadFilas; j++) {
      const y = this.margenY + j * this.tamModulo + this.offsetY;
      const grad = ctx.createLinearGradient(0, y - 10, 0, y + 10);
      grad.addColorStop(0, "rgba(200,200,200,0.8)");
      grad.addColorStop(0.5, "rgba(50,50,50,1)");
      grad.addColorStop(1, "rgba(200,200,200,0.8)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}

let rejaActiva = null;

// Revisión: 1006 - 2025-05-08 03:15 GMT-3
