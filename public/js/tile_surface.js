class TileSurface {
  constructor (container, params={}) {
    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
    this.tileSize = params.tileSize || 32;

    this.setupCanvas();
    this.drawBackground();
    this.initDrawSurface();
  }
}
