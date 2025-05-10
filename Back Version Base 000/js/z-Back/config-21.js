// Canvases y contextos
let canvasPrincipal, ctxPrincipal;
let canvasFondo, ctxFondo;
let canvasPelota, ctxPelota;
let canvasReja, ctxReja;

// Configuración general
let configReja;
let tiempo = 0;
let tiempoJuego = 0;

// Movimiento reja
const amplitudX = 20;
const amplitudY = 10;
const velocidadX = 0.0025;
const velocidadY = 0.0015;

// Movimiento pelota
let anguloPelota = 0;
let anguloPelotaX = 0;
let anguloPelotaY = 0;
const velPelotaX = 0.002;
const velPelotaY = 0.0016;
const amplitudPelotaX = 60;
const amplitudPelotaY = 40;

// Pelota
let centroPelotaX = 0;
let centroPelotaY = 0;
let radioPelota = 0;
let forzarVisibilidad = false;

// Lógica de visibilidad controlada
let ultimaFaseVisible = false;
let tiempoInicioFase = 0;
let faseActual = "cubierta";
let celdaDestino = null;

// --- Fin del archivo config.js — 2025-05-01 10:42:00 GMT-3 — rev. 021 ---
