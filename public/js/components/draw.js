let React = require('react');

import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';
import ManageDrawList from './manage_draw_list';

let Draw = React.createClass({
  getInitialState: function () {
    return {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      palettes: {
        'Rainbow': [
          '#ff0000', '#ffaa00', '#ffff00', '#00ff00', '#0000ff', '#7900ff',
          '#ff00ff'
        ]
      },
      activePalette: 'Rainbow'
    };
  },

  render: function () {
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager palettes={this.state.palettes}
                          activePalette={this.state.activePalette}
                          onPrimaryColorChange={this.onPrimaryColorChange}
                          onSecondaryColorChange={this.onSecondaryColorChange}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.onPrimaryColorChange}
                       onSecondaryColorChange={this.onSecondaryColorChange}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}/>

        <div className="manage-surface">
          <ManageDrawList/>
        </div>
      </div>
    );
  },

  onPrimaryColorChange: function (color) {
    this.setState({ primaryColor: color });
  },

  onSecondaryColorChange: function (color) {
    this.setState({ secondaryColor: color });
  }
});

export default Draw;
