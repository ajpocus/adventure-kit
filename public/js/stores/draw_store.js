let PIXI = require('pixi.js');

import alt from '../alt';
import DrawActions from '../actions/draw_actions';

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

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.stage = new PIXI.Container();
    this.bgGfx = new PIXI.Graphics();
    this.drawGfx = new PIXI.Graphics();
    this.overlayGfx = new PIXI.Graphics();

    this.stage.addChild(this.bgGfx);
    this.stage.addChild(this.drawGfx);
    this.stage.addChild(this.overlayGfx);

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
      createGrid: DrawActions.CREATE_GRID
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
}

export default alt.createStore(DrawStore, 'DrawStore');
