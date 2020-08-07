export const SET_ALGORITH_READY = "SET_ALGORITH_READY";
export const SET_ALGORITH_NOT_READY = "SET_ALGORITH_NOT_READY";
export const LOADING_ALGORITH = "LOADING_ALGORITH";
export const UPDATE_TRAININGPOLYGON = "UPDATE_TRAININGPOLYGON";

export const setAlgorithReady = () => {
  return {
    type: "SET_ALGORITH_READY",
  };
};

export const setAlgorithNotReady = () => {
  return {
    type: "SET_ALGORITH_NOT_READY",
  };
};

export const loadingAlgorith = () => {
  return {
    type: "LOADING_ALGORITH",
  };
};

export const updateTrainingPolygons = (data) => {
  return {
    type: "UPDATE_TRAININGPOLYGON",
    data: data,
  };
};
