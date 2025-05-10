// Revisión: 1011 - 2025-05-08 05:00 GMT-3

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

  if (estadoJuego === "cubierto") {
    ctx.fillStyle = "lime";
    ctx.fillRect(cx - 30, 5, 60, 60);
  } else if (estadoJuego === "descubierto") {
    ctx.fillStyle = "blue";
    ctx.fillRect(cx - 100, 5, 60, 60);
  }
}

// Revisión: 1011 - 2025-05-08 05:00 GMT-3
