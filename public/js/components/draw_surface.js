let React = require('react');
let $ = require('jquery');
let PIXI = require('pixi.js');

import Pixel from '../models/pixel';

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

  componentWillMount: function () {
    let stage = new PIXI.Stage(0xbbbbbb);
    let renderer = PIXI.autoDetectRenderer(this.props.totalWidth,
                                           this.props.totalHeight);

    let bgGfx = new PIXI.Graphics();
    let drawGfx = new PIXI.Graphics();
    let overlayGfx = new PIXI.Graphics();

    bgGfx.width = this.state.actualWidth;
    bgGfx.height = this.state.actualHeight;
    drawGfx.width = this.state.actualWidth;
    drawGfx.height = this.state.actualHeight;
    overlayGfx.width = this.state.actualWidth;
    overlayGfx.height = this.state.actualHeight;

    stage.addChild(bgGfx);
    stage.addChild(drawGfx);
    stage.addChild(overlayGfx);

    this.setState({
      stage: stage,
      renderer: renderer,
      bgGfx: bgGfx,
      drawGfx: drawGfx,
      overlayGfx: overlayGfx,
      grid: this.initTiles()
    });
  },

  componentDidMount: function () {
    $('#render').append(this.state.renderer.view);
    this.updatePosition();
    this.drawBackground();
  },

  render: function () {
    let surfaceStyle = {
      width: this.state.actualWidth,
      height: this.state.actualHeight
    };

    this.state.renderer.render(this.state.stage);

    return (
      <div id="render"
           onMouseMove={this.handleMouseMove}
           onMouseOut={this.clearHighlight}
           onMouseDown={this.fillPixel}
           onContextMenu={this.fillPixel}
           onMouseUp={this.setMouseUp}>
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
    let overlayGfx = this.state.overlayGfx;
    let drawGfx = this.state.drawGfx;

    overlayGfx.beginFill(0x000000, 0);
    overlayGfx.drawRect(0, 0, overlayGfx.width, overlayGfx.height);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let px = this.state.grid[x][y];
        if (px.color) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          drawGfx.beginFill(px.color);
          drawGfx.drawRect(fillX, fillY, tileWidth, tileHeight);
        }

        if (px.highlighted) {
          let fillX = px.x * tileWidth;
          let fillY = px.y * tileHeight;
          overlayGfx.beginFill(0xffffff, 0.4);
          overlayGfx.drawRect(0, 0, tileWidth, tileHeight);
        }
      }
    }

    this.setState({
      overlayGfx: overlayGfx,
      drawGfx: drawGfx
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
    let x = (this.props.totalWidth - this.state.actualWidth) / 2;
    let y = (this.props.totalHeight - this.state.actualHeight) / 2;

    let bgGfx = this.state.bgGfx;
    let drawGfx = this.state.drawGfx;
    let overlayGfx = this.state.overlayGfx;

    bgGfx.position.set(x, y);
    drawGfx.position.set(x, y);
    overlayGfx.position.set(x, y);

    this.setState({
      bgGfx: bgGfx,
      drawGfx: drawGfx,
      overlayGfx: overlayGfx
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
    let numTilesH = this.state.actualWidth / this.props.bgTileSize;
    let numTilesV = this.state.actualHeight / this.props.bgTileSize;
    let bgGfx = this.state.bgGfx;

    for (let i = 0; i < numTilesH; i++) {
      for (let j = 0; j < numTilesV; j++) {
        let x = i * this.props.bgTileSize;
        let y = j * this.props.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? 0x999999 : 0x777777;

        bgGfx.beginFill(fill);
        bgGfx.drawRect(x, y, this.props.bgTileSize, this.props.bgTileSize);
      }
    }
  },

  handleMouseMove: function (ev) {
    console.log("MOUSE MOVED");
    ev.preventDefault();
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    grid[x][y].highlighted = true;


    let overlayGfx = this.state.overlayGfx;
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let fillX = x * tileWidth;
    let fillY = y * tileHeight;
    overlayGfx.beginFill(0xffffff, 0.4);
    overlayGfx.drawRect(fillX, fillY, tileWidth, tileHeight);

    this.setState({ overlayGfx: overlayGfx, grid: grid });
    this.clearHighlight(ev, x, y);

    if (this.state.isMouseDown) {
      this.fillPixel(ev);
    }
  },

  clearHighlight: function (ev, x, y) {
    console.log("CLEAR");
    ev.preventDefault();
    let grid = this.state.grid;
    let overlayGfx = this.state.overlayGfx;

    for (let ix = 0; ix < this.state.width; ix++) {
      for (let iy = 0; iy < this.state.height; iy++) {
        if (x === ix && y === iy) {
          continue;
        }

        grid[ix][iy].highlighted = false;
        let tileWidth = this.state.tileWidth;
        let tileHeight = this.state.tileHeight;
        let fillX = ix * tileWidth;
        let fillY = iy * tileHeight;
        overlayGfx.beginFill(0xffffff, 0.4);
        overlayGfx.drawRect(fillX, fillY, tileWidth, tileHeight);
      }
    }

    this.setState({
      grid: grid,
      overlayGfx: overlayGfx
    });
  },

  fillPixel: function (ev) {
    console.log("FILL");
    ev.preventDefault();
    this.setState({ isMouseDown: true });
    let grid = this.state.grid;
    let drawGfx = this.state.drawGfx;
    let { x, y } = this.getTileCoordinates(ev);

    let button = ev.which || ev.button;
    let color = this.props.primaryColor;

    if (button === 2) {
      color = this.props.secondaryColor;
    }

    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let fillX = x * tileWidth;
    let fillY = y * tileHeight;
    drawGfx.beginFill(color);
    drawGfx.drawRect(fillX, fillY, tileWidth, tileHeight);

    grid[x][y].color = color;
    this.setState({
      grid: grid,
      drawGfx: drawGfx
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
