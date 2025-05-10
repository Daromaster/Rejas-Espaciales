let canvasPrincipal, ctxPrincipal;
let canvasFondo, ctxFondo;
let canvasPelota, ctxPelota;
let canvasReja, ctxReja;
let configReja;
let tiempo = 0;
let tiempoJuego = 0;

const amplitudX = 20;
const amplitudY = 10;
const velocidadX = 0.0025;
const velocidadY = 0.0015;

let anguloPelota = 0;
let anguloPelotaX = 0;
let anguloPelotaY = 0;
const velPelotaX = 0.002;
const velPelotaY = 0.0016;
const amplitudPelotaX = 60;
const amplitudPelotaY = 40;

let centroPelotaX = 0;
let centroPelotaY = 0;
let radioPelota = 0;
let forzarVisibilidad = false;

let ultimaFaseVisible = false;
let tiempoInicioFase = 0;
let faseActual = "cubierta";

function calcularConfiguracionReja(width, height) {
  const dimensionMenor = Math.min(width, height);
  const altoZonaReja = dimensionMenor * 0.6;
  const tamCuadrado = altoZonaReja / 4;

  const cantidadCuadradosHoriz = Math.floor((width * 0.6) / tamCuadrado);
  const anchoRejaReal = (cantidadCuadradosHoriz + 1) * tamCuadrado;

  const margenX = (width - anchoRejaReal) / 2;
  const margenY = (height - altoZonaReja) / 2;

  return {
    baseX: margenX,
    baseY: margenY,
    tamCuadrado: tamCuadrado,
    cantidadHoriz: cantidadCuadradosHoriz,
    cantidadVert: 3,
    grosorLinea: 12
  };
}

// ... [continúa el código según el canvas actual: render, actualizarMovimientoPelota, etc.]