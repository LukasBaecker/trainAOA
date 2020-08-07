import axios from "axios";
import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import { message } from "antd";
import { connect } from "react-redux";
import Loader from "./Loader.jsx";
let Yup = require("yup");

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "*Names must have at least 2 characters")
    .max(100, "*Names can't be longer than 100 characters")
    .required("*Name is required"),
  categories: Yup.string().required("Categories are required"),
  centerpoint: Yup.string().required("centerpoint is required"),
});

class Upload extends Component {
  constructor(props) {
    super(props);
    this.handleShowLoader = this.handleShowLoader.bind(this);
    this.handleCloseLoader = this.handleCloseLoader.bind(this);
    this.state = {
      selectedFile: null,
      showLoader: false,
    };
  }

  handleShowLoader() {
    this.setState({ showLoader: true });
  }

  handleCloseLoader() {
    this.setState({ showLoader: false });
  }

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };
  render() {
    const showLoader = this.state.showLoader;
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
    return (
      <>
        {loader}
        <Formik
          // Hooks up our validationSchema to Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            categories:
              '["forrest", "greenland", "infastructure", "field_cultivated", "field_fallow" , "water"]',
            centerpoint: "[51.960667, 7.626135]",
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // When button submits form and form is in the process of submitting, submit button is disabled
            setSubmitting(true);
            this.handleShowLoader();
            alert(
              "There are currently problems tiling of the project-layer. If your layer will not show up on the map please check the FAQs for more information."
            );
            if (this.state.selectedFile == null) {
              this.handleCloseLoader();
              setSubmitting(false);
              message.error("You must upload a file for your project ");
            } else {
              const data = new FormData();
              data.append("file", this.state.selectedFile);
              axios
                .post("../api/v1/project", data, {
                  params: {
                    values,
                    owner: this.props.user.id,
                  },
                })
                .then((res) => {
                  axios
                    .post(
                      "../api/v1/tiles",
                      {},
                      {
                        params: {
                          name: values.name,
                        },
                      }
                    )
                    .then(() => {
                      axios
                        .post(
                          "../api/v1/user/project",
                          {},
                          {
                            params: {
                              projectname: values.name,
                              userid: this.props.user.id,
                              own: true,
                            },
                          }
                        )
                        .then(() => {
                          this.handleCloseLoader();
                          resetForm();
                          setSubmitting(false);
                          message.success(
                            "Your project has been saved and is ready to get start!"
                          );
                        })
                        .catch((err) => {
                          this.handleCloseLoader();
                          setSubmitting(false);
                          message.error(
                            "An error has been occured: " + JSON.stringify(err)
                          );
                        });
                    })
                    .catch((err) => {
                      this.handleCloseLoader();
                      setSubmitting(false);
                      message.error(
                        "An error has been occured: " +
                          JSON.stringify(err.response.data)
                      );
                    });
                })
                .catch((err) => {
                  handleCloseLoader();
                  setSubmitting(false);
                  console.log("err:", err.response);
                  message.error(
                    "An error has been occured: " +
                      JSON.stringify(err.response.data)
                  );
                });
            }
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
                  placeholder="Project Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className={touched.name && errors.name ? "errorForm" : null}
                />
                {touched.name && errors.name ? (
                  <div className="errorForm-message">{errors.name}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formCategories">
                <Form.Label>Categories :</Form.Label>
                <Form.Control
                  type="text"
                  name="categories"
                  placeholder='["forrest", "greenland", "infastructure", "field_cultivated", "field_fallow" , "water"]'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.categories}
                  className={
                    touched.categories && errors.categories ? "errorForm" : null
                  }
                />
                {touched.categories && errors.categories ? (
                  <div className="errorForm-message">{errors.categories}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formCategories">
                <Form.Label>Centerpoint :</Form.Label>
                <Form.Control
                  type="text"
                  name="centerpoint"
                  placeholder="[51.960667, 7.626135]"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.centerpoint}
                  className={
                    touched.centerpoint && errors.centerpoint
                      ? "errorForm"
                      : null
                  }
                />
                {touched.centerpoint && errors.centerpoint ? (
                  <div className="errorForm-message">{errors.centerpoint}</div>
                ) : null}
              </Form.Group>
              <div className="form-group files">
                <label>
                  Please upload a valid tif file with geographic reference,
                  otherwise there will be problems.{" "}
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={this.onChangeHandler}
                />
              </div>

              <Button
                className="form-group"
                variant="secondary"
                type="submit"
                disabled={isSubmitting}
              >
                create project
              </Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

function UploadContainer(props) {
  return <Upload user={props.user} />;
}

const mapStateToProps = function (state) {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(UploadContainer);
