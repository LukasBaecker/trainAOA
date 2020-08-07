import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { message } from "antd";
import axios from "axios";
import NavItem from "react-bootstrap/NavItem";
import {
  setAlgorithNotReady,
  loadingAlgorith,
  setAlgorithReady,
} from "../actions";
import { useDispatch } from "react-redux";

function updateButton() {
  const dispatch = useDispatch();
  const algorithReady = useSelector((state) => state.algorithReady);
  const currentProject = useSelector((state) => state.currentProject);

  const startRscript = () => {
    dispatch(loadingAlgorith());
    console.log(currentProject.name);
    axios
      .post(
        "/api/v1/aoa",
        {},
        {
          params: {
            projectid: currentProject._id,
            name: currentProject.name,
          },
        }
      )
      .then(function () {
        dispatch(setAlgorithNotReady());
        message.success("The AOA layer has successfully been updated.");
        alert(
          "To make sure you are watching the updated AOA-layer, please refresh the webside."
        );
      })
      .catch(function (err) {
        message.error("An error has been occured: " + err.response.data + ".");
        dispatch(setAlgorithReady());
      });
  };
  let button;
  if (algorithReady == 2) {
    button = (
      <Button
        className="updateButton"
        variant={"primary"}
        onClick={startRscript}
      >
        update aoa-layer
      </Button>
    );
  } else {
    if (algorithReady == 3) {
      button = (
        <Button variant={"primary"} className="buttonload">
          <Spinner
            animation="grow"
            id="spinner_aoa"
            size="sm"
            variant="light"
          />
          ...reloading aoa layer
        </Button>
      );
    } else {
      button = <></>;
    }
  }

  return (
    <>
      <Navbar fixed="bottom" id="updateButtonDiv">
        <Nav className="mr-auto">
          <NavItem>{button}</NavItem>
        </Nav>
      </Navbar>
    </>
  );
}

export default updateButton;
