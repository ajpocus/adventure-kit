let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let React = require('react');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';
import EditPalette from '../components/edit_palette';

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
  activePalette: 'Rainbow',
  editPalette: []
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
      case DrawStoreConstants.LOAD_DRAW:
        loadDraw(action.data);
        break;

      case DrawStoreConstants.SET_ACTIVE_TOOL:
        _draw.activeTool = action.data;
        break;

      case DrawStoreConstants.SET_PRIMARY_COLOR:
        _draw.primaryColor = action.data;
        break;

      case DrawStoreConstants.SET_SECONDARY_COLOR:
        _draw.secondaryColor = action.data;
        break;

      case DrawStoreConstants.SET_PALETTE_COLOR:
        _draw.paletteColor = action.data;
        break;

      case DrawStoreConstants.REMOVE_PALETTE_COLOR:
        let palette = _draw.editPalette;
        let idx = palette.indexOf(action.data);
        palette.splice(idx, 1);
        _draw.editPalette = palette;
        break;

      case DrawStoreConstants.ADD_PALETTE_COLOR:
        let palette = _draw.editPalette;
        let newColor = '#ffffff';
        palette.push(newColor);
        _draw.editPalette = palette;
        _draw.activePaletteColor = newColor;
        break;

      case DrawStoreConstants.UPDATE_PALETTE_COLOR:
        let palette = _draw.editPalette;
        let idx = palette.indexOf(_draw.activePaletteColor);
        let updatedColor = action.data;
        palette[idx] = updatedColor;
        _draw.activePaletteColor = updatedColor;
        _draw.editPalette = palette;
        break;

      case DrawStoreConstants.NEW_PALETTE:
        let paletteName = action.data;
        _draw.palettes[paletteName] = {};
        _draw.activePalette = paletteName;
        break;

      case DrawStoreConstants.SET_ACTIVE_PALETTE_COLOR:
        let color = action.data;
        _draw.activePaletteColor = color;
        break;

      case DrawStoreConstants.EDIT_PALETTE:
        _draw.isEditingPalette = true;
        break;

      case DrawStoreConstants.SAVE_PALETTE:
        _draw.palettes[_draw.activePalette] = _draw.editPalette;
        break;

      case DrawStoreConstants.CLOSE_EDIT:
        _draw.isEditingPalette = false;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  })
});

export default DrawStore;
