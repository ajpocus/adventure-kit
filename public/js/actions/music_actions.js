import {
  SET_ACTIVE_INSTRUMENT,
  NEW_INSTRUMENT,
  UPDATE_INSTRUMENT,
  CLOSE_EDIT_INSTRUMENT,
  PLAY_TRACK,
  PAUSE_TRACK,
  SET_IS_MOUSE_DOWN,
  SET_VOLUME,
  UPDATE_RECORDING
} from './actionTypes';

export function setActiveInstrument(index) {
  return {
    type: SET_ACTIVE_INSTRUMENT,
    index
  };
};

export function newInstrument() {
  return {
    type: NEW_INSTRUMENT
  };
};

export function updateInstrument(instrument) {
  return {
    type: UPDATE_INSTRUMENT,
    instrument
  };
};

export function closeEditInstrument() {
  return {
    type: CLOSE_EDIT_INSTRUMENT
  };
};

export function playTrack(trackNumber) {
  return {
    type: PLAY_TRACK,
    trackNumber
  };
};

export function pauseTrack(trackNumber) {
  return {
    type: PAUSE_TRACK,
    trackNumber
  };
};

export function setIsMouseDown(isMouseDown) {
  return {
    type: SET_IS_MOUSE_DOWN,
    isMouseDown
  };
};

export function setVolume(volume) {
  return {
    type: SET_VOLUME,
    volume
  };
};

export function updateRecording(recording) {
  return {
    type: UPDATE_RECORDING,
    recording
  };
};
