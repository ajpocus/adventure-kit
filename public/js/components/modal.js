let React = require('react');

let Modal = React.createClass({
  getDefaultProps: function () {
    isOpen: false
  },

  render: function () {
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
});

export default Modal;
