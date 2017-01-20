var Bletcd = require('bletcd');
var options = require('../../options');

const bletcd = new Bletcd({ url: options.ETCD });

function safeParse(obj, done) {
  let json;

  try {
    json = JSON.parse(obj);
  } catch (err) {
    return done(err);
  }

  done(null, json);
}

function getSettings(key, props = {}) {
  return new Promise((resolve, reject) => {
    bletcd.get(`/connections/${key}`, (err, response) => {
      if (err) {
        throw err;
      }

      if (response) {
        if (response.errorCode && response.errorCode === 100) {
          throw new Error(`Cant get ${options.ETCD}/connections/${key}`);
        }

        safeParse(response.node.value, (err, value) => {
          if (err) {
            throw new Error(`Cant get ${options.ETCD}/connections/${key}`);
          }

          const ret = {};

          ret[key] = value;

          return resolve(Object.assign(
            {},
            props,
            ret
          ));
        });
      } else {
        throw new Error(`Cant get ${options.ETCD}/connections/${key}`);
      }
    });
  });
}

module.exports = function (props = {}) {
  return getSettings('amqp', props)
    .then((data) => getSettings('db', data))
    .then((data) => getSettings('s3', data))
    .then((data) => Promise.resolve(data));
};
