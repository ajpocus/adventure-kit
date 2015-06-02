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

let DrawController = React.createClass({
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
          <DrawToolList activeTool={this.state.activeTool}/>
          <PaletteManager palettes={this.state.palettes}
                          activePalette={this.state.activePalette}
                          editPalette={this.state.editPalette}
                          isEditingPalette={this.state.isEditingPalette}
                          activePaletteColor={this.state.activePaletteColor}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}/>
        </div>

        <DrawSurface canvases={this.state.canvases}
                     primaryColor={this.state.primaryColor}
                     secondaryColor={this.state.secondaryColor}
                     width={this.state.width}
                     height={this.state.height}
                     totalWidth={this.state.totalWidth}
                     totalHeight={this.state.totalHeight}
                     actualWidth={this.state.actualWidth}
                     actualHeight={this.state.actualHeight}
                     tileWidth={this.state.tileWidth}
                     tileHeight={this.state.tileHeight}
                     drawGrid={this.state.drawGrid}
                     isMouseDown={this.state.isMouseDown}/>

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

export default DrawController;
