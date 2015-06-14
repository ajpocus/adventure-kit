let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      width: 32,
      height: 32,
      totalWidth: 1024,
      totalHeight: 1024,
      zoom: 0.875,
      activeTool: 'Pencil'
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
          <DrawToolList activeTool={this.state.activeTool}
                        onSetActiveTool={this.onSetActiveTool}/>
          <PaletteManager onPrimaryColorChange={this.onPrimaryColorChange}
                          onSecondaryColorChange={this.onSecondaryColorChange}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.onPrimaryColorChange}
                       onSecondaryColorChange={this.onSecondaryColorChange}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     activeTool={this.state.activeTool}/>
      </div>
    );
  },

  onPrimaryColorChange: function (color) {
    this.setState({ primaryColor: color });
  },

  onSecondaryColorChange: function (color) {
    this.setState({ secondaryColor: color });
  },

  onSetActiveTool: function (name) {
    this.setState({ activeTool: name });
  }
});

export default Draw;
