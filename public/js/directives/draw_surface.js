let angular = require('angular');

let DrawSurfaceDirective = function () {
  return {
    restrict: 'E',
    templateUrl: '../templates/draw_surface.html',
    link: function (scope, element, attrs) {
      let drawCanvas = $("#draw-canvas");
      this.bgCtx = $("#bg-canvas")[0].getContext('2d');
      this.drawCtx = $("#draw-canvas")[0].getContext('2d');
      this.overlayCtx = $("#overlay-canvas")[0].getContext('2d');

      this.width = drawCanvas.width;
      this.height = drawCanvas.height;
      this.bgTileSize = 8;
      this.tileSize = 32;
      scope.isMouseDown = false;

      let numTilesH = this.width / this.bgTileSize;
      let numTilesV = this.height / this.bgTileSize;

      for (let i = 0; i < numTilesH; i++) {
        for (let j = 0; j < numTilesV; j++) {
          let x = i * this.bgTileSize;
          let y = j * this.bgTileSize;

          let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

          this.bgCtx.fillStyle = fill;
          this.bgCtx.fillRect(x, y, this.bgTileSize, this.bgTileSize);
        }
      }

    }
  }
};
