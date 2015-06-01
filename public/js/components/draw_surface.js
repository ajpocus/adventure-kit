let React = require('react');
let $ = require('jquery');
let PIXI = require('pixi.js');

import Pixel from '../models/pixel';

let DrawCanvas = React.createClass({
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

  componentDidMount: function () {
    let renderNode = $(React.findDOMNode(this));

    this.bgCtx = renderNode.find("#bg-canvas")[0].getContext('2d');
    this.drawCtx = renderNode.find("#draw-canvas")[0].getContext('2d');
    this.overlayCtx = renderNode.find("#overlay-canvas")[0].getContext('2d');

    this.setState({ grid: this.initTiles() });
    this.initBackground();
  },

  render: function () {
    return (
      <div id="render"
          onMouseMove={this.mouseMoved}
          onMouseOut={this.clearHighlight}
          onMouseDown={this.fillPixel}
          onContextMenu={this.fillPixel}
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

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.updateTiles();
      this.initBackground();
    }
  },

  initTiles: function () {
    let numTilesH = this.props.width / this.props.tileSize;
    let numTilesV = this.props.height / this.props.tileSize;
    let grid = [];

    for (let x = 0; x < numTilesH; x++) {
      grid[x] = [];

      for (let y = 0; y < numTilesV; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    return grid;
  },

  updateTiles: function () {
    let numTilesH = this.props.width / this.props.tileSize;
    let numTilesV = this.props.height / this.props.tileSize;
    let oldGrid = this.state.grid;
    let newGrid = [];

    for (let x = 0; x < numTilesH; x++) {
      newGrid[x] = [];
      for (let y = 0; y < numTilesV; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    console.log('new grid', newGrid);

    this.setState({ grid: newGrid });
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.props.tileSize);
    let tileY = Math.floor(y / this.props.tileSize);

    return { x: tileX, y: tileY };
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
    let grid = this.state.grid;
    let numPixels = grid.length;
    let currentPixel = grid[x][y];

    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.props.tileSize;
      let fillY = currentPixel.y * this.props.tileSize;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)"
      this.overlayCtx.fillRect(fillX, fillY, this.props.tileSize,
                               this.props.tileSize);
      currentPixel.highlighted = true;
    }

    this.setState({ grid: grid });
    this.clearHighlight(null, currentPixel);

    if (this.state.isMouseDown) {
      this.fillPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let numPixelsH = this.props.width / this.props.tileSize;
    let numPixelsV = this.props.height / this.props.tileSize;
    let grid = this.state.grid;

    for (let ix = 0; ix < numPixelsH; ix++) {
      for (let iy = 0; iy < numPixelsV; iy++) {
        let pixel = grid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let fillX = pixel.x * this.props.tileSize;
          let fillY = pixel.y * this.props.tileSize;

          this.overlayCtx.clearRect(fillX, fillY, this.props.tileSize,
                                    this.props.tileSize);
          pixel.highlighted = false;
        }
      }
    }

    this.setState({ grid: grid });
  },

  fillPixel: function (ev) {
    ev.preventDefault();
    this.setState({ isMouseDown: true });
    let grid = this.state.grid;

    let { x, y } = this.getTileCoordinates(ev);
    let pixel = grid[x][y];
    let fillX = x * this.props.tileSize;
    let fillY = y * this.props.tileSize;

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;

    if (button === 2) {
      color = this.props.secondaryColor;
    }

    this.drawCtx.fillStyle = color;
    this.drawCtx.clearRect(fillX, fillY, this.props.tileSize,
                           this.props.tileSize);
    this.drawCtx.fillRect(fillX, fillY, this.props.tileSize,
                          this.props.tileSize);
    pixel.color = color;
    this.setState({ grid: grid });
  },

  setMouseUp: function () {
    this.setState({ isMouseDown: false });
  }
});

export default DrawCanvas;
