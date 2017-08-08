import React from 'react';
import PropTypes from 'prop-types';

class ContextMenu extends React.Component {
  componentDidMount() {
    document.body.addEventListener('click', this.close);
  }

  render() {
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
  }

  close() {
    let container = document.getElementById('context-menu-container');
    React.unmountComponentAtNode(container);
    document.body.removeEventListener('click', this.close);
  }
};

ContextMenu.propTypes = {
  options: PropTypes.array.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
  ev: PropTypes.object.isRequired
}

export default ContextMenu;
