let PIXI = require('pixi.js');

import alt from '../alt';
import DrawActions from '../actions/draw_actions';
import Pixel from '../models/pixel';

class DrawStore {
  constructor() {
    this.activeTool = 'Pencil'
    this.primaryColor = '#000000';
    this.secondaryColor = '#ffffff';
    this.palette = [
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
    ];

    this.width = 16;
    this.height = 16;
    this.zoom = 1.0;
    this.totalWidth = 512;
    this.totalHeight = 512;
    this.actualWidth = this.totalWidth * this.zoom;
    this.actualHeight = this.totalHeight * this.zoom;
    this.tileWidth = this.actualWidth / this.width;
    this.tileHeight = this.actualHeight / this.height;
    this.isMouseDown = false;

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
    let oldGrid = this.grid;
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
