// Archivo: pelota.js
// Proyecto: Rejas Espaciales
// Revisión: 037-H
// Fecha de modificación: 2025-05-08 00:40 GMT-3

// === Agregado: cálculo de destino cubierto y dibujo auxiliar ===

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
  if (!destinoCubierto) return;
  ctx.beginPath();
  ctx.arc(destinoCubierto.x, destinoCubierto.y, diametroBarrote * 2, 0, 2 * Math.PI);
  ctx.fillStyle = "yellow";
  ctx.fill();
}

// NOTA: Para usarlo, desde main1.js (solo en modo cubierto):
// if (!forzarVisibilidad) dibujarDestinoCubierto(ctxPrincipal, destinoCubierto);
// Asegurarse de que `destinoCubierto` exista o se defina una vez al entrar en fase cubierta.

// === Fin del agregado ===


let salidaDesdeX = null;
let salidaDesdeY = null;
let tiempoInicioSalida = null;
let salidaDestinoX = null;
let salidaDestinoY = null;

let puntoDestinoCubierto = null;
let tiempoUltimoDestino = 0;
const duracionDestinoCubierto = 2.0; // segundos

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

function easeInOut(t) {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function actualizarMovimientoPelota(offsetRejaX = 0, offsetRejaY = 0) {
  const paso = 2 * Math.PI;
  const visibleDeseado = (tiempoJuego % 6) > 2;
  forzarVisibilidad = false;

  if (visibleDeseado !== ultimaFaseVisible) {
    tiempoInicioFase = tiempoJuego;
    faseActual = visibleDeseado ? "visible" : "cubierta";
    ultimaFaseVisible = visibleDeseado;

    if (!visibleDeseado) {
      tiempoInicioSalida = tiempoJuego;
      puntoDestinoCubierto = null;

      if (celdaDestino) {
        salidaDesdeX = celdaDestino.cxCentro + offsetRejaX;
        salidaDesdeY = celdaDestino.cyCentro + offsetRejaY;

        const centroX = canvasPrincipal.width / 2;
        const centroY = canvasPrincipal.height / 2;

        const xRatio = clamp((salidaDesdeX - centroX) / amplitudPelotaX, -1, 1);
        const yRatio = clamp((salidaDesdeY - centroY) / amplitudPelotaY, -1, 1);

        anguloPelotaX = Math.asin(xRatio) / paso;
        anguloPelotaY = Math.acos(yRatio) / paso;

        if (isNaN(anguloPelotaX)) anguloPelotaX = 0;
        if (isNaN(anguloPelotaY)) anguloPelotaY = 0;

        salidaDestinoX = centroX + Math.sin(anguloPelotaX * paso) * amplitudPelotaX * 0.6;
        salidaDestinoY = centroY + Math.cos(anguloPelotaY * paso) * amplitudPelotaY * 0.6;
      }
    }

    if (visibleDeseado) {
      celdaDestino = null;
    }
  }

  let px, py;
  const tiempoFase = tiempoJuego - tiempoInicioFase;

  if (faseActual === "visible") {
    if (!celdaDestino) {
      const cx = canvasPrincipal.width / 2;
      const cy = canvasPrincipal.height / 2;
      let candidatos = [];

      for (let i = 0; i < configReja.cantidadHoriz; i++) {
        for (let j = 0; j < configReja.cantidadVert; j++) {
          const cxCentro = configReja.baseX + configReja.tamCuadrado * (i + 1);
          const cyCentro = configReja.baseY + configReja.tamCuadrado * (j + 1);
          const dist = Math.hypot(cx - (cxCentro + offsetRejaX), cy - (cyCentro + offsetRejaY));
          candidatos.push({ i, j, cxCentro, cyCentro, dist });
        }
      }

      candidatos.sort((a, b) => a.dist - b.dist);
      const topCandidatos = candidatos.slice(0, 9);
      const elegido = topCandidatos[Math.floor(Math.random() * topCandidatos.length)];
      celdaDestino = elegido;
    }

    const { cxCentro, cyCentro } = celdaDestino;
    const cxObjetivo = cxCentro + offsetRejaX;
    const cyObjetivo = cyCentro + offsetRejaY;

    if (tiempoFase < 1.0) {
      const avance = easeInOut(tiempoFase / 1.0);
      const origenX = canvasPrincipal.width / 2 + Math.sin(anguloPelotaX * paso) * amplitudPelotaX;
      const origenY = canvasPrincipal.height / 2 + Math.cos(anguloPelotaY * paso) * amplitudPelotaY;
      px = origenX * (1 - avance) + cxObjetivo * avance;
      py = origenY * (1 - avance) + cyObjetivo * avance;
    } else if (tiempoFase < 3.5) {
      px = cxObjetivo + Math.sin(tiempoFase * 2 * Math.PI) * 2;
      py = cyObjetivo + Math.cos(tiempoFase * 2 * Math.PI) * 2;
    } else {
      anguloPelotaX += velPelotaX;
      anguloPelotaY += velPelotaY;
      px = cxObjetivo + Math.sin(anguloPelotaX * paso) * 20;
      py = cyObjetivo + Math.cos(anguloPelotaY * paso) * 20;
    }

  } else {
    const durTransicion = 1.5;
    const tiempoDesdeSalida = tiempoJuego - tiempoInicioSalida;

    if (
      salidaDesdeX !== null &&
      salidaDestinoX !== null &&
      tiempoDesdeSalida < durTransicion
    ) {
      const avance = easeInOut(tiempoDesdeSalida / durTransicion);
      px = salidaDesdeX * (1 - avance) + salidaDestinoX * avance;
      py = salidaDesdeY * (1 - avance) + salidaDestinoY * avance;
    } else {
      // Movimiento suave entre puntos destino en etapa cubierta
      if (!puntoDestinoCubierto || (tiempoJuego - tiempoUltimoDestino > duracionDestinoCubierto)) {
        let intentos = 0;
        while (intentos < 100) {
          const destinoX = canvasPrincipal.width * (0.2 + 0.6 * Math.random());
          const destinoY = canvasPrincipal.height * (0.2 + 0.6 * Math.random());
          if (!calcularVisibilidadPelota(destinoX - offsetRejaX, destinoY - offsetRejaY)) {
            puntoDestinoCubierto = {
              x: destinoX,
              y: destinoY,
              t0: tiempoJuego,
              origenX: px || canvasPrincipal.width / 2,
              origenY: py || canvasPrincipal.height / 2
            };
            tiempoUltimoDestino = tiempoJuego;
            break;
          }
          intentos++;
        }
      }

      if (puntoDestinoCubierto) {
        const avance = easeInOut((tiempoJuego - puntoDestinoCubierto.t0) / duracionDestinoCubierto);
        px = puntoDestinoCubierto.origenX * (1 - avance) + puntoDestinoCubierto.x * avance;
        py = puntoDestinoCubierto.origenY * (1 - avance) + puntoDestinoCubierto.y * avance;
      } else {
        // Fallback por si no se logró encontrar destino
        anguloPelotaX += velPelotaX;
        anguloPelotaY += velPelotaY;
        px = canvasPrincipal.width / 2 + Math.sin(anguloPelotaX * paso) * amplitudPelotaX;
        py = canvasPrincipal.height / 2 + Math.cos(anguloPelotaY * paso) * amplitudPelotaY;
      }
    }
  }

  const visible = calcularVisibilidadPelota(px - offsetRejaX, py - offsetRejaY);
  if (visible) {
    forzarVisibilidad = true;
  }

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

function determinarDestinoCubierto(pelotaX, pelotaY, intersecciones) {
  if (!intersecciones || !Array.isArray(intersecciones)) return null;

  const distancias = intersecciones
    .filter(p => p && typeof p.x === "number" && typeof p.y === "number")
    .map(({ x, y }) => ({
      x,
      y,
      distancia: Math.hypot(pelotaX - x, pelotaY - y)
    }));

  if (distancias.length === 0) return null;

  distancias.sort((a, b) => a.distancia - b.distancia);
  const candidatas = distancias.slice(0, 12);
  if (candidatas.length === 0) return null;

  const seleccionada = candidatas[Math.floor(Math.random() * candidatas.length)];
  return { x: seleccionada.x, y: seleccionada.y };
}

// Fin del archivo pelota.js
// Revisión: 037-H
// Fecha de modificación: 2025-05-08 00:40 GMT-3