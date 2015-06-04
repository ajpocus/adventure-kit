let React = require('react');
let $ = require('jquery');

import Pixel from '../models/pixel';
import Transparency from '../mixins/transparency';

let DrawCanvas = React.createClass({
  getInitialState: function () {
    return {
      isMouseDown: false,
      zoom: this.props.zoom,
      width: this.props.width,
      height: this.props.height,
      actualWidth: this.props.actualWidth,
      actualHeight: this.props.actualHeight,
      tileWidth: this.props.tileWidth,
      tileHeight: this.props.tileHeight
    };
  },

  getDefaultProps: function () {
    return {
      bgTileSize: 8
    };
  },

  componentDidMount: function () {
    let bgCtx = this.refs.bgCanvas.getDOMNode().getContext('2d');
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');

    let bgTileSize = this.props.bgTileSize;
    bgCtx.scale(bgTileSize, bgTileSize);

    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    drawCtx.scale(tileWidth, tileHeight);
    overlayCtx.scale(tileWidth, tileHeight);

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    });

    this.drawBackground(bgCtx);
    this.initGrid();
  },

  render: function () {
    let surfaceTop = (this.props.totalHeight - this.state.actualHeight) / 2;
    let surfaceLeft = (this.props.totalWidth - this.state.actualWidth) / 2;
    let surfaceStyle = {
      width: this.state.actualWidth,
      height: this.state.actualHeight,
      top: surfaceTop,
      left: surfaceLeft
    };

    return (
      <div id="render">
        <div className="background">
          <div className="surface"
               style={surfaceStyle}
               onMouseMove={this.highlightPixel}
               onMouseOut={this.clearHighlight}
               onMouseDown={this.drawPixel}
               onContextMenu={this.drawPixel}
               onMouseUp={this.setMouseUp}>
            <canvas id="bg-canvas"
                    className="draw"
                    ref="bgCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
            <canvas id="draw-canvas"
                    className="draw"
                    ref="drawCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
            <canvas id="overlay-canvas"
                    className="draw"
                    ref="overlayCanvas"
                    width={this.state.actualWidth}
                    height={this.state.actualHeight}>
            </canvas>
          </div>
        </div>
      </div>
    );
  },

  highlightPixel: function (ev) {
    let overlayCtx = this.state.overlayCtx;
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    let numPixels = grid.length;
    let currentPixel = grid[x][y];

    if (!currentPixel.highlighted) {
      overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      overlayCtx.fillRect(x, y, 1, 1);
      currentPixel.highlighted = true;
    }

    this.setState({
      grid: grid,
      overlayCtx: overlayCtx
    });

    this.clearHighlight(null, currentPixel);

    if (this.state.isMouseDown) {
      this.drawPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let overlayCtx = this.state.overlayCtx;
    let grid = this.state.grid;

    overlayCtx.clearRect(0, 0, this.state.width, this.state.height);
    overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    overlayCtx.fillRect(currentPixel.x, currentPixel.y, 1, 1);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let pixel = grid[x][y];
        if (pixel === currentPixel) {
          continue;
        }

        pixel.highlighted = false;
      }
    }

    this.setState({
      grid: grid,
      overlayCtx: overlayCtx
    });
  },

  drawPixel: function (ev) {
    let {x, y} = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    let drawCtx = this.state.drawCtx;

    let color = this.state.primaryColor;
    let button = ev.which || ev.button;
    if (button === 2) {
      color = this.props.secondaryColor;
    }

    let pixel = grid[x][y];
    pixel.color = color;
    drawCtx.fillStyle = color;
    drawCtx.fillRect(x, y, 1, 1);

    this.setState({
      grid: grid,
      drawCtx: drawCtx,
      isMouseDown: true
    });
  },

  setMouseUp: function (ev) {
    this.setState({ isMouseDown: false });
  },

  drawBackground: function (bgCtx) {
    let numTilesH = this.state.actualWidth / this.props.bgTileSize;
    let numTilesV = this.state.actualHeight / this.props.bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, this.props.bgTileSize, this.props.bgTileSize);
      }
    }

    this.setState({ bgCtx: bgCtx });
  },

  initGrid: function () {
    let grid = [];

    for (let x = 0; x < this.state.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.state.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    this.setState({ grid: grid });
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.state.tileWidth);
    let tileY = Math.floor(y / this.state.tileHeight);

    return { x: tileX, y: tileY };
  },
});

export default DrawCanvas;
