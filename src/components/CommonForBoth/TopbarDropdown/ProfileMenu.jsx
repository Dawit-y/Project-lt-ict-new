import React, { useState } from "react";
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
import { FaUserCircle } from "react-icons/fa";
import { useAuthUser } from "../../../hooks/useAuthUser";

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false);
  const { user: authUser } = useAuthUser();

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
          <FaUserCircle
  className="rounded-circle header-profile-user"
  size={40} // adjust size like image width/height
  color="#ccc" // optional, change color if needed
  title="Header Avatar"
/>
          <span className="d-none d-xl-inline-block ms-2">
            {authUser.usr_full_name || authUser.usr_email}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}
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

export default withRouter(withTranslation()(ProfileMenu));
