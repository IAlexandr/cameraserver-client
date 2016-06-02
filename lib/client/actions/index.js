import * as types from './types';
import superagent from 'superagent';

export function loadFramesComplete (frames) {
  return {
    type: types.LOAD_FRAMES_COMPLETE,
    frames
  };
}

export function loadFramesFailed (err) {
  return {
    type: types.LOAD_FRAMES_FAILED,
    err
  };
}

export function loadFrames (callback) {
  return dispatch => {
    dispatch({
      type: types.LOAD_FRAMES
    });

    superagent.get('http://localhost:4000/api/frames')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadFramesFailed(err));
        } else {
          dispatch(loadFramesComplete(JSON.parse(res.body)));
        }
      });
  };
}
