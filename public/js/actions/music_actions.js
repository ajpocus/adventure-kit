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

  setVolume(volume) {
    this.dispatch(volume);
  }

  updateRecording(data) {
    this.dispatch(data);
  }

  updateOscillators(oscillators) {
    this.dispatch(oscillators);
  }

  updateNotes(notes) {
    this.dispatch(notes);
  }
}

export default alt.createActions(MusicActions);
