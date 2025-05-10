// Revisión: 1005 - 2025-05-08 03:00 GMT-3

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
    return []; // para futuro
  }

  getCeldasDescubiertas() {
    return []; // para futuro
  }
}

class MotorRejaCuadriculada extends MotorReja {
  constructor(ancho, alto) {
    super();
    this.ancho = ancho;
    this.alto = alto;
    this.cantCols = 8;
    this.cantFilas = 6;
    this.anchoCelda = ancho / this.cantCols;
    this.altoCelda = alto / this.cantFilas;

    this.generarInterseccionesBase();
  }

  generarInterseccionesBase() {
    this.interseccionesBase = [];
    for (let i = 0; i <= this.cantCols; i++) {
      for (let j = 0; j <= this.cantFilas; j++) {
        this.interseccionesBase.push({
          x: i * this.anchoCelda,
          y: j * this.altoCelda
        });
      }
    }
  }

  dibujar(ctx) {
    ctx.clearRect(0, 0, this.ancho, this.alto);
    ctx.strokeStyle = "rgba(50,50,50,0.5)";
    ctx.lineWidth = 2;

    for (let i = 0; i <= this.cantCols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.anchoCelda + this.offsetX, 0);
      ctx.lineTo(i * this.anchoCelda + this.offsetX, this.alto);
      ctx.stroke();
    }
    for (let j = 0; j <= this.cantFilas; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * this.altoCelda + this.offsetY);
      ctx.lineTo(this.ancho, j * this.altoCelda + this.offsetY);
      ctx.stroke();
    }
  }
}

let rejaActiva = null;

// Revisión: 1005 - 2025-05-08 03:00 GMT-3
