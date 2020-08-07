import { UPDATE_TRAININGPOLYGON } from "../actions";
import axios from "axios";

let initialValue = {
  type: "FeatureCollection",
  features: [],
};

const trainingdataReducer = (state = initialValue, action) => {
  switch (action.type) {
    case UPDATE_TRAININGPOLYGON:
      return action.data;
    default:
      return state;
  }
};

export default trainingdataReducer;
