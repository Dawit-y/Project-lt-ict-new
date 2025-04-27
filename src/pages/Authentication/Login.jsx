import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { post } from "../../helpers/api_Lists";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Spinner,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import lightlogo from "../../assets/images/logo-light.png";
import {
  LOGIN_TITLE,
  FOOTER_TEXT,
  BUREAU_NAME,
} from "../../constants/constantFile";

const loginUser = async (credentials) => await post("/login", credentials);

const Login = () => {
  document.title = "Login ";

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("authUser", JSON.stringify(data));
      localStorage.setItem("I18N_LANGUAGE", "en");
      localStorage.setItem("i18nextLng", "en");
      setErrorMessage(null)
      navigate("/dashboard");
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        setErrorMessage("Incorrect email or password. Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    },
  });

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Your Email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Password should be at least 8 characters long"),
    }),
    onSubmit: async (values) => await mutation.mutateAsync(values),
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary-subtle">
                <Row>
                  <Col xs={12} className="text-center mt-2">
                    <img src={lightlogo} alt="logo" className="img-fluid" />
                  </Col>
                  <Col xs={12}>
                    <div className="text-primary p-4 text-center">
                      <h4>{BUREAU_NAME}</h4>
                      <h4>{LOGIN_TITLE}</h4>
                    </div>
                  </Col>
                </Row>
              </div>
              <CardBody className="pt-0 mt-2">
                {errorMessage && (
                  <Alert color="danger">{errorMessage}</Alert>
                )}
                <Form onSubmit={validation.handleSubmit}>
                  <div className="mb-3">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email}
                      invalid={
                        validation.touched.email && validation.errors.email
                      }
                    />
                    <FormFeedback>{validation.errors.email}</FormFeedback>
                  </div>

                  <div className="mb-3">
                    <Label>Password</Label>
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
                          validation.errors.password
                        }
                      />
                      <InputGroupText
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroupText>
                      <FormFeedback>{validation.errors.password}</FormFeedback>
                    </InputGroup>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <div className="mt-3 d-grid">
                    <button
                      className="btn btn-primary btn-block"
                      type="submit"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <Spinner size="sm" className="me-2" />
                      ) : null}{" "}
                      Log In
                    </button>
                  </div>
                </Form>
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

export default Login;

Login.propTypes = {
  history: PropTypes.object,
};