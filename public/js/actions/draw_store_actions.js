import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';

let DrawStoreActions = {
  loadState: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.LOAD_STATE,
      data: data
    });
  },

  zoomIn: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.ZOOM_IN,
      data: data
    });
  },

  zoomOut: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.ZOOM_OUT,
      data: data
    });
  },

  setActiveTool: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.SET_ACTIVE_TOOL,
      data: data
    });
  },

  setPrimaryColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.SET_PRIMARY_COLOR,
      data: data
    });
  },

  setSecondaryColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.SET_SECONDARY_COLOR,
      data: data
    });
  },

  newPalette: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.NEW_PALETTE,
      data: data
    });
  },

  editPalette: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.EDIT_PALETTE,
      data: data
    });
  }
};

export default DrawStoreActions;
