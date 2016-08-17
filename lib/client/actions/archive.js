export const actionTypes = {
  GET: 'GET',
  SET_PERIOD: 'SET_PERIOD',
  SWITCH_MODE: 'SWITCH_MODE',
  CLEAR: 'CLEAR'
};

export function get () {
  return dispatch => {
    dispatch({
      type: actionTypes.GET
    });
  }
}


export function setPeriod (period, cameraId) {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PERIOD,
      period,
      cameraId
    });
  }
}

export function switchMode () {
  return dispatch => {
    dispatch({
      type: actionTypes.SWITCH_MODE
    });
  }
}
export function clear (cameraId) {
  return dispatch => {
    dispatch({
      type: actionTypes.CLEAR,
      cameraId
    });
  }
}

export const actions = {
  get,
  setPeriod,
  switchMode,
  clear
};
