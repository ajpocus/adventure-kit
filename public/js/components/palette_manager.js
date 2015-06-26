let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import EditPalette from './edit_palette';
import Transparency from '../mixins/transparency';
import Modal from './modal';

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: {
        'Rainbow': [
          '#ff0000', '#ffaa00', '#ffff00', '#00ff00', '#0000ff', '#7900ff',
          '#770099'
        ]
      },
      activePalette: 'Rainbow',
      isEditingPalette: false
    };
  },

  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.state.palettes) {
      if (this.state.palettes.hasOwnProperty(paletteName)) {
        paletteOptions.push(
          <option value={paletteName} key={paletteName}>{paletteName}</option>
        );
      }
    }

    let activePalette = this.state.palettes[this.state.activePalette];
    let paletteColors = [];
    for (let i = 0; i < activePalette.length; i++) {
      let color = activePalette[i];

      // When transparent, use a checkerboard pattern.
      let liStyle = { background: color };
      if (color === "rgba(0, 0, 0, 0)") {
        liStyle.background = Transparency.background;
      }

      paletteColors.push(
        <li className="color" style={liStyle} key={i}
            onClick={this.setPrimaryColor.bind(this, color)}></li>
      );
    }

    let paletteCopy = activePalette.slice();

    return (
      <div className="palette-manager">
        <h2>Palette</h2>

        <button className="new-palette" onClick={this.newPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="activePalette" className="palette-chooser"
                value={this.state.activePalette}>
          {paletteOptions}
        </select>

        <button className="edit-palette btn" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>

        <Modal isOpen={this.state.isEditingPalette}>
          <EditPalette palette={paletteCopy}
                       name={this.state.activePalette}
                       onPaletteChange={this.onPaletteChange}
                       closeEditPalette={this.closeEditPalette}/>
        </Modal>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    this.props.onPrimaryColorChange(color);
  },

  newPalette: function () {
    let paletteName = prompt("New palette name");
    if (paletteName.length === 0) {
      return;
    }

    if (this.state.palettes[paletteName]) {
      alert("That palette name is already taken.");
    }

    let palettes = this.state.palettes;
    palettes[paletteName] = {};
    this.setState({ palettes: palettes });
  },

  editPalette: function () {
    this.setState({ isEditingPalette: true });
  },

  onPaletteChange: function (palette) {
    let name = this.state.activePalette;
    let palettes = this.state.palettes;
    palettes[name] = palette;
    this.setState({
      palettes: palettes,
      isEditingPalette: false
    });
  },

  closeEditPalette: function () {
    this.setState({ isEditingPalette: false });
  }
});

export default PaletteManager;
