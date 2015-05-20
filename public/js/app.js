'use strict';

import Pixel from './pixel';

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

  let PixelGrid = [];

  function drawBackground() {
    const NUM_TILES_HORIZ = WIDTH / BG_TILE_SIZE;
    const NUM_TILES_VERT = HEIGHT / BG_TILE_SIZE;

    for (let i = 0; i < NUM_TILES_HORIZ; i++) {
      for (let j = 0; j < NUM_TILES_VERT; j++) {
        let x = i * BG_TILE_SIZE;
        let y = j * BG_TILE_SIZE;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, BG_TILE_SIZE, BG_TILE_SIZE);
      }
    }
  }

  function initializeDrawSurface() {
    const NUM_PIXELS_HORIZ = WIDTH / PIXEL_SIZE;
    const NUM_PIXELS_VERT = HEIGHT / PIXEL_SIZE;

    for (let x = 0; x < NUM_PIXELS_HORIZ; x++) {
      PixelGrid[x] = [];

      for (let y = 0; y < NUM_PIXELS_VERT; y++) {
        PixelGrid[x].push(new Pixel(x, y));
      }
    }
  }

  function getPixelCoordinates(ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let pixelX = Math.floor(x / PIXEL_SIZE);
    let pixelY = Math.floor(y / PIXEL_SIZE);

    return [pixelX, pixelY];
  }

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
