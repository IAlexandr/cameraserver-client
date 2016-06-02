import {
  LOAD_FRAMES,
  LOAD_FRAMES_FAILED,
  LOAD_FRAMES_COMPLETE,
} from '../actions/types';

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  let data = {};

  switch (action.type) {
    case LOAD_FRAMES:
      return {
        loading: true,
        error: '',
        data: {}
      };

    case LOAD_FRAMES_FAILED:
      return {
        loading: false,
        error: action.err,
        data: {}
      };

    case LOAD_FRAMES_COMPLETE:
      return {
        loading: false,
        error: '',
        data: action.frames
      };

    default:
      return state;
  }
}
