let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let React = require('react');

import AppDispatcher from '../dispatcher/app_dispatcher';
import ModalStoreConstants from '../constants/modal_store_constants';

let _modal = {};

function loadModal(data) {
  _modal = data.modal;
}

let ModalStore = assign(EventEmitter.prototype, {
  getModal: function () {
    return _modal;
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
      case DrawStoreConstants.LOAD_MODAL:
        loadModal(action.data);
        break;

      case DrawStoreConstants.CREATE_VIEW:
        _modal.view = action.data.view;
        _modal.viewProps = action.data.props;
        break;

      default:
        return true;
    }

    ModalStore.emitChange();

    return true;
  })
});

export default ModalStore;
