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
}

export default alt.createActions(DrawActions);
