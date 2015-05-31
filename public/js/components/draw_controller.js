let React = require('react');

import DrawStore from '../stores/draw_store';
import DrawToolList from './draw_tool_list';
import PaletteManager from './palette_manager';
import ColorPicker from './color_picker';
import DrawSurface from './draw_surface';
import ManageDrawList from './manage_draw_list';

function getAppState() {
  return DrawStore.getDraw();
}

let DrawController = React.createClass({
  getInitialState: function () {
    return getAppState();
  },

  componentDidMount: function () {
    DrawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    DrawStore.removeChangeListener(this._onChange);
  },

  render: function () {
    console.log(this.state);
    return (
      <div id="draw">
        <div className="toolbar">
          <DrawToolList/>
          <PaletteManager palettes={this.state.palettes}
                          activePalette={this.state.activePalette}/>
          <ColorPicker primaryColor={this.state.primaryColor}
                       secondaryColor={this.state.secondaryColor}
                       onPrimaryColorChange={this.setPrimaryColor}
                       onSecondaryColorChange={this.setSecondaryColor}/>
        </div>

        <DrawSurface primaryColor={this.state.primaryColor}
                     primaryColorAlpha={this.state.primaryColorAlpha}
                     secondaryColor={this.state.secondaryColor}
                     secondaryColorAlpha={this.state.secondaryColorAlpha}/>

        <div className="manage-surface">
          <ManageDrawList/>
        </div>
      </div>
    );
  },

  _onChange: function () {
    this.setState(getAppState());
  },

  setPrimaryColor: function (color) {
    this.setState({
      primaryColor: color
    });
  },

  setSecondaryColor: function (color) {
    this.setState({
      secondaryColor: color
    });
  }
});

export default DrawController;
