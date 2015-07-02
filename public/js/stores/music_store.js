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

    this.trackCount = 5;
    this.trackStates = [];

    let defaultTrackState = {
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      activeTool: 'Stop',
      isSelectingTrack: false,
      isTrackSelected: false,
      selectedNote: null,
      selectionStart: null,
      selectionEnd: null,
      startBound: null,
      endBound: null,
      marker: 0
    };
    let lastIdx = this.trackCount - 1;
    for (let i = 0; i < this.trackCount; i++) {
      this.trackStates.push(defaultTrackState);
      this.tracks.push([]);
    }

    this.scratchTrack = [];
    this.scratchTrackState = defaultTrackState;

    this.isMouseDown = false;

    this.notesPlaying = {};
    this.oscillators = {};
    this.octaveShift = 2;
    this.recording = [];
    this.recordingIndices = {};

    this.bindListeners({
      setActiveInstrument: MusicActions.SET_ACTIVE_INSTRUMENT,
      newInstrument: MusicActions.NEW_INSTRUMENT,
      updateInstrument: MusicActions.UPDATE_INSTRUMENT,
      closeEditInstrument: MusicActions.CLOSE_EDIT_INSTRUMENT,
      playTrack: MusicActions.PLAY_TRACK,
      pauseTrack: MusicActions.PAUSE_TRACK,
      setIsMouseDown: MusicActions.SET_IS_MOUSE_DOWN,
      setVolume: MusicActions.SET_VOLUME,
      updateRecording: MusicActions.UPDATE_RECORDING,
      updateNotes: MusicActions.UPDATE_NOTES
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

  playTrack(trackNumber) {
    let trackState = this.trackStates[trackNumber];
    trackState.isRecording = false;
    trackState.isPlaying = true;
    trackState.isPaused = false;
    trackState.isStopped = false;
    trackState.activeTool = 'Play';

    this.trackStates[trackNumber] = trackState;
  }

  pauseTrack(trackNumber) {
    let trackState = this.trackStates[trackNumber];
    trackState.isRecording = false;
    trackState.isPlaying = false;
    trackState.isPaused = true;
    trackState.isStopped = false;
    trackState.activeTool = 'Pause';
    trackState.endBound = Number(new Date());

    this.trackStates[trackNumber] = trackState;
  }

  setIsMouseDown(bool) {
    this.isMouseDown = bool;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  updateRecording(data) {
    let { recording, recordingIndices } = data;
    this.recording = recording;
    this.recordingIndices = recordingIndices;
    this.scratchTrack = recording;
  }

  updateNotes(notes) {
    this.notesPlaying = notes;
  }
}

export default alt.createStore(MusicStore, 'MusicStore');
