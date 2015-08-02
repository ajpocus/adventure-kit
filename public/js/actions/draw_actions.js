import alt from '../alt';

class DrawActions {
  setActiveTool(tool) {
    this.dispatch(tool);
  }

  setPrimaryColor(color) {
    this.dispatch(color);
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

  resizeSurface(data) {
    this.dispatch(data);
  }

  saveSprite(data) {
    this.dispatch(data);
  }

  setActiveSprite(data) {
    this.dispatch(data);
  }
}

export default alt.createActions(DrawActions);
