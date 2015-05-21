import Pixel from './pixel';

class TileSurface {
  constructor (container, params={}) {
    this.container = container;
    if (!this.container) {
      throw {
        name: "TileSurfaceException",
        message: "TileSurface requires a container parameter.",
        toString: function () { return `${this.name}: ${this.message}`; }
      };
    }

    this.WIDTH = params.width || 512;
    this.HEIGHT = params.height || 512;
    this.TILE_SIZE = params.tileSize || 32;

    this.initCanvas();
    this.initBackground();
    this.initTiles();
  }

  initCanvas () {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.WIDTH);
    this.canvas.setAttribute('height', this.HEIGHT);

    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  initBackground () {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  initTiles () {
    const NUM_TILES_HORIZ = this.WIDTH / this.TILE_SIZE;
    const NUM_TILES_VERT = this.HEIGHT / this.TILE_SIZE;
    this.grid = [];

    for (let x = 0; x < NUM_TILES_HORIZ; x++) {
      this.grid[x] = [];

      for (let y = 0; y < NUM_TILES_VERT; y++) {
        this.grid[x].push(new Pixel(x, y));
      }
    }
  }

  getTileCoordinates (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.TILE_SIZE);
    let tileY = Math.floor(y / this.TILE_SIZE);

    return { x: tileX, y: tileY };
  }
}

export default TileSurface;
