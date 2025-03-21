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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Form,
  Input,
} from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";
import { FaLock, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFetchUser } from "../../queries/users_query";
import { useTranslation } from "react-i18next";
import UpdateModal from "./UpdateModal"; // Ensure this import is correct

const API_URL = import.meta.env.VITE_BASE_API_FILE;

const UsersProfile = () => {
  document.title = "Profile | PMS";

  const { t } = useTranslation();
  const storedUser = localStorage.getItem("authUser");
  const Users = storedUser ? JSON.parse(storedUser) : null;
  const [profile, setProfile] = useState({});
  const { data, isLoading, refetch } = useFetchUser({
    id: Users?.user?.usr_id,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  useEffect(() => {
    if (data?.data[0]) {
      setProfile(data.data[0]);
    }
  }, [data]);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error("Please enter a valid password.", { autoClose: 2000 });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}user/change_password`,
        {
          user_id: Users.user.usr_id,
          password: newPassword,
        }
      );
      toast.success("Password changed successfully!", { autoClose: 2000 });
      setIsPasswordModalOpen(false);
      setNewPassword("");
    } catch (error) {
      toast.error("Error changing password. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <React.Fragment>
      {/* Update Modal */}
      <UpdateModal
        profile={profile}
        modal={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        refetch={refetch}
      />

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        toggle={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
        backdrop={"static"}
        centered={true}
      >
        <ModalHeader
          toggle={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
        >
          {t("edit")} Password
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-4">
              <Label
                htmlFor="horizontal-password-Input"
                className="col-sm-3 col-form-label"
              >
                Password
              </Label>
              <Col sm={9}>
                <Input
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  className="form-control"
                  id="horizontal-password-Input"
                  placeholder="Enter Your New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <i
                  className={`mdi ${
                    passwordShown ? "mdi-eye-off" : "mdi-eye"
                  } font-size-16`}
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                ></i>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setIsPasswordModalOpen(false)}>
            {t("close")}
          </Button>
          <Button color="success" onClick={handlePasswordChange}>
            {t("edit")}
          </Button>
        </ModalFooter>
      </Modal>

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
                              src={`${API_URL}/public/uploads/pictures/${Users.user.usr_picture}`}
                              alt="User Profile"
                              className="img-thumbnail rounded-circle mt-3"
                              style={{
                                border: "4px solid #fff",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                width: "120px",
                                height: "120px",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://i.pinimg.com/236x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg";
                              }}
                            />
                          </div>
                        </div>
                        <h5 className="font-size-15 text-truncate text-center mb-2">
                          {Users.user.usr_full_name || "-"}
                        </h5>

                        <Col className="align-self-center">
                          <div className="text-lg-center mt-4 mb-2 mt-lg-0">
                            <Row>
                              <Col xs="4">
                                <div className="p-3 border rounded">
                                  <i
                                    className={`bx bx-building-house font-size-24 mb-2`}
                                  ></i>
                                  <h5 className="mb-1">
                                    {Users.user.user_info.sector_name || "-"}
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {t("sector_name")}
                                  </p>
                                </div>
                              </Col>
                              <Col xs="4">
                                <div className="p-3 border rounded">
                                  <i
                                    className={`bx bx-map font-size-24 mb-2`}
                                  ></i>
                                  <h5 className="mb-1">
                                    {Users.user.user_info.woreda_name || "-"}
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {t("woreda_name")}
                                  </p>
                                </div>
                              </Col>
                              <Col xs="4">
                                <div className="p-3 border rounded">
                                  <i
                                    className={`bx bx-globe font-size-24 mb-2`}
                                  ></i>
                                  <h5 className="mb-1">
                                    {Users.user.user_info.zone_name || "-"}
                                  </h5>
                                  <p className="text-muted mb-0">
                                    {t("zone_name")}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Card>
                          <CardBody>
                            <CardTitle className="mb-2">
                              {t("personal_information")}
                            </CardTitle>
                            <p className="text-muted mb-4">
                              {Users.user.usr_description ||
                                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum quos aliquid dolorem aperiam facilis veritatis accusantium rerum voluptatem voluptas esse dolores ipsam, voluptatum debitis sapiente quae. Enim non, mollitia cum dolorem laborum ipsum ipsa quas?"}
                            </p>
                            <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row">
                                      <i className="mdi mdi-account-circle me-2"></i>
                                      {t("full_name")} :
                                    </th>
                                    <td>{Users.user.usr_full_name || "-"}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      <i className="mdi mdi-phone me-2"></i>
                                      {t("phone_number")} :
                                    </th>
                                    <td>
                                      {Users.user.usr_phone_number || "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      <i className="mdi mdi-email me-2"></i>
                                      {t("email")} :
                                    </th>
                                    <td>{Users.user.usr_email || "-"}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      <i className="mdi mdi-calendar me-2"></i>
                                      {t("created")} :
                                    </th>
                                    <td>
                                      {Users.user.usr_create_time
                                        ? formatDate(Users.user.usr_create_time)
                                        : "-"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      <i className="mdi mdi-clock me-2"></i>
                                      {t("last_logged_in")} :
                                    </th>
                                    <td>
                                      {Users.user.usr_last_logged_in
                                        ? formatDate(
                                            Users.user.usr_last_logged_in
                                          )
                                        : "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                          <Row className="d-flex justify-content-center align-items-center g-3">
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
