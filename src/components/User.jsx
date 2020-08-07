import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import { message } from "antd";
import axios from "axios";
import Upload from "./Upload.jsx";
import Collapse from "react-bootstrap/Collapse";
import { useDispatch } from "react-redux";
import { changeProjectValues } from "../actions/proj.js";
import Loader from "./Loader.jsx";
let Yup = require("yup");

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "*Names must have at least 2 characters")
    .max(100, "*Names can't be longer than 100 characters")
    .required("*Name is required"),
});

const User = ({ match, location }) => {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const handleCloseLoader = () => setShowLoader(false);
  const handleShowLoader = () => setShowLoader(true);
  const [openProject, setOpenProject] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const userName = useSelector((state) => state.auth.user.name);
  let loader;
  if (showLoader) {
    loader = (
      <>
        <Loader />
      </>
    );
  } else {
    loader = <></>;
  }
  let content;
  if (userId == match.params.userId) {
    content = (
      <div>
        <h1 style={{ margin: "30px" }}> Hello {userName} </h1>
        <Button
          variant="secondary"
          className="collapseButton"
          onClick={() => setOpenUser(!openUser)}
          aria-controls="example-collapse-text"
          aria-expanded={openUser}
        >
          join an existing project
        </Button>
        <Collapse in={openUser} className="collapseUserPage">
          <div id="example-collapse-text">
            <Formik
              // Hooks up our validationSchema to Formik
              validationSchema={validationSchema}
              initialValues={{
                name: "",
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                handleShowLoader();
                axios
                  .post(
                    "../api/v1/user/project",
                    {},
                    {
                      params: {
                        projectname: values.name,
                        userid: userId,
                        own: false,
                      },
                    }
                  )
                  .then(() => {
                    resetForm();
                    setSubmitting(false);
                    handleCloseLoader();
                    dispatch(changeProjectValues());
                    message.success("you joint the project " + values.name);
                  })
                  .catch((err) => {
                    resetForm();
                    setSubmitting(false);
                    handleCloseLoader();
                    message.error(
                      "An error has been occured: " +
                        JSON.stringify(err.response.data)
                    );
                  });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <Form onSubmit={handleSubmit} className="mx-auto">
                  <Form.Group controlId="formName">
                    <Form.Label>Name :</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="projectname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={
                        touched.name && errors.name ? "errorForm" : null
                      }
                    />
                    {touched.name && errors.name ? (
                      <div className="errorForm-message">{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Button
                    className="form-group"
                    variant="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    join project
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Collapse>
        <Button
          variant="secondary"
          className="collapseButton"
          onClick={() => setOpenProject(!openProject)}
          aria-controls="example-collapse-text"
          aria-expanded={openProject}
        >
          create a new project
        </Button>
        <Collapse in={openProject} className="collapseUserPage">
          <div id="example-collapse-text">
            <Upload />
          </div>
        </Collapse>
      </div>
    );
  } else {
    content = <Redirect to="/autherror" />;
  }
  return (
    <>
      {loader}
      <div className="main-container">{content}</div>
    </>
  );
};

export default User;
