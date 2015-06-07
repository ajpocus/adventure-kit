let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';
import Pixel from '../models/pixel';

let _state = {
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  width: 32,
  height: 32,
  totalWidth: 1024,
  totalHeight: 1024,
  zoom: 0.875,
  totalWidth: 1024,
  totalHeight: 1024,
  bgTileSize: 8,
  minZoom: 0.125,
  maxZoom: 4,
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
    _state.actualWidth = _state.totalWidth * _state.zoom;
    _state.actualHeight = _state.totalHeight * _state.zoom;
    _state.tileWidth = _state.actualWidth / _state.width;
    _state.tileHeight = _state.actualHeight / _state.height;

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

      case DrawStoreConstants.SET_ACTIVE_PALETTE_COLOR:
        _state.activePaletteColor = action.data;
        break;

      case DrawStoreConstants.REMOVE_PALETTE_COLOR:
        let palette = _state.editPalette;
        let idx = palette.indexOf(action.data);
        palette.splice(idx, 1);
        _state.editPalette = palette;
        break;

      case DrawStoreConstants.ADD_PALETTE_COLOR:
        let newColor = '#ffffff';
        _state.editPalette.push(newColor);
        _state.activePaletteColor = newColor;
        break;

      case DrawStoreConstants.UPDATE_PALETTE_COLOR:
        let updatedColor = action.data;
        let palette = _state.editPalette;
        let idx = palette.indexOf(_state.activePaletteColor);

        palette[idx] = updatedColor;
        _state.editPalette = palette;
        _state.activePaletteColor = updatedColor;
        break;

      case DrawStoreConstants.SAVE_PALETTE:
        let name = _state.activePalette;
        let palettes = _state.palettes;
        palettes[name] = _state.editPalette;
        _state.palettes = palettes;
        break;

      case DrawStoreConstants.CLOSE_EDIT:
        _state.isEditingPalette = false;
        break;

      case DrawStoreConstants.SET_DRAW_CONTEXTS:
        let contexts = action.data;
        _state.bgCtx = contexts.bgCtx;
        _state.drawCtx = contexts.drawCtx;
        _state.overlayCtx = contexts.overlayCtx;

        let bgTileSize = _state.bgTileSize;
        _state.bgCtx.scale(bgTileSize, bgTileSize);

        let tileWidth = _state.tileWidth;
        let tileHeight = _state.tileHeight;
        _state.drawCtx.scale(tileWidth, tileHeight);
        _state.overlayCtx.scale(tileWidth, tileHeight);

        break;

      case DrawStoreConstants.INIT_GRID:
        let grid = [];

        for (let x = 0; x < _state.width; x++) {
          grid[x] = [];

          for (let y = 0; y < _state.height; y++) {
            grid[x].push(new Pixel(x, y));
          }
        }

        _state.grid = grid;
        break;

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  })
});

export default DrawStore;
