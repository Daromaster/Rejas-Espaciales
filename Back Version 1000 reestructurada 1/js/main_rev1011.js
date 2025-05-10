// Revisión: 1011 - 2025-05-08 04:45 GMT-3
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
    rejaActiva = new MotorRejaCuadriculada(canvasPrincipal);
    inicializarPelotas(rejaActiva.configReja, ancho, alto);
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

    getCtx("ui").clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);

    copiarCapasEn(ctxPrincipal);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
  window.addEventListener("resize", redimensionarTodo);
});
// Revisión: 1011 - 2025-05-08 04:45 GMT-3
