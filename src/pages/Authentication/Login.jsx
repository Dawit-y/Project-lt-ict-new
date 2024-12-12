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
} from "reactstrap";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import lightlogo from "../../assets/images/logo-light.png";
import { LOGIN_TITLE , FOOTER_TEXT,BUREAU_NAME} from "../../constants/constantFile";

const Login = (props) => {
  //meta title
  document.title = "Login - PMS";
  const dispatch = useDispatch();
  const [passwordStrength, setPasswordStrength] = useState("");

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
      // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .matches(/\d/, "Password must contain at least one number")
      // .matches(/[@$!%*#?&]/, "Password must contain at least one special character"),
    }),
    onSubmit: async (values) => {
      try {
        // console.log("login page ...");        
         dispatch(loginUser(values, props.router.navigate));
      } catch (error) {
        // console.log("error message ", error);
        // If login fails, catch the error and display it
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

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //for facebook and google authentication
  const socialResponse = (type) => {
    signIn(type);
  };
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*#?&]/.test(password)) strength += 1;

    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Moderate";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
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
                      <h4 className="text-primary text-center">{BUREAU_NAME}</h4>
                        <h4 className="text-primary text-center">{LOGIN_TITLE}</h4>
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
                    <Link to="/" className="auth-logo-dark">
                    </Link>
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
                        <Input
                          name="password"
                          autoComplete="off"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={(e) => {
                            validation.handleChange(e);
                            setPasswordStrength(
                              getPasswordStrength(e.target.value)
                            ); // Update strength
                          }}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}

                        {/* Password Strength Message */}
                        {validation.values.password && (
                          <p>Password Strength: {passwordStrength}</p>
                        )}
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
                <p>© {new Date().getFullYear()}  {FOOTER_TEXT}</p>
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
