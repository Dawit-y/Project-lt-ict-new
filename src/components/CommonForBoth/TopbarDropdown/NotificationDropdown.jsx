import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  useFetchNotifications,
  useMarkNotificationsAsRead,
} from "../../../queries/notifications_query";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { data, isLoading, isError, error, refetch } = useFetchNotifications();
  const notifications = data?.data || [];
  const { mutate: markAsRead } = useMarkNotificationsAsRead();

  useEffect(() => {
    if (notifications) {
      const unreadCount = notifications.filter(
        (notification) => notification.not_is_read == 0,
      ).length;
      setUnreadNotifications(unreadCount);
    }
  }, [notifications]);

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const toggleMenu = () => {
    setMenu(!menu);
    if (!menu) {
      setUnreadNotifications(0);
    }
  };

  const handleMarkUnreadAsRead = () => {
    const unreadNotificationIds = notifications
      .filter(
        (notification) => notification.not_is_read === "0000-00-00 00:00:00",
      )
      .map((notification) => notification.not_id);
    if (unreadNotificationIds.length > 0) {
      markAsRead(unreadNotificationIds, {
        onSuccess: () => {
          refetch();
        },
      });
    }
    toggleMenu();
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={toggleMenu}
        className="dropdown d-inline-block"
        tag="li"
        style={{ zIndex: "999999999999999" }}
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          {unreadNotifications > 0 && (
            <span className="badge bg-danger rounded-pill">
              {unreadNotifications}
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                {notifications.length > 0 && (
                  <Link
                    to={"/notifications"}
                    className="small"
                    onClick={handleMarkUnreadAsRead}
                  >
                    View All
                  </Link>
                )}
              </div>
            </Row>
          </div>
          {isError && (
            <h6 className="text-center text-danger text-sm">
              Error occured during Fetching
            </h6>
          )}
          {notifications.length === 0 && !isError && (
            <h6 className="p-3 text-center">No New Notifications</h6>
          )}

          {isLoading && <div className="p-3 text-center">Loading...</div>}

          {!isLoading && notifications?.length > 0 && (
            <SimpleBar style={{ height: "230px" }}>
              {notifications.map((notification, index) => (
                <Link
                  to=""
                  key={index}
                  className="text-reset notification-item"
                >
                  <div className="d-flex">
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i
                          className={`bx bx-${notification.not_type.toLowerCase()}`}
                        />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1">
                        {props.t(notification.not_type.toLowerCase())}
                      </h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          {props.t(notification.not_detail)}
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline" />{" "}
                          {props.t(formatDate(notification.not_date))}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </SimpleBar>
          )}
          <div className="p-2 border-top d-grid">
            {notifications.length > 0 && (
              <Link
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
                to="/notifications"
                onClick={handleMarkUnreadAsRead}
              >
                <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
                {props.t("View all")}{" "}
              </Link>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
