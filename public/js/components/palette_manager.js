let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import DrawActions from '../actions/draw_actions';
import EditPalette from './edit_palette';
import Transparency from '../mixins/transparency';
import Modal from './modal';

let PaletteManager = React.createClass({
  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.props.palettes) {
      if (this.props.palettes.hasOwnProperty(paletteName)) {
        paletteOptions.push(
          <option value={paletteName} key={paletteName}>{paletteName}</option>
        );
      }
    }

    let activePalette = this.props.palettes[this.props.activePalette];
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

    return (
      <div className="palette-manager">
        <h2>Palette</h2>

        <button className="new-palette" onClick={this.newPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="activePalette" className="palette-chooser"
                value={this.props.activePalette}>
          {paletteOptions}
        </select>

        <button className="edit-palette" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>

        <EditPalette isOpen={this.props.isEditingPalette}
                     palette={this.props.editPalette}
                     activePaletteColor={this.props.activePaletteColor}/>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    DrawActions.setPrimaryColor(color);
  },

  newPalette: function () {
    let name = prompt("New palette name");
    if (name.length === 0) {
      return;
    }

    if (this.props.palettes[name]) {
      alert("That palette name is already taken.");
    }

    DrawActions.newPalette(name);
  },

  editPalette: function () {
    let name = this.props.activePalette;
    let palette = this.props.palettes[name].slice(0);
    DrawActions.editPalette(palette);
  }
});

export default PaletteManager;
