import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormFeedback,
  Input,
  Label,
  Alert,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import profile from "../../assets/images/profile-img.png";
import { LOGIN_TITLE, FOOTER_TEXT } from "../../constants/constantFile";

const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prevState) => !prevState);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid or missing token.");
    }
  }, [location]);

  const validation = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://pms.awashsol.com/api/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              new_password: values.password,
              confirm_password: values.confirmPassword,
            }),
          },
        );

        const data = await response.json();
        if (response.ok) {
          setApiResponse(data.message);
          setError("");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        setError("Network error, please try again");
      }
    },
  });

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <div className="bg-primary-subtle">
              <Row>
                <Col xs={7}>
                  <div className="text-primary p-4">
                    <h5 className="text-primary">Change Password</h5>
                    <p>{LOGIN_TITLE}</p>
                  </div>
                </Col>
                <Col xs={5} className="align-self-end">
                  <img src={profile} alt="Profile" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody>
              <h4 className="text-center mb-4">Change Your Password</h4>

              {apiResponse && <Alert color="success">{apiResponse}</Alert>}
              {error && <Alert color="danger">{error}</Alert>}

              <Form
                className="form-horizontal"
                onSubmit={validation.handleSubmit}
              >
                {/* New Password Field */}
                <div className="mb-3">
                  <Label>New Password</Label>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.password}
                      invalid={
                        validation.touched.password &&
                        !!validation.errors.password
                      }
                    />
                    <InputGroupText
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                    {validation.touched.password &&
                      validation.errors.password && (
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                      )}
                  </InputGroup>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <Label>Confirm Password</Label>
                  <InputGroup>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
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

                {/* Submit Button */}
                <div className="text-end">
                  <button className="btn btn-primary w-md" type="submit">
                    Change Password
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordForm;
