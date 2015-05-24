var Pixel = require('./pixel');
var TileSurface = require('./tile_surface');
var ColorPicker = require('./color_picker');

var DrawSurface = function (container, params) {
  TileSurface.call(this, container, params);

  params || (params = {});
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
};

DrawSurface.prototype = Object.create(TileSurface.prototype);
DrawSurface.prototype.constructor = TileSurface;

DrawSurface.prototype.initCanvas = function () {
  this.bgCanvas = document.createElement('canvas');
  this.bgCanvas.setAttribute('width', this.WIDTH);
  this.bgCanvas.setAttribute('height', this.HEIGHT);
  this.bgCanvas.addClass('draw');
  this.container.appendChild(this.bgCanvas);

  this.drawCanvas = document.createElement('canvas');
  this.drawCanvas.setAttribute('width', this.WIDTH);
  this.drawCanvas.setAttribute('height', this.HEIGHT);
  this.drawCanvas.addClass('draw');
  this.container.appendChild(this.drawCanvas);

  this.overlayCanvas = document.createElement('canvas');
  this.overlayCanvas.setAttribute('width', this.WIDTH);
  this.overlayCanvas.setAttribute('height', this.HEIGHT);
  this.overlayCanvas.addClass('draw');
  this.container.appendChild(this.overlayCanvas);

  this.bgCtx = this.bgCanvas.getContext('2d');
  this.drawCtx = this.drawCanvas.getContext('2d');
  this.overlayCtx = this.overlayCanvas.getContext('2d');
};

DrawSurface.prototype.initBackground = function () {
  var NUM_TILES_HORIZ = this.WIDTH / this.BG_TILE_SIZE;
  var NUM_TILES_VERT = this.HEIGHT / this.BG_TILE_SIZE;

  for (var i = 0; i < NUM_TILES_HORIZ; i++) {
    for (var j = 0; j < NUM_TILES_VERT; j++) {
      var x = i * this.BG_TILE_SIZE;
      var y = j * this.BG_TILE_SIZE;

      var fill = ((i + j) % 2 == 0) ? "#999" : "#777";

      this.bgCtx.fillStyle = fill;
      this.bgCtx.fillRect(x, y, this.BG_TILE_SIZE, this.BG_TILE_SIZE);
    }
  }
};

DrawSurface.prototype.initTiles = function () {
  var NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
  this.grid = [];

  for (var x = 0; x < NUM_PIXELS_HORIZ; x++) {
    this.grid[x] = [];

    for (var y = 0; y < NUM_PIXELS_VERT; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
};


DrawSurface.prototype.mouseMoved = function (ev) {
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var NUM_PIXELS = this.grid.length;

  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x * this.TILE_SIZE;
    var fillY = currentPixel.y * this.TILE_SIZE;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
    currentPixel.highlighted = true;
  }

  this.clearHighlight(null, currentPixel);

  if (this.isMouseDown) {
    this.paintPixel(ev);
  }
};

DrawSurface.prototype.clearHighlight = function (ev, currentPixel) {
  var NUM_PIXELS_HORIZ = this.WIDTH / this.TILE_SIZE;
  var NUM_PIXELS_VERT = this.HEIGHT / this.TILE_SIZE;
  for (var ix = 0; ix < NUM_PIXELS_HORIZ; ix++) {
    for (var iy = 0; iy < NUM_PIXELS_VERT; iy++) {
      var pixel = this.grid[ix][iy];
      if (pixel === currentPixel) {
        continue;
      }

      if (pixel.highlighted) {
        var clrX = pixel.x * this.TILE_SIZE;
        var clrY = pixel.y * this.TILE_SIZE;

        this.overlayCtx.clearRect(clrX, clrY, this.TILE_SIZE, this.TILE_SIZE);
        pixel.highlighted = false;
      }
    }
  }
};

DrawSurface.prototype.paintPixel = function(ev) {
  this.isMouseDown = true;
  var coords = this.getTileCoordinates(ev);
  var x = coords.x;
  var y = coords.y;

  var color = "#000000";
  var pixel = this.grid[x][y];

  var fillX = x * this.TILE_SIZE;
  var fillY = y * this.TILE_SIZE;
  this.drawCtx.fillStyle = color;
  this.drawCtx.fillRect(fillX, fillY, this.TILE_SIZE, this.TILE_SIZE);
  pixel.color = color;
};

DrawSurface.prototype.setMouseUp = function () {
  this.isMouseDown = false;
};

exports = module.exports = DrawSurface;
