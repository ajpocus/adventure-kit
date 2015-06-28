import alt from '../alt';

class MusicActions {
  setActiveInstrument(idx) {
    this.dispatch(idx);
  }

  newInstrument() {
    this.dispatch();
  }

  updateInstrument(instrument) {
    this.dispatch(instrument);
  }
}

export default alt.createActions(MusicActions);
