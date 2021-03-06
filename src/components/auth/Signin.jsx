import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { message } from "antd";
let Yup = require("yup");
import { loginUser } from "../../actions/auth.js";
import { useDispatch } from "react-redux";
import { changeProjectValues } from "../../actions/proj.js";
import axios from "axios";
// Schema for yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*must be a valid email address")
    .required("*please enter your email"),
  password: Yup.string().required("*please enter your password."),
});

const Login = () => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        width: "80vw",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "80px",
      }}
    >
      <h2>Sign in</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        // Hooks up our validationSchema to Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          axios
            .post("/api/v1/user/login", null, {
              params: {
                values,
              },
            })
            .then((res) => {
              dispatch(loginUser(res));
              dispatch(changeProjectValues());
              setSubmitting(false);
              resetForm();
              message.success("You have been logged in");
            })
            .catch((err) => {
              setSubmitting(false);
              message.error(err.response.data.password);
            });
        }}
      >
        {/* Callback function containing Formik state and helpers that handle common form actions */}
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
            <Form.Group controlId="formEmail">
              <Form.Label>Email :</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={touched.email && errors.email ? "errorForm" : null}
              />
              {touched.email && errors.email ? (
                <div className="errorForm-message">{errors.email}</div>
              ) : null}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password :</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className={
                  touched.password && errors.password ? "errorForm" : null
                }
              />
              {touched.password && errors.password ? (
                <div className="errorForm-message">{errors.password}</div>
              ) : null}
            </Form.Group>

            <Button
              className="form-group"
              variant="secondary"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
