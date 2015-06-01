let React = require('react');

let Modal = React.createClass({
  render: function () {
    let modalStyle = {};
    if (!this.props.isOpen) {
      modalStyle.display = 'none';
    }

    return (
      <div className="modal" style={modalStyle}></div>
    );
  }
});

export default Modal;
