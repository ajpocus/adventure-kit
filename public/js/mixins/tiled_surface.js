import Pixel from '../models/pixel';

let TiledSurface = {
  getInitialState: function () {
    return {
      width: 512,
      height: 512,
      tileSize: 32,
      grid: this.initTiles()
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      this.updateTiles();
    }
  },

  initTiles: function () {
    let numTilesH = this.state.width / this.state.tileSize;
    let numTilesV = this.state.height / this.state.tileSize;
    let grid = [];

    for (let x = 0; x < numTilesH; x++) {
      grid[x] = [];

      for (let y = 0; y < numTilesV; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    return grid;
  },

  updateTiles: function () {
    let numTilesH = this.state.width / this.state.tileSize;
    let numTilesV = this.state.height / this.state.tileSize;
    let oldGrid = this.state.grid;
    let newGrid = [];

    for (let x = 0; x < numTilesH; x++) {
      newGrid[x] = [];
      for (let y = 0; y < numTilesV; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    this.setState({ grid: newGrid });
  },

  getTileCoordinates: function (ev) {
    let elRect = ev.target.getBoundingClientRect();
    let absX = ev.clientX;
    let absY = ev.clientY;
    let x = absX - elRect.left;
    let y = absY - elRect.top;

    let tileX = Math.floor(x / this.state.tileSize);
    let tileY = Math.floor(y / this.state.tileSize);

    return { x: tileX, y: tileY };
  },

  componentDidMount: function () {
    this.initTiles();
  }
};

export default TiledSurface;
