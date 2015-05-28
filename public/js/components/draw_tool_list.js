let React = require('react');

import DrawTool from './draw_tool';

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
      activeToolName: 'Pencil'
    }
  },

  render: function () {
    let toolList = [];
    for (let i = 0; i < this.props.tools.length; i++) {
      let tool = this.props.tools[i];

      toolList.push(
        <DrawTool name={tool.name}
                  imgUrl={tool.imgUrl}
                  active={tool.name === this.state.activeToolName}
                  onClick={this.setActive}/>
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

  setActive: function (name) {
    console.log(name);
    this.setState({ activeToolName: name });
  }
});

export default DrawToolList;
