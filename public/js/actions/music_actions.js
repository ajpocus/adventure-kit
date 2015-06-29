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

  recordTrack(trackNumber) {
    this.dispatch(trackNumber);
  }

  playTrack(trackNumber) {
    this.dispatch(trackNumber);
  }

  pauseTrack(trackNumber) {
    this.dispatch(trackNumber);
  }

  setIsMouseDown(bool) {
    this.dispatch(bool);
  }
}

export default alt.createActions(MusicActions);
