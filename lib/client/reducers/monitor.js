import {monitorActionTypes} from '../actions';

const {
  GET_PLAYERS,
  ADD_PLAYER,
  REMOVE_PLAYER,
} = monitorActionTypes;

const initialState = {
  players: {}
};

// function reposition (players) {
//   Object.keys(players).forEach((cameraId) => {
//
//   });
// }

export default function (state = initialState, action) {
  const { players } = state;
  switch (action.type) {
    case GET_PLAYERS:
      return state;

    case ADD_PLAYER:
      const { camera } = action;
      if (!players.hasOwnProperty(camera._id)) {
        players[camera._id] = camera;
        players[camera._id].positionNumber = Object.keys(players).length + 1;
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
          players
        }
      };

    default:
      return state;
  }
}
