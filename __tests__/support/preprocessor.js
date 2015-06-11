var ReactTools = require('react-tools');

exports = module.exports = {
  process: function (src) {
    return ReactTools.transform(src);
  }
};
