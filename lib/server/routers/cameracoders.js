import { Router } from 'express';
import dg from 'debug';
import superagent from 'superagent';
const debug = dg('cam-cameracoders-router');
import options from './../../../options';

const router = Router();

router.get('/', function (req, res) {
  superagent.get(options.CS_API + '/cameracoders')
    .accept('application/json')
    .end((err, response) => {
      if (err) {
        return res.status(500).send(err);
      }
      let result = response.body;
      if (Object.prototype.toString.call(result) === '[object Array]') {
        result = result.map((doc) => {
          return {
            cameraId: doc.cameraId,
            startedAt: doc.startedAt,
            stoppedAt: doc.stoppedAt,
            isWorking: doc.isWorking,
          };
        });
      }
      return res.json(result);
    });
});

export default {
  route: 'cameracoders',
  router
};
