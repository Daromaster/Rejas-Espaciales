let celdaDestino = null;
let posActualCubiertaX = null;
let posActualCubiertaY = null;
let puntoDestinoCubierto = null;
let tiempoUltimoDestino = 0;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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
      // Movimiento hacia el objetivo
      const avance = easeInOut(tiempoFase / 1.0);
      const origenX = posActualCubiertaX || canvasPrincipal.width / 2;
      const origenY = posActualCubiertaY || canvasPrincipal.height / 2;
      px = origenX * (1 - avance) + celdaDestino.cxCentro * avance + offsetRejaX;
      py = origenY * (1 - avance) + celdaDestino.cyCentro * avance + offsetRejaY;

      // 🟦 Azul: intención
      ctxPrincipal.fillStyle = "blue";
      ctxPrincipal.fillRect(canvasPrincipal.width / 2 - 80, 10, 30, 30);
    } else {
      // Mantenerse en el centro del cuadro
      px = celdaDestino.cxCentro + offsetRejaX;
      py = celdaDestino.cyCentro + offsetRejaY;

      // 🟩 Verde: descubierta
      ctxPrincipal.fillStyle = "lime";
      ctxPrincipal.fillRect(canvasPrincipal.width / 2 - 40, 10, 30, 30);
    }

    // 🔴 Rojo: centro de destino
    ctxPrincipal.fillStyle = "red";
    ctxPrincipal.beginPath();
    ctxPrincipal.arc(
      celdaDestino.cxCentro + offsetRejaX,
      celdaDestino.cyCentro + offsetRejaY,
      6,
      0,
      2 * Math.PI
    );
    ctxPrincipal.fill();

    posActualCubiertaX = px;
    posActualCubiertaY = py;

  } else {
    // Movimiento suave y azaroso, siempre dentro de zonas cubiertas
    if (!puntoDestinoCubierto || (tiempoJuego - tiempoUltimoDestino > 2)) {
      let encontrado = false;
      for (let intentos = 0; intentos < 100; intentos++) {
        const destinoX = canvasPrincipal.width * (0.2 + 0.6 * Math.random());
        const destinoY = canvasPrincipal.height * (0.2 + 0.6 * Math.random());
        if (!calcularVisibilidadPelota(destinoX - offsetRejaX, destinoY - offsetRejaY)) {
          puntoDestinoCubierto = {
            x: destinoX,
            y: destinoY,
            t0: tiempoJuego,
            origenX: posActualCubiertaX || canvasPrincipal.width / 2,
            origenY: posActualCubiertaY || canvasPrincipal.height / 2
          };
          tiempoUltimoDestino = tiempoJuego;
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        puntoDestinoCubierto = null;
      }
    }

    if (puntoDestinoCubierto) {
      const avance = Math.min(1, (tiempoJuego - puntoDestinoCubierto.t0) / 2);
      const interp = easeInOut(avance);
      px = puntoDestinoCubierto.origenX * (1 - interp) + puntoDestinoCubierto.x * interp;
      py = puntoDestinoCubierto.origenY * (1 - interp) + puntoDestinoCubierto.y * interp;
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

// --- Fin del archivo pelota.js — 2025-05-01 14:10:30 GMT-3 — rev. 048 ---
