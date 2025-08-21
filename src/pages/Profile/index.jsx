import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Table,
} from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FaLock, FaEdit } from "react-icons/fa";
import { useFetchUser } from "../../queries/users_query";
import { useTranslation } from "react-i18next";
import UpdateModal from "./UpdateModal";
import ChangePasswordModal from "../../components/Common/ChangePasswordModal";
import { useAuthUser } from "../../hooks/useAuthUser";

const API_URL = import.meta.env.VITE_BASE_API_FILE;

const UsersProfile = () => {
  const { t } = useTranslation();

  const { user: authUser } = useAuthUser();
  const [profile, setProfile] = useState({});
  const { data, isLoading, refetch } = useFetchUser({
    id: authUser?.usr_id,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (data?.data?.[0]) {
      setProfile(data.data[0]);
    }
  }, [data]);

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  return (
    <React.Fragment>
      <UpdateModal
        profile={profile}
        modal={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        refetch={refetch}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        toggle={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
      />
      <div className="page-content">
        <Container>
          <Row className="d-flex align-items-center justify-content-center">
            <Col xl="10">
              <Card
                className="overflow-hidden"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
              >
                {isLoading ? (
                  <Spinners />
                ) : (
                  <CardBody className="position-relative">
                    <Row>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <div className="avatar-xl profile-user-wid mb-4">
                            <img
                              src={`${API_URL}/public/uploads/pictures/${profile.usr_picture}`}
                              alt="User Profile"
                              className="img-thumbnail rounded-circle mt-3"
                              style={{
                                border: "4px solid #fff",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                width: "120px",
                                height: "120px",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://i.pinimg.com/236x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg";
                              }}
                            />
                          </div>
                        </div>
                        <h5 className="font-size-15 text-truncate text-center mb-2">
                          {profile.usr_full_name || "-"}
                        </h5>

                        <div className="text-lg-center mt-4 mb-2 mt-lg-0">
                          <Row>
                            <Col xs="4">
                              <div className="p-3 border rounded">
                                <i className="bx bx-building-house font-size-24 mb-2"></i>
                                <h5 className="mb-1">
                                  {authUser.user_info?.sector_name || "-"}
                                </h5>
                                <p className="text-muted mb-0">
                                  {t("sector_name")}
                                </p>
                              </div>
                            </Col>
                            <Col xs="4">
                              <div className="p-3 border rounded">
                                <i className="bx bx-globe font-size-24 mb-2"></i>
                                <h5 className="mb-1">
                                  {authUser.user_info?.zone_name || "-"}
                                </h5>
                                <p className="text-muted mb-0">
                                  {t("zone_name")}
                                </p>
                              </div>
                            </Col>
                            <Col xs="4">
                              <div className="p-3 border rounded">
                                <i className="bx bx-map font-size-24 mb-2"></i>
                                <h5 className="mb-1">
                                  {authUser.user_info?.woreda_name || "-"}
                                </h5>
                                <p className="text-muted mb-0">
                                  {t("woreda_name")}
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <Card>
                          <CardBody>
                            <CardTitle className="mb-2">
                              {t("personal_information")}
                            </CardTitle>
                            <p className="text-muted mb-4">
                              {profile.usr_description || ""}
                            </p>
                            <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                <tbody>
                                  <tr>
                                    <th>
                                      <i className="mdi mdi-account-circle me-2" />
                                      {t("full_name")} :
                                    </th>
                                    <td>{profile.usr_full_name || "-"}</td>
                                  </tr>
                                  <tr>
                                    <th>
                                      <i className="mdi mdi-phone me-2" />
                                      {t("phone_number")} :
                                    </th>
                                    <td>{profile.usr_phone_number || "-"}</td>
                                  </tr>
                                  <tr>
                                    <th>
                                      <i className="mdi mdi-email me-2" />
                                      {t("email")} :
                                    </th>
                                    <td>{profile.usr_email || "-"}</td>
                                  </tr>
                                  <tr>
                                    <th>
                                      <i className="mdi mdi-calendar me-2" />
                                      {t("created")} :
                                    </th>
                                    <td>
                                      {authUser.usr_create_time
                                        ? formatDate(authUser.usr_create_time)
                                        : "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>
                                      <i className="mdi mdi-clock me-2" />
                                      {t("last_logged_in")} :
                                    </th>
                                    <td>
                                      {profile.usr_last_logged_in
                                        ? formatDate(profile.usr_last_logged_in)
                                        : "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>

                          <Row className="d-flex justify-content-center align-items-center g-3 mb-3">
                            <Col xs="auto">
                              <Button
                                outline
                                color="success"
                                className="d-flex align-items-center px-4 py-2"
                                onClick={() => setIsUpdateModalOpen(true)}
                              >
                                <FaEdit className="me-2" />
                                {t("edit")}
                              </Button>
                            </Col>
                            <Col xs="auto">
                              <Button
                                outline
                                color="primary"
                                className="d-flex align-items-center px-4 py-2"
                                onClick={() => setIsPasswordModalOpen(true)}
                              >
                                <FaLock className="me-2" />
                                {t("reset_password")}
                              </Button>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UsersProfile;
