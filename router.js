const express = require('express');
// const moment = require('moment');
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

  const startDate = new Date(parseInt(query.startDate));
  const endDate = new Date(parseInt(query.endDate));

  if (query.startDate && query.endDate) {
    var q0 = `"createdAt" <= '${endDate.toISOString()}' AND "stoppedAt" IS NULL AND "cameraId" = ${cameraId}`;
    var q1 = `"createdAt" <= '${endDate.toISOString()}' AND "createdAt" >= '${startDate.toISOString()}' AND "cameraId" = ${cameraId}`;
    var q2 = `"stoppedAt" <= '${endDate.toISOString()}' AND "stoppedAt" >= '${startDate.toISOString()}' AND "cameraId" = ${cameraId}`;
    var q = `SELECT * FROM sessions WHERE (${q0}) OR (${q1}) OR (${q2})`

    connections.db.query(q, {model:connections.db.Session})
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
                $lte: endDate
              }
            }
          }
        }).then((segments) => {
          // no-video code
          connections.db.Session.findOne({
            where: {
              sessionGuid: 'no-video'
            }
          }).then((noVideoSession) => {
            connections.db.Segment.findAll({
              order: '"chunkNumber" ASC',
              where: {
                sessionGuid: 'no-video'
              }
            }).then((noVideoSegments) => {
              if (records.length) {
                res.set('Content-Type', 'text/xml');
                return res.send(getArchiveMpd({
                  sessions: records,
                  segments,
                  noVideoSession,
                  noVideoSegments,
                  startDate,
                  endDate
                }));
              } else {
                return res.sendStatus(404);
              }
            });
          });
        }).catch(function (err) {
          console.log(err);
          return res.sendStatus(500);
        });
      })
      .catch(function (err) {
        console.log(err);
        return res.sendStatus(500);
      });
  } else {
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
        return res.sendStatus(500);
      });
  }
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
