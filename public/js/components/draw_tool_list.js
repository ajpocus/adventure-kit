let React = require('react');

let DrawToolList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: "Pencil",
          imgUrl: "/img/icons/glyphicons-31-pencil.png"
        },
        {
          name: "Bucket",
          imgUrl: "/img/icons/glyphicons-481-bucket.png"
        }
      ]
    }
  },

  getInitialState: function () {
    return {
      activeTool: 'Pencil'
    }
  },

  render: function () {
    let toolList = [];
    for (let i = 0; i < this.props.tools.length; i++) {
      let tool = this.props.tools[i];
      let className = "btn";
      if (tool.name === this.state.activeTool) {
        className += " active";
      }

      toolList.push(
        <li className="tool" key={tool.name}>
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
      <div className="draw-tools">
        <ul className="tool-list">
          {toolList}
        </ul>
      </div>
    );
  },

  setActiveTool: function (name) {
    this.setState({ activeTool: name });
  },
});

export default DrawToolList;
