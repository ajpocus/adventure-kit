let assign = require('object-assign');

import Dispatcher from './dispatcher';

let AppDispatcher = assign({}, Dispatcher.prototype, {
  handleViewAction: function (action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }
});

export default AppDispatcher;
