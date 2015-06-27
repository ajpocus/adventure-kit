import alt from '../alt';
import DrawActions from '../actions/draw_actions';

class DrawStore {
  constructor() {
    this.activeTool = 'Pencil'
    this.primaryColor = '#000000';
    this.secondaryColor = '#ffffff';
    this.width = 32;
    this.height = 32;
    this.totalWidth = 1024;
    this.totalHeight = 1024;
    this.zoom = 0.875;

    this.bindListeners({
      setActiveTool: DrawActions.SET_ACTIVE_TOOL
    });
  }

  setActiveTool(tool) {
    this.activeTool = tool;
  }
}

export default alt.createStore(DrawStore, 'DrawStore');
