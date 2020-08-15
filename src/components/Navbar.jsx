import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import logo from "../img/favicon.png";
import axios from "axios";
//import { message } from "antd";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/auth.js";
import { updateTrainingPolygons } from "../actions";
import { changeProjectValues, setCurrentProject } from "../actions/proj.js";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FAQ from "./info/FAQ.jsx";
import HowTo from "./info/HowTo.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";

function navigation() {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showFAQ, setShowFAQ] = useState(false);
  const handleCloseFAQ = () => setShowFAQ(false);
  const handleShowFAQ = () => setShowFAQ(true);

  const trainingdata = useSelector((state) => state.trainingdata);
  const authorized = useSelector((state) => state.auth.isAuthenticated);
  const userIcon = useSelector((state) => state.auth.user.avatar);
  const userId = useSelector((state) => state.auth.user.id);
  const projects = useSelector((state) => state.projectValues);
  const currentProject = useSelector((state) => state.currentProject);
  var data =
    "text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(trainingdata));
  useEffect(() => {
    dispatch(changeProjectValues());
  }, []);

  let logginbuttons;
  let csvDownload;

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
  const buttonLabel = () => {
    if (Object.keys(currentProject).length < 1) {
      return <>{"select a project"}</>;
    } else {
      return <>{currentProject.name}</>;
    }
  };
  if (
    Object.keys(currentProject).length === 0 &&
    currentProject.constructor === Object
  ) {
    csvDownload = <></>;
  } else {
    csvDownload = (
      <>
        <a
          href={"data:" + data + ""}
          download={"" + currentProject.name + ".json"}
          style={{ marginRight: "15px" }}
        >
          <FontAwesomeIcon icon={faFileDownload} /> trainingdata
        </a>
      </>
    );
  }
  if (authorized === true) {
    if (
      Object.keys(currentProject).length === 0 &&
      currentProject.constructor === Object
    ) {
      logginbuttons = (
        <>
          <NavDropdown
            className="tryout"
            title={<Image src={userIcon} id="userIconNav" roundedCircle />}
            id="basic-nav-dropdown"
            alignRight
          >
            <NavDropdown.Item>
              <Link to={"/user/" + userId}>
                <Button className="buttonheader" variant="outline-primary">
                  manage projects
                </Button>
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              {" "}
              <Button
                className="buttonheader"
                variant="outline-primary"
                onClick={() => {
                  dispatch(logoutUser());
                  dispatch(updateTrainingPolygons({}));
                  dispatch(setCurrentProject({}));
                  dispatch(changeProjectValues());
                }}
              >
                Log out
              </Button>
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    } else {
      logginbuttons = (
        <>
          <Dropdown as={ButtonGroup}>
            <Button variant="outline-primary">{buttonLabel()}</Button>

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
          <NavDropdown
            className="tryout"
            title={<Image src={userIcon} id="userIconNav" roundedCircle />}
            id="basic-nav-dropdown"
            alignRight
          >
            <NavDropdown.Item>
              <Link to={"/user/" + userId}>
                <Button className="buttonheader" variant="outline-primary">
                  manage projects
                </Button>
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              {" "}
              <Button
                className="buttonheader"
                variant="outline-primary"
                onClick={() => {
                  dispatch(logoutUser());
                  dispatch(updateTrainingPolygons({}));
                  dispatch(setCurrentProject({}));
                  dispatch(changeProjectValues());
                }}
              >
                Log out
              </Button>
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    }
  } else {
    logginbuttons = (
      <>
        <Link to="/signin">
          <Button className="buttonheader" variant="outline-primary">
            Sign in
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="buttonheader" variant="primary">
            Sign up
          </Button>
        </Link>
      </>
    );
  }
  return (
    <>
      <Navbar
        collapseOnSelect
        fixed="top"
        bg="dark"
        variant="dark"
        id="navbar"
        expand="xl"
      >
        <Navbar.Brand href="/" id="logo-div">
          <img src={logo} alt="Logo" id="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="navigation-collapse">
          <Nav className="mr-auto">
            <Nav.Link href="/">Map</Nav.Link>
            <Nav.Link onClick={handleShow}>Info</Nav.Link>
            <Nav.Link onClick={handleShowFAQ}>FAQ</Nav.Link>
          </Nav>
          {csvDownload}
          {logginbuttons}
        </Navbar.Collapse>
      </Navbar>

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        className="fancymodal"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HowTo />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Thanks and close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFAQ}
        size="xl"
        onHide={handleCloseFAQ}
        className="fancymodal"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>FAQs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <FAQ />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseFAQ}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default navigation;
