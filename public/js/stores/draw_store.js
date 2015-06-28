let PIXI = require('pixi.js');

import alt from '../alt';
import DrawActions from '../actions/draw_actions';
import Pixel from '../models/pixel';

class DrawStore {
  constructor() {
    this.activeTool = 'Pencil'
    this.primaryColor = '#000000';
    this.secondaryColor = '#ffffff';
    this.palettes = {
      'Rainbow': [
        '#ff0000', '#ffaa00', '#ffff00', '#00ff00', '#0000ff', '#7900ff',
        '#770099'
      ]
    };
    this.activePalette = 'Rainbow';
    this.isEditingPalette = false;
    this.paletteCopy = this.palettes[this.activePalette].slice();
    this.activeColor = this.paletteCopy[0];

    this.width = 32;
    this.height = 32;
    this.zoom = 0.875;
    this.totalWidth = 1024;
    this.totalHeight = 1024;
    this.actualWidth = this.totalWidth * this.zoom;
    this.actualHeight = this.totalHeight * this.zoom;
    this.tileWidth = this.actualWidth / this.width;
    this.tileHeight = this.actualHeight / this.height;
    this.isMouseDown = false;
    this.title = 'Untitled';

    this.bindListeners({
      setActiveTool: DrawActions.SET_ACTIVE_TOOL,
      setPrimaryColor: DrawActions.SET_PRIMARY_COLOR,
      setSecondaryColor: DrawActions.SET_SECONDARY_COLOR,
      createPalette: DrawActions.CREATE_PALETTE,
      editPalette: DrawActions.EDIT_PALETTE,
      setActiveColor: DrawActions.SET_ACTIVE_COLOR,
      removeColor: DrawActions.REMOVE_COLOR,
      addColor: DrawActions.ADD_COLOR,
      updateColor: DrawActions.UPDATE_COLOR,
      updatePalette: DrawActions.UPDATE_PALETTE,
      closeEditPalette: DrawActions.CLOSE_EDIT_PALETTE,
      createGrid: DrawActions.CREATE_GRID,
      updateGrid: DrawActions.UPDATE_GRID,
      resizeGrid: DrawActions.RESIZE_GRID,
      setIsMouseDown: DrawActions.SET_IS_MOUSE_DOWN,
      updateZoom: DrawActions.UPDATE_ZOOM,
      updateTitle: DrawActions.UPDATE_TITLE,
      resizeSurface: DrawActions.RESIZE_SURFACE
    });
  }

  setActiveTool(tool) {
    this.activeTool = tool;
  }

  setPrimaryColor(color) {
    this.primaryColor = color;
  }

  setSecondaryColor(color) {
    this.secondaryColor = color;
  }

  createPalette(paletteName) {
    this.palettes[paletteName] = {};
  }

  editPalette() {
    this.isEditingPalette = true;
  }

  setActiveColor(color) {
    this.activeColor = color;
  }

  removeColor(color) {
    let palette = this.paletteCopy;
    let idx = palette.indexOf(color);
    palette.splice(idx, 1);
    this.paletteCopy = palette;
  }

  addColor() {
    this.paletteCopy.push('#ffffff');
  }

  updateColor(color) {
    let activeColor = this.activeColor;
    let palette = this.paletteCopy;
    let idx = palette.indexOf(this.state.activePaletteColor);
    palette[idx] = color;
    this.paletteCopy = palette;
    this.activeColor = color;
  }

  updatePalette() {
    this.palettes[this.activePalette] = this.paletteCopy;
  }

  closeEditPalette() {
    this.isEditingPalette = false;
  }

  createGrid() {
    let grid = [];

    for (let x = 0; x < this.width; x++) {
      grid[x] = [];

      for (let y = 0; y < this.height; y++) {
        grid[x].push(new Pixel(x, y));
      }
    }

    this.grid = grid;
  }

  updateGrid(grid) {
    this.grid = grid;
  }

  resizeGrid() {
    let oldGrid = this.props.grid;
    let newGrid = [];

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

    this.grid = newGrid;
  }

  setIsMouseDown(val) {
    this.isMouseDown = val;
  }

  updateZoom(zoom) {
    this.zoom = zoom;
    this.actualWidth = this.totalWidth * this.zoom;
    this.actualHeight = this.totalHeight * this.zoom;
    this.tileWidth = this.actualWidth / this.width;
    this.tileHeight = this.actualHeight / this.height;
  }

  updateTitle(title) {
    this.title = title;
  }

  resizeSurface(data) {
    let { width, height } = data;
    this.width = width;
    this.height = height;
    this.actualWidth = this.totalWidth * this.zoom;
    this.actualHeight = this.totalHeight * this.zoom;
    this.tileWidth = this.actualWidth / this.width;
    this.tileHeight = this.actualHeight / this.height;
  }
}

export default alt.createStore(DrawStore, 'DrawStore');
