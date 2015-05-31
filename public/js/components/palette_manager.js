let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import EditPalette from './edit_palette';
import Transparency from '../mixins/transparency';
import Modal from './modal';

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: this.props.palettes,
      activePalette: this.props.activePalette
    };
  },

  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.state.palettes) {
      if (this.state.palettes.hasOwnProperty(paletteName)) {
        paletteOptions.push(
          <option value={paletteName}>{paletteName}</option>
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

    let paletteCopy = activePalette.splice(0);

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

        <button className="edit-palette" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>

        <Modal isOpen={this.props.isEditingPalette}>
          <EditPalette palette={paletteCopy}/>
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
    let name = this.state.activePalette;
    let palette = this.state.palettes[name].splice(0);

    React.render(<EditPalette palette={palette} name={name}
                  onPaletteChange={this.onPaletteChange}/>,
                 document.getElementById('modal-container'));
  },

  onPaletteChange: function (palette) {
    let name = this.state.activePalette;
    let palettes = this.state.palettes;
    palettes[name] = palette;
    this.setState({ palettes: palettes });
  }
});

export default PaletteManager;
