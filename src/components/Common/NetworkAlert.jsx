import React, { useState } from "react";
import { Alert, Button } from "reactstrap";

const NetworkAlert = (props) => {
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <>
      {bannerOpen && (
        <div
          className="position-fixed"
          style={{ bottom: "16px", right: "16px", zIndex: 50 }}
        >
          <Alert
            color="dark"
            className="d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              borderColor: "#334155",
            }}
          >
            <div className="text-danger">{props.AlertMessage}</div>
            <Button
              close
              onClick={() => setBannerOpen(false)}
              className="text-light"
              style={{ borderColor: "#334155" }}
            >
              <span aria-hidden>&times;</span>
            </Button>
          </Alert>
        </div>
      )}
    </>
  );
};

export default NetworkAlert;
