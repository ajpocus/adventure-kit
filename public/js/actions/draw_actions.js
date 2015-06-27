import alt from '../alt';

class DrawActions {
  setActiveTool(tool) {
    this.dispatch(tool);
  }
}

export default alt.createActions(DrawActions);
