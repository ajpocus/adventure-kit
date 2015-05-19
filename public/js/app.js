'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let bgCanvas = document.getElementById('bg-canvas');
  let drawCanvas = document.getElementById('draw-canvas');
  let bgCtx = bgCanvas.getContext('2d');
  let drawCtx = drawCanvas.getContext('2d');

  const WIDTH = bgCanvas.width;
  const HEIGHT = bgCanvas.height;
  const BG_TILE_SIZE = 8;
  const PIXEL_SIZE = 32;

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

  drawBackground();
});
