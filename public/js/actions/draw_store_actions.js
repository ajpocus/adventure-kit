import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawStoreConstants from '../constants/draw_store_constants';

let DrawStoreActions = {
  loadDraw: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.LOAD_DRAW,
      data: data
    })
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

  setPaletteColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.SET_PALETTE_COLOR,
      data: data
    });
  },

  removePaletteColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.REMOVE_PALETTE_COLOR,
      data: data
    });
  },

  addPaletteColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.ADD_PALETTE_COLOR,
      data: data
    });
  },

  updatePaletteColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.UPDATE_PALETTE_COLOR,
      data: data
    });
  },

  newPalette: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.NEW_PALETTE,
      data: data
    });
  },

  setActiveColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawStoreConstants.SET_ACTIVE_COLOR,
      data: data
    });
  }
};

export default DrawStoreActions;
