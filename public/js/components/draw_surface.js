let React = require('react');
let $ = require('jquery');
let PIXI = require('pixi.js');

import DrawActions from '../actions/draw_actions';

let DrawCanvas = React.createClass({
  componentDidMount: function () {
    let tileWidth = this.props.actualWidth / this.props.width;
    let tileHeight = this.props.actualHeight / this.props.height;

    // init drawGrid
    let grid = [];
    for (let x = 0; x < this.props.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.props.height; y++) {
        grid[x].push({
          x: x,
          y: y,
          color: null,
          isHighlighted: false
        });
      }
    }

    DrawActions.setDrawGrid(grid);

    // TODO: Fix prop updating so I don't have to merge these methods.
    let zoomCtx = this.refs.zoomCanvas.getDOMNode().getContext('2d');
    let bgCtx = this.refs.bgCanvas.getDOMNode().getContext('2d');
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');
    let canvases = {
      zoomCtx: zoomCtx,
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    };

    // init background
    let numTilesH = this.props.actualWidth / this.props.bgTileSize;
    let numTilesV = this.props.actualHeight / this.props.bgTileSize;
    let bgTileSize = 8;
    for (let i = 0; i < numTilesH; i++) {
      for (let j = 0; j < numTilesV; j++) {
        let x = i * bgTileSize;
        let y = j * bgTileSize;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        bgCtx.fillStyle = fill;
        bgCtx.fillRect(x, y, bgTileSize, bgTileSize);
      }
    }

    DrawActions.setTileSize({width: tileWidth, height: tileHeight });
    DrawActions.setDrawCanvases(canvases);
    console.log(this.props.drawGrid);
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.resizeDrawGrid();
      this.initBackground();

      this.redrawCanvas();
    } else if (this.props.drawGrid !== prevProps.drawGrid) {
      this.redrawCanvas();
    }
  },

  render: function () {
    let width = this.props.width;
    let height = this.props.height;

    return (
      <div id="render">
        <canvas id="zoom-canvas"
                className="draw"
                ref="zoomCanvas"
                width={this.props.totalWidth}
                height={this.props.totalHeight}>
        </canvas>
        <canvas id="bg-canvas"
                className="draw"
                ref="bgCanvas"
                width={this.props.actualWidth}
                height={this.props.actualHeight}>
        </canvas>
        <canvas id="draw-canvas"
                className="draw"
                ref="drawCanvas"
                onMouseDown={this.fillPixel}
                onContextMenu={this.fillPixel}
                onMouseUp={this.setMouseUp}
                width={this.props.actualWidth}
                height={this.props.actualHeight}>
        </canvas>
        <canvas id="overlay-canvas"
                className="draw"
                ref="overlayCanvas"
                onMouseMove={this.mouseMoved}
                onMouseOut={this.clearHighlight}
                width={this.props.actualWidth}
                height={this.props.actualHeight}>
        </canvas>
      </div>
    );
  },

  resizeDrawGrid: function () {
    let oldGrid = this.props.grid;
    let newGrid = [];

    for (let x = 0; x < this.props.width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < this.props.height; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push({
            x: x,
            y: y,
            color: null,
            isHighlighted: false
          });
        }
      }
    }

    let tileWidth = this.props.actualWidth / this.props.width;
    let tileHeight = this.props.actualHeight / this.props.height;

    DrawActions.setDrawGrid(newGrid);
    DrawActions.setTileSize({ width: tileWidth, height: tileHeight });
  },

  redrawCanvas: function () {
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');
    drawCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    drawCtx.fillRect(0, 0, this.props.actualWidth, this.props.actualHeight);

    let tileWidth = this.props.tileWidth;
    let tileHeight = this.props.tileHeight;

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let px = this.props.drawGrid[x][y];

        let fillX = px.x * tileWidth;
        let fillY = px.y * tileHeight;

        if (px.color) {
          drawCtx.fillStyle = px.color;
          drawCtx.fillRect(fillX, fillY, tileWidth, tileHeight);
        }

        if (px.highlighted) {
          overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)"
          overlayCtx.fillRect(fillX, fillY, tileWidth, tileHeight);
        }
      }
    }
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.props.tileWidth);
    let tileY = Math.floor(y / this.props.tileHeight);

    return { x: tileX, y: tileY };
  },

  mouseMoved: function (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.props.drawGrid;

    grid[x][y].highlighted = true;
    DrawActions.setDrawGrid(grid);

    if (this.props.isMouseDown) {
      this.fillPixel(ev);
    }

    this.clearHighlight(null, currentPixel);

    if (this.props.isMouseDown) {
      this.fillPixel(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let grid = this.props.drawGrid;

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let px = grid[x][y];
        if (px === currentPixel) {
          continue;
        }

        if (px.highlighted) {
          px.highlighted = false;
        }

        grid[x][y] = px;
        DrawActions.setGrid(grid);
      }
    }
  },

  fillPixel: function (ev) {
    ev.preventDefault

    DrawActions.setMouseDown();
    let grid = this.props.drawGrid;

    let { x, y } = this.getTileCoordinates(ev);

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;

    if (button === 2) {
      color = this.props.secondaryColor;
    }

    grid[x][y].color = color;
    DrawActions.setGrid(grid);
  },

  setMouseUp: function () {
    DrawActions.setMouseUp();
  }
});

export default DrawCanvas;
