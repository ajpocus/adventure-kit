let React = require('react');

import Transparency from '../mixins/transparency';

let EditPalette = React.createClass({
  getInitialState: function () {
    return {
      name: this.props.name,
      palette: this.props.palette
    };
  },

  render: function () {
    let colorList = [];
    for (let i = 0; i < this.state.palette.length; i++) {
      let color = this.state.palette[i];
      let swatchStyle = { background: color };
      if (color === 'rgba(0, 0, 0, 0)') {
        swatchStyle.background = Transparency.background;
      }

      colorList.push(
        <li className="color">
          <span className="remove" onClick={this.removeColor.bind(this, color)}>
            x
          </span>
          <div className="swatch" style={swatchStyle}></div>
        </li>
      );
    }

    return (
      <div className="edit-palette modal">
        <div className="modal-background">
          <div className="modal-content">
            <h3>Edit Palette</h3>
            <span className="close-modal" onClick={this.closeEdit}>x</span>

            <span className="palette-name">{this.props.name}</span>

            <ul className="colors">
              {colorList}
            </ul>

            <button className="cancel btn">Cancel</button>
            <button className="save btn">Save</button>
          </div>
        </div>
      </div>
    );
  },

  removeColor: function (color) {
    let idx = this.state.palette.indexOf(color);
    // Can't just splice and save the result, because it'll be the removed color
    let updatedPalette = this.state.palette;
    updatedPalette.splice(idx, 1);
    this.setState({ palette: updatedPalette });
  },

  closeEdit: function () {
    React.unmountComponentAtNode(document.getElementById('modal-container'));
  }
});

export default EditPalette;
