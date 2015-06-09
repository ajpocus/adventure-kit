let Dispatcher = require('flux').Dispatcher;

let AppDispatcher = new Dispatcher();

AppDispatcher.handleAction = function (action) {
  this.dispatch({
    source: 'ACTION',
    action: action
  });
};

export default AppDispatcher;
