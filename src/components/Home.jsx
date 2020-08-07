import React from "react";
import Map from "./Map.jsx";
import UpdateButton from "./UpdateButton.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProject } from "../actions/proj.js";

import { updateTrainingPolygons } from "../actions";
import { Result, message } from "antd";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
const Home = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.currentProject);
  const projects = useSelector((state) => state.projectValues);

  const createOwnItems = () => {
    if (projects.ownprojects != undefined) {
      let items = [];
      for (let i = 0; i < projects.ownprojects.length; i++) {
        items.push(
          <Dropdown.Item
            key={i}
            onClick={() => {
              axios
                .get("/api/v1/featureclass", {
                  params: {
                    projectid: projects.ownprojects[i].projectid,
                  },
                })
                .then((featureClass) => {
                  axios
                    .get("/api/v1/project", {
                      params: {
                        id: projects.ownprojects[i].projectid,
                      },
                    })
                    .then((projectDetails) => {
                      dispatch(updateTrainingPolygons(featureClass.data));
                      dispatch(setCurrentProject(projectDetails.data));
                    });
                })
                .catch((err) => {
                  message.error(err.message);
                });
            }}
          >
            {" "}
            {projects.ownprojects[i].projectname}{" "}
          </Dropdown.Item>
        );
      }
      return items;
    } else {
      return <></>;
    }
  };

  const createItems = () => {
    if (projects.projects != undefined) {
      let items = [];
      for (let i = 0; i < projects.projects.length; i++) {
        items.push(
          <Dropdown.Item
            key={i}
            onClick={() => {
              axios
                .get("/api/v1/featureclass", {
                  params: {
                    projectid: projects.projects[i].projectid,
                  },
                })
                .then((featureClass) => {
                  axios
                    .get("/api/v1/project", {
                      params: {
                        id: projects.projects[i].projectid,
                      },
                    })
                    .then((projectDetails) => {
                      dispatch(updateTrainingPolygons(featureClass.data));
                      dispatch(setCurrentProject(projectDetails.data));
                    });
                })
                .catch((err) => {
                  message.error("Something went wrong:" + err);
                });
            }}
          >
            {" "}
            {projects.projects[i].projectname}{" "}
          </Dropdown.Item>
        );
      }
      return items;
    } else {
      return <></>;
    }
  };
  let projectLoaded = () => {
    if (Object.keys(currentProject).length < 1) {
      return (
        <>
          <Result
            className="main-container"
            title="Please choose a project to start mapping"
            extra={
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-primary">select a project</Button>

                <Dropdown.Toggle
                  split
                  variant="outline-primary"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu>
                  <p style={{ color: "#888888", marginLeft: "5px" }}>
                    your own projects:
                  </p>
                  {createOwnItems()}
                  <Dropdown.Divider />
                  <p style={{ color: "#888888", marginLeft: "5px" }}>
                    others projects:
                  </p>
                  {createItems()}
                </Dropdown.Menu>
              </Dropdown>
            }
          />
        </>
      );
    } else {
      return (
        <>
          <Map onChange={onChange} />
          <UpdateButton />;
        </>
      );
    }
  };
  return <>{projectLoaded()}</>;
};

function onChange(geojson) {
  console.log("geojson changed", geojson);
}

export default Home;
