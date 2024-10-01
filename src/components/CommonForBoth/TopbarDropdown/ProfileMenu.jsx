import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { DropdownMenu, DropdownItem } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../Common/withRouter";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

import { Badge } from "reactstrap";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const storedUser = localStorage.getItem("authUser");
  const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const [userProfile, setUserProfile] = useState(User); // Set state directly to Users

  const truncateText = (text, maxLength) => {
    if (typeof text !== "string") {
      return text;
    }
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  };

  const userInitial = userProfile.user.usr_full_name
    ? userProfile.user.usr_full_name.charAt(0).toUpperCase()
    : "";

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          {userProfile.user.usr_picture.length > 1 ? (
            <img
              className="rounded-circle"
              src={userProfile.user.usr_picture}
              alt="Avatar"
              style={{ width: "30px", height: "30px" }}
            />
          ) : (
            <Badge
              className="rounded-circle d-flex justify-content-center align-items-center"
              color="primary"
              style={{
                width: "30px",
                height: "30px",
                fontSize: "20px",
                backgroundColor: "#ccc",
                color: "#fff",
              }}
            >
              {userInitial}
            </Badge>
          )}
          <span className="d-none d-xl-inline-block ms-2">
            {truncateText(userProfile.user.usr_full_name, 6) ||
              userProfile.user.usr_email}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}
          </DropdownItem>
          <DropdownItem tag={Link} to="/crypto-wallet">
            <i className="bx bx-wallet font-size-16 align-middle me-1" />
            {props.t("My Wallet")}
          </DropdownItem>
          <DropdownItem tag={Link} to="#">
            <span className="badge bg-success float-end">11</span>
            <i className="bx bx-wrench font-size-16 align-middle me-1" />
            {props.t("Settings")}
          </DropdownItem>
          <DropdownItem tag={Link} to="/auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem>
          <div className="dropdown-divider" />
          <DropdownItem tag={Link} to="/logout">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
