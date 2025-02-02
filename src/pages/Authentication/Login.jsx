import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

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
// actions
import { loginUser, socialLogin } from "../../store/actions";
import lightlogo from "../../assets/images/logo-light.png";
import {
  LOGIN_TITLE,
  FOOTER_TEXT,
  BUREAU_NAME,
} from "../../constants/constantFile";

const Login = (props) => {
  //meta title
  document.title = "Login - PMS";
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "test@gmail.com" || "",
      password: "12345678" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Your Email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Password should be at least 8 characters long"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(loginUser(values, props.router.navigate));
        localStorage.setItem("I18N_LANGUAGE", "en");
        localStorage.setItem("i18nextLng", "en");
      } catch (error) {
        setResponseError(error.message); // Set the error message
      }
    },
  });

  const LoginProperties = createSelector(
    (state) => state.Login,
    (login) => ({
      error: login.error,
      loading: login.loading,
    })
  );

  const { error, loading } = useSelector(LoginProperties);

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col xs={12} className="text-center mt-2">
                      <img src={lightlogo} alt="" className="img-fluid" />
                    </Col>
                    <Col xs={12}>
                      <div className="text-primary p-4">
                        <h4 className="text-primary text-center">
                          {BUREAU_NAME}
                        </h4>
                        <h4 className="text-primary text-center">
                          {LOGIN_TITLE}
                        </h4>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0 mt-2">
                  <div className="auth-logo">
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
                    <Link to="/" className="auth-logo-dark"></Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>

                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />

                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <InputGroup>
                          <Input
                            name="password"
                            autoComplete="off"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <InputGroupText
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        {loading ? (
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                            disabled
                          >
                            <span className="flex align-items-center justify-content-center">
                              <Spinner size={"sm"} />{" "}
                              <span className="ms-2">Log In</span>
                            </span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Log In
                          </button>
                        )}
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
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
