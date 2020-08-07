import { SET_PROJECT_VALUES } from "../actions/proj.js";
let initialValue = {};

const projectValuesReducer = (state = initialValue, action) => {
  switch (action.type) {
    case SET_PROJECT_VALUES:
      return action.data;
    default:
      return state;
  }
};

export default projectValuesReducer;
