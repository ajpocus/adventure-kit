import TileSurface from './tile_surface';

class RenderSurface extends TileSurface {
  constructor (container, params) {
    super(container, params);

    params || (params = {});
    this.container = container;
    if (!this.container) {
      throw new Exception("DrawSurface requires a container parameter.");
    }

    this.width = params.width || 512;
    this.height = params.height || 512;
  }
};

export default RenderSurface;
