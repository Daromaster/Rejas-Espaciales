// Archivo: reja.js
// Proyecto: Rejas Espaciales
// Revisión: 037
// Fecha de modificación: 2025-05-08 00:55 GMT-3

function calcularConfiguracionReja(width, height) {
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
  
  function dibujarReja(offsetX = 0, offsetY = 0) {
    const {
      baseX,
      baseY,
      tamCuadrado,
      cantidadHoriz,
      cantidadVert,
      grosorLinea
    } = configReja;
  
    const x0 = baseX + offsetX;
    const y0 = baseY + offsetY;
    const radio = grosorLinea / 2;
  
    ctxReja.clearRect(0, 0, canvasReja.width, canvasReja.height);
    ctxReja.lineWidth = grosorLinea;
  
    for (let i = 0.5; i <= cantidadVert + 0.5; i++) {
      const y = y0 + i * tamCuadrado;
      const grad = ctxReja.createLinearGradient(0, y - radio, 0, y + radio);
      grad.addColorStop(0, "#004050");
      grad.addColorStop(0.5, "#00ffff");
      grad.addColorStop(1, "#004050");
      ctxReja.strokeStyle = grad;
      ctxReja.beginPath();
      ctxReja.moveTo(x0, y);
      ctxReja.lineTo(x0 + (cantidadHoriz + 1) * tamCuadrado, y);
      ctxReja.stroke();
    }
  
    for (let j = 0.5; j <= cantidadHoriz + 0.5; j++) {
      const x = x0 + j * tamCuadrado;
      const grad = ctxReja.createLinearGradient(x - radio, 0, x + radio, 0);
      grad.addColorStop(0, "#004050");
      grad.addColorStop(0.5, "#00ffff");
      grad.addColorStop(1, "#004050");
      ctxReja.strokeStyle = grad;
      ctxReja.beginPath();
      ctxReja.moveTo(x, y0);
      ctxReja.lineTo(x, y0 + 4 * tamCuadrado);
      ctxReja.stroke();
    }
  }

// === Cálculo de intersecciones base y desplazadas ===

let interseccionesBase = [];

function generarInterseccionesBase() {
  interseccionesBase = [];
  for (let fila = 0; fila < cantFilas; fila++) {
    for (let col = 0; col < cantColumnas; col++) {
      interseccionesBase.push({
        x: origenX + col * anchoCelda,
        y: origenY + fila * altoCelda
      });
    }
  }
}

function obtenerIntersecciones(offsetX, offsetY) {
  return interseccionesBase.map(p => ({
    x: p.x + offsetX,
    y: p.y + offsetY
  }));
}

// Fin del archivo reja.js
// Revisión: 037
// Fecha de modificación: 2025-05-08 00:55 GMT-3