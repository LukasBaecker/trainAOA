import axios from "axios";

export const changeProjectValues = () => (dispatch) => {
  axios.get("/api/v1/user/me", null, {}).then((res) => {
    dispatch(setProjectValues(res));
  });
};

export const SET_PROJECT_VALUES = "SET_PROJECT_VALUES";
export const setProjectValues = (data) => {
  return {
    type: "SET_PROJECT_VALUES",
    data: { ownprojects: data.data.ownproject, projects: data.data.projects },
  };
};

export const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";
export const setCurrentProject = (data) => {
  return {
    type: "SET_CURRENT_PROJECT",
    data: data,
  };
};
