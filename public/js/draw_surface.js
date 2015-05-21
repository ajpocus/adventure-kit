import Pixel from './pixel';

class DrawSurface {
  constructor (container, params={}) {
    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.WIDTH = params.width || 512;
    this.HEIGHT = params.height || 512;
    this.TILE_SIZE = params.tileSize || 32;
    this.BG_TILE_SIZE = params.bgTileSize || 8;

    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.setAttribute('width', this.WIDTH);
    this.bgCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.bgCanvas);

    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.setAttribute('width', this.WIDTH);
    this.drawCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.drawCanvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.setAttribute('width', this.WIDTH);
    this.overlayCanvas.setAttribute('height', this.HEIGHT);
    this.container.appendChild(this.overlayCanvas);

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.drawCtx = this.drawCanvas.getContext('2d');
    this.overlayCtx = this.overlayCanvas.getContext('2d');

    this.drawBackground();
    this.initDrawSurface();

    this.container.addEventListener('mousemove', this.highlightPixel.bind(this),
                                    false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                    false);
  }

  drawBackground () {
    const NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
    const NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

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

  initDrawSurface () {
    const NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
    const NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
    this.grid = [];

    for (let x = 0; x < NUM_PIXELS_HORIZ; x++) {
      this.grid[x] = [];

      for (let y = 0; y < NUM_PIXELS_VERT; y++) {
        this.grid[x].push(new Pixel(x, y));
      }
    }
  }

  getPixelCoordinates (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let pixelX = Math.floor(x / this.TILE_SIZE);
    let pixelY = Math.floor(y / this.TILE_SIZE);

    return [pixelX, pixelY];
  }

  highlightPixel (ev) {
    let [x, y] = this.getPixelCoordinates(ev);
    const NUM_PIXELS = this.grid.length;

    // highlight the pixel under the mouse
    let currentPixel = this.grid[x][y];
    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.TILE_SIZE;
      let fillY = currentPixel.y * this.TILE_SIZE;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
      currentPixel.highlighted = true;
    }

    // clear highlighting on other pixels
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
    let [x, y] = this.getPixelCoordinates(ev);
    let color = "#000000";
    let pixel = this.grid[x][y];

    let fillX = x * this.TILE_SIZE;
    let fillY = y * this.TILE_SIZE;
    this.drawCtx.fillStyle = color;
    this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
    pixel.color = color;
  }
}

export default DrawSurface;
