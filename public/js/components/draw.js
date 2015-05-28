let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: "#fff",
      secondaryColor: "rgba(0, 0, 0, 0)"
    }
  },

  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <DrawToolList/>
        <PaletteManager/>
        <ColorPicker onPrimaryColorChange={this.setPrimaryColor}
                     onSecondaryColorChange={this.setSecondaryColor}/>

        <DrawSurface primaryColor={this.state.primaryColor}
                     primaryColorAlpha={this.state.primaryColorAlpha}
                     secondaryColor={this.state.secondaryColor}
                     secondaryColorAlpha={this.state.secondaryColorAlpha}/>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    this.setState({
      primaryColor: color.toRgbString()
    });
  },

  setSecondaryColor: function (color) {
    this.setState({
      secondaryColor: color.toRgbString()
    });
  }
});

export default Draw;
