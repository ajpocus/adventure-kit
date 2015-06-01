import AppDispatcher from '../dispatcher/app_dispatcher';
import DrawConstants from '../constants/draw_constants';

let DrawActions = {
  loadState: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.LOAD_STATE,
      data: data
    });
  },

  setPrimaryColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.SET_PRIMARY_COLOR,
      data: data
    });
  },

  setSecondaryColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.SET_SECONDARY_COLOR,
      data: data
    });
  },

  newPalette: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.NEW_PALETTE,
      data: data
    });
  },

  editPalette: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.EDIT_PALETTE,
      data: data
    });
  },

  addPaletteColor: function (data) {
    AppDispatcher.handleAction({
      actionType: DrawConstants.ADD_PALETTE_COLOR,
      data: data
    });
  },
};

export default DrawActions;
