var TileSurface = require('./tile_surface');

var RenderSurface = function (container, params) {
  TileSurface.call(this, container, params);

  params || (params = {});
  this.container = container;
  if (!this.container) {
    throw new Exception("DrawSurface requires a container parameter.");
  }

  this.width = params.width || 512;
  this.height = params.height || 512;
};

RenderSurface.prototype.initBackgound = function () {
  this.ctx.fillStyle = "#aaaaaa";
  this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

RenderSurface.prototype = Object.create(TileSurface.prototype);
RenderSurface.prototype.constructor = TileSurface;


exports = module.exports = RenderSurface;
