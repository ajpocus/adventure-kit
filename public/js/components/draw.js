let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: "#000",
      secondaryColor: "rgba(0, 0, 0, 0)"
    }
  },

  render: function () {
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager onColorChange={this.setPrimaryColor}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.setPrimaryColor}
                       onSecondaryColorChange={this.setSecondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     primaryColorAlpha={this.state.primaryColorAlpha}
                     secondaryColor={this.state.secondaryColor}
                     secondaryColorAlpha={this.state.secondaryColorAlpha}/>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    this.setState({ primaryColor: color });
  },

  setSecondaryColor: function (color) {
    this.setState({ secondaryColor: color });
  }
});

export default Draw;
