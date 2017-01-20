var Sequelize = require('sequelize');
var models = require('./models');

function checkStorage(props) {
  return new Promise((resolve, reject) => {
    const {
      dbName,
      username,
      password,
      options
    } = props.db;

    const sequelize = new Sequelize(dbName, username, password, options);

    sequelize
      .authenticate()
      .then(() => {
        models(sequelize);
        props.connections.db = sequelize;
        return resolve(props);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

module.exports = checkStorage;
