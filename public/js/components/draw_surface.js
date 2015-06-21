let React = require('react');
let $ = require('jquery');
let PNG = require('pngjs').PNG;
let tinycolor = require('tinycolor2');

import ManageDrawList from './manage_draw_list';
import ResizePrompt from './resize_prompt';
import Pixel from '../models/pixel';
import Transparency from '../lib/transparency';

let DrawSurface = React.createClass({
  propTypes: {
    primaryColor: React.PropTypes.string.isRequired,
    secondaryColor: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    let zoom = 0.875;
    let width = 32;
    let height = 32;
    let actualWidth = this.props.totalWidth * zoom;
    let actualHeight = this.props.totalHeight * zoom;
    let tileWidth = actualWidth / width;
    let tileHeight = actualHeight / height;

    return {
      isMouseDown: false,
      width: 32,
      height: 32,
      zoom: 0.875,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight,
      title: 'Untitled'
    };
  },

  getDefaultProps: function () {
    return {
      totalWidth: 1024,
      totalHeight: 1024,
      bgTileSize: 8,
      minZoom: 0.125,
      maxZoom: 4,
      overlayFill: 'rgba(255, 255, 255, 0.2)'
    };
  },

  componentDidMount: function () {
    let bgCtx = this.refs.bgCanvas.getDOMNode().getContext('2d');
    let drawCtx = this.refs.drawCanvas.getDOMNode().getContext('2d');
    let overlayCtx = this.refs.overlayCanvas.getDOMNode().getContext('2d');

    this.setState({
      bgCtx: bgCtx,
      drawCtx: drawCtx,
      overlayCtx: overlayCtx
    });

    this.initGrid();
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.bgCtx &&
        this.state.bgCtx !== prevState.bgCtx &&
        !prevState.bgCtx) {
      this.drawBackground();
    }

    if (this.state.actualWidth !== prevState.actualWidth ||
        this.state.actualHeight !== prevState.actualHeight ||
        this.state.width !== prevState.width ||
        this.state.height !== prevState.height) {
      this.updateGrid(function () {
        this.redraw();
      });
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
      <div className="render-container">
        <div className="render-column">
          <div className="title-container">
            <input name="title"
                   className="title"
                   ref="title"
                   value={this.state.title}
                   onChange={this.onTitleChange}/>
          </div>

          <div id="render">
            <div className="background">
              <div className="surface"
                   style={surfaceStyle}
                   onMouseMove={this.highlightPixel}
                   onMouseOut={this.clearHighlight}
                   onMouseDown={this.draw}
                   onContextMenu={this.draw}
                   onMouseUp={this.setMouseUp}
                   onWheel={this.onZoom}>
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
        </div>

        <div className="manage-surface">
          <ManageDrawList onResizeClick={this.onResizeClick}
                          onExportClick={this.onExportClick}
                          onSaveClick={this.onSaveClick}/>
        </div>
      </div>
    );
  },

  redraw: function () {
    let bgCtx = this.state.bgCtx;
    let drawCtx = this.state.drawCtx;
    let overlayCtx = this.state.overlayCtx;
    let zoom = this.state.zoom;

    let grid = this.state.grid;
    this.drawBackground();
    drawCtx.clearRect(0, 0, this.state.actualWidth, this.state.actualHeight);

    for (let x = 0; x < this.state.width; x++) {
      for (let y = 0; y < this.state.height; y++) {
        let pixel = grid[x][y];
        if (pixel.color) {
          let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
          drawCtx.fillStyle = pixel.color;
          drawCtx.fillRect(fillX, fillY, fillWidth, fillHeight);
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
      let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
      overlayCtx.fillStyle = this.props.overlayFill;
      overlayCtx.fillRect(fillX, fillY, fillWidth, fillHeight);
      currentPixel.highlighted = true;
    }

    this.setState({
      grid: grid,
      overlayCtx: overlayCtx
    });

    this.clearHighlight(null, currentPixel);

    if (this.state.isMouseDown) {
      this.draw(ev);
    }
  },

  clearHighlight: function (ev, currentPixel) {
    let overlayCtx = this.state.overlayCtx;
    let grid = this.state.grid;

    let clearWidth = this.state.width * this.state.tileWidth;
    let clearHeight = this.state.height * this.state.tileHeight;
    overlayCtx.clearRect(0, 0, this.state.actualWidth, this.state.actualHeight);
    let x = currentPixel.x;
    let y = currentPixel.y;
    let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
    overlayCtx.fillStyle = this.props.overlayFill;
    overlayCtx.fillRect(fillX, fillY, fillWidth, fillHeight);

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

  draw: function (ev) {
    let {x, y} = this.getTileCoordinates(ev);
    let grid = this.state.grid;
    let drawCtx = this.state.drawCtx;

    let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
    let color = this.props.primaryColor;
    let button = ev.which || ev.button;
    if (button === 2) {
      color = this.props.secondaryColor;
    }

    switch (this.props.activeTool) {
      case 'Pencil':
        grid[x][y].color = color;
        drawCtx.fillStyle = color;
        drawCtx.fillRect(fillX, fillY, fillWidth, fillHeight);

        this.setState({
          grid: grid,
          drawCtx: drawCtx,
          isMouseDown: true
        });

        break;

      case 'Bucket':
        let originalColor = grid[x][y].color;
        grid[x][y].color = color;
        drawCtx.fillStyle = color;
        drawCtx.fillRect(fillX, fillY, fillWidth, fillHeight);

        var seen = {};
        (function drawNeighbors(x, y) {
          if (seen[x] && seen[x][y]) {
            return;
          } else {
            seen[x] || (seen[x] = {});
            seen[x][y] = true;
          }

          let neighbors = [
            { x: x + 1, y: y },
            { x: x - 1, y: y },
            { x: x, y: y + 1 },
            { x: x, y: y - 1 }
          ];

          for (let i = 0; i < neighbors.length; i++) {
            let {x, y} = neighbors[i];

            if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
              continue;
            }

            let px = grid[x][y];
            if (px.color !== originalColor) {
              continue;
            }

            let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
            grid[x][y].color = color;
            drawCtx.fillRect(fillX, fillY, fillWidth, fillHeight);
            drawNeighbors(x, y);
          }
        })(x, y);

        break;

      default:
        return;
    }

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

    if (ev) {
      ev.preventDefault();
      if (ev.deltaY > 0) {
        zoom /= 2;
      } else if (ev.deltaY < 0) {
        zoom *= 2;
      } else {
        return;
      }
    } else if (data) {
      if (data.delta) {
        zoom += data.delta;
      } else if (data.zoom) {
        zoom = data.zoom;
      } else {
        return;
      }
    } else {
      return;
    }

    if (zoom < this.props.minZoom || zoom > this.props.maxZoom) {
      return;
    }

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

  onTitleChange: function (ev) {
    this.setState({ title: ev.target.value });
  },

  onResizeClick: function () {
    React.render(<ResizePrompt width={this.state.width}
                               height={this.state.height}
                               handleResize={this.handleResize}/>,
                 document.getElementById('modal-container'));
  },

  handleResize: function (width, height) {
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;
    let actualWidth = this.state.actualWidth;
    let actualHeight = this.state.actualHeight;
    let zoom = this.state.zoom;

    actualWidth = this.props.totalWidth * zoom;
    actualHeight = this.props.totalHeight * zoom;
    tileWidth = actualWidth / width;
    tileHeight = actualHeight / height;

    this.setState({
      width: width,
      height: height,
      actualWidth: actualWidth,
      actualHeight: actualHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight,
      zoom: zoom
    });
  },

  onExportClick: function () {
    // TODO: post image data to server and download the response as image/png
  },

  onSaveClick: function () {
    // TODO: save image to local store
    let images = JSON.parse(localStorage.getItem('images')) || {};
    let dataUrl = this.refs.drawCanvas.getDOMNode().toDataURL('image/png');
    dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
    images[this.state.title] = dataUrl;
    localStorage.setItem('images', JSON.stringify(images));
    console.log(localStorage.getItem('images'));
  },

  drawBackground: function () {
    let bgCtx = this.state.bgCtx;
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.state.actualWidth / bgTileSize;
    let numTilesV = this.state.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 == 0) ? "#999" : "#777";
        let fillX = x * bgTileSize;
        let fillY = y * bgTileSize;
        bgCtx.fillStyle = fill;
        bgCtx.fillRect(fillX, fillY, bgTileSize, bgTileSize);
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

  updateGrid: function (callback) {
    let width = this.state.width;
    let height = this.state.height;
    let oldGrid = this.state.grid;
    let newGrid = [];

    for (let x = 0; x < width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < height; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    this.setState({ grid: newGrid }, callback);
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

  getFillParams: function (x, y) {
    let fillWidth = this.state.tileWidth;
    let fillHeight = this.state.tileHeight;
    let fillX = x * fillWidth;
    let fillY = y * fillHeight;

    return {
      fillX: fillX,
      fillY: fillY,
      fillWidth: fillWidth,
      fillHeight: fillHeight
    };
  }
});

export default DrawSurface;
