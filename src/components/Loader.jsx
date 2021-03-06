import React from "react";
import Spinner from "react-bootstrap/Spinner";

function Loader() {
  return (
    <>
      <div className="loader">
        {" "}
        <Spinner
          animation="border"
          className="loader-spinner"
          variant="primary"
        />
      </div>
      ;
    </>
  );
}

export default Loader;
