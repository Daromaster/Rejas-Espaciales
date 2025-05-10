// Revisión: 1009 - 2025-05-08 04:35 GMT-3

function dibujarFondoEstrellado(ctx, ancho, alto, cantidadEstrellas = 100) {
  ctx.fillStyle = "#000011";
  ctx.fillRect(0, 0, ancho, alto);

  for (let i = 0; i < cantidadEstrellas; i++) {
    const x = Math.random() * ancho;
    const y = Math.random() * alto;
    const radio = Math.random() * 1.5 + 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, radio, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function actualizarFondo() {
  const ctxFondo = getCtx("fondo");
  const ancho = ctxFondo.canvas.width;
  const alto = ctxFondo.canvas.height;
  dibujarFondoEstrellado(ctxFondo, ancho, alto);
}

// Revisión: 1009 - 2025-05-08 04:35 GMT-3
