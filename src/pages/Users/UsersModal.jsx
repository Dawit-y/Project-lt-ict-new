import React, { useTransition, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  Label,
  Input,
} from "reactstrap";

import {
  getUsers as onGetUsers,
  addUsers as onAddUsers,
  updateUsers as onUpdateUsers,
  deleteUsers as onDeleteUsers,
} from "../../store/users/actions";
// Import Images
import profile1 from "/src/assets/images/profile-img.png";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ToastContainer } from "react-toastify";
//redux
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const modalStyle = {
  width: "100%",
  height: "100%",
};

const UsersModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const [switch1, setSwitch1] = useState(true);
  const dispatch = useDispatch();

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
    if (!newPassword) {
      setMessage("Please enter a valid password.");
      return;
    }

    const data = {
      user_id: transaction.usr_id, // Assuming usr_id exists
      password: newPassword,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}user/change_password`,
        data
      );
      console.log(response);
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
      console.error("Error changing password:", error);
    }
  };
  const OffSymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          fontSize: 12,
          color: "#fff",
          paddingRight: 0,
        }}
      >
        {" "}
        Off
      </div>
    );
  };

  const OnSymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: "2px",
          fontSize: 12,
          color: "#fff",
          paddingRight: 2,
        }}
      >
        {" "}
        On
      </div>
    );
  };

  const usr_id = transaction.user_id;
  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="modal-xl"
      tabIndex="-1"
      toggle={toggle}
      style={modalStyle}
    >
      <div className="modal-xl">
        <ModalHeader toggle={toggle}>{t("View Details")}</ModalHeader>

        <ModalBody>
          <Row>
            <Col className="md-6">
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <Row>
                    <Col className="md-6">
                      <img
                        src={`${import.meta.env.VITE_BASE_API_FILE}public/uploads/userfiles/${transaction.usr_picture}`}
                        alt="User Profile"
                        className="img-thumbnail w-100"
                        style={{ height: "150px", objectFit: "cover" }}
                      />


                      <Card>
                        <CardBody>
                          <CardTitle className="mb-4">
                            Personal Information
                          </CardTitle>
                          <p className="text-muted mb-4">
                            {transaction.usr_description}
                          </p>
                          <div className="table-responsive">
                            <Table className="table-nowrap mb-0">
                              <tbody>
                                <tr>
                                  <th scope="row">Full Name :</th>
                                  <td>{transaction.usr_full_name}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Mobile :</th>
                                  <td>{transaction.usr_phone_number}</td>
                                </tr>
                                <tr>
                                  <th scope="row">E-mail :</th>
                                  <td>{transaction.usr_email}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Profile Created :</th>
                                  <td>{transaction.usr_last_logged_in}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                      <div className="d-flex justify-content-between align-items-center gap-3 p-3" style={{ backgroundColor: "#ffff2", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Col>
                          <Label className="form-label mb-2" style={{ fontSize: "16px", fontWeight: "bold" }}>
                            Reset New Password
                          </Label>
                          <Button
                            type="button"
                            color="primary"
                            className="px-4 py-2"
                            style={{ borderRadius: "5px", fontWeight: "bold", fontSize: "16px" }}
                            onClick={() => {
                              tog_backdrop();
                            }}
                          >
                            <i className="bx bx-refresh" style={{ marginRight: "8px" }}></i> Reset
                          </Button>
                        </Col>

                        <Col className="d-flex flex-column align-items-center">
                          <Label className="form-label mb-2" style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                            Update User Status
                          </Label>

                          <div className="d-flex align-items-center">
                            <Switch
                              uncheckedIcon={<OffSymbol />}
                              checkedIcon={<OnSymbol />}
                              className="me-2"
                              onColor="#626ed4"
                              offColor="#d9534f"
                              onChange={() => {
                                setSwitch1(!switch1);
                                console.log("default", transaction.usr_id);
                                const update_user = {
                                  usr_id: transaction.usr_id,
                                  usr_description: "this is for demo",
                                };
                                dispatch(onUpdateUsers(update_user));
                              }}
                              checked={switch1}
                            />

                            {/* Display Active/Inactive based on switch state */}
                            <span style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: switch1 ? "#28a745" : "#d9534f" // Green for Active, Red for Inactive
                            }}>
                              {switch1 ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </Col>

                      </div>
                    </Col>


                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col className="md-6">
              <div className="text-muted mt-4">
                <Table className="table-nowrap mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">{t("usr_role_id")} </th>
                      <td> {transaction.usr_role_id}</td>
                    </tr>
                    <tr>
                      <th scope="row">{t("usr_region_id")}</th>
                      <td>{transaction.usr_region_id}</td>
                    </tr>
                    <tr>
                      <th scope="row">{t("usr_zone_id")}</th>
                      <td>{transaction.usr_zone_id}</td>
                    </tr>
                    <tr>
                      <th scope="row"> {t("usr_kebele_id")}</th>
                      <td>{transaction.usr_kebele_id}</td>
                    </tr>

                    <tr>
                      <th scope="row"> {t("usr_sector_id")}</th>
                      <td>{transaction.usr_sector_id}</td>
                    </tr>
                    <tr>
                      <th scope="row"> {t("usr_department_id")}</th>
                      <td>{transaction.usr_department_id}</td>
                    </tr>
                    <tr>

                      <th scope="row"> {t("usr_is_active")}</th>
                      <td>{transaction.usr_is_active}</td>
                    </tr>
                    <tr>
                      <th scope="row">Is Deleteable :</th>
                      <td className="text-danger">
                        {transaction.is_deletable === 1 && "Data is deletable"}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Is Editable :</th>
                      <td className="text-success">
                        {transaction.is_editable === 1 && "Editable"}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            {t("Close")}
          </Button>
        </ModalFooter>

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
            Password Reset
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
              Close
            </Button>
            <Button
              type="button"
              color="success"
              onClick={()=>{
                
                handlePasswordChange()
              }}
              // onClick={handlePasswordChange}
            >
              Edit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <ToastContainer />
    </Modal>
  );
};
UsersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default UsersModal;
