import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  const notificationProperties = createSelector(
    (state) => state.notificationReducer,
    (notificationReducer) => ({
      notifications: notificationReducer.notifications,
      loading: notificationReducer.loading,
      previledge: notificationReducer.previledge,
      error: notificationReducer.error,
    })
  );

  const { notifications, loading, previledge, error } = useSelector(
    notificationProperties
  );
  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString); // Parse the string into a Date object
    return formatDistanceToNow(parsedDate, { addSuffix: true }); // Get a relative time format (e.g., "3 minutes ago")
  };
  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title={t("notifications")}
          breadcrumbItem={t("notifications")}
        />
        {/* If notifications are loading */}
        {loading && <div className="p-3 text-center">Loading...</div>}

        {/* If there was an error */}
        {error && <div className="p-3 text-center text-danger">{error}</div>}

        {!loading && notifications?.length > 0 && (
          <div style={{ height: "100vh" }}>
            {notifications.map((notification, index) => (
              <div className="text-reset notification-item w-100 bg-white rounded-2 mb-2">
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
                      {t(notification.not_type.toLowerCase())}
                    </h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{t(notification.not_detail)}</p>
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline" />{" "}
                        {t(formatDate(notification.not_date))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
