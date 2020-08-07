import { combineReducers } from "redux";
import algorithReadyReducer from "./algorithReadyReducer.js";
import trainingdataReducer from "./trainingdataReducer.js";
import authReducer from "./authReducer.js";
import projectValuesReducer from "./projectValuesReducer.js";
import currentProjectReducer from "./currentProjectReducer.js";

const rootReducer = combineReducers({
  algorithReady: algorithReadyReducer,
  trainingdata: trainingdataReducer,
  auth: authReducer,
  projectValues: projectValuesReducer,
  currentProject: currentProjectReducer,
});

export default rootReducer;
