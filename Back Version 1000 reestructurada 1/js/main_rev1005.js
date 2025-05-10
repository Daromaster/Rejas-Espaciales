// Revisión: 1005 - 2025-05-08 03:05 GMT-3
window.addEventListener("DOMContentLoaded", () => {
  const canvasPrincipal = document.getElementById("canvas-juego");
  const ctxPrincipal = canvasPrincipal.getContext("2d");
  const ancho = canvasPrincipal.width;
  const alto = canvasPrincipal.height;

  crearCapas(["fondo", "reja", "pelota", "ui"], ancho, alto);

  rejaActiva = new MotorRejaCuadriculada(ancho, alto);

  let tiempoPrevio = performance.now();

  function render(tiempoActual) {
    const delta = tiempoActual - tiempoPrevio;
    tiempoPrevio = tiempoActual;

    // Fondo
    const ctxFondo = getCtx("fondo");
    ctxFondo.fillStyle = "#ddd";
    ctxFondo.fillRect(0, 0, ancho, alto);

    // Reja
    rejaActiva.actualizar(delta);
    rejaActiva.dibujar(getCtx("reja"));

    // Pelota
    pelotas.forEach(p => p.actualizar());
    const ctxPelota = getCtx("pelota");
    ctxPelota.clearRect(0, 0, ancho, alto);
    pelotas.forEach(p => p.dibujar(ctxPelota));

    // UI (por ahora vacío)
    getCtx("ui").clearRect(0, 0, ancho, alto);

    copiarCapasEn(ctxPrincipal);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
// Revisión: 1005 - 2025-05-08 03:05 GMT-3
