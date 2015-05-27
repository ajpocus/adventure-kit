let assign = require('object-assign');

let _callbacks = [];
let _promises = [];

let Dispatcher = function () {};
Dispatcher.prototype = assign({}, Dispatcher.prototype, {
  register: function (callback) {
    _callbacks.push(callback);
    return _callbacks.length - 1; // index
  },

  dispatch: function (payload) {
    // First create array of promises for callbacks to reference.
    let resolves = [];
    let rejects = [];
    _promises = _callbacks.map(function (_, i) {
      return new Promise(function (resolve, reject) {
        resolves[i] = resolve;
        rejects[i] = reject;
      });
    });

    // Dispatch to callbacks and resolve/reject promises.
    _callbacks.forEach(function (callback, i) {
      // Callback can return an obj, to resolve, or a promise, to chain.
      // See waitFor() for why this might be useful.
      Promise.resolve(callback(payload)).then(function () {
        resolves[i](payload);
      }).catch(function (e) {
        rejects[i](new Error(e, 'Dispatcher callback unsuccessful'));
      });
    });

    _promises = [];
  }
});

export default Dispatcher;
