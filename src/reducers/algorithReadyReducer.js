import {
  SET_ALGORITH_READY,
  SET_ALGORITH_NOT_READY,
  LOADING_ALGORITH,
} from "../actions";

const algorithReadyReducer = (state = 1, action) => {
  switch (action.type) {
    case SET_ALGORITH_READY:
      return 2;
    case SET_ALGORITH_NOT_READY:
      return 1;
    case LOADING_ALGORITH:
      return 3;
    default:
      return state;
  }
};

export default algorithReadyReducer;
