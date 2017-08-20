import React from 'react';
import { connect } from 'react-redux';

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import DrawSurface from './draw_surface';
import SpriteManager from './sprite_manager';

let DrawCtrl = (props) => {
  let actualWidth = props.totalWidth * props.zoom;
  let actualHeight = props.totalHeight * props.zoom;
  let tileWidth = actualWidth / props.width;
  let tileHeight = actualHeight / props.height;

  return (
    <div id="draw">
      <div className="toolbar">
        <DrawToolList tools={props.tools}
                      activeTool={props.activeTool}/>
        <PaletteManager palette={props.palette}
                        primaryColor={props.primaryColor}/>
      </div>

      <DrawSurface primaryColor={props.primaryColor}
                   activeTool={props.activeTool}
                   width={props.width}
                   height={props.height}
                   zoom={props.zoom}
                   totalWidth={props.totalWidth}
                   totalHeight={props.totalHeight}
                   actualWidth={props.actualWidth}
                   actualHeight={props.actualHeight}
                   tileWidth={props.tileWidth}
                   tileHeight={props.tileHeight}
                   isMouseDown={props.isMouseDown}
                   grid={props.grid}/>

      <SpriteManager sprites={props.sprites}
                     activeSprite={props.activeSprite}/>
    </div>
  );
};

DrawCtrl = connect()(DrawCtrl);

export default DrawCtrl;
