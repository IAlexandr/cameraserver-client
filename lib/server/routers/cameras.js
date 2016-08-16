import { Router } from 'express';
import dg from 'debug';
import superagent from 'superagent';
import request from 'request';
const debug = dg('cam-cameras-router');
import options from './../../../options';

const router = Router();

router.get('/', function (req, res) {
  superagent.get(options.CS_API + '/cameras')
    .accept('application/json')
    .end((err, response) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json(response.body);
    });
});

router.get('/:cameraId/mpd', function (req, res) {
  const _id = req.params.cameraId;
  const query = req.query;
  superagent.get(options.CS_API + '/mpds/' + _id + '/mpd')
    .accept('application/json')
    .query(query)
    .type('xml')
    .end((err, response) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(response.text);
    });
});

router.get('/:cameraId/:fileName', function (req, res) {
  const _id = req.params.cameraId;
  const fileName = req.params.fileName;
  request.get(options.CS_API + '/mpds/' + _id + '/' + fileName)
    .pipe(res);
});

export default {
  route: 'cameras',
  router
};
