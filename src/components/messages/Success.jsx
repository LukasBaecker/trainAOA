import { Result, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Autherror = (match) => {
  let headline;
  let message;

  if (match.match.params.message == "newuser") {
    headline = "You have been signed up!";
    message = "Now, lets start and find a project or create a new one.";
  } else {
    headline = "Success";
    message = "There is something beautful watching this page.";
  }
  return (
    <Result
      className="main-container"
      status="success"
      title={headline}
      subTitle={message}
      extra={[
        <Link key="login" to="/signin">
          <Button className="buttonheader" variant="outline-primary">
            Sign in
          </Button>
        </Link>,
      ]}
    />
  );
};

export default Autherror;
