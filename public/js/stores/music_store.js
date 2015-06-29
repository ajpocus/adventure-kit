import alt from '../alt';
import MusicActions from '../actions/music_actions';

class MusicStore {
  constructor() {
    this.instruments = [
      {
        name: '8-bit Synth',
        components: [
          {
            harmonic: 0,
            gain: 0.3,
            type: 'sawtooth',
            key: 0
          },
          {
            harmonic: 1,
            gain: 0.5,
            type: 'sine',
            key: 1
          },
          {
            harmonic: 2,
            gain: 0.2,
            type: 'square',
            key: 2
          }
        ]
      }
    ];
    this.activeInstrument = 0;
    this.isEditingInstrument = false;
    this.volume = 0.3;
    this.recording = [];
    this.tracks = [];
    this.isRecording = true;

    this.bindListeners({
      setActiveInstrument: MusicActions.SET_ACTIVE_INSTRUMENT,
      newInstrument: MusicActions.NEW_INSTRUMENT,
      updateInstrument: MusicActions.UPDATE_INSTRUMENT,
      closeEditInstrument: MusicActions.CLOSE_EDIT_INSTRUMENT
    });
  }

  setActiveInstrument(idx) {
    this.activeInstrument = idx;
  }

  newInstrument() {
    let instrument = {
      name: 'New Instrument',
      components: [
        {
          harmonic: 0,
          gain: 0.5,
          type: 'sawtooth',
          key: 0
        }
      ]
    };

    this.instruments.push(instrument);
    this.activeInstrument = this.instruments.length - 1;
    this.isEditingInstrument = true;
  }

  updateInstrument(instrument) {
    this.instruments[this.activeInstrument] = instrument;
  }

  closeEditInstrument() {
    this.isEditingInstrument = false;
  }
}

export default alt.createStore(MusicStore, 'MusicStore');
