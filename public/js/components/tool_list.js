let React = require('react');

let ToolList = React.createClass({
  propTypes: {
    tools: React.PropTypes.array.isRequired,
    onSetActiveTool: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      activeTool: this.props.activeTool
    };
  },

  render: function () {
    let toolList = [];
    for (let i = 0; i < this.props.tools.length; i++) {
      let tool = this.props.tools[i];
      let className = "btn";
      if (tool.name === this.state.activeTool || tool.active) {
        className += " active";
      }

      toolList.push(
        <li className="tool" key={tool.name} title={tool.name}>
          <button className={className}
                  onClick={this.setActiveTool.bind(this, tool.name)}>
            <div className="img-container">
              <img className="icon" src={tool.imgUrl}/>
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
  },

  setActiveTool: function (name) {
    this.setState({ activeTool: name });

    if (this.props.onSetActiveTool) {
      this.props.onSetActiveTool(name);
    }
  },
});

export default ToolList;
