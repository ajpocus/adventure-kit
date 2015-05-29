let React = require('react');
let tinycolor = require('tinycolor2');

let PaletteManager = React.createClass({
  getInitialState: function () {
    return {
      palettes: {
        "Rainbow": [
          "#ff0000", "#ff7f00", "#ffff00", "#00ff00",
          "#0000ff", "#4b0082", "#8f00ff", "rgba(0, 0, 0, 0)"
        ]
      },
      currentPalette: "Rainbow"
    };
  },

  render: function () {
    let paletteOptions = [];
    for (let paletteName in this.state.palettes) {
      if (this.state.palettes.hasOwnProperty(paletteName)) {
        let selected = "";
        if (paletteName === this.state.currentPalette) {
          selected = "selected";
        }

        paletteOptions.push(
          <option value={paletteName} selected={selected}>{paletteName}</option>
        );
      }
    }

    let currentPalette = this.state.palettes[this.state.currentPalette];
    let paletteColors = [];
    for (let i = 0; i < currentPalette.length; i++) {
      let color = currentPalette[i];

      // When transparent, use a checkerboard pattern.
      let liStyle = { background: color };
      if (color === "rgba(0, 0, 0, 0)") {
        liStyle.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==")';
      }

      paletteColors.push(
        <li className="color" style={liStyle}
            onClick={this.selectColor.bind(this, color)}></li>
      );
    }

    return (
      <div className="palette-manager">
        <h2>Palette</h2>

        <button className="new-palette" onClick={this.newPalette}>
          <img className="icon" src="/img/icons/glyphicons-433-plus.png"/>
        </button>

        <select name="currentPalette" className="palette-chooser">
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

  selectColor: function (color) {
    console.log(color);
    this.props.onColorChange(tinycolor(color));
  },

  newPalette: function () {
    let paletteName = prompt("New palette name");
    if (paletteName.length === 0) {
      return;
    }

    let newPalette = {};
    // Can't set in Object.assign because paletteName won't be eval'ed
    newPalette[paletteName] = {};
    let updatedPalettes = Object.assign(this.state.palettes, newPalette);
    
    this.setState({ palettes: updatedPalettes });
    this.setState({ currentPalette: paletteName });
  }
});

export default PaletteManager;
