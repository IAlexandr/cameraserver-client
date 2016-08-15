import {monitorActionTypes} from '../actions';

const {
  GET_PLAYERS,
  ADD_PLAYER,
  REMOVE_PLAYER,
} = monitorActionTypes;

const initialState = {
  players: {}
};

function reposition (players) {
  const cameraIds = Object.keys(players);
  const cameraIdsSorted = cameraIds.sort((a, b) => {
    if (players[a].positionNumber < players[b].positionNumber) {
      return -1;
    }
    if (players[a].positionNumber > players[b].positionNumber) {
      return 1;
    }
    return 0;
  });
  cameraIdsSorted.forEach((cameraId, i) => {
    players[cameraId].positionNumber = i + 1;
  });
  return players;
}

export default function (state = initialState, action) {
  const { players } = state;
  switch (action.type) {
    case GET_PLAYERS:
      return state;

    case ADD_PLAYER:
      const { camera } = action;
      if (!players.hasOwnProperty(camera._id)) {
        players[camera._id] = camera;
        players[camera._id].positionNumber = Object.keys(players).length;
        return {
          ...state,
          ...{
            players
          }
        };
      }
      return state;

    case REMOVE_PLAYER:
      const { cameraId } = action;
      delete players[cameraId];
      return {
        ...state,
        ...{
          players: reposition(players)
        }
      };

    default:
      return state;
  }
}
