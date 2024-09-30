import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import { formatDistanceToNow, parseISO } from "date-fns";

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
                                userProfile.user.usr_picture === ""
                                  ? "https://static.thenounproject.com/png/638636-200.png"
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
    </React.Fragment>
  );
};
export default UsersProfile;
