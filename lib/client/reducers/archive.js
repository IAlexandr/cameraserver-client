import {
  archiveActionTypes
} from '../actions';

const {
  GET,
  SET_PERIOD,
  SWITCH_MODE,
  CLEAR,
  TOGGLE_PERIOD
} = archiveActionTypes;

const initialState = {
  multipleMode: false,    // включает и устанавливает всем плеерам один период архива.
  players: {}, // выбирается при multipleMode: true { cameraId: { startTime, endTime, turnedOn } }
  period: {
    turnedOn: false
  }, // выбирается при multipleMode: false { startTime, endTime, turnedOn }
};

export default function (state = initialState, action) {
  const { period, cameraId, isToggleOn } = action;
  switch (action.type) {
    case GET:
      return state;

    case SET_PERIOD:
      let players = state.players;
      if (!state.multipleMode) {
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

    case TOGGLE_PERIOD:
      if (!state.multipleMode) {
        if (state.players.hasOwnProperty(cameraId)) {
          if (typeof isToggleOn === 'boolean') {
            state.players[cameraId].period.turnedOn = isToggleOn;
          } else {
            state.players[cameraId].period.turnedOn = !state.players[cameraId].period.turnedOn;
          }
          return {
            ...state,
            ...{
              players: state.players
            }
          };
        } else {
          state.players[cameraId] = { period: {} };
          if (typeof isToggleOn === 'boolean') {
            state.players[cameraId].period.turnedOn = isToggleOn;
          }
          return {
            ...state,
            ...{
              players: state.players
            }
          };
        }
      }
      state.period.turnedOn = !state.period.turnedOn;
      if (typeof isToggleOn === 'boolean') {
        state.period.turnedOn = isToggleOn;
      }
      return {
        ...state,
        ...{
          period: state.period
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
