let React = require('react');
let $ = require('jquery');
let PNG = require('pngjs').PNG;
let tinycolor = require('tinycolor2');
let PIXI = require('pixi.js');

import DrawActions from '../actions/draw_actions';
import DrawProperties from './draw_properties';
import Pixel from '../models/pixel';
import Transparency from '../mixins/transparency';

class DrawSurface extends React.Component {
  componentDidMount() {
    let width = this.props.actualWidth;
    let height = this.props.actualHeight;
    let renderer = PIXI.autoDetectRenderer(width, height);
    this.refs.surface.getDOMNode().appendChild(renderer.view);
    let stage = new PIXI.Container();

    let bgGfx = new PIXI.Graphics();
    let drawGfx = new PIXI.Graphics();
    let overlayGfx = new PIXI.Graphics();

    stage.addChild(bgGfx);
    stage.addChild(drawGfx);
    stage.addChild(overlayGfx);

    this.setState({
      renderer,
      stage,
      bgGfx,
      drawGfx,
      overlayGfx
    }, function () {
      DrawActions.createGrid();
      this.drawBackground();
      requestAnimationFrame(this.animate);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actualWidth !== prevProps.actualWidth ||
        this.props.actualHeight !== prevProps.actualHeight ||
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.drawBackground();
      this.resizeGrid();
    }
  }

  render() {
    let surfaceTop = (this.props.totalHeight - this.props.actualHeight) / 2;
    let surfaceLeft = (this.props.totalWidth - this.props.actualWidth) / 2;
    let surfaceStyle = {
      width: this.props.actualWidth,
      height: this.props.actualHeight,
      top: surfaceTop,
      left: surfaceLeft
    };

    return (
      <div className="render-container">
        <div className="render-column">
          <div id="render">
            <div className="background">
              <div className="surface"
                   ref="surface"
                   style={surfaceStyle}
                   onMouseMove={this.highlightPixel}
                   onMouseOut={this.clearHighlight.bind(this, null)}
                   onMouseDown={this.draw}
                   onContextMenu={this.draw}
                   onMouseUp={this.setMouseUp}
                   onWheel={this.onZoom}>
              </div>
            </div>
          </div>
        </div>

        <div className="manage-surface">
          <DrawProperties/>
        </div>
      </div>
    );
  }

  animate() {
    let drawGfx = this.state.drawGfx;
    let renderer = this.state.renderer;
    let stage = this.state.stage;
    let zoom = this.props.zoom;
    let grid = this.props.grid;

    renderer.resize(this.props.actualWidth, this.props.actualHeight);
    drawGfx.clear();

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let pixel = grid[x][y];
        if (pixel.color) {
          let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
          drawGfx.beginFill(this.colorToInt(pixel.color));
          drawGfx.drawRect(fillX, fillY, fillWidth, fillHeight);
        }
      }
    }

    renderer.render(stage);
    requestAnimationFrame(this.animate);
    this.setState({ renderer }, function () {
      DrawActions.saveSprite({
        grid: grid,
        dataUrl: renderer.view.toDataURL(),
        size: this.props.width * 2
      });
    });
  }

  highlightPixel(ev) {
    let overlayGfx = this.state.overlayGfx;
    let { x, y } = this.getTileCoordinates(ev);
    let grid = this.props.grid;
    let numPixels = grid.length;
    let currentPixel = grid[x][y];

    if (!currentPixel.highlighted) {
      let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
      overlayGfx.beginFill(0xffffff, 0.2);
      overlayGfx.drawRect(fillX, fillY, fillWidth, fillHeight);
      currentPixel.highlighted = true;
    }

    DrawActions.updateGrid(grid);
    this.setState({ overlayGfx });

    this.clearHighlight(currentPixel);

    if (this.props.isMouseDown) {
      this.draw(ev);
    }
  }

  clearHighlight(currentPixel) {
    let overlayGfx = this.state.overlayGfx;
    let grid = this.props.grid;
    overlayGfx.clear();

    if (currentPixel) {
      let x = currentPixel.x;
      let y = currentPixel.y;
      let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);

      overlayGfx.beginFill(0xffffff, 0.2);
      overlayGfx.drawRect(fillX, fillY, fillWidth, fillHeight);
    }

    for (let x = 0; x < this.props.width; x++) {
      for (let y = 0; y < this.props.height; y++) {
        let pixel = grid[x][y];
        if (pixel === currentPixel) {
          continue;
        }

        pixel.highlighted = false;
      }
    }

    DrawActions.updateGrid(grid);
    this.setState({ overlayGfx });
  }

  draw(ev) {
    ev.preventDefault();
    let {x, y} = this.getTileCoordinates(ev);
    let grid = this.props.grid;
    let drawGfx = this.state.drawGfx;

    let { fillX, fillY, fillWidth, fillHeight } = this.getFillParams(x, y);
    let color = this.props.primaryColor;
    let button = ev.which || ev.button;
    let eraseColor = false;
    if (button === 2) {
      eraseColor = true;
    }

    switch (this.props.activeTool) {
      case 'Pencil':
        if (eraseColor) {
          grid[x][y].color = null;
        } else {
          grid[x][y].color = color;
        }

        break;

      case 'Bucket':
        let originalColor = grid[x][y].color;
        grid[x][y].color = color;

        var seen = {};
        (function drawNeighbors(x, y) {
          if (seen[x] && seen[x][y]) {
            return;
          } else {
            if (!seen[x]) {
              seen[x] = {};
            }
            seen[x][y] = true;
          }

          let neighbors = [
            { nx: x + 1, ny: y },
            { nx: x - 1, ny: y },
            { nx: x, ny: y + 1 },
            { nx: x, ny: y - 1 }
          ];

          for (let i = 0; i < neighbors.length; i++) {
            let {nx, ny} = neighbors[i];

            if (nx < 0 || ny < 0 || nx >= grid.length || ny >= grid[0].length) {
              continue;
            }

            let px = grid[nx][ny];
            if (px.color !== originalColor) {
              continue;
            }

            grid[nx][ny].color = color;
            drawNeighbors(nx, ny);
          }
        })(x, y);

        break;

      default:
        return;
    }

    DrawActions.updateGrid(grid);
    DrawActions.setIsMouseDown(true);
    this.setState({ drawGfx });
  }

  setMouseUp(ev) {
    DrawActions.setIsMouseDown(false);
  }

  onZoom(ev) {
    ev.preventDefault();
    let zoom = this.props.zoom;
    let actualWidth = this.props.actualWidth;
    let actualHeight = this.props.actualHeight;
    let tileWidth = this.props.tileWidth;
    let tileHeight = this.props.tileHeight;

    if (ev.deltaY > 0) {
      zoom /= 1.5;
    } else if (ev.deltaY < 0) {
      zoom *= 1.5;
    } else {
      return;
    }

    if (zoom < this.props.minZoom || zoom > this.props.maxZoom) {
      return;
    }

    DrawActions.updateZoom(zoom);
  }

  drawBackground() {
    let bgGfx = this.state.bgGfx;
    let bgTileSize = this.props.bgTileSize;
    let numTilesH = this.props.actualWidth / bgTileSize;
    let numTilesV = this.props.actualHeight / bgTileSize;

    for (let x = 0; x < numTilesH; x++) {
      for (let y = 0; y < numTilesV; y++) {
        let fill = ((x + y) % 2 === 0) ? 0x999999 : 0x777777;
        let fillX = x * bgTileSize;
        let fillY = y * bgTileSize;

        bgGfx.beginFill(fill);
        bgGfx.drawRect(fillX, fillY, bgTileSize, bgTileSize);
      }
    }

    this.setState({ bgGfx });
  }

  resizeGrid() {
    DrawActions.resizeGrid();
  }

  getTileCoordinates(ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.props.tileWidth);
    let tileY = Math.floor(y / this.props.tileHeight);

    return { x: tileX, y: tileY };
  }

  getFillParams(x, y) {
    let fillWidth = this.props.tileWidth;
    let fillHeight = this.props.tileHeight;
    let fillX = x * fillWidth;
    let fillY = y * fillHeight;

    return {
      fillX,
      fillY,
      fillWidth,
      fillHeight
    };
  }

  colorToInt(color) {
    return parseInt(color.slice(1), 16);
  }
};

DrawSurface.defaultProps = {
  bgTileSize: 8,
  minZoom: 0.125,
  maxZoom: 4,
  zoomDelta: 0.125
}

export default DrawSurface;
