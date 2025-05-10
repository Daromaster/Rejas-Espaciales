// Archivo: main1.js
// Proyecto: Rejas Espaciales
// Revisión: 037-H
// Fecha de modificación: 2025-05-08 01:30 GMT-3

// Archivo: main1.js
// Proyecto: Rejas Espaciales
// Revisión: 037-C
// Fecha de modificación: 2025-05-07 22:30 GMT-3
// Archivo: main1.js
// Proyecto: Rejas Espaciales
// Revisión: 037-B
// Fecha de modificación: 2025-05-07 22:15 GMT-3



let destinoCubierto = null;
let pelota = { x: 0, y: 0 };
let cx = 0;


function render() {
  const offsetX = amplitudX * Math.sin(tiempo * velocidadX * 2 * Math.PI);
  const offsetY = amplitudY * Math.cos(tiempo * velocidadY * 2 * Math.PI);
  const { px, py, visibleDeseado } = actualizarMovimientoPelota(offsetX, offsetY);

  ctxPrincipal.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
  ctxPrincipal.globalCompositeOperation = 'source-over';

  // Solo copiamos el fondo ya generado
  ctxPrincipal.drawImage(canvasFondo, 0, 0);

  dibujarPelota();
  dibujarReja(offsetX, offsetY);

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


  // Marca roja o amarilla según fase actual
  if (forzarVisibilidad && celdaDestino && celdaDestino.cxCentro && celdaDestino.cyCentro) {
    const x = celdaDestino.cxCentro + offsetX;
    const y = celdaDestino.cyCentro + offsetY;
    ctxPrincipal.fillStyle = "red";
    ctxPrincipal.beginPath();
    ctxPrincipal.arc(x, y, 4, 0, 2 * Math.PI);
    ctxPrincipal.fill();
  }
  if (!forzarVisibilidad) {
  const intersecciones = obtenerIntersecciones(offsetX, offsetY);
  if (!destinoCubierto && pelota && intersecciones.length > 0) {
      destinoCubierto = determinarDestinoCubierto(pelota.x, pelota.y, obtenerIntersecciones(offsetX, offsetY));
    }
    if (destinoCubierto) {
      dibujarDestinoCubierto(ctxPrincipal, destinoCubierto);
    }
  }
  }
  if (forzarVisibilidad) {
  }

  anguloPelota += 0.01;
  tiempo++;
  tiempoJuego += 1 / 60;

  requestAnimationFrame(render);
  if (visibleDeseado) {
    ctxPrincipal.fillStyle = "blue";
    ctxPrincipal.fillRect(cx - 100, 5, 60, 60);
  }
  if (forzarVisibilidad) {
    ctxPrincipal.fillStyle = "lime";
    ctxPrincipal.fillRect(cx - 30, 5, 60, 60);
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
  dibujarFondo(); // El fondo solo se dibuja una vez aquí
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
  const cx = canvasPrincipal.width / 2;
  render();
});

window.addEventListener("resize", () => {
  ajustarCanvasYCapas();
});

// --- Fin del archivo main1.js — 2025-05-01 11:48:20 GMT-3 — rev. 027 (Paso 2 de 2) ---


// Fin del archivo main1.js
// Revisión: 037-B
// Fecha de modificación: 2025-05-07 22:15 GMT-3
// Fin del archivo main1.js
// Revisión: 037-C
// Fecha de modificación: 2025-05-07 22:30 GMT-3

// Fin del archivo main1.js
// Revisión: 037-H
// Fecha de modificación: 2025-05-08 01:30 GMT-3