function dibujarFondo() {
    ctxFondo.clearRect(0, 0, canvasFondo.width, canvasFondo.height);
    ctxFondo.fillStyle = "#000020";
    ctxFondo.fillRect(0, 0, canvasFondo.width, canvasFondo.height);
  
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvasFondo.width;
      const y = Math.random() * canvasFondo.height;
      const brillo = Math.random();
      ctxFondo.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.5 * brillo})`;
      ctxFondo.beginPath();
      ctxFondo.arc(x, y, 1.2, 0, 2 * Math.PI);
      ctxFondo.fill();
    }
  }
  