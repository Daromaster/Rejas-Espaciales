// Revisión: 1007 - 2025-05-08 04:00 GMT-3

const capas = {};
let ordenCapas = [];

function crearCapas(nombres, ancho, alto) {
  nombres.forEach(nombre => {
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext("2d");
    capas[nombre] = { canvas, ctx };
  });
  ordenCapas = [...nombres];
}

function ajustarDimensiones(ancho, alto) {
  ordenCapas.forEach(nombre => {
    const { canvas } = capas[nombre];
    canvas.width = ancho;
    canvas.height = alto;
  });
}

function copiarCapasEn(ctxDestino) {
  ordenCapas.forEach(nombre => {
    const { canvas } = capas[nombre];
    ctxDestino.drawImage(canvas, 0, 0);
  });
}

function getCtx(nombre) {
  return capas[nombre]?.ctx || null;
}

// Revisión: 1007 - 2025-05-08 04:00 GMT-3
