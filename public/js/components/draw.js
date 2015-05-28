let React = require('react');

import DrawToolList from './draw_tool_list';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: 0xffffff,
      primaryColorAlpha: 1,
      secondaryColor: 0x000000,
      secondaryColorAlpha: 0
    }
  },

  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <DrawToolList/>
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
      primaryColor: parseInt(color.toHex(), 16),
      primaryColorAlpha: color.getAlpha()
    });
  },

  setSecondaryColor: function (color) {
    this.setState({
      secondaryColor: parseInt(color.toHex(), 16),
      secondaryColorAlpha: color.getAlpha()
    });
  }
});

export default Draw;
