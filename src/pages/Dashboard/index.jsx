import { useState, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectDashboard } from "../../helpers/dashboard_backend_helper";
import { withTranslation } from "react-i18next";
const SupersetDashboard = lazy(() => import("./SupersetDashboard"));
import Spinners from "../../components/Common/Spinner";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import ChangePasswordModal from "../../components/Common/ChangePasswordModal";
import { Col, Row, UncontrolledAlert } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";

const Dashboard = () => {
  document.title = "Project Management System";
  const role = "Deputy";

  const { t } = useTranslation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user: authUser } = useAuthUser();

  // Fetch data using TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projectDashboard", role],
    queryFn: () => getProjectDashboard({ role }),
  });

  if (isLoading) return <Spinners />;
  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <div className="page-content">
      <div className="container-fluid1">
        <div className="row">
          {authUser?.usr_password_changed === 0 && (
            <Row className="justify-content-center">
              <Col lg={12}>
                <UncontrolledAlert
                  color="warning"
                  className="alert-dismissible fade show"
                  role="alert"
                >
                  <i className="mdi mdi-alert-outline me-2"></i>{" "}
                  <strong>{t("notice")}:</strong>{" "}
                  {t("your_account_is_still_using_the")}{" "}
                  <strong>{t("administrator_assigned_password")}</strong>.{" "}
                  {t("for_security_reasons_please")}{" "}
                  <a
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="custom-link"
                    style={{ textDecoration: "underline", fontWeight: "bold" }}
                  >
                    {t("click_me_to_update_your_password")}
                  </a>{" "}
                  {t("promptly")}.
                </UncontrolledAlert>
              </Col>
            </Row>
          )}
          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            toggle={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
          />

          {Array.isArray(data) &&
            data.map((supersetPath, index) => (
              <div key={index}>
                {supersetPath ? (
                  <SupersetDashboard
                    dashboardPath={supersetPath.superset_url}
                  />
                ) : (
                  <Spinners />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Dashboard);
