import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { SIDEDATA_CACHE_KEY } from "../../components/HorizontalLayout/Navbar";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authUser");
    localStorage.removeItem(SIDEDATA_CACHE_KEY)
    navigate("/login");
  }, []);

  return <></>;
};

export default withRouter(Logout);
