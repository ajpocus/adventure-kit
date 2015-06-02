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
  SET_ACTIVE_TOOL: null,
  SET_DRAW_CANVASES: null,
  UPDATE_DRAW_CANVASES: null,
  SET_DRAW_GRID: null,
  SET_TILE_SIZE: null,
  SET_MOUSE_DOWN: null,
  SET_MOUSE_UP: null
});

export default DrawConstants;
