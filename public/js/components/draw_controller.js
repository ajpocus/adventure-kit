let React = require('react');

import DrawStore from '../stores/draw_store';
import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';
import ManageDrawList from './manage_draw_list';
import ResizePrompt from './resize_prompt';

function getAppState() {
  return DrawStore.getState();
}

let Draw = React.createClass({
  getInitialState: function () {
    return getAppState();
  },

  componentDidMount: function () {
    DrawStore.addChangeListener(this._onchange);
  },

  componentWillUnmount: function () {
    DrawStore.removeChangeListener(this._onchange);
  },

  render: function () {
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager palettes={this.state.palettes}
                          activePalette={this.state.activePalette}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     width={this.state.width}
                     height={this.state.height}
                     tileSize={this.state.tileSize}/>

        <div className="manage-surface">
          <ManageDrawList onResizeClick={this.onResizeClick}/>
        </div>
      </div>
    );
  },

  _onchange: function () {
    this.setState(getAppState());
  }
});

export default Draw;
