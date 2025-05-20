import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Logout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.removeItem("authUser");
    navigate("/login");
    queryClient.removeQueries({ queryKey: ["sideData"], exact: false });
  }, []);

  return <></>;
};

export default withRouter(Logout);
