import {
  SET_ACTIVE_TOOL,
  SET_PRIMARY_COLOR,
  CREATE_GRID,
  UPDATE_GRID,
  RESIZE_GRID,
  SET_IS_MOUSE_DOWN,
  UPDATE_ZOOM,
  RESIZE_SURFACE,
  SAVE_SPRITE,
  SET_ACTIVE_SPRITE
} from './actionTypes';

export function setActiveTool(tool) {
  return {
    type: SET_ACTIVE_TOOL,
    tool
  };
}

export function setPrimaryColor(color) {
  return {
    type: SET_PRIMARY_COLOR,
    color
  };
}

export function createGrid() {
  return {
    type: CREATE_GRID
  };
}

export function updateGrid(grid) {
  return {
    type: UPDATE_GRID,
    grid
  };
}

export function resizeGrid() {
  return {
    type: RESIZE_GRID
  }
}

export function setIsMouseDown(isMouseDown) {
  return {
    type: SET_IS_MOUSE_DOWN,
    isMouseDown
  }
}

export function updateZoom(zoom) {
  return {
    type: UPDATE_ZOOM,
    zoom
  };
}

export function resizeSurface(data) {
  return {
    type: RESIZE_SURFACE,
    data
  };
}

export function saveSprite(data) {
  return {
    type: SAVE_SPRITE,
    data
  };
}

export function setActiveSprite(data) {
  return {
    type: SET_ACTIVE_SPRITE,
    data
  };
}
