import {
  cameracodersActionTypes
} from '../actions';

const {
  LOAD_CAMERACODERS,
  LOAD_CAMERACODERS_FAILED,
  LOAD_CAMERACODERS_COMPLETE,
} = cameracodersActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERACODERS:
      return {
        ...state,
        ...{
          loading: true,
          error: '',
          data: {}
        }
      };

    case LOAD_CAMERACODERS_FAILED:
      return {
        ...state,
        ...{
          loading: false,
          error: action.err,
          data: {}
        }
      };

    case LOAD_CAMERACODERS_COMPLETE:
      const cameracoders = {};
      action.cameracoders.forEach((camera) => {
        cameracoders[camera._id] = camera;
      });
      return {
        ...state,
        ...{
          loading: false,
          error: '',
          data: cameracoders
        }
      };

    default:
      return state;
  }
}
