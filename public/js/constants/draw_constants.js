let keyMirror = require('react/lib/keyMirror');

let DrawConstants = keyMirror({
  LOAD_STATE: null,
  SET_PRIMARY_COLOR: null,
  SET_SECONDARY_COLOR: null,
  NEW_PALETTE: null,
  EDIT_PALETTE: null,
  ADD_PALETTE_COLOR: null,
  REMOVE_PALETTE_COLOR: null,
  UPDATE_PALETTE_COLOR: null,
  SET_ACTIVE_PALETTE_COLOR: null,
  SAVE_PALETTE: null,
  CLOSE_EDIT_PALETTE: null,
  SET_ACTIVE_TOOL: null
});

export default DrawConstants;
