let React = require('react');

import DrawActions from '../actions/draw_actions';
import ToolList from './tool_list';

const DrawToolList = ({ tools, activeTool, onSetActiveTool }) => (
  <div className="draw-tools">
    <ToolList tools={tools}
              activeTool={activeTool}
              onSetActiveTool={onSetActiveTool}/>
  </div>
);

export default DrawToolList;
