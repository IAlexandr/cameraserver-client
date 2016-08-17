import {
  archiveActionTypes
} from '../actions';

const {
  GET,
  SET_PERIOD,
  SWITCH_MODE,
  CLEAR
} = archiveActionTypes;

const initialState = {
  multipleMode: false,    // включает и устанавливает всем плеерам один период архива.
  players: {}, // выбирается при multipleMode: true { cameraId: { startTime, endTime, turnedOn } }
  period: {}, // выбирается при multipleMode: false { startTime, endTime, turnedOn }
};

export default function (state = initialState, action) {
  const { period, cameraId } = action;
  switch (action.type) {
    case GET:
      return state;

    case SET_PERIOD:
      let players = {};
      if (state.multipleMode) {
        if (!state.players.hasOwnProperty(cameraId)) {
          players[cameraId] = {};
        }
        players[cameraId].period = period;
        return {
          ...state,
          ...{
            players
          }
        };
      }
      return {
        ...state,
        ...{
          period
        }
      };

    case SWITCH_MODE:
      return {
        ...state,
        ...{
          multipleMode: !state.multipleMode
        }
      };

    case CLEAR:
      if (cameraId) {
        delete state.players[cameraId];
        return {
          ...state,
          ...{
            players: state.players
          }
        };
      }
      return {
        ...state,
        ...{
          period: {}  // TODO првоерить работает ли?
        }
      };

    default:
      return state;
  }
}
