var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const Session = sequelize.define('session', {
    startedAt: {
      type: Sequelize.DATE
    },
    stoppedAt: {
      type: Sequelize.DATE
    },
    mpdProps: {
      type: Sequelize.JSON
    },
    sessionGuid: {
      type: Sequelize.STRING
    },
    cameraId: {
      type: Sequelize.INTEGER
    }
  });

  const Segment = sequelize.define('segment', {
    duration: {
      type: Sequelize.INTEGER
    },
    chunkNumber: {
      type: Sequelize.STRING
    },
    sessionGuid: {
      type: Sequelize.STRING
    }
  });

  const Camera = sequelize.define('camera', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    geometry: {
      type: Sequelize.JSON
    },
    ptz: {
      type: Sequelize.BOOLEAN
    },
    turnedOn: {
      type: Sequelize.BOOLEAN
    },
    address: {
      type: Sequelize.CHAR
    },
    label: {
      type: Sequelize.CHAR
    },
    connectionOptions: {
      type: Sequelize.JSON
    },
    ping: {
      type: Sequelize.JSON
    },
    createdAt: {
      type: Sequelize.JSON
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    cameraModelId: {
      type: Sequelize.INTEGER
    },
    cameraGroupId: {
      type: Sequelize.INTEGER
    }
  });

  sequelize.Camera = Camera;
  sequelize.Session = Session;
  sequelize.Segment = Segment;
}
