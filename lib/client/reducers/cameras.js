import {
  camerasActionTypes
} from '../actions';

const {
  LOAD_CAMERAS,
  LOAD_CAMERAS_FAILED,
  LOAD_CAMERAS_COMPLETE,
} = camerasActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERAS:
      return {
        ...state,
        ...{
          loading: true,
          error: '',
          data: {}
        }
      };

    case LOAD_CAMERAS_FAILED:
      return {
        ...state,
        ...{
          loading: false,
          error: action.err,
          data: {}
        }
      };

    case LOAD_CAMERAS_COMPLETE:
      const cameras = {};
      action.cameras.forEach((camera) => {
        cameras[camera.id] = camera;
      });
      return {
        ...state,
        ...{
          loading: false,
          error: '',
          data: cameras
        }
      };

    default:
      return state;
  }
}
