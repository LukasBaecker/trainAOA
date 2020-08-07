import { SET_CURRENT_PROJECT } from "../actions/proj.js";
let initialValue = {};

const currentProjectReducer = (state = initialValue, action) => {
  switch (action.type) {
    case SET_CURRENT_PROJECT:
      return action.data;
    default:
      return state;
  }
};

export default currentProjectReducer;
