let React = require('react');

class Modal extends React.Component {
  getDefaultProps() {
    isOpen: false
  }

  render() {
    let modalStyle = {};
    if (!this.props.isOpen) {
      modalStyle.display = 'none';
    }

    return (
      <div className="modal" style={modalStyle}>
        {this.props.children}
      </div>
    );
  }
};

export default Modal;
