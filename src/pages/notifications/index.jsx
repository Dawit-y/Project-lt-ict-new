import Breadcrumbs from "../../components/Common/Breadcrumb";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useFetchNotifications } from "../../queries/notifications_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { Spinner } from "reactstrap";

const Notifications = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, isError, refetch } = useFetchNotifications();
  const notifications = data?.data || [];

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title={t("notifications")}
          breadcrumbItem={t("notifications")}
        />
        {isLoading ? (
          <Spinner />
        ) : (
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
