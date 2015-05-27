let $ = require('jquery');
let PIXI = require('pixi.js');

import TiledSurface from '../tiled_surface';

let DrawSurfaceDirective = function () {
  return {
    restrict: 'E',
    templateUrl: '../templates/draw_surface.html',

    link: function (scope, element, attrs) {
      let renderer = new PIXI.autoDetectRenderer(512, 512);
      element.appendChild(renderer.view);

      let isMouseDown = false;
      let grid = TiledSurface.initTiles()
      let drawCanvas = $("#draw-canvas");
      let bgCtx = $("#bg-canvas")[0].getContext('2d');
      let drawCtx = $("#draw-canvas")[0].getContext('2d');
      let overlayCtx = $("#overlay-canvas")[0].getContext('2d');

      console.log(bgCtx);
      let width = drawCanvas.width;
      let height = drawCanvas.height;
      let bgTileSize = 8;
      let tileSize = 32;

      let numTilesH = width / bgTileSize;
      let numTilesV = height / bgTileSize;

      for (let i = 0; i < numTilesH; i++) {
        for (let j = 0; j < numTilesV; j++) {
          let x = i * bgTileSize;
          let y = j * bgTileSize;

          let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

          bgCtx.fillStyle = fill;
          bgCtx.fillRect(x, y, bgTileSize, bgTileSize);
        }
      }

      function mouseMoved (ev) {
        let { x, y } = TiledSurface.getTileCoordinates(ev);
        let numPixels = grid.length;
        let currentPixel = grid[x][y];

        if (!currentPixel.highlighted) {
          let fillX = currentPixel.x * tileSize;
          let fillY = currentPixel.y * tileSize;

          overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
          overlayCtx.fillRect(fillX, fillY, tileSize, tileSize);
          currentPixel.highlighted = true;
        }

        clearHighlight(null, currentPixel);

        if (isMouseDown) {
          paintPixel(ev);
        }
      };

      function clearHighlight (ev, currentPixel) {
        let numPixelsH = width / tileSize;
        let numPixelsV = height / tileSize;
        for (let ix = 0; ix < numPixelsH; ix++) {
          for (let iy = 0; iy < numPixelsV; iy++) {
            let pixel = grid[ix][iy];
            if (pixel === currentPixel) {
              continue;
            }

            if (pixel.highlighted) {
              let clrX = pixel.x * tileSize;
              let clrY = pixel.y * tileSize;

              scope.overlayCtx.clearRect(clrX, clrY, tileSize, tileSize);
              pixel.highlighted = false;
            }
          }
        }
      };

      function paintPixel (ev) {
        isMouseDown = true;
        let { x, y } = TiledSurface.getTileCoordinates(ev);

        let color = "#000000";
        let pixel = grid[x][y];

        let fillX = x * tileSize;
        let fillY = y * tileSize;
        drawCtx.fillStyle = color;
        drawCtx.fillRect(fillX, fillY, tileSize, tileSize);
        pixel.color = color;
      };

      function setMouseUp () {
        isMouseDown = false;
      };

      element.bind('mousemove', mouseMoved);
      element.bind('mouseout', clearHighlight);
      element.bind('mousedown', paintPixel);
      element.bind('mouseup', setMouseUp);
    }
  }
};

export default DrawSurfaceDirective;
