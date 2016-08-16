export const actionTypes = {
  GET: 'GET',
  SET_PERIOD: 'SET_PERIOD',
  CLEAR: 'CLEAR'
};

export function get () {
  return dispatch => {
    dispatch({
      type: actionTypes.GET
    });
  }
}


export function setPeriod (period) {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_PERIOD,
      period
    });
  }
}

export function clear () {
  return dispatch => {
    dispatch({
      type: actionTypes.CLEAR
    });
  }
}

export const actions = {
  get,
  setPeriod,
  clear
};
