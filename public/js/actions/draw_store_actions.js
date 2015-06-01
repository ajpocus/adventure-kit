import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';

let DrawStoreActions = {
  loadState: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.LOAD_STATE,
      data: data
    });
  }
};

export default DrawStoreActions;
