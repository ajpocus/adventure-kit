let React = require('react');

import DrawStore from '../stores/draw_store';
import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import DrawSurface from './draw_surface';
import SpriteManager from './sprite_manager';

let DrawCtrl = React.createClass({
  getInitialState: function () {
    return DrawStore.getState();
  },

  componentDidMount: function () {
    DrawStore.listen(this.onChange);
  },

  componentWillUnmount: function () {
    DrawStore.unlisten(this.onChange);
  },

  onChange: function (state) {
    this.setState(state);
  },

  render: function () {
    let actualWidth = this.state.totalWidth * this.state.zoom;
    let actualHeight = this.state.totalHeight * this.state.zoom;
    let tileWidth = actualWidth / this.state.width;
    let tileHeight = actualHeight / this.state.height;

    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList activeTool={this.state.activeTool}/>
          <PaletteManager palette={this.state.palette}
                          primaryColor={this.state.primaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     activeTool={this.state.activeTool}
                     width={this.state.width}
                     height={this.state.height}
                     zoom={this.state.zoom}
                     totalWidth={this.state.totalWidth}
                     totalHeight={this.state.totalHeight}
                     actualWidth={this.state.actualWidth}
                     actualHeight={this.state.actualHeight}
                     tileWidth={this.state.tileWidth}
                     tileHeight={this.state.tileHeight}
                     isMouseDown={this.state.isMouseDown}
                     grid={this.state.grid}/>

        <SpriteManager sprites={this.state.sprites}
                       activeSprite={this.state.activeSprite}/>
      </div>
    );
  }
});

export default DrawCtrl;
