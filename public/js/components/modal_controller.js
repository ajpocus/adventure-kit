let React = require('react');

import ModalStore from '../store/modal_store';

function getAppState() {
  return ModalStore.getModal();
}

let ModalController = React.createClass({
  getInitialState: function () {
    return getAppState();
  },

  componentDidMount: function () {
    ModalStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ModalStore.removeChangeListener(this._onChange);
  },

  render: function () {
    let view = React.createElement(this.state.view, this.state.viewProps);
    <div id="modal-container">
      {view}
    </div>
  },

  _onChange: function () {
    this.setState(getAppState());
  },
});

export default ModalController;
