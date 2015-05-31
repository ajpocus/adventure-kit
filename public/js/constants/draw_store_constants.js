let keyMirror = require('react/lib/keyMirror');

let DrawStoreConstants = keyMirror({
  LOAD_DRAW: null,
  SET_ACTIVE_TOOL: null,
  SET_PRIMARY_COLOR: null,
  SET_SECONDARY_COLOR: null,
  SET_PALETTE_COLOR: null,
  REMOVE_PALETTE_COLOR: null,
  ADD_PALETTE_COLOR: null,
  UPDATE_PALETTE_COLOR: null,
  NEW_PALETTE: null,
  EDIT_PALETTE: null,
  SAVE_PALETTE: null,
  CLOSE_EDIT: null
});

export default DrawStoreConstants;
