let React = require('react');

import DrawCanvas from './draw_canvas';
import ColorPicker from './color_picker';

let Draw = React.createClass({
  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <ColorPicker/>
        <DrawCanvas/>
      </div>
    );
  }
});

export default Draw;
