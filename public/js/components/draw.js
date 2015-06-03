let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';
import ManageDrawList from './manage_draw_list';
import ResizePrompt from './resize_prompt';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: 0x000000,
      secondaryColor: 0xffffff,
      width: 32,
      height: 32,
      totalWidth: 1024,
      totalHeight: 1024,
      zoom: 0.8
    };
  },

  render: function () {
    let actualWidth = this.state.totalWidth * this.state.zoom;
    let actualHeight = this.state.totalHeight * this.state.zoom;
    let tileWidth = actualWidth / this.state.width;
    let tileHeight = actualHeight / this.state.height;

    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager onPrimaryColorChange={this.onPrimaryColorChange}
                          onSecondaryColorChange={this.onSecondaryColorChange}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.onPrimaryColorChange}
                       onSecondaryColorChange={this.onSecondaryColorChange}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     width={this.state.width}
                     height={this.state.height}
                     totalWidth={this.state.totalWidth}
                     totalHeight={this.state.totalHeight}
                     zoom={this.state.zoom}
                     actualWidth={actualWidth}
                     actualHeight={actualHeight}
                     tileWidth={tileWidth}
                     tileHeight={tileHeight}/>

        <div className="manage-surface">
          <ManageDrawList onResizeClick={this.onResizeClick}/>
        </div>
      </div>
    );
  },

  onPrimaryColorChange: function (color) {
    this.setState({ primaryColor: color });
  },

  onSecondaryColorChange: function (color) {
    this.setState({ secondaryColor: color });
  },

  onResizeClick: function () {
    React.render(<ResizePrompt width={this.state.width}
                               height={this.state.height}
                               handleResize={this.handleResize}/>,
                 document.getElementById('modal-container'));
  },

  handleResize: function (width, height) {
    this.setState({ width: width, height: height });
  }
});

export default Draw;
