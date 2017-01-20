var config = require('config');
var uuid = require('uuid');

function reduceConfig() {
  const ret = {};

  Object.keys(config).forEach((key) => {
    ret[key] = process.env[key] || config.get(key);
  });

  return ret;
}

module.exports = reduceConfig();
