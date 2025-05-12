// Archivo: pelota.js
// Proyecto: Rejas Espaciales
// Revisión: 036
// Fecha de actualización: 2025-05-07 20:40 GMT-3

let modoActual = "cubierto";
let tiempoModo = 0;
const duracionCubierto = 2;      // segundos
const duracionDescubierto = 4;   // segundos
let destinoCubierto = null;
let destinoDescubierto = null;

function actualizarModo(deltaTime) {
  tiempoModo += deltaTime;

  if (modoActual === "cubierto" && tiempoModo >= duracionCubierto) {
    modoActual = "descubierto";
    tiempoModo = 0;
    destinoDescubierto = determinarDestinoDescubierto();
  } else if (modoActual === "descubierto" && tiempoModo >= duracionDescubierto) {
    modoActual = "cubierto";
    tiempoModo = 0;
    destinoCubierto = determinarDestinoCubierto(pelota.x, pelota.y, intersecciones);
  }
}

function actualizarMovimientoPelota(offsetX, offsetY) {
  const deltaTime = 1 / 60;
  actualizarModo(deltaTime);

  let destino = (modoActual === "cubierto") ? destinoCubierto : destinoDescubierto;

  if (!destino) return { px: pelota.x, py: pelota.y, visibleDeseado: false };

  const dx = destino.x - pelota.x;
  const dy = destino.y - pelota.y;
  pelota.x += dx * 0.05;
  pelota.y += dy * 0.05;

  return {
    px: pelota.x + offsetX,
    py: pelota.y + offsetY,
    visibleDeseado: (modoActual === "descubierto")
  };
}

function determinarDestinoDescubierto() {
  return celdaDestino ? { x: celdaDestino.cxCentro, y: celdaDestino.cyCentro } : null;
}

function determinarDestinoCubierto(pelotaX, pelotaY, intersecciones) {
  const distancias = intersecciones.map(({ x, y }) => ({
    x, y,
    distancia: Math.hypot(pelotaX - x, pelotaY - y)
  }));
  distancias.sort((a, b) => a.distancia - b.distancia);
  const candidatas = distancias.slice(0, 12);
  const seleccionada = candidatas[Math.floor(Math.random() * candidatas.length)];
  return { x: seleccionada.x, y: seleccionada.y };
}

function dibujarDestinoCubierto(ctx, destinoCubierto) {
  ctx.beginPath();
  ctx.arc(destinoCubierto.x, destinoCubierto.y, diametroBarrote * 2, 0, 2 * Math.PI);
  ctx.fillStyle = "yellow";
  ctx.fill();
}

// Variables como `pelota`, `intersecciones`, `celdaDestino`, `diametroBarrote` deben existir globalmente.
// Este archivo controla alternancia de modo y movimiento entre fases.
// Rev. 036 — con control explícito de modoActual y tiempoModo.
