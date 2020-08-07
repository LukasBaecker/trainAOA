import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { message } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom";
let Yup = require("yup");

// Schema for yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "*names must have at least 2 characters")
    .max(30, "*names can't be longer than 30 characters")
    .required("*name is required"),
  email: Yup.string()
    .email("*must be a valid email address")
    .max(100, "*email must be less than 100 characters long")
    .required("*email is required"),
  password: Yup.string()
    .required("*please enter a password.")
    .min(6, "*your password is too short - 6 chars minimum"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*passwords do not match")
    .required("please confirm your password.")
    .min(6, "*password is too short - 6 chars minimum"),
});

const Register = () => {
  let history = useHistory();
  return (
    <div
      style={{
        width: "80vw",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "80px",
      }}
    >
      <h2>Registration</h2>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        // Hooks up our validationSchema to Formik
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // When button submits form and form is in the process of submitting, submit button is disabled
          setSubmitting(true);
          axios
            .post("api/v1/user/register", null, {
              params: {
                values,
              },
            })
            .then(() => {
              resetForm();
              setSubmitting(false);
              history.push("/success/newuser");
            })
            .catch((err) => {
              setSubmitting(false);
              console.log("err:", err.response);
              message.error(
                "An error has been occured: " +
                  JSON.stringify(err.response.data.email)
              );
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
            <Form.Group controlId="formName">
              <Form.Label>Name :</Form.Label>
              <Form.Control
                type="text"
                /* This name property is used to access the value of the form element via values.nameOfElement */
                name="name"
                placeholder="please enter a name"
                /* Set onChange to handleChange */
                onChange={handleChange}
                /* Set onBlur to handleBlur */
                onBlur={handleBlur}
                /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                value={values.name}
                /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                className={touched.name && errors.name ? "errorForm" : null}
              />
              {touched.name && errors.name ? (
                <div className="errorForm-message">{errors.name}</div>
              ) : null}
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email :</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="enter a valid email"
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
            <Form.Group controlId="formRepeatPassword">
              <Form.Label>confirm Password :</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="repeatPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.repeatPassword}
                className={
                  touched.repeatPassword && errors.repeatPassword
                    ? "errorForm"
                    : null
                }
              />
              {touched.repeatPassword && errors.repeatPassword ? (
                <div className="errorForm-message">{errors.repeatPassword}</div>
              ) : null}
            </Form.Group>

            <Button
              className="form-group"
              variant="secondary"
              type="submit"
              disabled={isSubmitting}
            >
              Register your account
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
/*
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirm: "",
      errors: {},
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
    };
    this.props.registerUser(user, this.props.history);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const { errors } = this.state;
    return (
      

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.name,
              })}
              name="name"
              onChange={this.handleInputChange}
              value={this.state.name}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.email,
              })}
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.password,
              })}
              name="password"
              onChange={this.handleInputChange}
              value={this.state.password}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.password_confirm,
              })}
              name="password_confirm"
              onChange={this.handleInputChange}
              value={this.state.password_confirm}
            />
            {errors.password_confirm && (
              <div className="invalid-feedback">{errors.password_confirm}</div>
            )}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Register User
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
*/
