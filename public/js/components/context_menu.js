let React = require('react');

let ContextMenu = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    onOptionSelected: React.PropTypes.func.isRequired,
    ev: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    document.body.addEventListener('click', this.close);
  },

  render: function () {
    let ev = this.props.ev;
    let menuStyle = {
      top: ev.pageY + 1,
      left: ev.pageX + 1
    };
    let self = this;

    let options = this.props.options;
    let optionViews = [];
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      optionViews.push(
        <li className="option"
            key={option}
            onClick={this.props.onOptionSelected(option)}>
          {option}
        </li>
      );
    }

    return (
      <div className="context-menu"
           style={menuStyle}>
        <ul className="options">
          {optionViews}
        </ul>
      </div>
    );
  },

  close: function () {
    let container = document.getElementById('context-menu-container');
    React.unmountComponentAtNode(container);
    document.body.removeEventListener('click', this.close);
  }
});

export default ContextMenu;
