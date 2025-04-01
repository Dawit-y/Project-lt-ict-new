import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { post } from "../../helpers/api_Lists";
import {
  Row,
  Col,
  CardBody,
  Card,
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
import {
  alphanumericValidation,
  phoneValidation,
  websiteUrlValidation,
} from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USERS_QUERY_KEY } from "../../queries/users_query"
import { CSO_INFO_QUERY_KEY } from "../../queries/csoinfo_query";

// const registerUser = async (data) => await post("/user/signup", data);
const registerUser = async (data) => {
  const params = new URLSearchParams(data).toString();
  return await post(`/user/signup?${params}`);
};


const CsoRegister = () => {
  document.title = "Register";
  const [showPassword, setShowPassword] = useState(false);
  const [csoInfo] = useState("");
  const { t } = useTranslation();

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  const queryClient = useQueryClient();
  const addCsoInfo = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CSO_INFO_QUERY_KEY });
    },
  });

  const handleAddCsoInfo = async (data) => {
    try {
      await addCsoInfo.mutateAsync(data);
      toast.success(t("add_success"), { autoClose: 2000 });
      validation.resetForm();
    } catch {
      toast.error(t("add_failure"), { autoClose: 2000 });
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      cso_name: csoInfo?.cso_name || "",
      cso_address: csoInfo?.cso_address || "",
      usr_phone: csoInfo?.usr_phone || "",
      usr_email: csoInfo?.usr_email || "",
      cso_website: csoInfo?.cso_website || "",
      usr_password: "",
      usr_confirm_password: "",
    },
    validationSchema: Yup.object({
      cso_name: alphanumericValidation(3, 150, true),
      cso_address: alphanumericValidation(3, 150, true),
      usr_phone: phoneValidation(true),
      usr_email: Yup.string()
        .required(t("usr_email"))
        .email(t("Invalid email format")),
      cso_website: websiteUrlValidation(true),
      usr_password: Yup.string()
        .required(t("usr_password"))
        .min(8, t("Password must be at least 8 characters"))
        .matches(
          /[a-z]/,
          t("Password must contain at least one lowercase letter")
        )
        .matches(
          /[A-Z]/,
          t("Password must contain at least one uppercase letter")
        )
        .matches(/\d/, t("Password must contain at least one number"))
        .matches(
          /[@$!%*?&#]/,
          t("Password must contain at least one special character")
        ),
      usr_confirm_password: Yup.string()
        .required(t("Please confirm your password"))
        .oneOf([Yup.ref("usr_password")], t("Passwords must match")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const newCsoInfo = {
        cso_name: values.cso_name,
        cso_address: values.cso_address,
        usr_phone: `+251${values.usr_phone}`,
        usr_email: values.usr_email,
        cso_website: values.cso_website,
        usr_password: values.usr_password,
      };
      handleAddCsoInfo(newCsoInfo);
    },
  });

  return (
    <div className="my-5 pt-sm-5" style={{ overflowX: "hidden" }}>
      <div>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={6}>
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
                <Form onSubmit={validation.handleSubmit}>
                  <Row>
                    <Col md={6} sm={12} className='mb-3'>
                      <Label>{t('cso_name')}</Label>
                      <span className="text-danger">*</span>
                      <Input
                        name='cso_name'
                        type='text'
                        placeholder={t('cso_name')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cso_name || ''}
                        invalid={
                          validation.touched.cso_name &&
                            validation.errors.cso_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.cso_name &&
                        validation.errors.cso_name ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cso_name}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col md={6} sm={12} className='col-md-6 mb-3'>
                      <Label>{t('usr_email')}</Label>
                      <span className="text-danger">*</span>
                      <Input
                        name='usr_email'
                        type='text'
                        placeholder={t('usr_email')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usr_email || ''}
                        invalid={
                          validation.touched.usr_email &&
                            validation.errors.usr_email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.usr_email &&
                        validation.errors.usr_email ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.usr_email}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} sm={12} className='col-md-6 mb-3'>
                      <Label>{t('cso_address')}</Label>
                      <span className="text-danger">*</span>
                      <Input
                        name='cso_address'
                        type='text'
                        placeholder={t('cso_address')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cso_address || ''}
                        invalid={
                          validation.touched.cso_address &&
                            validation.errors.cso_address
                            ? true
                            : false
                        }
                      />
                      {validation.touched.cso_address &&
                        validation.errors.cso_address ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cso_address}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col md={6} sm={12} className="col-md-6 mb-3">
                      <Label>
                        Phone Number <span className="text-danger">*</span>
                      </Label>
                      <InputGroup>
                        <InputGroupText>{"+251"}</InputGroupText>
                        <Input
                          name="usr_phone"
                          type="text"
                          placeholder="Enter phone number"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            let formattedValue = inputValue.replace(/^0/, "");
                            formattedValue = formattedValue.replace(/[^\d]/g, "");
                            formattedValue = formattedValue.substring(0, 9);
                            validation.setFieldValue(
                              "usr_phone",
                              formattedValue
                            );
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.usr_phone}
                          invalid={
                            validation.touched.usr_phone &&
                            !!validation.errors.usr_phone
                          }
                        />
                        {validation.touched.usr_phone &&
                          validation.errors.usr_phone ? (
                          <FormFeedback type="invalid">
                            {validation.errors.usr_phone}
                          </FormFeedback>
                        ) : null}
                      </InputGroup>
                    </Col>
                  </Row>

                  <Col className='col-md-12 mb-3'>
                    <Label>{t('cso_website')}</Label>
                    <span className="text-danger">*</span>
                    <Input
                      name='cso_website'
                      type='text'
                      placeholder={t('cso_website')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.cso_website || ''}
                      invalid={
                        validation.touched.cso_website &&
                          validation.errors.cso_website
                          ? true
                          : false
                      }
                    />
                    {validation.touched.cso_website &&
                      validation.errors.cso_website ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.cso_website}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-12 mb-3">
                    <Label>
                      {t("usr_password")}{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <InputGroup>
                      <Input
                        name="usr_password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("usr_password")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usr_password || ""}
                        invalid={
                          validation.touched.usr_password &&
                            validation.errors.usr_password
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      <InputGroupText
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroupText>
                      {validation.touched.usr_password &&
                        validation.errors.usr_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.usr_password}
                        </FormFeedback>
                      ) : null}
                    </InputGroup>
                  </Col>
                  <Col className="col-md-12 mb-3">
                    <Label>
                      {t("usr_confirm_password")}{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <InputGroup>
                      <Input
                        name="usr_confirm_password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("usr_confirm_password")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usr_confirm_password || ""}
                        invalid={
                          validation.touched.usr_confirm_password &&
                            validation.errors.usr_confirm_password
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      <InputGroupText
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroupText>
                      {validation.touched.usr_confirm_password &&
                        validation.errors.usr_confirm_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.usr_confirm_password}
                        </FormFeedback>
                      ) : null}
                    </InputGroup>
                  </Col>
                  <div className="mt-3 d-grid">
                    <button
                      className="btn btn-primary btn-block"
                      type="submit"
                      disabled={addCsoInfo.isPending}
                    >
                      {addCsoInfo.isPending ? (
                        <Spinner size="sm" className="me-2" />
                      ) : null}{" "}
                      {t("register")}
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <div className="mt-5 text-center">
              <p>
                {t("have_account")}{" "}
                <Link to="/login" className="fw-medium text-primary">
                  {t("Login")}
                </Link>
              </p>
              <p>
                © {new Date().getFullYear()} {FOOTER_TEXT}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

CsoRegister.propTypes = {
  history: PropTypes.object,
};

export default CsoRegister;