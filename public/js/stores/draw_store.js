let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawConstants from '../constants/draw_store_constants';

let _draw = {
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  activeTool: 'Pencil',
  palettes: {
    'Rainbow': [
      '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082',
      '#8f00ff'
    ]
  },
  activePalette: 'Rainbow'
};

function loadDraw(data) {
  _draw = data.draw;
}

let DrawStore = assign(EventEmitter.prototype, {
  getDraw: function () {
    return _draw;
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
      case DrawConstants.LOAD_DRAW:
        loadDraw(action.data);
        break;

      case DrawConstants.SET_ACTIVE_TOOL:
        _draw.activeTool = action.data;
        break;

      case DrawConstants.SET_PRIMARY_COLOR:
        _draw.primaryColor = action.data;
        break;

      case DrawConstants.SET_SECONDARY_COLOR:
        _draw.secondaryColor = action.data;
        break;

      case DrawConstants.SET_PALETTE_COLOR:
        _draw.paletteColor = action.data;
        break;

      case DrawConstants.REMOVE_PALETTE_COLOR:
        let palette = _draw.palettes[_draw.activePalette];
        let idx = palette.indexOf(action.data);
        palette.splice(idx, 1);
        _draw.palettes[_draw.activePalette] = palette;
        break;

      case DrawConstants.ADD_PALETTE_COLOR:
        let palette = _draw.palettes[_draw.activePalette];
        let newColor = '#ffffff';
        palette.push(newColor);
        _draw.palettes[_draw.activePalette] = palette;
        _draw.activeColor = newColor;
        break;

      case DrawConstants.UPDATE_PALETTE_COLOR:
        let palette = _draw.palettes[_draw.activePalette];
        let idx = palette.indexOf(_draw.activeColor);
        let updatedColor = action.data;
        palette[idx] = updatedColor;
        _draw.activeColor = updatedColor;
        _draw.palettes[_draw.activePalette] = palette;
        break;

      case DrawConstants.NEW_PALETTE:
        let paletteName = action.data;
        _draw.palettes[paletteName] = {};
        _draw.activePalette = paletteName;
        break;

      case DrawConstants.SET_ACTIVE_COLOR:
        let color = action.data;
        _draw.activeColor = color;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  })
});

export default DrawStore;
