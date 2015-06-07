let EventEmitter = require('events').EventEmitter;
let merge = require('react/lib/merge');

import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawConstants from '../constants/draw_constants';

let _state = {};

function loadState(data) {
  _state = data;
}

let DrawStore = merge(EventEmitter.prototype, {
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

      default:
        return true;
    }

    DrawStore.emitChange();

    return true;
  }
});

export default DrawStore;
