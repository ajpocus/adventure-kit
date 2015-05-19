'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var WIDTH = 640;
  var HEIGHT = 480;
  var TILE_SIZE = 16;

  var bgCanvas = document.getElementById('bg-canvas');
  var drawCanvas = document.getElementById('draw-canvas');
  var bgCtx = bgCanvas.getContext('2d');
  var drawCtx = drawCanvas.getContext('2d');

  function drawBackground(ctx) {
    ctx.fillStyle = '#aaa';
    ctx.fillRect(0, 0, 20, 20);
  }

  drawBackground(bgCtx);
  drawCtx.fillStyle = '#eee';
  drawCtx.fillRect(0, 4, 20, 20);
});