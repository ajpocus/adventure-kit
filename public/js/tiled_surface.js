import Pixel from './pixel';

let TiledSurface = {
  width: 512,
  height: 512,
  tileSize: 32,

  initTiles: function () {
    let numTilesH = this.width / this.tileSize;
    let numTilesV = this.height / this.tileSize;
    let grid = [];

    for (let x = 0; x < numTilesH; x++) {
      grid[x] = [];

      for (let y = 0; y < numTilesV; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    return grid;
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.tileSize);
    let tileY = Math.floor(y / this.tileSize);

    return { x: tileX, y: tileY };
  }
};

export default TiledSurface;
