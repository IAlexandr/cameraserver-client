import superagent from 'superagent';
import {actions as smessagesActions} from './smessages';

export const actionTypes = {
  LOAD_CAMERAS_COMPLETE: 'LOAD_CAMERAS_COMPLETE',
  LOAD_CAMERAS_FAILED: 'LOAD_CAMERAS_FAILED',
  LOAD_CAMERAS: 'LOAD_CAMERAS',

};

export function loadCamerasComplete (cameras) {
  return {
    type: actionTypes.LOAD_CAMERAS_COMPLETE,
    cameras
  };
}

export function loadCamerasFailed (err) {
  return {
    type: actionTypes.LOAD_CAMERAS_FAILED,
    err
  };
}

export function loadCameras (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_CAMERAS
    });

    superagent.get('/api/cameras')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadCamerasFailed(err));
          dispatch(smessagesActions.openMessage('Неудалось загрузить список камер.'));
        } else {
          setTimeout(() => {
            dispatch(loadCamerasComplete(res.body));
            dispatch(smessagesActions.openMessage('Список камер обновлен.'));
          }, 1000);
        }
      });
  };
}

export const actions = {
  loadCamerasComplete,
  loadCamerasFailed,
  loadCameras,

};