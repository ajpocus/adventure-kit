let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawConstants from '../constants/draw_constants';

let _state = {
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  width: 512,
  height: 512,
  tileSize: 32,
  palettes: {
    'Rainbow': [
      '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082',
      '#8b00ff'
    ]
  },
  activePalette: 'Rainbow',
  isEditingPalette: false
};

function loadState(data) {
  _state = data.state;
}

let DrawStore = assign(EventEmitter.prototype, {
  getState: function () {
    return _state;
  },

  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let action = payload.action;

    switch (action.actionType) {
      case DrawConstants.LOAD_STATE:
        loadState(action.data);
        break;

      case DrawConstants.SET_PRIMARY_COLOR:
        _state.primaryColor = action.data;
        break;

      case DrawConstants.SET_SECONDARY_COLOR:
        _state.secondaryColor = action.data;
        break;

      case DrawConstants.NEW_PALETTE:
        let name = action.data;
        _state.palettes[name] = [];
        _state.activePalette = name;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();
    return true;
  })
});

export default DrawStore;
