let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';

let _state = {
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  width: 32,
  height: 32,
  totalWidth: 1024,
  totalHeight: 1024,
  zoom: 0.875,
  activeTool: 'Pencil',
  palettes: {
    'Rainbow': [
      '#ff0000', '#ffaa00', '#ffff00', '#00ff00', '#0000ff', '#7900ff',
      '#ff00ff'
    ]
  },
  activePalette: 'Rainbow'
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
      case DrawStoreConstants.LOAD_STATE:
        loadState(action.data);
        break;

      case DrawStoreConstants.ZOOM_IN:
        _state.zoom += 0.125;
        break;

      case DrawStoreConstants.ZOOM_OUT:
        _state.zoom -= 0.125;
        break;

      case DrawStoreConstants.SET_ACTIVE_TOOL:
        _state.activeTool = action.data;
        break;

      case DrawStoreConstants.SET_PRIMARY_COLOR:
        _state.primaryColor = action.data;
        break;

      case DrawStoreConstants.SET_SECONDARY_COLOR:
        _state.secondaryColor = action.data;
        break;

      case DrawStoreConstants.NEW_PALETTE:
        _state.palettes[paletteName] = {};
        break;

      case DrawStoreConstants.EDIT_PALETTE:
        _state.editPaletteName = _state.activePalette;
        _state.editPalette = _state.palettes[_state.editPaletteName].slice();
        _state.isEditingPalette = true;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  })
});

export default DrawStore;
