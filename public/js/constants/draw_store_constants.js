let keyMirror = require('react/lib/keyMirror');

let DrawStoreConstants = keyMirror({
  LOAD_STATE: null,
  ZOOM_IN: null,
  ZOOM_OUT: null,
  SET_ACTIVE_TOOL: null,
  SET_PRIMARY_COLOR: null,
  SET_SECONDARY_COLOR: null,
  NEW_PALETTE: null,
  EDIT_PALETTE: null
});

export default DrawStoreConstants;
