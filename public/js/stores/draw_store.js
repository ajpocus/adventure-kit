let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawConstants from '../constants/draw_constants';

let width = 32;
let height = 32;
let zoom = 0.8;
let totalWidth = 1024;
let totalHeight = 1024;
let actualWidth = totalWidth * zoom;
let actualHeight = totalHeight * zoom;
let tileWidth = actualWidth / width;
let tileHeight = actualHeight / height;

let _state = {
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  palettes: {
    'Rainbow': [
      '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082',
      '#8b00ff'
    ]
  },
  activePalette: 'Rainbow',
  isEditingPalette: false,
  editPalette: null,
  activeTool: 'Pencil',
  isMouseDown: false,
  width: width,
  height: height,
  totalWidth: totalWidth,
  totalHeight: totalWidth,
  zoom: zoom,
  actualWidth: actualWidth,
  actualHeight: actualHeight,
  tileWidth: tileWidth,
  tileHeight: tileHeight
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

      case DrawConstants.SET_ACTIVE_TOOL:
        _state.activeTool = action.data;
        break;

      case DrawConstants.SET_DRAW_CANVASES:
        _state.canvases = action.data;
        break;

      case DrawConstants.UPDATE_DRAW_CANVASES:
        let newCanvases = action.data;

        for (let prop in newCanvases) {
          if (newCanvases.hasOwnProperty(prop)) {
            _state.canvases[prop] = newCanvases[prop];
          }
        }

        break;

      case DrawConstants.SET_DRAW_GRID:
        console.log(action.data);
        _state.drawGrid = action.data;
        break;

      case DrawConstants.SET_TILE_SIZE:
        _state.tileWidth = action.data.width;
        _state.tileHeight = action.data.height;
        break;

      case DrawConstants.SET_MOUSE_DOWN:
        _state.isMouseDown = true;
        break;

      case DrawConstants.SET_MOUSE_UP:
        _state.isMouseDown = false;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();
    return true;
  })
});

export default DrawStore;
