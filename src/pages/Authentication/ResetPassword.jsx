import React, { useState } from "react";
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
  Alert,
} from "reactstrap";
import { LOGIN_TITLE, FOOTER_TEXT } from "../../constants/constantFile";

// import images
import profile from "../../assets/images/profile-img.png";
import lightlogo from "../../assets/images/logo-light.png";

const ResetPassword = () => {
  document.title = "Reset Password";
  const [apiResponse, setApiResponse] = useState("");
  const [error, setError] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please Enter Your Email"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `https://pms.awashsol.com/api/forgot-password?email=${values.email}`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setApiResponse(data.message);
          setError("");
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        setError("Network error, please try again");
      }
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
                      <h5 className="text-primary">Reset Password</h5>
                      <p>{LOGIN_TITLE}</p>
                    </div>
                  </Col>
                  <Col xs={5} className="align-self-end">
                    <img src={profile} alt="Profile" className="img-fluid" />
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
                          alt="Logo"
                          className="rounded-circle"
                          height="34"
                        />
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="p-2">
                  {error ? (
                    <Alert color="danger">{error}</Alert>
                  ) : (
                    !apiResponse && (
                      <div className="alert alert-success text-center mb-4">
                        Enter your email, and instructions will be sent to you!
                      </div>
                    )
                  )}

                  {apiResponse.length > 0 ? (
                    apiResponse && <Alert color="success">{apiResponse}</Alert>
                  ) : (
                    <Form
                      className="form-horizontal"
                      onSubmit={validation.handleSubmit}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          invalid={
                            !!(
                              validation.touched.email &&
                              validation.errors.email
                            )
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email && (
                            <FormFeedback>
                              {validation.errors.email}
                            </FormFeedback>
                          )}
                      </div>
                      <div className="text-end">
                        <button className="btn btn-primary w-md" type="submit">
                          Reset
                        </button>
                      </div>
                    </Form>
                  )}
                </div>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>
                Remember It?{" "}
                <Link to="/login" className="fw-medium text-primary">
                  Sign In here
                </Link>
              </p>
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

export default ResetPassword;
