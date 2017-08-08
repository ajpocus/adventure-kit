let React = require('react');

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

class DrawToolList extends React.Component {
  render() {
    return (
      <div className="draw-tools">
        <ToolList tools={this.props.tools}
                  activeTool={this.props.activeTool}
                  onSetActiveTool={this.onSetActiveTool}/>
      </div>
    );
  }

  onSetActiveTool(tool) {
    DrawActions.setActiveTool(tool);
  }
};

export default DrawToolList;
