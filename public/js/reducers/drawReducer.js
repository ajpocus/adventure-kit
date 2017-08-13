import {
  SET_ACTIVE_TOOL,
  SET_PRIMARY_COLOR,
  CREATE_GRID,
  UPDATE_GRID,
  RESIZE_GRID,
  SET_IS_MOUSE_DOWN,
  UPDATE_ZOOM,
  RESIZE_SURFACE,
  SAVE_SPRITE,
  SET_ACTIVE_SPRITE
} from '../actions/actionTypes';

const WIDTH = 16;
const HEIGHT = 16;
const TOTAL_WIDTH = 512;
const TOTAL_HEIGHT = 512;
const ZOOM = 1.0;
const ACTUAL_WIDTH = TOTAL_WIDTH * ZOOM;
const ACTUAL_HEIGHT = TOTAL_HEIGHT * ZOOM;
const TILE_WIDTH = ACTUAL_WIDTH / WIDTH;
const TILE_HEIGHT = ACTUAL_HEIGHT / HEIGHT;

const defaultDrawState = {
	activeTool: 'Pencil',
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  palette: [
    '#7c7c7c', '#bcbcbc', '#fcfcfc', '#ffffff', '#0000fc', '#0078f8',
    '#3cbcfc', '#a4e4fc', '#0000bc', '#0058f8', '#6888fc', '#b8b8f8',
    '#4428bc', '#6844fc', '#9878f8', '#d8b8f8', '#940084', '#d800cc',
    '#f878f8', '#f8b8f8', '#a80020', '#e40058', '#f85898', '#f8a4c0',
    '#a81000', '#f83800', '#f87858', '#f0d0b0', '#881400', '#e45c10',
    '#fca044', '#fce0a8', '#503000', '#ac7c00', '#f8b800', '#f8d878',
    '#007800', '#00b800', '#b8f818', '#d8f878', '#006800', '#00a800',
    '#58d854', '#b8f8b8', '#005800', '#00a844', '#58f898', '#b8f8d8',
    '#004058', '#008888', '#00e8d8', '#00fcfc', '#000000', '#080808',
    '#7c7c7c', '#d8d8d8'
  ],

  width: WIDTH,
  height: HEIGHT,
  zoom: ZOOM,
  totalWidth: TOTAL_WIDTH,
  totalHeight: TOTAL_HEIGHT,
  actualWidth: ACTUAL_WIDTH,
  actualHeight: ACTUAL_HEIGHT,
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT,
  isMouseDown: false,
  sprites: [],
  activeSprite: 0
};

function drawReducer(state = defaultDrawState, action) {
  let newGrid, zoom, actualWidth, actualHeight, tileWidth, tileHeight;

	switch (action.type) {
	case SET_ACTIVE_TOOL:
		return {
			...state,
			activeTool: action.tool
	  };
	case SET_PRIMARY_COLOR:
		return {
			...state,
			primaryColor: action.color
		};
  case CREATE_GRID:
    let grid = [];

    for (let x = 0; x < this.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    return {
      ...state,
      grid
    };

  case UPDATE_GRID:
    return {
      ...state,
      grid: action.grid
    };

  case RESIZE_GRID:
    let oldGrid = this.grid;
    newGrid = [];

    for (let x = 0; x < this.width; x++) {
      newGrid[x] = [];
      for (let y = 0; y < this.height; y++) {
        if (x < oldGrid.length && y < oldGrid[x].length) {
          newGrid[x][y] = oldGrid[x][y];
        } else {
          newGrid[x].push(new Pixel(x, y));
        }
      }
    }

    return {
      ...state,
      grid: newGrid
    };

  case SET_IS_MOUSE_DOWN:
    return {
      ...state,
      isMouseDown: action.isMouseDown
    };

  case UPDATE_ZOOM:
    zoom = action.zoom;
    actualWidth = state.totalWidth * zoom;
    actualHeight = state.totalHeight * zoom;
    tileWidth = actualWidth / state.width;
    tileHeight = actualHeight / state.height;

    return {
      ...state,
      zoom,
      actualWidth,
      actualHeight,
      tileWidth,
      tileHeight
    };

  case RESIZE_SURFACE:
    let { width, height } = action;
    actualWidth = state.totalWidth * zoom;
    actualHeight = state.totalHeight * zoom;
    tileWidth = actualWidth / state.width;
    tileHeight = actualHeight / state.height;

    return {
      ...state,
      width,
      height,
      actualWidth,
      actualHeight,
      tileWidth,
      tileHeight
    };

  case SAVE_SPRITE:
    let newSprites = state.sprites;
    newSprites[state.activeSprite] = action.data;

    return {
      ...state,
      sprites: newSprites
    };

  case SET_ACTIVE_SPRITE:
    let activeSprite = action.data;
    let newGrid = state.sprites[activeSprite].grid;

    return {
      ...state,
      activeSprite,
      grid: newGrid
    };

  default:
    return state;
	}
}

export default drawReducer;
