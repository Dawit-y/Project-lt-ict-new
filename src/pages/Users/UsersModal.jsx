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
            <Col md="6">
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <Row>
                    <Col>
                      <div className="d-flex justify-content-center">
                        <div className="avatar-xl profile-user-wid mb-2">
                          <img
                            src={transaction.usr_picture}
                            alt="User Profile"
                            className="img-thumbnail rounded-circle"
                          />
                        </div>
                      </div>
                      <h5 className="font-size-15 text-truncate text-center">
                        {transaction.usr_full_name}
                      </h5>
                      <p className="text-muted mb-0 text-truncate text-center mb-2">
                        {transaction.usr_department_id}
                      </p>
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
                    </Col>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        type="button"
                        color="primary "
                        onClick={() => {
                          tog_backdrop();
                        }}
                      >
                        <i className="font-size-16"></i> Reset
                      </Button>
                      <Label>Update user status</Label>
                      <Switch
                        uncheckedIcon={<OffSymbol />}
                        checkedIcon={<OnSymbol />}
                        className="me-1 mb-sm-8 mb-2"
                        onColor="#626ed4"
                        onChange={() => {
                          setSwitch1(!switch1);
                          console.log("defout", transaction.usr_id);
                          const update_user = {
                            usr_id: transaction.usr_id,
                            usr_description: "this is for demo",
                          };

                          dispatch(onUpdateUsers(update_user));
                        }}
                        checked={switch1}
                      />
                    </div>
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
            <Button
              type="button"
              color="success"
              onClick={handlePasswordChange}
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
