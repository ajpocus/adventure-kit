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
  isEditingPalette: false,
  editPalette: null
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

      case DrawConstants.EDIT_PALETTE:
        _state.isEditingPalette = true;
        _state.editPalette = action.data;
        break;

      case DrawConstants.ADD_PALETTE_COLOR:
        let newColor = '#ffffff';
        _state.editPalette.push(newColor);
        _state.activePaletteColor = newColor;
        break;

      case DrawConstants.REMOVE_PALETTE_COLOR:
        let palette = _state.editPalette;
        let color = action.data;
        let idx = palette.indexOf(color);
        palette.splice(idx, 1);
        _state.editPalette = palette;
        break;

      case DrawConstants.UPDATE_PALETTE_COLOR:
        let color = action.data;
        let palette = _state.editPalette;
        let idx = palette.indexOf(_state.activePaletteColor);
        palette[idx] = color;
        _state.editPalette = palette;
        _state.activePaletteColor = color;
        break;

      case DrawConstants.SET_ACTIVE_PALETTE_COLOR:
        _state.activePaletteColor = action.data;
        break;

      case DrawConstants.SAVE_PALETTE:
        _state.palettes[_state.activePalette] = _state.editPalette;
        _state.activeColor = _state.palettes[_state.activePalette].first;
        break;

      case DrawConstants.CLOSE_EDIT_PALETTE:
        _state.isEditingPalette = false;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();
    return true;
  })
});

export default DrawStore;
