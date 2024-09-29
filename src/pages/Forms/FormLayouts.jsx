import React from "react";

import { Card, Col, Container, Row, CardBody, CardTitle, Label, Form, Input, InputGroup, FormFeedback } from "reactstrap";
import * as Yup from 'yup';
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const FormLayouts = () => {

  //meta title
  document.title = "Form Layouts | Skote - Vite React Admin & Dashboard Template";

  const formik = useFormik({
    initialValues: {
      firstname: "",
      email: "",
      password: "",
      city: "",
      state: "",
      zip: "",
      check: ""
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("This field is required"),
      email: Yup.string().email().matches(/^(?!.*@[^,]*,)/).required("Please Enter Your Email"),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(RegExp('(.*[a-z].*)'), 'At least lowercase letter')
        .matches(RegExp('(.*[A-Z].*)'), 'At least uppercase letter')
        .matches(RegExp('(.*[0-9].*)'), 'At least one number')
        .required("This field is required"),
      city: Yup.string().required("This field is required"),
      state: Yup.string().required("This field is required"),
      zip: Yup.string().required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  //Horizontal form 
  const horizontalformik = useFormik({
    initialValues: {
      firstname: "",
      email: "",
      password: "",
      check: ""
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("This field is required"),
      email: Yup.string().email().matches(/^(?!.*@[^,]*,)/).required("Please Enter Your Email"),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(RegExp('(.*[a-z].*)'), 'At least lowercase letter')
        .matches(RegExp('(.*[A-Z].*)'), 'At least uppercase letter')
        .matches(RegExp('(.*[0-9].*)'), 'At least one number')
        .required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  //auto sizeing form
  const autoformik = useFormik({
    initialValues: {
      name: "",
      username: "",
      state: "",
      check: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("This field is required"),
      username: Yup.string().required("This field is required"),
      state: Yup.string().required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  //Inline forms
  const inlineformik = useFormik({
    initialValues: {
      username: "",
      select: "",
      check: ""
    },
    validationSchema: Yup.object({
      username: Yup.string().required("This field is required"),
      select: Yup.string().required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  //Floating labels forms
  const floatingformik = useFormik({
    initialValues: {
      name: "",
      email: "",
      select: "",
      check: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("This field is required"),
      email: Yup.string().email().matches(/^(?!.*@[^,]*,)/).required("Please Enter Your Email"),
      select: Yup.string().required("This field is required"),
      check: Yup.string().required("This field is required"),
    }),

    onSubmit: (values) => {
      // console.log("value", values.password);
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Forms" breadcrumbItem="Form Layouts" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Form Grid Layout</CardTitle>

                  <Form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <Label htmlFor="formrow-firstname-Input">First Name</Label>
                      <Input
                        type="text"
                        name="firstname"
                        className="form-control"
                        id="formrow-firstname-Input"
                        placeholder="Enter Your First Name"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.firstname && formik.errors.firstname ? true : false
                        }
                      />
                      {
                        formik.errors.firstname && formik.touched.firstname ? (
                          <FormFeedback type="invalid">{formik.errors.firstname}</FormFeedback>
                        ) : null
                      }
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-email-Input">Email</Label>
                          <Input
                            type="email"
                            name="email"
                            className="form-control"
                            id="formrow-email-Input"
                            placeholder="Enter Your Email ID"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.email && formik.errors.email ? true : false
                            }
                          />
                          {
                            formik.errors.email && formik.touched.email ? (
                              <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                            ) : null
                          }
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-password-Input">Password</Label>
                          <Input
                            type="password"
                            name="password"
                            className="form-control"
                            id="formrow-password-Input"
                            placeholder="Enter Your Password"
                            autoComplete="off"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.password && formik.errors.password ? true : false
                            }
                          />
                          {
                            formik.errors.password && formik.touched.password ? (
                              <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                            ) : null
                          }
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={4}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-InputCity">City</Label>
                          <Input
                            type="text"
                            name="city"
                            className="form-control"
                            id="formrow-InputCity"
                            placeholder="Enter Your Living City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.city && formik.errors.city ? true : false
                            }
                          />
                          {
                            formik.errors.city && formik.touched.city ? (
                              <FormFeedback type="invalid">{formik.errors.city}</FormFeedback>
                            ) : null
                          }
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-InputState">State</Label>
                          <select
                            name="state"
                            id="formrow-InputState"
                            className="form-control"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option >Choose...</option>
                            <option>...</option>
                          </select>
                          {
                            formik.errors.state && formik.touched.state ? (
                              <span className="text-danger">{formik.errors.state}</span>
                            ) : null
                          }
                        </div>
                      </Col>

                      <Col lg={4}>
                        <div className="mb-3">
                          <Label htmlFor="formrow-InputZip">Zip</Label>
                          <Input
                            type="text"
                            name="zip"
                            className="form-control"
                            id="formrow-InputZip"
                            placeholder="Enter Your Zip Code"
                            value={formik.values.zip}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.zip && formik.errors.zip ? true : false
                            }
                          />
                          {
                            formik.errors.zip && formik.touched.zip ? (
                              <FormFeedback type="invalid">{formik.errors.zip}</FormFeedback>
                            ) : null
                          }
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          className="form-check-Input"
                          id="formrow-customCheck"
                          name="check"
                          value={formik.values.check}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.touched.check && formik.errors.check ? true : false
                          }
                        />
                        <Label
                          className="form-check-Label"
                          htmlFor="formrow-customCheck"
                        >
                          Check me out
                        </Label>
                      </div>
                      {
                        formik.errors.check && formik.touched.check ? (
                          <FormFeedback type="invalid">{formik.errors.check}</FormFeedback>
                        ) : null
                      }
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary w-md">
                        Submit
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Horizontal form Layout</CardTitle>
                  <Form onSubmit={horizontalformik.handleSubmit}>
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-firstname-Input"
                        className="col-sm-3 col-form-label"
                      >
                        First name
                      </Label>
                      <Col sm={9}>
                        <Input
                          name="firstname"
                          type="text"
                          className="form-control"
                          id="horizontal-firstname-Input"
                          placeholder="Enter Your"
                          value={horizontalformik.values.firstname}
                          onChange={horizontalformik.handleChange}
                          onBlur={horizontalformik.handleBlur}
                          invalid={
                            horizontalformik.touched.firstname && horizontalformik.errors.firstname ? true : false
                          }
                        />
                        {
                          horizontalformik.errors.firstname && horizontalformik.touched.firstname ? (
                            <FormFeedback type="invalid">{horizontalformik.errors.firstname}</FormFeedback>
                          ) : null
                        }
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-email-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Email
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="email"
                          name="email"
                          className="form-control"
                          id="horizontal-email-Input"
                          placeholder="Enter Your Email ID"
                          value={horizontalformik.values.email}
                          onChange={horizontalformik.handleChange}
                          onBlur={horizontalformik.handleBlur}
                          invalid={
                            horizontalformik.touched.email && horizontalformik.errors.email ? true : false
                          }
                        />
                        {
                          horizontalformik.errors.email && horizontalformik.touched.email ? (
                            <FormFeedback type="invalid">{horizontalformik.errors.email}</FormFeedback>
                          ) : null
                        }
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-password-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Password
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="password"
                          name="password"
                          className="form-control"
                          id="horizontal-password-Input"
                          autoComplete="off"
                          placeholder="Enter Your Password"
                          value={horizontalformik.values.password}
                          onChange={horizontalformik.handleChange}
                          onBlur={horizontalformik.handleBlur}
                          invalid={
                            horizontalformik.touched.password && horizontalformik.errors.password ? true : false
                          }
                        />
                        {
                          horizontalformik.errors.password && horizontalformik.touched.password ? (
                            <FormFeedback type="invalid">{horizontalformik.errors.password}</FormFeedback>
                          ) : null
                        }
                      </Col>
                    </Row>

                    <Row className="justify-content-end">
                      <Col sm={9}>
                        <div className="form-check mb-4">
                          <Input
                            type="checkbox"
                            name="check"
                            className="form-check-Input"
                            id="horizontal-customCheck"
                            value={horizontalformik.values.check}
                            onChange={horizontalformik.handleChange}
                            onBlur={horizontalformik.handleBlur}
                            invalid={
                              horizontalformik.touched.check && horizontalformik.errors.check ? true : false
                            }
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="horizontal-customCheck"
                          >
                            Remember me
                          </Label>
                          <div>
                            {
                              horizontalformik.errors.check && horizontalformik.touched.check ? (
                                <FormFeedback type="invalid">{horizontalformik.errors.check}</FormFeedback>
                              ) : null
                            }
                          </div>
                        </div>

                        <div>
                          <button type="submit" className="btn btn-primary w-md">
                            Submit
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">Auto Sizing</CardTitle>

                  <Form className="row gy-2 gx-3 align-items-center" onSubmit={autoformik.handleSubmit}>
                    <div className="col-sm-auto">
                      <Label className="visually-hidden" htmlFor="autoSizingInput">Name</Label>
                      <Input type="text" name="name" className="form-control" id="autoSizingInput" placeholder="Jane Doe"
                        value={autoformik.values.name}
                        onChange={autoformik.handleChange}
                        onBlur={autoformik.handleBlur}
                        invalid={
                          autoformik.touched.name && autoformik.errors.name ? true : false
                        } />
                      {
                        autoformik.errors.name && autoformik.touched.name ? (
                          <FormFeedback type="invalid">{autoformik.errors.name}</FormFeedback>
                        ) : null
                      }
                    </div>
                    <div className="col-sm-auto">
                      <Label className="visually-hidden" htmlFor="autoSizingInputGroup">Username</Label>
                      <InputGroup>
                        <div className="input-group-text">@</div>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="autoSizingInputGroup"
                          placeholder="Username"
                          value={autoformik.values.username}
                          onChange={autoformik.handleChange}
                          onBlur={autoformik.handleBlur} />
                      </InputGroup>
                      {
                        autoformik.errors.username && autoformik.touched.username ? (
                          <span className="text-danger">{autoformik.errors.username}</span>
                        ) : null
                      }
                    </div>
                    <div className="col-sm-auto">
                      <label className="visually-hidden" htmlFor="autoSizingSelect">Preference</label>
                      <select className="form-select" name="state"
                        value={autoformik.values.state}
                        onChange={autoformik.handleChange}
                        onBlur={autoformik.handleBlur}
                      >
                        <option defaultValue="0">Choose...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      {
                        autoformik.errors.state && autoformik.touched.state ? (
                          <span className="text-danger">{autoformik.errors.state}</span>
                        ) : null
                      }
                    </div>
                    <div className="col-sm-auto">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="autoSizingCheck" name="check"
                          value={autoformik.values.check}
                          onChange={autoformik.handleChange}
                          onBlur={autoformik.handleBlur}
                        />
                        <label className="form-check-label" htmlFor="autoSizingCheck">
                          Remember me
                        </label>

                        <div>
                          {
                            autoformik.errors.check && autoformik.touched.check ? (
                              <span className="text-danger">{autoformik.errors.check}</span>
                            ) : null
                          }
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <button type="submit" className="btn btn-primary w-md">Submit</button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* end row  */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">Inline forms</CardTitle>

                  <Form className="row row-cols-lg-auto g-3 align-items-center" onSubmit={inlineformik.handleSubmit}>
                    <Col xs={12}>
                      <label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Username</label>
                      <InputGroup>
                        <div className="input-group-text">@</div>
                        <input type="text" name="username" className="form-control" id="inlineFormInputGroupUsername" placeholder="Username"
                          value={inlineformik.values.username}
                          onChange={inlineformik.handleChange}
                          onBlur={inlineformik.handleBlur} />
                      </InputGroup>
                      {
                        inlineformik.errors.username && inlineformik.touched.username ? (
                          <span className="text-danger">{inlineformik.errors.username}</span>
                        ) : null
                      }
                    </Col>

                    <Col xs={12}>
                      <label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</label>
                      <select className="form-select" name="select"
                        value={inlineformik.values.select}
                        onChange={inlineformik.handleChange}
                        onBlur={inlineformik.handleBlur} >
                        <option value="0">Choose...</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                      {
                        inlineformik.errors.select && inlineformik.touched.select ? (
                          <span className="text-danger">{inlineformik.errors.select}</span>
                        ) : null
                      }
                    </Col>

                    <Col xs={12}>
                      <div className="form-check">
                        <input className="form-check-input" name="check" type="checkbox" id="inlineFormCheck"
                          value={inlineformik.values.check}
                          onChange={inlineformik.handleChange}
                          onBlur={inlineformik.handleBlur} />
                        <label className="form-check-label" htmlFor="inlineFormCheck">
                          Remember me
                        </label>
                      </div>
                      <div>
                        {
                          inlineformik.errors.check && inlineformik.touched.check ? (
                            <span className="text-danger">{inlineformik.errors.check}</span>
                          ) : null
                        }
                      </div>
                    </Col>

                    <Col xs={12}>
                      <button type="submit" className="btn btn-primary w-md">Submit</button>
                    </Col>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h5">Floating labels</CardTitle>
                  <p className="card-title-desc">Create beautifully simple form labels that float over your input fields.</p>

                  <Form onSubmit={floatingformik.handleSubmit} >
                    <div className="form-floating mb-3">
                      <input type="text" name="name" className="form-control" id="floatingnameInput" placeholder="Enter Name"
                        value={floatingformik.values.name}
                        onChange={floatingformik.handleChange}
                        onBlur={floatingformik.handleBlur}
                      />
                      <label htmlFor="floatingnameInput">Name</label>
                      {
                        floatingformik.errors.name && floatingformik.touched.name ? (
                          <span className="text-danger">{floatingformik.errors.name}</span>
                        ) : null
                      }
                    </div>
                    <Row>
                      <Col md={6}>
                        <div className="form-floating mb-3">
                          <input type="email" name="email" className="form-control" id="floatingemailInput" placeholder="Enter Email address"
                            value={floatingformik.values.email}
                            onChange={floatingformik.handleChange}
                            onBlur={floatingformik.handleBlur}
                          />
                          <label htmlFor="floatingemailInput">Email address</label>
                          {
                            floatingformik.errors.email && floatingformik.touched.email ? (
                              <span className="text-danger">{floatingformik.errors.email}</span>
                            ) : null
                          }
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-floating mb-3">
                          <select className="form-select" name="select"
                            value={floatingformik.values.select}
                            onChange={floatingformik.handleChange}
                            onBlur={floatingformik.handleBlur}>
                            <option defaultValue="0">Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                          <label htmlFor="floatingSelectGrid">Works with selects</label>
                          <div>
                            {
                              floatingformik.errors.select && floatingformik.touched.select ? (
                                <span className="text-danger">{floatingformik.errors.select}</span>
                              ) : null
                            }
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">

                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="floatingCheck" name="check"
                          value={floatingformik.values.check}
                          onChange={floatingformik.handleChange}
                          onBlur={floatingformik.handleBlur} />
                        <label className="form-check-label" htmlFor="floatingCheck">
                          Check me out
                        </label>
                      </div>
                      {
                        floatingformik.errors.check && floatingformik.touched.check ? (
                          <span className="text-danger">{floatingformik.errors.check}</span>
                        ) : null
                      }
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary w-md">Submit</button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">Inline Forms With Hstack</CardTitle>
                  <div className="hstack gap-3">
                    <Input className="form-control me-auto" type="text" placeholder="Add your item here..."
                      aria-label="Add your item here..." />
                    <button type="button" className="btn btn-secondary">Submit</button>
                    <div className="vr"></div>
                    <button type="button" className="btn btn-outline-danger">Reset</button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormLayouts;
