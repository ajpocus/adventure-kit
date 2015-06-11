let React = require('react');

let DrawToolList = React.createClass({
  getDefaultProps: function () {
    return {
      tools: [
        {
          name: 'Pencil',
          imgUrl: '/img/icons/glyphicons-31-pencil.png'
        },
        {
          name: 'Bucket',
          imgUrl: '/img/icons/glyphicons-481-bucket.png'
        },
        {
          name: 'Zoom In',
          imgUrl: '/img/icons/glyphicons-237-zoom-in.png'
        },
        {
          name: 'Zoom Out',
          imgUrl: '/img/icons/glyphicons-238-zoom-out.png'
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
      <div className="draw-tools">
        <ul className="tool-list">
          {toolList}
        </ul>
      </div>
    );
  },

  setActiveTool: function (name) {
    switch (name) {
      case 'Zoom In':
        break;

      case 'Zoom Out':
        break;

      default:
        this.setState({ activeTool: name });
    }
  },
});

export default DrawToolList;
