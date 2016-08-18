import {archiveActions} from './index';

export const actionTypes = {
  GET_PLAYERS: 'GET_PLAYERS',
  ADD_PLAYER: 'ADD_PLAYER',
  REMOVE_PLAYER: 'REMOVE_PLAYER'
};

export function getPlayers () {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_PLAYERS
    });
  }
}


export function addPlayer (camera) {
  return dispatch => {
    dispatch({
      type: actionTypes.ADD_PLAYER,
      camera
    });
  }
}

export function removePlayer (cameraId) {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_PLAYER,
      cameraId
    });
    dispatch(archiveActions.clear(cameraId));
  }
}

export const actions = {
  getPlayers,
  addPlayer,
  removePlayer
};
