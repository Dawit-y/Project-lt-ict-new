import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = ({ isOpen, toggle, user }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const validation = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      if (!values.password) {
        toast.error("Please enter a valid password.", { autoClose: 2000 });
        return;
      }

      try {
        const token = user?.authorization?.token;

        await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}user/change_password`,
          {
            user_id: user?.user?.usr_id,
            password: values.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Password changed successfully!", { autoClose: 2000 });
        toggle(); // Close modal
        navigate("/login");
      } catch (error) {
        toast.error("Error changing password. Please try again.", {
          autoClose: 2000,
        });
      }
    },
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" centered>
      <ModalHeader toggle={toggle}>{t("change_password")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={validation.handleSubmit}>
          <div className="mb-3">
            <Label>{t("new_password")}</Label>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("enter_new_password")}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.password}
                invalid={
                  validation.touched.password && !!validation.errors.password
                }
              />
              <InputGroupText
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroupText>
              {validation.touched.password && validation.errors.password && (
                <FormFeedback>{validation.errors.password}</FormFeedback>
              )}
            </InputGroup>
          </div>

          <div className="mb-3">
            <Label>{t("confirm_password")}</Label>
            <InputGroup>
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirm_password")}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.confirmPassword}
                invalid={
                  validation.touched.confirmPassword &&
                  !!validation.errors.confirmPassword
                }
              />
              <InputGroupText
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroupText>
              {validation.touched.confirmPassword &&
                validation.errors.confirmPassword && (
                  <FormFeedback>
                    {validation.errors.confirmPassword}
                  </FormFeedback>
                )}
            </InputGroup>
          </div>

          <div className="text-end">
            <Button color="primary" type="submit">
              {t("change_password")}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ChangePasswordModal;
