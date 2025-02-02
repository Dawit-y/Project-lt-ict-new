import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Col,
  Row,
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { useUpdateUsers, useSearchUserss } from "../../queries/users_query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ImageUploader from "../../components/Common/ImageUploader";
import {
  alphanumericValidation,
  phoneValidation,
} from "../../utils/Validation/validation";

const UpdateModal = ({ modal, toggle, profile }) => {
  const { t } = useTranslation();
  const { data } = useSearchUserss({ usr_id: 6 });
  console.log(data);
  const updateUsers = useUpdateUsers();
  const handleUpdateUsers = async (data) => {
    try {
      await updateUsers.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      usr_full_name: (profile && profile.usr_full_name) || "",
      usr_phone_number: (profile && profile.usr_phone_number) || "",
      usr_picture: (profile && profile.usr_picture) || "",
      usr_email: (profile && profile.usr_email) || "",
    },
    validationSchema: Yup.object({
      usr_full_name: alphanumericValidation(3, 50, true),
      usr_phone_number: phoneValidation(true),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const updateUsers = {
        usr_id: profile?.usr_id,
        usr_email: profile?.usr_email,
        usr_full_name: values.usr_full_name,
        usr_phone_number: values.usr_phone_number,
      };
      handleUpdateUsers(updateUsers);
    },
  });
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          <div>{t("edit") + " " + t("profile")}</div>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col className="col-md-6 mb-3">
                <Label>
                  {t("usr_full_name")} <span className="text-danger">*</span>
                </Label>
                <Input
                  name="usr_full_name"
                  type="text"
                  placeholder={t("usr_full_name")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.usr_full_name || ""}
                  invalid={
                    validation.touched.usr_full_name &&
                    validation.errors.usr_full_name
                      ? true
                      : false
                  }
                  maxLength={30}
                />
                {validation.touched.usr_full_name &&
                validation.errors.usr_full_name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.usr_full_name}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>
                  Phone Number <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <InputGroupText>{"+251"}</InputGroupText>
                  <Input
                    name="usr_phone_number"
                    type="text"
                    placeholder="Enter phone number"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      let formattedValue = inputValue.replace(/^0/, "");
                      formattedValue = formattedValue.replace(/[^\d]/g, "");
                      formattedValue = formattedValue.substring(0, 9);
                      validation.setFieldValue(
                        "usr_phone_number",
                        formattedValue
                      );
                    }}
                    onBlur={validation.handleBlur}
                    value={validation.values.usr_phone_number}
                    invalid={
                      validation.touched.usr_phone_number &&
                      !!validation.errors.usr_phone_number
                    }
                  />
                  {validation.touched.usr_phone_number &&
                  validation.errors.usr_phone_number ? (
                    <FormFeedback type="invalid">
                      {validation.errors.usr_phone_number}
                    </FormFeedback>
                  ) : null}
                </InputGroup>
              </Col>

              <ImageUploader validation={validation} />
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {updateUsers.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={updateUsers.isPending || !validation.dirty}
                    >
                      <Spinner size={"sm"} color="light" className="me-2" />
                      {t("Save")}
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={updateUsers.isPending || !validation.dirty}
                    >
                      <div>{t("Save")}</div>
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default UpdateModal;
