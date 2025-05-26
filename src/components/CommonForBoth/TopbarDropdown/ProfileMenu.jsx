import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import withRouter from "../../Common/withRouter";
import defaultAvatar from "../../../assets/images/default-avatar.jpg";

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false);

  const storedUser = localStorage.getItem("authUser");
  const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const [userProfile, setUserProfile] = useState(User); // Set state directly to Users

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
          <img
            className="rounded-circle header-profile-user"
            src={defaultAvatar}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2">
            {userProfile.user.usr_full_name ||
              userProfile.user.usr_email}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/dashboard">
            <i className="bx bx-columns font-size-16 align-middle me-2" />
            {props.t("Dashboard")}
          </DropdownItem>
          <DropdownItem tag={Link} to="/profile">
            <i className="bx bx-user font-size-16 align-middle me-2" />
            {props.t("Profile")}
          </DropdownItem>
          <div className="dropdown-divider" />
          <DropdownItem tag={Link} to="/logout">
            <i className="bx bx-power-off font-size-16 align-middle me-2 text-danger" />
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

export default withRouter(withTranslation()(ProfileMenu));
