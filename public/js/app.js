'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let bgCanvas = document.getElementById('bg-canvas');
  let drawCanvas = document.getElementById('draw-canvas');
  let overlayCanvas = document.getElementById('overlay-canvas');

  let bgCtx = bgCanvas.getContext('2d');
  let drawCtx = drawCanvas.getContext('2d');
  let overlayCtx = overlayCanvas.getContext('2d');

  const WIDTH = bgCanvas.width;
  const HEIGHT = bgCanvas.height;
  const BG_TILE_SIZE = 8;
  const PIXEL_SIZE = 32;

  function highlightPixel (ev) {
    console.log("HIGHLIGHT");
    let [x, y] = getPixelCoordinates(ev);
    const NUM_PIXELS = PixelGrid.length;

    // highlight the pixel under the mouse
    let currentPixel = PixelGrid[x][y];
    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * PIXEL_SIZE;
      let fillY = currentPixel.y * PIXEL_SIZE;

      overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      overlayCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
      currentPixel.highlighted = true;
    }

    // clear highlighting on other pixels
    let NUM_PIXELS_HORIZ = WIDTH / PIXEL_SIZE;
    let NUM_PIXELS_VERT = HEIGHT / PIXEL_SIZE;
    for (let ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
      for (let iy = 0; iy < NUM_PIXELS_VERT; iy++) {
        let pixel = PixelGrid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let fillX = pixel.x * PIXEL_SIZE;
          let fillY = pixel.y * PIXEL_SIZE;

          overlayCtx.clearRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  }

  function paintPixel (ev) {
    console.log("PAINT");
    let [x, y] = getPixelCoordinates(ev);
    let color = "#000000";
    let pixel = PixelGrid[x][y];

    let fillX = x * PIXEL_SIZE;
    let fillY = y * PIXEL_SIZE;
    drawCtx.fillStyle = color;
    drawCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
    pixel.color = color;
  }

  drawBackground();
  initializeDrawSurface();
  overlayCanvas.addEventListener('mousemove', highlightPixel, false);
  overlayCanvas.addEventListener('mousedown', paintPixel, false);
});
