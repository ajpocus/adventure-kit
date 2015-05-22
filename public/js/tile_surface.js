var Pixel = require('./pixel');

var TileSurface = function (container, params) {
  params || (params = {});
  this.container = container;
  if (!this.container) {
    throw {
      name: "TileSurfaceException",
      message: "TileSurface requires a container parameter.",
      toString: function () { return this.name + ": " + this.message; }
    };
  }

  this.WIDTH = params.width || 512;
  this.HEIGHT = params.height || 512;
  this.TILE_SIZE = params.tileSize || 32;

  this.initCanvas();
  this.initBackground();
  this.initTiles();
};

TileSurface.prototype.initCanvas = function () {
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('width', this.WIDTH);
  this.canvas.setAttribute('height', this.HEIGHT);

  this.container.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
};

TileSurface.prototype.initBackground = function () {
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

TileSurface.prototype.initTiles = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.TILE_SIZE;
  this.grid = [];

  for (var x = 0; x < NUM_TILES_HORIZ; x++) {
    this.grid[x] = [];

    for (var y = 0; y < NUM_TILES_VERT; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};

TileSurface.prototype.getTileCoordinates = function (ev) {
  var elRect = ev.target.getBoundingClientRect();
  var absX = ev.clientX;
  var absY = ev.clientY;
  var x = absX - elRect.left;
  var y = absY - elRect.top;

  var tileX = Math.floor(x / this.TILE_SIZE);
  var tileY = Math.floor(y / this.TILE_SIZE);

  return { x: tileX, y: tileY };
};

exports = module.exports = TileSurface;
