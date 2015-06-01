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
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      width: 512,
      height: 512
    };
  },

  render: function () {
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
                     height={this.state.height}/>

        <div className="manage-surface">
          <ManageDrawList onResizeClick={this.onResizeClick}
                          handleResize={this.handleResize}/>
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
    React.render(<ResizePrompt onClick={this.handleResize}/>,
                 document.getElementById('modal-container'));
  },

  handleResize: function (width, height) {
    this.setState({ width: width, height: height });
  }
});

export default Draw;
