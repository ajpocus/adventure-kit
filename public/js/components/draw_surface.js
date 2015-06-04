let React = require('react');
let $ = require('jquery');

import Pixel from '../models/pixel';
import Transparency from '../mixins/transparency';

let DrawSurface = React.createClass({
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

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.actualWidth !== prevState.actualWidth ||
        this.state.actualHeight !== prevState.actualHeight) {
      this.redraw();
    }
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
      <div id="render"
           onWheel={this.onZoom}>
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

  redraw: function () {
    let bgCtx = this.state.bgCtx;
    let drawCtx = this.state.drawCtx;
    let overlayCtx = this.state.overlayCtx;
    let zoom = this.state.zoom;

    let bgScale = this.props.bgTileSize;
    bgCtx.scale(bgScale, bgScale);

    let scaleWidth = this.state.tileWidth;
    let scaleHeight = this.state.tileHeight;
    drawCtx.scale(scaleWidth, scaleHeight);
    overlayCtx.scale(scaleWidth, scaleHeight);

    let grid = this.state.grid;
    this.drawBackground(bgCtx);
    drawCtx.clearRect(0, 0, this.state.width, this.state.height);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let pixel = grid[x][y];
        if (pixel.color) {
          drawCtx.fillStyle = pixel.color;
          drawCtx.fillRect(x, y, 1, 1);
        }
      }
    }

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    });
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

    let color = this.props.primaryColor;
    let button = ev.which || ev.button;
    if (button === 2) {
      color = this.props.secondaryColor;
    }

    grid[x][y].color = color;
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

  onZoom: function (ev, data) {
    let zoom = this.state.zoom;
    let actualWidth = this.state.actualWidth;
    let actualHeight = this.state.actualHeight;
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let delta = 0;

    if (ev) {
      ev.preventDefault();
      if (ev.deltaY > 0) {
        delta = -0.25;
      } else if (ev.deltaY < 0) {
        delta = 0.25;
      } else {
        return;
      }
    } else if (data) {
      delta = data.delta
    } else {
      return;
    }

    zoom += delta;
    actualWidth = this.props.totalWidth * zoom;
    actualHeight = this.props.totalHeight * zoom;
    tileWidth = actualWidth / this.state.width;
    tileHeight = actualHeight / this.state.height;

    this.setState({
      zoom: zoom,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight
    });
  },

  drawBackground: function (bgCtx) {
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.state.actualWidth / bgTileSize;
    let numTilesV = this.state.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, 1, 1);
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

export default DrawSurface;
