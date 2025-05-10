// Revisión: 1004 - 2025-05-08 02:50 GMT-3
window.addEventListener("DOMContentLoaded", () => {
  const canvasPrincipal = document.getElementById("canvas-juego");
  const ctxPrincipal = canvasPrincipal.getContext("2d");
  const ancho = canvasPrincipal.width;
  const alto = canvasPrincipal.height;

  crearCapas(["fondo", "reja", "pelota", "ui"], ancho, alto);

  function render() {
    // Fondo
    const ctxFondo = getCtx("fondo");
    ctxFondo.fillStyle = "#ddd";
    ctxFondo.fillRect(0, 0, ancho, alto);

    // Reja
    const ctxReja = getCtx("reja");
    ctxReja.clearRect(0, 0, ancho, alto);
    ctxReja.strokeStyle = "#444";
    ctxReja.lineWidth = 2;
    for (let x = 50; x < ancho; x += 50) {
      ctxReja.beginPath();
      ctxReja.moveTo(x, 0);
      ctxReja.lineTo(x, alto);
      ctxReja.stroke();
    }
    for (let y = 50; y < alto; y += 50) {
      ctxReja.beginPath();
      ctxReja.moveTo(0, y);
      ctxReja.lineTo(ancho, y);
      ctxReja.stroke();
    }

    // Pelota
    const ctxPelota = getCtx("pelota");
    ctxPelota.clearRect(0, 0, ancho, alto);
    const grad = ctxPelota.createRadialGradient(400, 300, 5, 400, 300, 20);
    grad.addColorStop(0, "#ff4444");
    grad.addColorStop(1, "#880000");
    ctxPelota.fillStyle = grad;
    ctxPelota.beginPath();
    ctxPelota.arc(400, 300, 20, 0, 2 * Math.PI);
    ctxPelota.fill();

    copiarCapasEn(ctxPrincipal);
    requestAnimationFrame(render);
  }

  render();
});
// Revisión: 1004 - 2025-05-08 02:50 GMT-3