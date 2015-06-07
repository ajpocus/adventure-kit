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
  activeTool: 'Pencil'
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

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  })
});

export default DrawStore;
