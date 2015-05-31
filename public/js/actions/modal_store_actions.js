import AppDispatcher from '../dispatcher/app_dispatcher';
import ModalStoreConstants from '../constants/modal_store_constants';

let ModalStoreActions = {
  loadModal: function (data) {
    AppDispatcher.handleAction({
      actionType: ModalStoreConstants.LOAD_MODAL,
      data: data
    })
  },

  createView: function (data) {
    AppDispatcher.handleAction({
      actionType: ModalStoreConstants.CREATE_VIEW,
      data: data
    });
  }
};

export default ModalStoreActions;
