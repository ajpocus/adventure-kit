let React = require('react');

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

let ManageToolList = React.createClass({
  getInitialState: function () {
    return {
      size: 16
    };
  },

  render: function () {
    return (
      <div className="manage-draw">
        <div className="resize">
          <img src="/img/iconic/resize-both.png"
               className="pixel icon"/>
          <input ref="size"
                 type="range"
                 min="16"
                 max="64"
                 step="16"
                 value={this.state.size}
                 onChange={this.handleResize}/>
        </div>
      </div>
    );
  },

  handleResize: function (ev) {
    var sizeInput = this.refs.size.getDOMNode();
    let size = sizeInput.value;
    DrawActions.resizeSurface({
      width: size,
      height: size
    });
    this.setState({ size });
  }
});

export default ManageToolList;
