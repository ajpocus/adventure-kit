let $ = require('jquery');

import Pixel from './pixel';
import TileSurface from './tile_surface';
import ColorPicker from './color_picker';

class DrawSurface extends TileSurface {
  constructor (container, params={}) {
    super(container, params);

    this.BG_TILE_SIZE = params.bgTileSize || 8;
    this.initBackground();
    this.colorPicker = new ColorPicker();

    this.isMouseDown = false;
    this.container.addEventListener('mousemove', this.mouseMoved.bind(this),
                                    false);
    this.container.addEventListener('mouseout', this.clearHighlight.bind(this),
                                    false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                    false);
    this.container.addEventListener('mouseup', this.setMouseUp.bind(this),
                                    false);
  }

  initCanvas () {
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.setAttribute('width', this.WIDTH);
    this.bgCanvas.setAttribute('height', this.HEIGHT);
    $(this.bgCanvas).addClass('draw');
    this.container.appendChild(this.bgCanvas);

    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.setAttribute('width', this.WIDTH);
    this.drawCanvas.setAttribute('height', this.HEIGHT);
    $(this.drawCanvas).addClass('draw');
    this.container.appendChild(this.drawCanvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.setAttribute('width', this.WIDTH);
    this.overlayCanvas.setAttribute('height', this.HEIGHT);
    $(this.overlayCanvas).addClass('draw');
    this.container.appendChild(this.overlayCanvas);

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.drawCtx = this.drawCanvas.getContext('2d');
    this.overlayCtx = this.overlayCanvas.getContext('2d');
  }

  initBackground () {
    let NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
    let NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

    for (let i = 0; i < NUM_TILES_HORIZ; i++) {
      for (let j = 0; j < NUM_TILES_VERT; j++) {
        let x = i * this.BG_TILE_SIZE;
        let y = j * this.BG_TILE_SIZE;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
      }
    }
  }

  initTiles () {
    let NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
    let NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
    this.grid = [];

    for (let x = 0; x < NUM_PIXELS_HORIZ; x++) {
      this.grid[x] = [];

      for (let y = 0; y < NUM_PIXELS_VERT; y++) {
        this.grid[x].push(new Pixel(x, y));
      }
    }
  }

  mouseMoved (ev) {
    let { x, y } = this.getTileCoordinates(ev);
    let NUM_PIXELS = this.grid.length;

    let currentPixel = this.grid[x][y];
    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.TILE_SIZE;
      let fillY = currentPixel.y * this.TILE_SIZE;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
      currentPixel.highlighted = true;
    }

    this.clearHighlight(null, currentPixel);

    if (this.isMouseDown) {
      this.paintPixel(ev);
    }
  }

  clearHighlight (ev, currentPixel) {
    let NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
    let NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
    for (let ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
      for (let iy = 0; iy < NUM_PIXELS_VERT; iy++) {
        let pixel = this.grid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let clrX = pixel.x * this.TILE_SIZE;
          let clrY = pixel.y * this.TILE_SIZE;

          this.overlayCtx.clearRect(clrX, clrY, this.TILE_SIZE, this.TILE_SIZE);
          pixel.highlighted = false;
        }
      }
    }
  }

  paintPixel (ev) {
    this.isMouseDown = true;
    let { x, y } = this.getTileCoordinates(ev);

    let color = "#000000";
    let pixel = this.grid[x][y];

    let fillX = x * this.TILE_SIZE;
    let fillY = y * this.TILE_SIZE;
    this.drawCtx.fillStyle = color;
    this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
    pixel.color = color;
  }

  setMouseUp () {
    this.isMouseDown = false;
  }
}

export default DrawSurface;
