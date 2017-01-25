const express = require('express');
const moment = require('moment');
const options = require('./options');
const getConnections = require('./lib/server/getConnections');
const generateManifest = require('./lib/server/generateManifest');
const getArchiveMpd = require('./lib/server/get-archive-mpd');
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

router.get('/archive/:cameraId/manifest.mpd', (req, res) => {
  const cameraId = req.params.cameraId;
  const query = req.query;

  const startDate = new Date(parseInt(query.dt));
  const endDate = moment(startDate);
  endDate.set('hour', 23);
  endDate.set('minute', 59);
  endDate.set('second', 59);
  endDate.set('millisecond', 0);

  connections.db.Session.findAll({
    where: {
      $and: {
        createdAt: {
          $gte: startDate
        },
        createdAt: {
          $lte: endDate.utc().format()
        },
        cameraId: cameraId
      }
    }
  })
    .then((records) => {
      const guids = records.map((item) => {
        return item.sessionGuid;
      });
      connections.db.Segment.findAll({
        order: '"chunkNumber" ASC',
        where: {
          sessionGuid: {
            $in: guids
          },
          $and: {
            createdAt: {
              $gte: startDate
            },
            createdAt: {
              $lte: endDate.utc().format()
            }
          }
        }
      }).then((segments) => {
        if (records.length) {
          res.set('Content-Type', 'text/xml');
          return res.send(getArchiveMpd(records, segments));
        } else {
          return res.sendStatus(404);
        }
      }).catch(function (err) {
        res.sendStatus(500);
      });
    })
    .catch(function (err) {
      res.sendStatus(500);
    });
});

router.get('/archive/:cameraId/:key', (req, res) => {
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