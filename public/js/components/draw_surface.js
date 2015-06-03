let React = require('react');
let $ = require('jquery');
let PIXI = require('pixi.js');

import Pixel from '../models/pixel';

let DrawCanvas = React.createClass({
  getInitialState: function () {
    return {
      isMouseDown: false,
      zoom: this.props.zoom,
      actualWidth: this.props.actualWidth,
      actualHeight: this.props.actualHeight,
      tileWidth: this.props.tileWidth,
      tileHeight: this.props.tileHeight,
      grid: this.initTiles()
    };
  },

  getDefaultProps: function () {
    return {
      bgTileSize: 8
    };
  },

  componentDidMount: function () {
    let renderNode = $(React.findDOMNode(this));

    this.zoomCtx = renderNode.find('#zoom-canvas')[0].getContext('2d');
    this.bgCtx = renderNode.find('#bg-canvas')[0].getContext('2d');
    this.drawCtx = renderNode.find('#draw-canvas')[0].getContext('2d');
    this.overlayCtx = renderNode.find('#overlay-canvas')[0].getContext('2d');

    this.setState({ grid: this.initTiles() });
    this.updatePosition();
    this.drawBackground();
  },

  render: function () {
    return (
      <div id="render"
           onWheel={this.onZoom}>
        <canvas id="zoom-canvas"
                className="draw"
                width={this.props.totalWidth}
                height={this.props.totalHeight}>
        </canvas>

        <canvas id="bg-canvas"
                className="draw surface"
                width={this.state.actualWidth}
                height={this.state.actualHeight}>
        </canvas>

        <canvas id="draw-canvas"
                className="draw surface"
                width={this.state.actualWidth}
                height={this.state.actualHeight}>
        </canvas>

        <canvas id="overlay-canvas"
                className="draw surface"
                width={this.state.actualWidth}
                height={this.state.actualHeight}
                onMouseMove={this.mouseMoved}
                onMouseOut={this.clearHighlight}
                onMouseDown={this.fillPixel}
                onContextMenu={this.fillPixel}
                onMouseUp={this.setMouseUp}>
        </canvas>
      </div>
    );
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.updatePosition();
    }

    this.drawTiles();
  },

  drawTiles: function () {
    console.log("DRAWING");
    this.drawBackground();
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let px = this.state.grid[x][y];
        if (px.color) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          this.drawCtx.fillStyle = px.color;
          this.drawCtx.fillRect(fillX, fillY, tileWidth, tileHeight);
        }

        if (px.highlighted) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          this.overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          this.overlayCtx.drawRect(fillX, fillY, tileWidth, tileHeight);
        }
      }
    }
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

    for (let x = 0; x < this.props.width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < this.props.height; y++) {
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
    let canvases = $('#render canvas.draw.surface');
    canvases.css({
      top: (this.props.totalHeight - this.state.actualHeight) / 2,
      left: (this.props.totalWidth - this.state.actualWidth) / 2
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

  drawBackground: function () {
    this.zoomCtx.fillStyle = '#484848';
    this.zoomCtx.fillRect(0, 0, this.props.totalWidth, this.props.totalHeight);

    let numTilesH = this.state.actualWidth / this.props.bgTileSize;
    let numTilesV = this.state.actualHeight / this.props.bgTileSize;

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
    grid[x][y].highlighted = true;
    this.setState({ grid: grid });
    this.drawTiles();
    if (this.state.isMouseDown) {
      this.fillPixel(ev);
    }
  },

  fillPixel: function (ev) {
    ev.preventDefault();
    this.setState({ isMouseDown: true });
    let grid = this.state.grid;
    let { x, y } = this.getTileCoordinates(ev);

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;

    if (button === 2) {
      color = this.props.secondaryColor;
    }

    grid[x][y].color = color;
    this.setState({ grid: grid });
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
