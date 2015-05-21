var Pixel = require('./pixel');

var DrawSurface = function (container, params) {
  params || (params = {});
  this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
    this.tileSize = params.tileSize || 32;
    this.bgTileSize = params.bgTileSize || 8;

    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.setAttribute('width', this.width);
    this.bgCanvas.setAttribute('height', this.height);
    this.container.appendChild(this.bgCanvas);

    this.drawCanvas = document.createElement('canvas');
    this.drawCanvas.setAttribute('width', this.width);
    this.drawCanvas.setAttribute('height', this.height);
    this.container.appendChild(this.drawCanvas);

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.setAttribute('width', this.width);
    this.overlayCanvas.setAttribute('height', this.height);
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

DrawSurface.prototype.drawBackground = function () {
  var numTilesHoriz = this.width / this.bgTileSize;
  var numTilesVert = this.height / this.bgTileSize;

  for (var i = 0; i < numTilesHoriz; i++) {
    for (var j = 0; j < numTilesVert; j++) {
      var x = i * this.bgTileSize;
      var y = j * this.bgTileSize;

      var fill = ((i + j) % 2 == 0) ? "#999" : "#777";

      this.bgCtx.fillStyle = fill;
      this.bgCtx.fillRect(x, y, this.bgTileSize, this.bgTileSize);
    }
  }
};

DrawSurface.prototype.initDrawSurface = function () {
  var numPixelsHoriz = this.width / this.tileSize;
  var numPixelsVert = this.height / this.tileSize;
  this.grid = [];

  for (var x = 0; x < numPixelsHoriz; x++) {
    this.grid[x] = [];

    for (var y = 0; y < numPixelsVert; y++) {
      this.grid[x].push(new Pixel(x, y));
    }
  }
}

DrawSurface.prototype.getPixelCoordinates = function (ev) {
  var elRect = ev.target.getBoundingClientRect();
  var absX = ev.clientX;
  var absY = ev.clientY;
  var x = absX - elRect.left;
  var y = absY - elRect.top;

  var pixelX = Math.floor(x / this.tileSize);
  var pixelY = Math.floor(y / this.tileSize);

  return { x: pixelX, y: pixelY };
}

DrawSurface.prototype.highlightPixel = function (ev) {
  var coords = this.getPixelCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var numPixels = this.grid.length;

  // highlight the pixel under the mouse
  var currentPixel = this.grid[x][y];
  if (!currentPixel.highlighted) {
    var fillX = currentPixel.x * this.tileSize;
    var fillY = currentPixel.y * this.tileSize;

    this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
    this.overlayCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
    currentPixel.highlighted = true;
  }

  // clear highlighting on other pixels
  var numPixelsHoriz = this.width / this.tileSize;
  var numPixelsVert = this.height / this.tileSize;
  for (var ix = 0; ix < numPixelsHoriz; ix++) {
    for (var iy = 0; iy < numPixelsVert; iy++) {
      var pixel = this.grid[ix][iy];
      if (pixel === currentPixel) {
        continue;
      }

      if (pixel.highlighted) {
        var clrX = pixel.x * this.tileSize;
        var clrY = pixel.y * this.tileSize;

        this.overlayCtx.clearRect(clrX, clrY, this.tileSize, this.tileSize);
        pixel.highlighted = false;
      }
    }
  }
};

DrawSurface.prototype.paintPixel = function (ev) {
  var coords = this.getPixelCoordinates(ev);
  var x = coords.x;
  var y = coords.y;
  var color = "#000000";
  var pixel = this.grid[x][y];

  var fillX = x * this.tileSize;
  var fillY = y * this.tileSize;
  this.drawCtx.fillStyle = color;
  this.drawCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
  pixel.color = color;
};

exports = module.exports = DrawSurface;
