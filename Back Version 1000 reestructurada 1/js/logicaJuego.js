// Revisión: 1012 - 2025-05-08 05:05 GMT-3

let estadoJuego = "cubierto";
let tiempoTranscurrido = 0;
let duracionActual = 2000; // 2 segundos cubierto para empezar

function actualizarLogicaJuego(delta) {
  tiempoTranscurrido += delta;

  if (tiempoTranscurrido >= duracionActual) {
    if (estadoJuego === "cubierto") {
      estadoJuego = "descubierto";
      duracionActual = 4000; // 4 segundos
    } else {
      estadoJuego = "cubierto";
      duracionActual = 2000;
    }
    tiempoTranscurrido = 0;
  }
}

function dibujarEstadoJuego(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const cx = ctx.canvas.width / 2;
  const lado = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.06;

  if (estadoJuego === "cubierto") {
    ctx.fillStyle = "lime";
    ctx.fillRect(cx - lado / 2, 5, lado, lado);
  } else if (estadoJuego === "descubierto") {
    ctx.fillStyle = "blue";
    ctx.fillRect(cx - lado * 1.5, 5, lado, lado);
  }
}

// Revisión: 1012 - 2025-05-08 05:05 GMT-3
