let React = require('react');
let tinycolor = require('tinycolor2');
let $ = require('jquery');

import DrawActions from '../actions/draw_actions';
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

        <button className="new-palette" onClick={this.createPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="activePalette" className="palette-chooser"
                value={this.props.activePalette}>
          {paletteOptions}
        </select>

        <button className="edit-palette btn" onClick={this.editPalette}>
          <img className="icon" src="/img/icons/glyphicons-31-pencil.png"/>
        </button>

        <ul className="palette">
          {paletteColors}
        </ul>

        <Modal isOpen={this.props.isEditingPalette}>
          <EditPalette paletteCopy={this.props.paletteCopy}
                       name={this.props.activePalette}
                       activeColor={this.props.activeColor}/>
        </Modal>
      </div>
    );
  },

  setPrimaryColor: function (color) {
    DrawActions.setPrimaryColor(color);
  },

  createPalette: function () {
    let paletteName = prompt("New palette name");
    if (paletteName.length === 0) {
      return;
    }

    if (this.props.palettes[paletteName]) {
      alert("That palette name is already taken.");
    }

    DrawActions.createPalette(paletteName);
  },

  editPalette: function () {
    DrawActions.editPalette();
  },

  closeEditPalette: function () {
    DrawActions.closeEditPalette();
  }
});

export default PaletteManager;
