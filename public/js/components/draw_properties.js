import React from 'react';

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

class ManageToolList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 16
    };
  }

  render() {
    return (
      <div className="manage-draw">
        <div className="resize">
          <img src="/img/iconic/resize-both.png"
               className="pixel icon"/>
          <input ref="size"
                 className="size"
                 type="range"
                 min="16"
                 max="64"
                 step="16"
                 value={this.state.size}
                 onChange={this.handleResize}/>
          <div className="size-labels">
            <div className="size-label">16</div>
            <div className="size-label">32</div>
            <div className="size-label">48</div>
            <div className="size-label">64</div>
          </div>
        </div>
      </div>
    );
  }

  handleResize(ev) {
    var sizeInput = this.refs.size.getDOMNode();
    let size = sizeInput.value;
    
    this.props.dispatch({
      type: 'RESIZE_GRID',
      width: size,
      height: size
    });
    this.setState({ size });
  }
};

export default ManageToolList;
