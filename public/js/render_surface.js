var TileSurface = require('./tile_surface');

class RenderSurface extends TileSurface {
  constructor (container, params={}) {
    super(container, params);

    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
  }

  initBackgound () {
    this.ctx.fillStyle = "#aaaaaa";
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }
}

export default RenderSurface;
