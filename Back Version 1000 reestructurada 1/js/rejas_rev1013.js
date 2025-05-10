// Revisión: 1013 - 2025-05-08 05:10 GMT-3

class MotorReja {
  constructor() {
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
    this.configReja = this.calcularConfiguracionReja(canvas.width, canvas.height);
  }

  calcularConfiguracionReja(width, height) {
    const dimensionMenor = Math.min(width, height);
    const altoZonaReja = dimensionMenor * 0.6;
    const tamCuadrado = altoZonaReja / 4;

    const cantidadCuadradosHoriz = Math.floor((width * 0.6) / tamCuadrado);
    const anchoRejaReal = (cantidadCuadradosHoriz + 1) * tamCuadrado;

    const margenX = (width - anchoRejaReal) / 2;
    const margenY = (height - altoZonaReja) / 2;

    return {
      baseX: margenX,
      baseY: margenY,
      tamCuadrado: tamCuadrado,
      cantidadHoriz: cantidadCuadradosHoriz,
      cantidadVert: 3,
      grosorLinea: 12
    };
  }

  recalcular() {
    this.configReja = this.calcularConfiguracionReja(this.canvas.width, this.canvas.height);
  }

  dibujar(ctx) {
    const {
      baseX,
      baseY,
      tamCuadrado,
      cantidadHoriz,
      cantidadVert,
      grosorLinea
    } = this.configReja;

    const x0 = baseX + this.offsetX;
    const y0 = baseY + this.offsetY;
    const radio = grosorLinea / 2;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineWidth = grosorLinea;

    for (let i = 0.5; i <= cantidadVert + 0.5; i++) {
      const y = y0 + i * tamCuadrado;
      const grad = ctx.createLinearGradient(0, y - radio, 0, y + radio);
      grad.addColorStop(0, "#004050");
      grad.addColorStop(0.5, "#00ffff");
      grad.addColorStop(1, "#004050");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x0 + (cantidadHoriz + 1) * tamCuadrado, y);
      ctx.stroke();
    }

    for (let j = 0.5; j <= cantidadHoriz + 0.5; j++) {
      const x = x0 + j * tamCuadrado;
      const grad = ctx.createLinearGradient(x - radio, 0, x + radio, 0);
      grad.addColorStop(0, "#004050");
      grad.addColorStop(0.5, "#00ffff");
      grad.addColorStop(1, "#004050");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y0 + 4 * tamCuadrado);
      ctx.stroke();
    }
  }
}

let rejaActiva = null;
// Revisión: 1013 - 2025-05-08 05:10 GMT-3
