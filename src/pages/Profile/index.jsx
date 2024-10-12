import React, { useState } from "react";
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
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Import mini card widgets
import MiniCards from "./mini-card";

// Import Images
import profile1 from "/src/assets/images/profile-img.png";

// Import charts
import ApexRevenue from "./ApexRevenue";

const UsersProfile = () => {
  document.title = "Profile | Skote - Vite React Admin & Dashboard Template";

  const storedUser = localStorage.getItem("authUser");
  const Users = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const [userProfile, setUserProfile] = useState(Users); // Set state directly to Users

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

  const tog_backdrop = () => {
    setModal_backdrop(!modal_backdrop);
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
      usr_id: userProfile.user.usr_id, // Assuming usr_id exists
      password: newPassword,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}user/change_password`,
        data
      );
      console.log(response);
      setMessage("Password changed successfully!");
      setModal_backdrop(false); // Close the modal on success
    } catch (error) {
      setMessage("Error changing password. Please try again.");
      console.error("Error changing password:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Profile" />

          <Row>
            <Col xl="4">
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">Welcome Back!</h5>
                        <p>It will seem like simplified</p>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profile1} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                {userProfile && userProfile.user ? (
                  <CardBody className="pt-0">
                    <Row>
                      <Col>
                        <div className="d-flex justify-content-center">
                          <div className="avatar-xl profile-user-wid mb-2">
                            <img
                              src={
                                userProfile.user.usr_picture === "" ||
                                userProfile.user.usr_picture.length < 2
                                  ? "https://i.pinimg.com/236x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg"
                                  : userProfile.user.usr_picture
                              }
                              alt="User Profile"
                              className="img-thumbnail rounded-circle"
                            />
                          </div>
                        </div>
                        <h5 className="font-size-15 text-truncate text-center">
                          {userProfile.user.usr_full_name === ""
                            ? "Unkonwn User"
                            : userProfile.user.usr_full_name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate text-center mb-2">
                          {userProfile.user.usr_department_id === ""
                            ? "Unkonwn Department"
                            : userProfile.user.usr_department_id}
                        </p>
                        <Card>
                          <CardBody>
                            <CardTitle className="mb-4">
                              Personal Information
                            </CardTitle>
                            <p className="text-muted mb-4">
                              {userProfile.user.usr_description === ""
                                ? "No Description"
                                : userProfile.user.usr_description}
                            </p>
                            <div className="table-responsive">
                              <Table className="table-nowrap mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row">Full Name :</th>
                                    <td>
                                      {userProfile.user.usr_full_name === ""
                                        ? "-"
                                        : userProfile.user.usr_full_name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Mobile :</th>
                                    <td>
                                      {userProfile.user.usr_phone_number === ""
                                        ? "-"
                                        : userProfile.user.usr_phone_number}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">E-mail :</th>
                                    <td>
                                      {userProfile.user.usr_email === ""
                                        ? "-"
                                        : userProfile.user.usr_email}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Profile Created :</th>
                                    <td>
                                      {userProfile.user.usr_create_time !== ""
                                        ? formatDate(
                                            userProfile.user.usr_create_time
                                          )
                                        : "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          type="button"
                          color="primary "
                          onClick={() => {
                            tog_backdrop();
                          }}
                        >
                          <i className="mdi mdi-pencil font-size-16"></i> Edit
                        </Button>
                      </div>
                    </Row>
                  </CardBody>
                ) : (
                  <h1>No users found</h1>
                )}
              </Card>
            </Col>

            <Col xl="8">
              <Row>
                {(miniCards || []).map((card, key) => (
                  <MiniCards
                    title={card.title}
                    text={card.text}
                    iconClass={card.iconClass}
                    key={"_card_" + key}
                  />
                ))}
              </Row>

              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Projects</CardTitle>
                  <div id="revenue-chart">
                    <ApexRevenue dataColors='["--bs-primary"]' />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop();
        }}
        backdrop={"static"}
        id="staticBackdrop"
        centered="true"
      >
        <ModalHeader
          toggle={() => {
            tog_backdrop();
          }}
        >
          Edit Password
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
            Close
          </Button>
          <Button type="button" color="success" onClick={handlePasswordChange}>
            Edit
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default UsersProfile;
