import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import bgimage from "../../src/img/bgimage.gif";
const Start = () => {
  //const authorized = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <Jumbotron
        className="jumbotron-container"
        style={{
          backgroundImage: `url(${bgimage})`,
          backgroundSize: "cover",
          marginBottom: "0px",
        }}
      >
        <div className="startpageheader">
          <h1>trainAOA</h1>
          <p>
            The platform for effective and collaborative generation of training
            data for satellite image classifications
          </p>
          <p>
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
          </p>
        </div>
      </Jumbotron>
    </>
  );
};

export default Start;
