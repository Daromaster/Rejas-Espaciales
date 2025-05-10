let canvasPrincipal, ctxPrincipal;
let canvasFondo, ctxFondo;
let canvasPelota, ctxPelota;
let canvasReja, ctxReja;

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

function dibujarFondo() {
  ctxFondo.clearRect(0, 0, canvasFondo.width, canvasFondo.height);
  ctxFondo.fillStyle = "#000020";
  ctxFondo.fillRect(0, 0, canvasFondo.width, canvasFondo.height);

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvasFondo.width;
    const y = Math.random() * canvasFondo.height;
    const brillo = Math.random();
    ctxFondo.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.5 * brillo})`;
    ctxFondo.beginPath();
    ctxFondo.arc(x, y, 1.2, 0, 2 * Math.PI);
    ctxFondo.fill();
  }
}

function dibujarPelota() {
  ctxPelota.clearRect(0, 0, canvasPelota.width, canvasPelota.height);
  const espacioEntreBarrotes = configReja.tamCuadrado;
  const grosor = configReja.grosorLinea;
  const diametro = espacioEntreBarrotes - grosor - 6;
  const radio = diametro / 2;
  radioPelota = radio;
  centroPelotaX = canvasPelota.width / 2;
  centroPelotaY = canvasPelota.height / 2;
  const gradX = centroPelotaX + radio * 0.66;
  const gradY = centroPelotaY - radio * 0.33;
  const grad = ctxPelota.createRadialGradient(gradX, gradY, 2, centroPelotaX, centroPelotaY, radio);
  grad.addColorStop(0, "#ffaaaa");
  grad.addColorStop(0.5, "#ff5050");
  grad.addColorStop(1, "#800000");
  ctxPelota.fillStyle = grad;
  ctxPelota.beginPath();
  ctxPelota.arc(centroPelotaX, centroPelotaY, radio, 0, 2 * Math.PI);
  ctxPelota.fill();
}

function dibujarReja(offsetX = 0, offsetY = 0) {
  const { baseX, baseY, tamCuadrado, cantidadHoriz, cantidadVert, grosorLinea } = configReja;
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

function render() {
  const offsetX = amplitudX * Math.sin(tiempo * velocidadX * 2 * Math.PI);
  const offsetY = amplitudY * Math.cos(tiempo * velocidadY * 2 * Math.PI);

  const { px, py, visibleDeseado } = actualizarMovimientoPelota(offsetX, offsetY);

  ctxPrincipal.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
  ctxPrincipal.globalCompositeOperation = 'source-over';
  ctxPrincipal.drawImage(canvasFondo, 0, 0);

  ctxPrincipal.save();
  ctxPrincipal.translate(px, py);
  ctxPrincipal.rotate(anguloPelota);
  ctxPrincipal.drawImage(
    canvasPelota,
    -canvasPelota.width / 2,
    -canvasPelota.height / 2
  );
  ctxPrincipal.restore();

  ctxPrincipal.drawImage(canvasReja, 0, 0);

  // === MARCAS VISUALES ===

  const cx = canvasPrincipal.width / 2;

  // 🟩 VERDE: pelota efectivamente descubierta
  if (forzarVisibilidad) {
    ctxPrincipal.fillStyle = "lime";
    ctxPrincipal.fillRect(cx - 40, 10, 30, 30);
  }

  // 🟦 AZUL: etapa de entrada (visible y viaje)
  if (faseActual === "visible" && (tiempoJuego - tiempoInicioFase) < 1.0) {
    ctxPrincipal.fillStyle = "blue";
    ctxPrincipal.fillRect(cx - 80, 10, 30, 30);
  }

  // 🔴 ROJO: marca el centro del cuadro objetivo
  if (faseActual === "visible" && celdaDestino) {
    ctxPrincipal.fillStyle = "red";
    ctxPrincipal.beginPath();
    ctxPrincipal.arc(
      celdaDestino.cxCentro + offsetX,
      celdaDestino.cyCentro + offsetY,
      6,
      0,
      2 * Math.PI
    );
    ctxPrincipal.fill();
  }

  anguloPelota += 0.01;
  tiempo++;
  tiempoJuego += 1 / 60;
  requestAnimationFrame(render);
}


function ajustarCanvasYCapas() {
  const zonaJuego = document.getElementById("zona-juego");
  const width = zonaJuego.offsetWidth;
  const height = zonaJuego.offsetHeight;
  for (const canvas of [canvasPrincipal, canvasFondo, canvasPelota, canvasReja]) {
    canvas.width = width;
    canvas.height = height;
  }
  configReja = calcularConfiguracionReja(width, height);
  dibujarFondo();
  dibujarPelota();
  dibujarReja();
}

window.addEventListener("DOMContentLoaded", () => {
  canvasPrincipal = document.getElementById("canvas-juego");
  ctxPrincipal = canvasPrincipal.getContext("2d");
  canvasFondo = document.createElement("canvas");
  ctxFondo = canvasFondo.getContext("2d");
  canvasPelota = document.createElement("canvas");
  ctxPelota = canvasPelota.getContext("2d");
  canvasReja = document.createElement("canvas");
  ctxReja = canvasReja.getContext("2d");
  ajustarCanvasYCapas();
  render();
});

window.addEventListener("resize", () => {
  ajustarCanvasYCapas();
});

// --- Fin del archivo main1.js — 2025-05-01 13:43:40 GMT-3 — rev. 045 ---
