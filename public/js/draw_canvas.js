let React = require('react');
let $ = require('jquery');

import TiledCanvasMixin from './tiled_canvas_mixin';

let DrawCanvas = React.createClass({
  mixins: [TiledCanvasMixin],

  getInitialState: function () {
    return {
      isMouseDown: false
    };
  },

  getDefaultProps: function () {
    return {
      bgTileSize: 8
    };
  },

  render: function () {
    return (
      <div id="render"
          onMouseMove={this.mouseMoved}
          onMouseOut={this.clearHighlight}
          onMouseDown={this.paintPixel}
          onMouseUp={this.setMouseUp}>
        <canvas id="bg-canvas" className="draw" width={this.props.width}
            height={this.props.height}></canvas>
        <canvas id="draw-canvas" className="draw" width={this.props.width}
            height={this.props.height}></canvas>
        <canvas id="overlay-canvas" className="draw" width={this.props.width}
            height={this.props.height}></canvas>
      </div>
    );
  },

  componentDidMount: function () {
    this.bgCtx = $("#bg-canvas")[0].getContext('2d');
    this.drawCtx = $("#draw-canvas")[0].getContext('2d');
    this.overlayCtx = $("#overlay-canvas")[0].getContext('2d');
    this.initBackground();
  },

  initBackground: function () {
    let numTilesH = this.props.width / this.props.bgTileSize;
    let numTilesV = this.props.height / this.props.bgTileSize;

    for (let i = 0; i < numTilesH; i++) {
      for (let j = 0; j < numTilesV; j++) {
        let x = i * this.props.bgTileSize;
        let y = j * this.props.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, this.props.bgTileSize, this.props.bgTileSize);
      }
    }
  },

  mouseMoved: function (ev) {
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
  },

  clearHighlight: function (ev, currentPixel) {
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
  },

  paintPixel (ev) {
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
  },

  setMouseUp: function () {
    this.setState({ isMouseDown: false });
  }
});

export default DrawCanvas;
