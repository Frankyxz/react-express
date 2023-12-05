import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "../css/Loading.css";
const LoadingModal = () => {
  return (
    <>
      <div className="spinner-modal-overlay">
        <div className="spinner-modal-content">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </>
  );
};

export default LoadingModal;
