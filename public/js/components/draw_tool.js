let React = require('react');

let DrawTool = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    imgUrl: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool,
    onSetActive: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    isActive: this.props.isActive
  },

  render: function () {
    let className = "btn";
    if (tool.name === this.state.activeTool) {
      className += " active";
    }

    return (
      <li className="tool" key={this.props.name}>
        <button className={className}
                onClick={this.setActive}>
          <div className="img-container">
            <img className="icon" src={this.props.imgUrl}/>
          </div>
        </button>
      </li>
    );
  }
});

export default DrawTool;
