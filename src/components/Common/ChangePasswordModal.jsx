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
  Spinner,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../../queries/users_query";
import { useAuthUser } from "../../hooks/useAuthUser";
import { checkPasswordStrength } from "../../utils/Validation/validation";

const ChangePasswordModal = ({ isOpen, toggle }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();

  const { mutateAsync: changeUserPassword, isPending } = useChangePassword();

  const handlePasswordChange = async (values) => {
    try {
      await changeUserPassword({
        user_id: userId,
        password: values.password,
      });
      toast.success("Password changed successfully!", { autoClose: 2000 });
      toggle();
    } catch (error) {
      toast.error("Failed to change password", { autoClose: 2000 });
    }
  };

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
    onSubmit: handlePasswordChange,
  });

  const handlePasswordInputChange = (e) => {
    validation.handleChange(e);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" centered>
      <ModalHeader toggle={toggle}>{t("change_password")}</ModalHeader>
      <ModalBody>
        <Form onSubmit={validation.handleSubmit}>
          {/* New Password Field */}
          <div className="mb-3">
            <Label>{t("new_password")}</Label>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("enter_new_password")}
                onChange={handlePasswordInputChange}
                onBlur={validation.handleBlur}
                value={validation.values.password}
                invalid={
                  validation.touched.password && !!validation.errors.password
                }
              />
              <InputGroupText
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroupText>
              {validation.touched.password && validation.errors.password && (
                <FormFeedback>{validation.errors.password}</FormFeedback>
              )}
            </InputGroup>
            {/* Password Strength Checker */}
            {validation.values.password && (
              <div
                className={`mt-1 text-sm ${
                  passwordStrength === "Strong"
                    ? "text-success"
                    : passwordStrength === "Moderate"
                      ? "text-warning"
                      : "text-danger"
                }`}
              >
                {t(passwordStrength)}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
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
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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

          {/* Submit Button */}
          <div className="text-end">
            <Button color="primary" type="submit" disabled={isPending}>
              {isPending ? (
                <span>
                  <Spinner size="sm" className="me-1" /> {t("change_password")}
                </span>
              ) : (
                t("change_password")
              )}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ChangePasswordModal;
