import {
  GET,
  SET_PERIOD,
  TOGGLE_PERIOD,
  SWITCH_MODE,
  CLEAR,
  LOAD_CAMERAS_COMPLETE,
  LOAD_CAMERAS_FAILED,
  LOAD_CAMERAS,
  GET_PLAYERS,
  ADD_PLAYER,
  REMOVE_PLAYER,
  OPEN_MESSAGE,
  CLOSE_MESSAGE
} from './actionTypes';

export function get() {
  return dispatch => {
    dispatch({
      type: GET
    });
  }
}

export function setPeriod({period, cameraId}) {
  return dispatch => {
    dispatch({
      type: SET_PERIOD,
      period,
      cameraId
    });
  }
}

export function togglePeriod({cameraId, isToggleOn}) {
  return dispatch => {
    dispatch({
      type: TOGGLE_PERIOD,
      cameraId,
      isToggleOn
    });
  }
}

export function switchMode() {
  return dispatch => {
    dispatch({
      type: SWITCH_MODE
    });
  }
}
export function clear(cameraId) {
  return dispatch => {
    dispatch({
      type: CLEAR,
      cameraId
    });
  }
}

export function loadCamerasComplete (cameras) {
  return {
    type: LOAD_CAMERAS_COMPLETE,
    cameras
  };
}

export function loadCamerasFailed (err) {
  return {
    type: LOAD_CAMERAS_FAILED,
    err
  };
}

export function loadCameras (callback) {
  return dispatch => {
    dispatch({
      type: LOAD_CAMERAS
    });

    superagent.get('/api/streams')
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
          }, 300);
        }
      });
  };
}
export function getPlayers () {
  return dispatch => {
    dispatch({
      type: GET_PLAYERS
    });
  }
}

export function addPlayer (camera) {
  return dispatch => {
    dispatch({
      type: ADD_PLAYER,
      camera
    });
  }
}

export function removePlayer (cameraId) {
  return dispatch => {
    dispatch({
      type: REMOVE_PLAYER,
      cameraId
    });
    dispatch(archiveActions.clear(cameraId));
  }
}
let timeoutHandler;

export function openMessage (message) {
  return dispatch => {
    dispatch({
      type: OPEN_MESSAGE,
      message
    });

    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }

    timeoutHandler = setTimeout(() => {
      dispatch(closeMessage());
    }, 5000);
  }
}

export function closeMessage () {
  return dispatch => {
    if (timeoutHandler) {
      clearTimeout(timeoutHandler);
    }

    dispatch({
      type: CLOSE_MESSAGE
    });
  }
}
