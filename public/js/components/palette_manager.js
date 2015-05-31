let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import EditPalette from './edit_palette';
import Transparency from '../mixins/transparency';
import DrawStoreActions from '../actions/draw_store_actions';

let PaletteManager = React.createClass({
  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.props.palettes) {
      if (this.props.palettes.hasOwnProperty(paletteName)) {
        let selected = "";
        if (paletteName === this.props.activePalette) {
          selected = "selected";
        }

        paletteOptions.push(
          <option value={paletteName} selected={selected}>{paletteName}</option>
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
        <li className="color" style={liStyle}
            onClick={this.setPrimaryColor.bind(this, color)}></li>
      );
    }

    return (
      <div className="palette-manager">
        <h2>Palette</h2>

        <button className="new-palette" onClick={this.newPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="activePalette" className="palette-chooser">
          {paletteOptions}
        </select>

        <button className="edit-palette" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    DrawStoreActions.setPrimaryColor(color);
  },

  newPalette: function () {
    let paletteName = prompt("New palette name");
    if (paletteName.length === 0) {
      return;
    }

    DrawStoreActions.newPalette(paletteName);
  },

  editPalette: function () {
    let name = this.props.activePalette;
    let palette = this.props.palettes[name];

    React.render(<EditPalette palette={palette} name={name}/>,
                 document.getElementById('modal-container'));
  }
});

export default PaletteManager;
