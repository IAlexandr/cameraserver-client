import { Router } from 'express';
import dg from 'debug';
import superagent from 'superagent';
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

export default {
  route: 'cameras',
  router
};
