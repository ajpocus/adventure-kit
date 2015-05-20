'use strict';

import Pixel from './pixel';

document.addEventListener('DOMContentLoaded', function () {
  let bgCanvas = document.getElementById('bg-canvas');
  let drawCanvas = document.getElementById('draw-canvas');
  let overlayCanvas = document.getElementById('overlay-canvas');

  let bgCtx = bgCanvas.getContext('2d');
  let drawCtx = drawCanvas.getContext('2d');
  let overlayCtx = drawCanvas.getContext('2d');

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
      for (let y = 0; y < NUM_PIXELS_VERT; y++) {
        PixelGrid.push(new Pixel(x, y));
      }
    }
    console.log(PixelGrid);
  }

  function highlightPixel (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let pixelX = Math.floor(x / PIXEL_SIZE);
    let pixelY = Math.floor(y / PIXEL_SIZE);

    const NUM_PIXELS = PixelGrid.length;

    for (let i = 0; i < NUM_PIXELS; i++) {
      let pixel = PixelGrid[i];
      if (pixel.x === pixelX && pixel.y === pixelY) {
        if (!pixel.highlighted) {
          let fillX = pixel.x * PIXEL_SIZE;
          let fillY = pixel.y * PIXEL_SIZE;

          overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
          overlayCtx.fillRect(fillX, fillY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = true;
        }
      } else {
        if (pixel.highlighted) {
          let clearX = pixel.x * PIXEL_SIZE;
          let clearY = pixel.y * PIXEL_SIZE;

          overlayCtx.clearRect(clearX, clearY, PIXEL_SIZE, PIXEL_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  }

  function paintPixel (ev) {
    let x = ev.clientX;
    let y = ev.clientY;
  }

  drawBackground();
  initializeDrawSurface();
  drawCanvas.addEventListener('mousemove', highlightPixel, false);
  drawCanvas.addEventListener('click', paintPixel, false);
});
