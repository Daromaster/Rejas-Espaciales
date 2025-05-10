// Revisión 054 - Bloque 1 de 2

let celdaDestino = null;
let posActualCubiertaX = null;
let posActualCubiertaY = null;
let puntoDestinoCubierto = null;
let tiempoUltimoDestino = 0;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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

function actualizarMovimientoPelota(offsetRejaX = 0, offsetRejaY = 0) {
  const paso = 2 * Math.PI;
  const visibleDeseado = (tiempoJuego % 6) >= 4; // 4s cubierta, 2s descubierta

  if (visibleDeseado && faseActual !== "visible") {
    faseActual = "visible";
    tiempoInicioFase = tiempoJuego;
    celdaDestino = null;
  } else if (!visibleDeseado && faseActual !== "cubierta") {
    faseActual = "cubierta";
    tiempoInicioFase = tiempoJuego;
    puntoDestinoCubierto = null;
  }

  let px, py;

  if (faseActual === "visible") {
    const tiempoFase = tiempoJuego - tiempoInicioFase;

    if (!celdaDestino) {
      const cx = canvasPrincipal.width / 2;
      const cy = canvasPrincipal.height / 2;
      let mejorDist = Infinity;
      for (let i = 0; i < configReja.cantidadHoriz; i++) {
        for (let j = 0; j < configReja.cantidadVert; j++) {
          const cxCentro = configReja.baseX + configReja.tamCuadrado * (i + 1);
          const cyCentro = configReja.baseY + configReja.tamCuadrado * (j + 1);
          const dist = Math.hypot(cx - cxCentro, cy - cyCentro);
          if (dist < mejorDist) {
            mejorDist = dist;
            celdaDestino = { cxCentro, cyCentro };
          }
        }
      }
    }

    if (tiempoFase < 1.0) {
      const avance = easeInOut(tiempoFase / 1.0);
      const origenX = posActualCubiertaX || canvasPrincipal.width / 2;
      const origenY = posActualCubiertaY || canvasPrincipal.height / 2;
      px = origenX * (1 - avance) + celdaDestino.cxCentro * avance + offsetRejaX;
      py = origenY * (1 - avance) + celdaDestino.cyCentro * avance + offsetRejaY;

      ctxPrincipal.fillStyle = "blue";
      ctxPrincipal.fillRect(canvasPrincipal.width / 2 - 80, 10, 30, 30);
    } else {
      px = celdaDestino.cxCentro + offsetRejaX;
      py = celdaDestino.cyCentro + offsetRejaY;

      ctxPrincipal.fillStyle = "lime";
      ctxPrincipal.fillRect(canvasPrincipal.width / 2 - 40, 10, 30, 30);
    }

    if (celdaDestino) {
      ctxPrincipal.fillStyle = "blue";
      ctxPrincipal.beginPath();
      ctxPrincipal.arc(
        celdaDestino.cxCentro + offsetRejaX,
        celdaDestino.cyCentro + offsetRejaY,
        6,
        0,
        2 * Math.PI
      );
      ctxPrincipal.fill();
    }

    posActualCubiertaX = px;
    posActualCubiertaY = py;
  } else {
    if (!puntoDestinoCubierto || (tiempoJuego - tiempoUltimoDestino > 2.5)) {
      const i = Math.floor(Math.random() * (configReja.cantidadHoriz + 1));
      const j = Math.floor(Math.random() * (configReja.cantidadVert + 1));
      const x = configReja.baseX + i * configReja.tamCuadrado;
      const y = configReja.baseY + j * configReja.tamCuadrado;
      puntoDestinoCubierto = {
        x: x + offsetRejaX,
        y: y + offsetRejaY,
        t0: tiempoJuego,
        origenX: posActualCubiertaX || canvasPrincipal.width / 2,
        origenY: posActualCubiertaY || canvasPrincipal.height / 2
      };
      tiempoUltimoDestino = tiempoJuego;
    }

// --- Fin del bloque 1 de 2 — checksum: línea 104 — parte de rev. 054 ---

// Revisión 054 - Bloque 2 de 2

if (puntoDestinoCubierto) {
  const avance = Math.min(1, (tiempoJuego - puntoDestinoCubierto.t0) / 1.5);
  const interp = easeInOut(avance);
  px = puntoDestinoCubierto.origenX * (1 - interp) + puntoDestinoCubierto.x * interp;
  py = puntoDestinoCubierto.origenY * (1 - interp) + puntoDestinoCubierto.y * interp;

  // Marca amarilla con diámetro 150% del grosor del barrote
  ctxPrincipal.fillStyle = "yellow";
  ctxPrincipal.beginPath();
  ctxPrincipal.arc(
    puntoDestinoCubierto.x,
    puntoDestinoCubierto.y,
    configReja.grosorLinea * 0.75,
    0,
    2 * Math.PI
  );
  ctxPrincipal.fill();
} else {
  px = canvasPrincipal.width / 2;
  py = canvasPrincipal.height / 2;
}

posActualCubiertaX = px;
posActualCubiertaY = py;
}

const visible = calcularVisibilidadPelota(px - offsetRejaX, py - offsetRejaY);
forzarVisibilidad = visible;

return { px, py, visibleDeseado };
}

function calcularVisibilidadPelota(px, py) {
const { baseX, baseY, tamCuadrado, cantidadHoriz, cantidadVert, grosorLinea } = configReja;

for (let j = 0.5; j <= cantidadHoriz + 0.5; j++) {
const barroteX = baseX + j * tamCuadrado;
if (Math.abs(barroteX - px) < (grosorLinea / 2 + radioPelota)) {
  return false;
}
}

for (let i = 0.5; i <= cantidadVert + 0.5; i++) {
const barroteY = baseY + i * tamCuadrado;
if (Math.abs(barroteY - py) < (grosorLinea / 2 + radioPelota)) {
  return false;
}
}

return true;
}

// --- Fin del archivo pelota.js — 2025-05-01 22:03:45 GMT-3 — rev. 054 ---
