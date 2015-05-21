let Pixel = require('./pixel');

class DrawSurface {
  constructor (container, params={}) {
    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
    this.tileSize = params.tileSize || 32;
    this.bgTileSize = params.bgTileSize || 8;

    this.setupCanvas();
    this.drawBackground();
    this.initDrawSurface();

    this.container.addEventListener('mousemove', this.highlightPixel.bind(this),
                                    false);
    this.container.addEventListener('mouseout', this.clearHighlight.bind(this),
                                    false);
    this.container.addEventListener('mousedown', this.paintPixel.bind(this),
                                    false);
  }

  setupCanvas () {
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
  }

  drawBackground () {
    let numTilesHoriz = this.width / this.bgTileSize;
    let numTilesVert = this.height / this.bgTileSize;

    for (let i = 0; i < numTilesHoriz; i++) {
      for (let j = 0; j < numTilesVert; j++) {
        let x = i * this.bgTileSize;
        let y = j * this.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, this.bgTileSize, this.bgTileSize);
      }
    }
  }

  drawBackground () {
    let numTilesHoriz = this.width / this.bgTileSize;
    let numTilesVert = this.height / this.bgTileSize;

    for (let i = 0; i < numTilesHoriz; i++) {
      for (let j = 0; j < numTilesVert; j++) {
        let x = i * this.bgTileSize;
        let y = j * this.bgTileSize;

        let fill = ((i + j) % 2 == 0) ? "#999" : "#777";

        this.bgCtx.fillStyle = fill;
        this.bgCtx.fillRect(x, y, this.bgTileSize, this.bgTileSize);
      }
    }
  }

  initDrawSurface () {
    let numPixelsHoriz = this.width / this.tileSize;
    let numPixelsVert = this.height / this.tileSize;
    this.grid = [];

    for (let x = 0; x < numPixelsHoriz; x++) {
      this.grid[x] = [];

      for (let y = 0; y < numPixelsVert; y++) {
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

    let pixelX = Math.floor(x / this.tileSize);
    let pixelY = Math.floor(y / this.tileSize);

    return { x: pixelX, y: pixelY };
  }

  DrawSurface.prototype.highlightPixel = function (ev) {
    let { x, y } = this.getPixelCoordinates(ev);
    let numPixels = this.grid.length;

    let currentPixel = this.grid[x][y];
    if (!currentPixel.highlighted) {
      let fillX = currentPixel.x * this.tileSize;
      let fillY = currentPixel.y * this.tileSize;

      this.overlayCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.overlayCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
      currentPixel.highlighted = true;
    }

    this.clearHighlight(null, currentPixel);
  }

  clearHighlight (ev, currentPixel) {
    let numPixelsHoriz = this.width / this.tileSize;
    let numPixelsVert = this.height / this.tileSize;
    for (let ix = 0; ix < numPixelsHoriz; ix++) {
      for (let iy = 0; iy < numPixelsVert; iy++) {
        let pixel = this.grid[ix][iy];
        if (pixel === currentPixel) {
          continue;
        }

        if (pixel.highlighted) {
          let clrX = pixel.x * this.tileSize;
          let clrY = pixel.y * this.tileSize;

          this.overlayCtx.clearRect(clrX, clrY, this.tileSize, this.tileSize);
          pixel.highlighted = false;
        }
      }
    }
  }

  paintPixel (ev) {
    let coords = this.getPixelCoordinates(ev);
    let x = coords.x;
    let y = coords.y;
    let color = "#000000";
    let pixel = this.grid[x][y];

    let fillX = x * this.tileSize;
    let fillY = y * this.tileSize;
    this.drawCtx.fillStyle = color;
    this.drawCtx.fillRect(fillX, fillY, this.tileSize, this.tileSize);
    pixel.color = color;
  }
}

export default DrawSurface;
