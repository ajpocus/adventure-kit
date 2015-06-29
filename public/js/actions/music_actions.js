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

  closeEditInstrument() {
    this.dispatch();
  }
}

export default alt.createActions(MusicActions);
