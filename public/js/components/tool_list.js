let React = require('react');
import PropTypes from 'prop-types';

class ToolList extends React.Component {
  render() {
    let toolList = [];
    for (let i = 0; i < this.props.tools.length; i++) {
      let tool = this.props.tools[i];
      let className = "btn";
      if (tool.name === this.props.activeTool || tool.active) {
        className += " active";
      }

      toolList.push(
        <li className="tool" key={tool.name} title={tool.name}>
          <button className={className}
                  onClick={this.setActiveTool.bind(this, tool.name)}>
            <div className="img-container">
              <img className="pixel icon" src={tool.imgUrl}/>
            </div>
          </button>
        </li>
      );
    }

    return (
      <div className="tools">
        <ul className="tool-list">
          {toolList}
        </ul>
      </div>
    );
  }

  setActiveTool(tool) {
    this.props.onSetActiveTool(tool);
  }
};

ToolList.propTypes = {
  tools: PropTypes.array.isRequired,
  activeTool: PropTypes.string,
  onSetActiveTool: PropTypes.func.isRequired
}
export default ToolList;
