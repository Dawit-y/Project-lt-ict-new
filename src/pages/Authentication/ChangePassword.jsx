import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FOOTER_TEXT } from "../../constants/constantFile";

// Import images
import profile from "../../assets/images/profile-img.png";
import lightlogo from "../../assets/images/logo-light.png";

const ChangePassword = () => {
  // Set meta title
  document.title = "Change Password";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prevState) => !prevState);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Please enter your new password")
        .min(8, "Password should be at least 8 characters long"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your new password"),
    }),
    onSubmit: (values) => {
      console.log("New Password:", values.password);
    },
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary-subtle">
                <Row>
                  <Col xs={7}>
                    <div className="text-primary p-4">
                      <h5 className="text-primary">Change Password</h5>
                      <p>Enter a new password below to change your password</p>
                    </div>
                  </Col>
                  <Col xs={5} className="align-self-end">
                    <img src={profile} alt="" className="img-fluid" />
                  </Col>
                </Row>
              </div>
              <CardBody className="pt-0">
                <div className="auth-logo text-center">
                  <Link to="/" className="auth-logo-light">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img
                          src={lightlogo}
                          alt=""
                          className="rounded-circle"
                          height="34"
                        />
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="p-2">
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
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
                </div>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} {FOOTER_TEXT}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChangePassword;
