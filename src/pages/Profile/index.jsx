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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UpdateModal from "./UpdateModal";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFetchUser } from "../../queries/users_query";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_BASE_API_FILE;

const UsersProfile = () => {
  document.title = "Profile | PMS";

  const { t } = useTranslation();
  const storedUser = localStorage.getItem("authUser");
  const Users = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const [userProfile, setUserProfile] = useState(Users); // Set state directly to Users
  const [profile, setProfile] = useState({});
  const { data, isLoading, refetch } = useFetchUser({
    id: userProfile?.user?.usr_id,
  });

  useEffect(() => {
    setProfile(data?.data[0]);
  }, [data]);

  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString); // Parse the string into a Date object
    return formatDistanceToNow(parsedDate, { addSuffix: true }); // Get a relative time format (e.g., "3 minutes ago")
  };

  const miniCards = [
    { title: "Completed Projects", iconClass: "bx-check-circle", text: "125" },
    { title: "Pending Projects", iconClass: "bx-hourglass", text: "12" },
    { title: "Total Cost", iconClass: "bx-package", text: "36,524 ETB" },
  ];

  const [modal_backdrop, setModal_backdrop] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const tog_backdrop = () => {
    setModal_backdrop(!modal_backdrop);
  };

  const toggleUpdateModal = () => {
    setUpdateModal(!updateModal);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handlePasswordChange = async () => {
    if (!userProfile || !userProfile.user || !newPassword) {
      setMessage("Please enter a valid password.");
      return;
    }

    const data = {
      user_id: userProfile.user.usr_id, // Assuming usr_id exists
      password: newPassword,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}user/change_password`,
        data
      );
      setMessage("Password changed successfully!");
      toast.success(`Password changed successfully!`, {
        autoClose: 2000,
      });

      setModal_backdrop(false); // Close the modal on success
    } catch (error) {
      toast.success(`Error changing password. Please try again.`, {
        autoClose: 2000,
      });
      setMessage("Error changing password. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <UpdateModal
        profile={profile}
        modal={updateModal}
        toggle={toggleUpdateModal}
        refetch={refetch}
      />
      <Modal
        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={"static"}
        id="staticBackdrop"
        centered={true}
      >
        <ModalHeader
          toggle={() => {
            tog_backdrop();
          }}
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
              <Col sm={9} style={{ position: "relative" }}>
                <Input
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  className="form-control"
                  id="horizontal-password-Input"
                  autoComplete="off"
                  placeholder="Enter Your New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <i
                  className={`mdi ${passwordShown ? "mdi-eye-off" : "mdi-eye"
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
            {message && <p>{message}</p>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color="light"
            onClick={() => {
              setModal_backdrop(false);
            }}
          >
            {t("close")}
          </Button>
          <Button type="button" color="success" onClick={handlePasswordChange}>
            {t("edit")}
          </Button>
        </ModalFooter>
      </Modal>
      <div className="page-content">
        <Container>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Profile" />
          <Row className="d-flex align-items-center justify-content-center">
            <Col xl="10">
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle"></div>
                {isLoading ? (
                  <Spinners />
                ) : (
                  <CardBody className="">
                    <Row>
                      <Col>
                        <Row>
                          <Col xl={8}>
                            <div className="d-flex justify-content-center">
                              <div className="avatar-xl profile-user-wid mb-2">
                                <img
                                  src={`${API_URL}/public/uploads/pictures/${profile?.usr_picture}`}
                                  alt="User Profile"
                                  className="img-thumbnail rounded-circle mt-3"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://i.pinimg.com/236x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg";
                                  }}
                                />
                              </div>
                            </div>
                            <h5 className="font-size-15 text-truncate text-center mt-4">
                              {profile?.usr_full_name === ""
                                ? "Unkonwn User"
                                : profile?.usr_full_name}
                            </h5>
                            <p className="text-muted mb-0 text-truncate text-center mb-2">
                              {profile?.usr_department_id === ""
                                ? "Unkonwn Department"
                                : profile?.usr_department_id}
                            </p>
                          </Col>
                          <Col xl={4}>
                            <div className="d-flex flex-column flex-wrap gap-2">
                              <Button
                                outline
                                type="button"
                                color="success"
                                onClick={() => toggleUpdateModal()}
                              >
                                <i className="mdi mdi-pencil font-size-16 me-2"></i>
                                {t("edit")}
                              </Button>
                              <Button
                                outline
                                type="button"
                                color="primary"
                                onClick={() => {
                                  tog_backdrop();
                                }}
                              >
                                <FaLock className="me-2" />
                                {t("reset_password")}
                              </Button>
                            </div>
                          </Col>
                        </Row>

                        <div>
                          <CardBody>
                            <CardTitle className="mb-4">
                              {t("personal_information")}
                            </CardTitle>
                            <p className="text-muted mb-4">
                              {profile?.usr_description === ""
                                ? "No Description"
                                : profile?.usr_description}
                            </p>
                            <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row">{t("usr_full_name")}: </th>
                                    <td>
                                      {profile?.usr_full_name === ""
                                        ? "-"
                                        : profile?.usr_full_name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      {t("usr_phone_number")}:
                                    </th>
                                    <td>
                                      {profile?.usr_phone_number === ""
                                        ? "-"
                                        : profile?.usr_phone_number}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">{t("usr_email")}: </th>
                                    <td>
                                      {profile?.usr_email === ""
                                        ? "-"
                                        : profile?.usr_email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">{t("usr_create_time")}:</th>
                                    <td>
                                      {profile?.usr_create_time
                                        ? formatDate(profile.usr_create_time)
                                        : "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </div>
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
