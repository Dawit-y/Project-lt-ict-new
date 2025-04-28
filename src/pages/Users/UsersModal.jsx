import React, { useTransition, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
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
  Spinner,
} from "reactstrap";

import {
  useUpdateUsers,
  useChangeUserStatus,
  useChangePassword,
} from "../../queries/users_query";
import { toast } from "react-toastify";
import avatar from "../../assets/images/users/defaultAvatar.png";

const modalStyle = {
  width: "100%",
  // height: "100%",
};

const statusMap = {
  0: false,
  1: true,
};

const UsersModal = (props) => {
  const { t } = useTranslation();
  const { isOpen, toggle, transaction } = props;
  const status = transaction.usr_status === 0 ? false : true;
  const [switch1, setSwitch1] = useState(status);
  useEffect(() => {
    setSwitch1(transaction.usr_status === 0 ? false : true);
  }, [transaction.usr_status]);

  const [modal_backdrop, setModal_backdrop] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUsers = useUpdateUsers();
  const changeUserStatus = useChangeUserStatus();
  const changeUserPassword = useChangePassword();

  const handleChangeUserStatus = async (data) => {
    try {
      await changeUserStatus.mutateAsync(data);
      setSwitch1(!switch1);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      setSwitch1(false);
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
  };

  const tog_backdrop = () => {
    setModal_backdrop(!modal_backdrop);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const resetForm = () => {
    setNewPassword("");
    setPasswordStrength("");
    setMessage("");
    setPasswordShown(false);
    setIsSubmitting(false);
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Too short";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)
      return "Strong";
    if (hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar))
      return "Moderate";
    return "Weak";
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
      await changeUserPassword.mutateAsync(data);
      //setSwitch1(true);
      toast.success(`password changed successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      //setSwitch1(false);
      toast.error(`Failed to change password`, {
        autoClose: 2000,
      });
    } finally {
      setModal_backdrop(false)
    }
  };

  const handlePasswordInput = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    const strength = checkPasswordStrength(password);
    setPasswordStrength(strength);
    setMessage(strength === "Weak" ? "Password is too weak." : "");
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
                        src={`${import.meta.env.VITE_BASE_API_FILE
                          }/public/uploads/userfiles/${transaction.usr_picture}`}
                        alt="User Profile"
                        className="img-thumbnail"
                        style={{
                          width: "100%",
                          height: "auto",
                          maxWidth: "150px",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = avatar;
                        }}
                      />

                      <>
                        <div className="p-3">
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
                                  <td>{transaction.usr_create_time}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </>
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
                      <th scope="row">{t("usr_zone_id")}</th>
                      <td>{transaction.zone_name}</td>
                    </tr>
                    <tr>
                      <th scope="row"> {t("usr_woreda_id")}</th>
                      <td>
                        {transaction.woreda_name === 0
                          ? "--"
                          : transaction.woreda_name}
                      </td>
                    </tr>

                    <tr>
                      <th scope="row"> {t("usr_sector_id")}</th>
                      <td>{transaction.sector_name}</td>
                    </tr>
                    <tr>
                      <th scope="row"> {t("usr_department_id")}</th>
                      <td>{transaction.dep_name}</td>
                    </tr>
                    <tr>
                      <th scope="row"> {t("usr_is_active")}</th>
                      <td>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: !switch1 ? "#d9534f" : "#28a745", // Green for Active, Red for Inactive
                          }}
                        >
                          {switch1 == 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-start gap-3">
                  <Col className="d-flex flex-column align-items-start">
                    <div className="card-title mb-2">
                      {t("Reset New Password")}
                    </div>
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => {
                        tog_backdrop();
                      }}
                      outline
                    >
                      {t("Reset")}
                    </Button>
                  </Col>

                  <Col className="d-flex flex-column align-items-start">
                    <div className="card-title mb-2">
                      {t("Update User Status")}
                    </div>
                    <div className="d-flex align-items-center">
                      <Switch
                        uncheckedIcon={<OffSymbol />}
                        checkedIcon={<OnSymbol />}
                        className="me-2"
                        onColor="#626ed4"
                        offColor="#d9534f"
                        onChange={() => {
                          const updatedStatus = !switch1 ? 1 : 0;
                          const update_user = {
                            usr_id: transaction.usr_id,
                            usr_email: transaction.usr_email,
                            usr_status: updatedStatus,
                          };
                          handleChangeUserStatus(update_user);
                        }}
                        checked={switch1}
                      />
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: switch1 ? "#28a745" : "#d9534f",
                        }}
                      >
                        {switch1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </Col>
                </CardBody>
              </Card>

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
          centered={true}
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
                    onChange={handlePasswordInput}
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
              {passwordStrength && (
                <p
                  style={{
                    color:
                      passwordStrength === "Strong"
                        ? "green"
                        : passwordStrength === "Moderate"
                          ? "orange"
                          : "red",
                  }}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
              {message && <p style={{ color: "red" }}>{message}</p>}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
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
              disabled={passwordStrength === "Weak" || !newPassword || changeUserPassword.isPending}
            >
              {changeUserPassword.isPending ?
                <span> <Spinner size={"sm"} />  {" Change Password"}</span>
                : "Change Password"}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Modal>
  );
};
UsersModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  transaction: PropTypes.object,
};
export default UsersModal;
