let React = require('react');

import DrawTools from './draw_tools';
import ColorPicker from './color_picker';
import DrawCanvas from './draw_canvas';

let Draw = React.createClass({
  render: function () {
    return (
      <div id="draw">
        <h1>Draw</h1>

        <DrawTools/>
        <ColorPicker/>
        <DrawCanvas/>
      </div>
    );
  }
});

export default Draw;
