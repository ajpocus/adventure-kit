let $ = require('jquery');
let PIXI = require('pixi.js');

import TiledSurface from '../tiled_surface';

let DrawSurfaceDirective = function () {
  return {
    restrict: 'E',

    link: function (scope, element, attrs) {
      let width = 512;
      let height = 512;
      let bgTileSize = 8;
      let tileSize = 32;
      let isMouseDown = false;
      let grid = TiledSurface.initTiles();
      let numTilesH = width / bgTileSize;
      let numTilesV = height / bgTileSize;

      let stage = new PIXI.Container();
      let renderer = PIXI.autoDetectRenderer(width, height);
      element.append(renderer.view);

      let bgGfx = new PIXI.Graphics();
      let drawGfx = new PIXI.Graphics();
      let overlayGfx = new PIXI.Graphics();

      stage.addChild(bgGfx);
      stage.addChild(drawGfx);
      stage.addChild(overlayGfx);

      for (let i = 0; i < numTilesH; i++) {
        for (let j = 0; j < numTilesV; j++) {
          let x = i * bgTileSize;
          let y = j * bgTileSize;

          let fill = ((i + j) % 2 == 0) ? 0x999999 : 0x777777;

          bgGfx.beginFill(fill);
          bgGfx.drawRect(x, y, bgTileSize, bgTileSize);
        }
      }

      function mouseMoved (ev) {
        let { x, y } = TiledSurface.getTileCoordinates(ev);
        let numPixels = grid.length;
        let currentPixel = grid[x][y];

        if (!currentPixel.highlighted) {
          let fillX = currentPixel.x * tileSize;
          let fillY = currentPixel.y * tileSize;

          overlayGfx.beginFill(0xffffff, 0.5);
          overlayGfx.drawRect(fillX, fillY, tileSize, tileSize);
          currentPixel.highlighted = true;
        }

        clearHighlight(null, currentPixel);

        if (isMouseDown) {
          paintPixel(ev);
        }
      };

      function clearHighlight (ev, currentPixel) {
        overlayGfx.clear();
        if (currentPixel) {
          overlayGfx.beginFill(0xffffff, 0.5);
          let fillX = currentPixel.x * tileSize;
          let fillY = currentPixel.y * tileSize;
          overlayGfx.drawRect(fillX, fillY, tileSize, tileSize);
        }
      };

      function paintPixel (ev) {
        isMouseDown = true;
        let { x, y } = TiledSurface.getTileCoordinates(ev);

        let color = 0x000000;
        let pixel = grid[x][y];

        let fillX = x * tileSize;
        let fillY = y * tileSize;
        drawGfx.beginFill(color);
        drawGfx.drawRect(fillX, fillY, tileSize, tileSize);
        pixel.color = color;
      };

      function setMouseUp () {
        isMouseDown = false;
      };

      element.bind('mousemove', mouseMoved);
      element.bind('mouseout', clearHighlight);
      element.bind('mousedown', paintPixel);
      element.bind('mouseup', setMouseUp);

      (function render () {
        requestAnimationFrame(render);
        renderer.render(stage);
      })();
    }
  };
};

export default DrawSurfaceDirective;
