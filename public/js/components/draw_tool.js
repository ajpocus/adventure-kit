let React = require('react');

let DrawTool = React.createClass({
  render: function () {
    let className = "btn";
    if (this.props.active) {
      className += " active";
    }

    return (
      <li className="tool">
        <button className={className}
                onClick={this.handleClick}>
          <div className="img-container">
            <img className="icon" src={this.props.imgUrl}/>
          </div>
        </button>
      </li>
    );
  },

  handleClick: function () {
    this.props.onClick(this.props.name)
  }
});

export default DrawTool;
