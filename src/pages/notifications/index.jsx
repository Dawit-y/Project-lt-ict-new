import Breadcrumbs from "../../components/Common/Breadcrumb";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { useFetchNotifications } from "../../queries/notifications_query";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { Spinner, Card, CardBody } from "reactstrap";

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
              <Card key={index} className="mb-2 shadow-sm">
                <CardBody className="d-flex align-items-start">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <i className={`bx bx-${notification.not_type.toLowerCase()}`} />
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {t(notification.not_type.toLowerCase())}
                    </h6>
                    <div className="text-muted small">
                      <p className="mb-1">{t(notification.not_detail)}</p>
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline" />{" "}
                        {t(formatDate(notification.not_date))}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
