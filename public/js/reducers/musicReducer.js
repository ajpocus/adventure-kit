import {
  SET_ACTIVE_INSTRUMENT,
  NEW_INSTRUMENT,
  UPDATE_INSTRUMENT,
  CLOSE_EDIT_INSTRUMENT,
  PLAY_TRACK,
  PAUSE_TRACK,
  SET_VOLUME,
  UPDATE_RECORDING 
} from '../actions/actionTypes';

let defaultMusicState = {
	instruments: [
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
  ],

  activeInstrument: 0,
  isEditingInstrument: false,
  volume: 0.3,
 	recording: [],
  tracks: [],
  isRecording: true,

  trackCount: 5,
  trackStates: [],
  scratchTrack: [],

  isMouseDown: false,
  notesPlaying: {},
  oscillators: {},
  octaveShift: 2,
  recording: [],
	recordingIndices: {}
}

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

let lastIdx = defaultMusicState.trackCount - 1;
for (let i = 0; i < defaultMusicState.trackCount; i++) {
  defaultMusicState.trackStates.push(defaultTrackState);
  defaultMusicState.tracks.push([]);
}
defaultMusicState.scratchTrackState = defaultTrackState

function musicReducer(state = {}, action) {
  let index, trackState, trackStates, instrument;

	switch (action.type) {
    case SET_ACTIVE_INSTRUMENT:
      return {
        ...state,
        activeInstrument: action.index
      };

    case NEW_INSTRUMENT:
      instrument = {
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

      instruments = state.instruments;
      instruments.push(instrument)

      return {
        ...state,
        instruments,
        activeInstrument: instruments.length - 1,
        isEditingInstrument: true
      };

    case UPDATE_INSTRUMENT:
      instruments = state.instruments;
      instruments[state.activeInstrument] = action.instrument;

      return {
        ...state,
        instruments
      };

      case CLOSE_EDIT_INSTRUMENT:
        return {
          ...state,
          isEditingInstrument: false
        };

      case PLAY_TRACK:
        index = action.trackNumber;
        trackState = state.trackStates(index)
        Object.assign(trackState, {
          isRecording: false,
          isPlaying: true,
          isPaused: false,
          isStopped: false,
          activeTool: 'Play'
        });

        trackStates = state.trackStates;
        trackStates[index] = trackState;

        return {
          ...state,
          trackStates
        };

      case PAUSE_TRACK:
        index = action.trackNumber;
        trackState = state.trackStates(index)
        Object.assign(trackState, {
          isRecording: false,
          isPlaying: false,
          isPaused: true,
          isStopped: false,
          activeTool: 'Pause'
        });

        trackStates = state.trackStates;
        trackStates[index] = trackState;

        return {
          ...state,
          trackStates
        };

      case SET_IS_MOUSE_DOWN:
        return {
          ...state,
          isMouseDown: action.isMouseDown
        };

      case SET_VOLUME:
        return {
          ...state,
          volume: action.volume
        };

      case UPDATE_RECORDING:
        const recording = action.recording;

        return {
          ...state,
          recording,
          scratchTrack: recording
        };

      default:
        return state;
  }
}

export default musicReducer;
