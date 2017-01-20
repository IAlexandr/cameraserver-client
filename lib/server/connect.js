var checkDb = require('./db');
var checkStorage = require('./store');

module.exports = function (props) {
  return checkDb(Object.assign({connections: {}}, props))
    .then((data) => checkStorage(data));
};
