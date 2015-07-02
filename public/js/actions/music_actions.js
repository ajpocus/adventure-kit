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

  playTrack(trackNumber) {
    this.dispatch(trackNumber);
  }

  pauseTrack(trackNumber) {
    this.dispatch(trackNumber);
  }

  setIsMouseDown(bool) {
    this.dispatch(bool);
  }

  setVolume(volume) {
    this.dispatch(volume);
  }

  updateRecording(recording) {
    this.dispatch(recording);
  }
}

export default alt.createActions(MusicActions);
