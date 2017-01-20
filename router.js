const express = require('express');
const options = require('./options');
const getConnections = require('./lib/server/getConnections');
const generateManifest = require('./lib/server/generateManifest');
const connect = require('./lib/server/connect');

var connections;

const router = new express.Router();

getConnections()
  .then((data) => connect(data))
  .then((props) => {
    connections = props.connections;
  })
  .catch((err) => {
  });

router.get('/streams', (req, res) => {
  connections.db.Camera.findAll({})
    .then((records) => {
      res.json(records);
    })
    .catch(function (err) {
      res.sendStatus(500);
    })
});

router.get('/streams/:cameraId/manifest.mpd', (req, res) => {
  const cameraId = req.params.cameraId;
  const query = req.query;

  connections.db.Session.findOne({
    where: {
      stoppedAt: null,
      cameraId
    }
  })
    .then((record) => {
      generateManifest(
        {
          connection: connections.db, sessionGuid: record.sessionGuid, query
        },
      (err, manifest) => {
        if (err) {
          return res.sendStatus(500);
        }

        res.set('Content-Type', 'text/xml');

        return res.send(manifest);
      });
    })
    .catch(function (err) {
      res.sendStatus(500);
    });
});

router.get('/streams/:cameraId/:key', (req, res) => {
  const key = req.params.key;

  connections.store.exists({ key }, (err, exist) => {
    if (err) {
      return res.status(500);
    }

    if (!exist) {
      return res.status(404);
    }

    const rs = connections.store.createReadStream({ key });

    rs.pipe(res);
  });
});

module.exports = router;
