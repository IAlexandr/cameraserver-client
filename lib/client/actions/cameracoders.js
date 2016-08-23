import superagent from 'superagent';
import {actions as smessagesActions} from './smessages';

export const actionTypes = {
  LOAD_CAMERACODERS_COMPLETE: 'LOAD_CAMERACODERS_COMPLETE',
  LOAD_CAMERACODERS_FAILED: 'LOAD_CAMERACODERS_FAILED',
  LOAD_CAMERACODERS: 'LOAD_CAMERACODERS',

};

export function loadCameracodersComplete (cameracoders) {
  return {
    type: actionTypes.LOAD_CAMERACODERS_COMPLETE,
    cameracoders
  };
}

export function loadCameracodersFailed (err) {
  return {
    type: actionTypes.LOAD_CAMERACODERS_FAILED,
    err
  };
}

export function loadCameracoders (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_CAMERACODERS
    });

    superagent.get('/api/cameracoders')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadCameracodersFailed(err));
          dispatch(smessagesActions.openMessage('Неудалось загрузить сведения по ведению архива.'));
        } else {
          setTimeout(() => {
            dispatch(loadCameracodersComplete(res.body));
            // dispatch(smessagesActions.openMessage('Список камер обновлен.'));
          }, 300);
        }
      });
  };
}

export const actions = {
  loadCameracodersComplete,
  loadCameracodersFailed,
  loadCameracoders,

};