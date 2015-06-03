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

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx,
      grid: this.initTiles()
    });

    this.updatePosition();
    this.drawBackground(bgCtx);
  },

  render: function () {
    let surfaceStyle = {
      width: this.state.actualWidth,
      height: this.state.actualHeight
    };

    return (
      <div id="render">
        <div className="background">
          <div className="surface"
               style={surfaceStyle}
               onMouseMove={this.handleMouseMove}
               onMouseOut={this.clearHighlight}
               onMouseDown={this.fillPixel}
               onContextMenu={this.fillPixel}
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

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.width !== prevState.width ||
        this.state.height !== prevState.height) {
      this.updatePosition();
      this.redrawTiles();
    }
  },

  redrawTiles: function () {
    console.log("DRAWING");
    this.drawBackground();
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let overlayCtx = this.state.overlayCtx;
    let drawCtx = this.state.drawCtx;

    overlayCtx.fillStyle
    overlayCtx.drawRect(0, 0, overlayCtx.width, overlayCtx.height);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let px = this.state.grid[x][y];
        if (px.color) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          drawCtx.beginFill(px.color);
          drawCtx.drawRect(fillX, fillY, tileWidth, tileHeight);
        }

        if (px.highlighted) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          overlayCtx.fillRect(fillX, fillY, tileWidth, tileHeight);
        }
      }
    }

    this.setState({
      overlayCtx: overlayCtx,
      drawCtx: drawCtx
    });
  },

  initTiles: function () {
    let grid = [];

    for (let x = 0; x < this.props.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.props.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    return grid;
  },

  updateTiles: function () {
    let oldGrid = this.state.grid;
    let newGrid = [];

    for (let x = 0; x < this.state.width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < this.state.height; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    this.setState({ grid: newGrid });
  },

  updatePosition: function () {
    let left = (this.props.totalWidth - this.state.actualWidth) / 2;
    let top = (this.props.totalHeight - this.state.actualHeight) / 2;

    $('#render .surface').css({
      top: top,
      left: left
    });
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

  getFillParams(x, y) {
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let fillX = x * tileWidth;
    let fillY = y * tileHeight;
    return {
      x: fillX,
      y: fillY,
      width: tileWidth,
      height: tileHeight
    };
  },

  drawBackground: function (bgCtx) {
    let numTilesH = this.state.actualWidth / this.props.bgTileSize;
    let numTilesV = this.state.actualHeight / this.props.bgTileSize;

    for (let i = 0; i < numTilesH; i++) {
      for (let j = 0; j < numTilesV; j++) {
        let x = i * this.props.bgTileSize;
        let y = j * this.props.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? 0x999999 : 0x777777;
        let tileSize = this.props.bgTileSize;
        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, tileSize, tileSize);
      }
    }

    this.setState({ bgCtx: bgCtx });
  },

  handleMouseMove: function (ev) {
    console.log("MOUSE MOVED");
    ev.preventDefault();
    let { tx, ty } = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    grid[tx][ty].highlighted = true;

    let overlayCtx = this.state.overlayCtx;
    overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    let {x, y, width, height} = this.getFillParams(tx, ty);
    overlayCtx.fillRect(x, y, width, height)

    this.setState({
      overlayCtx: overlayCtx,
      grid: grid
    });
    this.clearHighlight(ev, x, y);

    if (this.state.isMouseDown) {
      this.fillPixel(ev);
    }
  },

  clearHighlight: function (ev, tx, ty) {
    console.log("CLEAR");
    ev.preventDefault();
    let grid = this.state.grid;
    let overlayCtx = this.state.overlayCtx;

    for (let ix = 0; ix < this.state.width; ix++) {
      for (let iy = 0; iy < this.state.height; iy++) {
        if (tx === ix && ty === iy) {
          continue;
        }

        grid[ix][iy].highlighted = false;
      }
    }

    overlayCtx.clearRect(0, 0, this.state.actualWidth, this.state.actualHeight);
    let {x, y, width, height} = this.getFillParams(tx, ty);
    overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    overlayCtx.fillRect(x, y, width, height);

    this.setState({
      grid: grid,
      overlayCtx: overlayCtx
    });
  },

  fillPixel: function (ev) {
    console.log("FILL");
    ev.preventDefault();
    this.setState({ isMouseDown: true });
    let grid = this.state.grid;
    let drawCtx = this.state.drawCtx;
    let { tx, ty } = this.getTileCoordinates(ev);

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;

    if (button === 2) {
      color = this.props.secondaryColor;
    }

    let {x, y, width, height} = this.getFillParams(tx, ty);
    drawCtx.fillStyle = color;
    drawCtx.fillRect(x, x, width, height);

    grid[x][y].color = color;
    this.setState({
      grid: grid,
      drawCtx: drawCtx
    });
  },

  setMouseUp: function () {
    this.setState({ isMouseDown: false });
  },

  onZoom: function (ev) {
    ev.preventDefault();
    let delta = 0;
    if (ev.deltaY > 0) {
      delta = -0.1;
    } else if (ev.deltaY < 0) {
      delta = 0.1;
    } else {
      return;
    }

    let newZoom = this.state.zoom + delta;
    let actualWidth = this.props.totalWidth * newZoom;
    let actualHeight = this.props.totalHeight * newZoom;

    this.setState({
      zoom: newZoom,
      actualWidth: actualWidth,
      actualHeight: actualHeight
    });

    this.updatePosition();
  }
});

export default DrawCanvas;
