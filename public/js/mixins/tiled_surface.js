import Pixel from '../models/pixel';

let TiledSurface = {
  getDefaultProps: function () {
    return {
      width: 512,
      height: 512,
      tileSize: 32
    };
  },

  getInitialState: function () {
    return {
      grid: this.initTiles()
    };
  },

  initTiles: function () {
    let numTilesH = this.props.width / this.props.tileSize;
    let numTilesV = this.props.height / this.props.tileSize;
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

    let tileX = Math.floor(x / this.props.tileSize);
    let tileY = Math.floor(y / this.props.tileSize);

    return { x: tileX, y: tileY };
  },

  componentDidMount: function () {
    this.initTiles();
  }
};

export default TiledSurface;
