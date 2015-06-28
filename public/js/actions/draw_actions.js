import alt from '../alt';

class DrawActions {
  setActiveTool(tool) {
    this.dispatch(tool);
  }

  setPrimaryColor(color) {
    this.dispatch(color);
  }

  setSecondaryColor(color) {
    this.dispatch(color);
  }

  createPalette(paletteName) {
    this.dispatch(paletteName);
  }

  editPalette() {
    this.dispatch();
  }

  setActiveColor(color) {
    this.dispatch(color);
  }

  removeColor(color) {
    this.dispatch(color);
  }

  addColor() {
    this.dispatch();
  }

  updateColor(color) {
    this.dispatch(color);
  }

  updatePalette() {
    this.dispatch();
  }

  closeEditPalette() {
    this.dispatch();
  }

  createGrid() {
    this.dispatch();
  }

  updateGrid(grid) {
    this.dispatch(grid);
  }

  resizeGrid() {
    this.dispatch();
  }

  setIsMouseDown(val) {
    this.dispatch(val);
  }

  updateZoom(zoom) {
    this.dispatch(zoom);
  }

  updateTitle(title) {
    this.dispatch(title);
  }

  resizeSurface(data) {
    this.dispatch(data);
  }
}

export default alt.createActions(DrawActions);
