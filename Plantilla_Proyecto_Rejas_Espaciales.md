
# Proyecto Rejas Espaciales

## Contexto inicial
- Juego en HTML5 canvas con múltiples capas.
- La pelota debe moverse alternando fases cubierta/descubierta.
- Hay un fondo estrellado y la reja debe estar sobre la pelota.

## Convenciones de código
- La pelota se dibuja en el canvas `ctxPelota`.
- La reja se dibuja en `ctxReja`.
- Todos los elementos deben adaptarse al tamaño dinámico del canvas.

## Prioridades actuales
1. Corregir cálculo de coordenadas relativas en redimensionado.
2. Implementar algoritmo de búsqueda de punto cubierto.
3. Verificar integración con reja en movimiento.

## Observaciones generales
- El código debe estar modularizado por archivos: `pelota.js`, `reja.js`, `main1.js`, etc.
- Revisar que todos los elementos gráficos respeten las proporciones definidas en relación al canvas principal.

---
*Este archivo puede abrirse como `.md` en editores compatibles o como `.txt` sin perder legibilidad.*
