let angular = require('angular');

let DrawCtrl = ['$scope', function ($scope) {
  $scope.foo = 'bar';
  $scope.mouseMoved = function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let numPixels = this.state.grid.length;
    let currentPixel = this.state.grid[x][y];

    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.props.tileSize;
      let fillY = currentPixel.y * this.props.tileSize;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.overlayCtx.fillRect(fillX, fillY, this.props.tileSize,
                               this.props.tileSize);
      currentPixel.highlighted = true;
    }

    this.clearHighlight(null, currentPixel);

    if (this.state.isMouseDown) {
      this.paintPixel(ev);
    }
  };

  $scope.clearHighlight = function (ev, currentPixel) {
    let numPixelsH = this.props.width / this.props.tileSize;
    let numPixelsV = this.props.height / this.props.tileSize;
    for (let ix = 0; ix < numPixelsH; ix++) {
      for (let iy = 0; iy < numPixelsV; iy++) {
        let pixel = this.state.grid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let clrX = pixel.x * this.props.tileSize;
          let clrY = pixel.y * this.props.tileSize;

          this.overlayCtx.clearRect(clrX, clrY, this.props.tileSize,
                                    this.props.tileSize);
          pixel.highlighted = false;
        }
      }
    }
  };

  $scope.paintPixel = function (ev) {
    this.setState({ isMouseDown: true });
    let { x, y } = this.getTileCoordinates(ev);

    let color = "#000000";
    let pixel = this.state.grid[x][y];

    let fillX = x * this.props.tileSize;
    let fillY = y * this.props.tileSize;
    this.drawCtx.fillStyle = color;
    this.drawCtx.fillRect(fillX, fillY, this.props.tileSize,
                          this.props.tileSize);
    pixel.color = color;
  };

  $scope.setMouseUp = function () {
    this.setState({ isMouseDown: false });
  };
}];

export default DrawCtrl;
