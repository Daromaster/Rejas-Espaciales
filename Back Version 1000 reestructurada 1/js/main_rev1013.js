// Revisión: 1013 - 2025-05-08 05:10 GMT-3
window.addEventListener("DOMContentLoaded", () => {
  const canvasPrincipal = document.getElementById("canvas-juego");
  const ctxPrincipal = canvasPrincipal.getContext("2d");

  function redimensionarTodo() {
    const ancho = canvasPrincipal.clientWidth;
    const alto = canvasPrincipal.clientHeight;
    canvasPrincipal.width = ancho;
    canvasPrincipal.height = alto;
    ajustarDimensiones(ancho, alto);

    fondoActivo = new MotorFondo(canvasPrincipal);

    if (rejaActiva) {
      rejaActiva.canvas = canvasPrincipal;
      rejaActiva.recalcular();
    } else {
      rejaActiva = new MotorRejaCuadriculada(canvasPrincipal);
    }

    if (pelotas.length > 0) {
      pelotas.forEach(p => p.actualizarRadio(rejaActiva.configReja));
    } else {
      inicializarPelotas(rejaActiva.configReja, ancho, alto);
    }
  }

  redimensionarTodo();
  crearCapas(["fondo", "pelota", "reja", "ui"], canvasPrincipal.width, canvasPrincipal.height);

  let tiempoPrevio = performance.now();

  function render(tiempoActual) {
    const delta = tiempoActual - tiempoPrevio;
    tiempoPrevio = tiempoActual;

    fondoActivo.dibujar(getCtx("fondo"));
    rejaActiva.actualizar(delta);
    rejaActiva.dibujar(getCtx("reja"));

    const ctxPelota = getCtx("pelota");
    ctxPelota.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);

    pelotas.forEach(p => {
      p.actualizar();
      p.dibujar(ctxPelota);
    });

    const ctxUI = getCtx("ui");
    ctxUI.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
    actualizarLogicaJuego(delta);
    dibujarEstadoJuego(ctxUI);

    copiarCapasEn(ctxPrincipal);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
  window.addEventListener("resize", redimensionarTodo);
});
// Revisión: 1013 - 2025-05-08 05:10 GMT-3
