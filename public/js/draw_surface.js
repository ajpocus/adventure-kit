import Pixel from './pixel';

class DrawSurface {
  constructor (params) {
    this.container = params.container;
    if (!this.container) {
      throw new UserException(
        "DrawSurface requires a container attribute in the params object."
      );
    }

    this.WIDTH = params.width || 640;
    this.HEIGHT = params.height || 480;
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
  }

  drawBackground () {
    const NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
    const NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

    for (let i = 0; i < NUM_TILES_HORIZ; i++) {
      for (let j = 0; j < NUM_TILES_VERT; j++) {
        let x = i * BG_TILE_SIZE;
        let y = j * BG_TILE_SIZE;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, BG_TILE_SIZE, BG_TILE_SIZE);
      }
    }
  }

  initDrawSurface () {
    const NUM_PIXELS_HORIZ = WIDTH / PIXEL_SIZE;
    const NUM_PIXELS_VERT = HEIGHT / PIXEL_SIZE;
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
}
