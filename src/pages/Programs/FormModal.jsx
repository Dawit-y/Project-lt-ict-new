import PropTypes from "prop-types";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useAddProgramInfo,
  useDeleteProgramInfo,
  useUpdateProgramInfo,
} from "../../queries/programinfo_query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DatePicker from "../../components/Common/DatePicker";
import { addYears } from "../../utils/commonMethods";
import { onlyAmharicValidation } from "../../utils/Validation/validation";

const levels = ["sector", "program", "sub_program", "output"];
function getNextLevel(currentLevel) {
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  return levels[currentIndex + 1];
}

const objectTypeId = [1, 2, 3, 4, 5];
function getNextObjectTypeId(currentId) {
  const id = parseInt(currentId, 10);
  if (id === 1 || id === 2) {
    return 3;
  }
  const currentIndex = objectTypeId.indexOf(id);
  if (currentIndex === -1 || currentIndex === objectTypeId.length - 1) {
    return null;
  }
  return objectTypeId[currentIndex + 1];
}

const FormModal = ({
  show,
  toggle,
  action,
  selectedRow,
  data,
  deleteModal,
  toggleDelete,
}) => {
  const { t } = useTranslation();
  const currentLevel = selectedRow?.level;
  const nextLevel = getNextLevel(currentLevel);
  const addProgramInfo = useAddProgramInfo();
  const updateProgramInfo = useUpdateProgramInfo();
  const deleteProgramInfo = useDeleteProgramInfo();

  const handleAddProgramInfo = async (data) => {
    try {
      await addProgramInfo.mutateAsync(data);
      toast.success(t("add_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
				autoClose: 3000,
			});
    } finally {
      toggle();
    }
  };
  const handleUpdateProgramInfo = async (data) => {
    try {
      await updateProgramInfo.mutateAsync(data);
      toast.success(t("update_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
				autoClose: 3000,
			});
    } finally {
      toggle();
    }
  };
  const handleDeleteProgramInfo = async () => {
    if (selectedRow && selectedRow.p_id) {
      try {
        const id = selectedRow.p_id;
        await deleteProgramInfo.mutateAsync(id);
        toast.success(t("delete_success"), {
					autoClose: 3000,
				});
      } catch (error) {
        toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
      } finally {
        toggleDelete();
      }
    }
  };

  const checkNameExists = (folders, name, idToIgnore = null) => {
    for (const folder of folders) {
      if (
        String(folder.name).trim() === String(name).trim() &&
        folder.id !== idToIgnore
      ) {
        return true;
      }
      if (folder.children && folder.children.length > 0) {
        if (checkNameExists(folder.children, name, idToIgnore)) return true;
      }
    }
    return false;
  };

  const validationSchema = Yup.object({
    pri_name_or: Yup.string()
      .required(t("Field is required."))
      .test("unique", t("Already exists"), function (value) {
        if (action === "add") {
          return !checkNameExists(data, value);
        } else {
          return !checkNameExists(data, value, selectedRow?.id);
        }
      }),
    pri_name_am: onlyAmharicValidation(3, 200, false),
    pri_name_en: Yup.string().required(t("Field is required.")),
    pri_program_code: Yup.string().required(t("Field is required.")),
    pri_start_date:
      currentLevel === "sector" ||
      currentLevel === "program" ||
      (currentLevel === "sub_program" && action === "edit")
        ? Yup.date().required(t("Field is required."))
        : Yup.mixed().notRequired(),

    pri_end_date:
      currentLevel === "sector" ||
      currentLevel === "program" ||
      (currentLevel === "sub_program" && action === "edit")
        ? Yup.date().required(t("Field is required."))
        : Yup.mixed().notRequired(),
  });
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: selectedRow?.id,
      parent_id: selectedRow?.rootId,
      pri_object_type_id: selectedRow?.pri_object_type_id,
      pri_name_or: action === "edit" ? selectedRow?.pri_name_or || "" : "",
      pri_name_am: action === "edit" ? selectedRow?.pri_name_am || "" : "",
      pri_name_en: action === "edit" ? selectedRow?.name || "" : "",
      pri_program_code:
        action === "edit" ? selectedRow?.pri_program_code || "" : "",
      pri_start_date:
        action === "edit" ? selectedRow?.pri_start_date || "" : "",
      pri_end_date: action === "edit" ? selectedRow?.pri_end_date || "" : "",
      pri_description:
        action === "edit" ? selectedRow?.pri_description || "" : "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (action === "add") {
        const newProgramInfo = {
          pri_sector_id: currentLevel === "sector" ? selectedRow?.p_id : "",
          pri_name_or: values.pri_name_or,
          pri_name_am: values.pri_name_am,
          pri_name_en: values.pri_name_en,
          pri_start_date: values.pri_start_date,
          pri_end_date: values.pri_end_date,
          pri_program_code: values.pri_program_code,
          pri_description: values.pri_description,
          parent_id: currentLevel === "sector" ? null : selectedRow?.p_id,
          object_type_id:
            currentLevel === "sector"
              ? 1
              : getNextObjectTypeId(selectedRow?.pri_object_type_id),
        };
        handleAddProgramInfo(newProgramInfo);
      } else if (action === "edit") {
        const updateProgramInfo = {
          pri_id: selectedRow?.p_id,
          pri_sector_id: selectedRow?.pri_sector_id,
          pri_name_or: values.pri_name_or,
          pri_name_am: values.pri_name_am,
          pri_name_en: values.pri_name_en,
          pri_start_date: values.pri_start_date,
          pri_end_date: values.pri_end_date,
          pri_program_code: values.pri_program_code,
          pri_description: values.pri_description,
          parent_id: selectedRow?.rootId,
          object_type_id: selectedRow?.pri_object_type_id,
        };
        handleUpdateProgramInfo(updateProgramInfo);
      }
    },
  });

  const minEndDateForProgram = addYears(validation.values.pri_start_date, 3);

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onCloseClick={toggleDelete}
        onDeleteClick={handleDeleteProgramInfo}
        isLoading={deleteProgramInfo.isPending}
      />
      <Modal centered size="lg" isOpen={show} toggle={toggle}>
        <div className="">
          <ModalHeader toggle={toggle}>
            {action === "add"
              ? `${t("add")} ${
                  selectedRow?.sci_name_or
                    ? ` ${nextLevel} under ${selectedRow.sci_name_or}`
                    : ""
                }`
              : `${t("edit")} - ${selectedRow?.name || ""}`}
          </ModalHeader>
          <ModalBody className="">
            <Form onSubmit={validation.handleSubmit}>
              <Row>
                <Col className="col-md-6 mb-3">
                  <Label>
                    {t("pri_name_or")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="pri_name_or"
                    type="text"
                    placeholder={t("pri_name_or")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pri_name_or || ""}
                    invalid={
                      validation.touched.pri_name_or &&
                      validation.errors.pri_name_or
                        ? true
                        : false
                    }
                    maxLength={200}
                  />
                  {validation.touched.pri_name_or &&
                  validation.errors.pri_name_or ? (
                    <FormFeedback type="invalid">
                      {validation.errors.pri_name_or}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>
                    {t("pri_name_am")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="pri_name_am"
                    type="text"
                    placeholder={t("pri_name_am")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pri_name_am || ""}
                    invalid={
                      validation.touched.pri_name_am &&
                      validation.errors.pri_name_am
                        ? true
                        : false
                    }
                    maxLength={200}
                  />
                  {validation.touched.pri_name_am &&
                  validation.errors.pri_name_am ? (
                    <FormFeedback type="invalid">
                      {validation.errors.pri_name_am}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>
                    {t("pri_name_en")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="pri_name_en"
                    type="text"
                    placeholder={t("pri_name_en")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pri_name_en || ""}
                    invalid={
                      validation.touched.pri_name_en &&
                      validation.errors.pri_name_en
                        ? true
                        : false
                    }
                    maxLength={200}
                  />
                  {validation.touched.pri_name_en &&
                  validation.errors.pri_name_en ? (
                    <FormFeedback type="invalid">
                      {validation.errors.pri_name_en}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>
                    {t("pri_program_code")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="pri_program_code"
                    type="text"
                    placeholder={t("pri_program_code")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pri_program_code || ""}
                    invalid={
                      validation.touched.pri_program_code &&
                      validation.errors.pri_program_code
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.pri_program_code &&
                  validation.errors.pri_program_code ? (
                    <FormFeedback type="invalid">
                      {validation.errors.pri_program_code}
                    </FormFeedback>
                  ) : null}
                </Col>
                {(currentLevel === "sector" ||
                  currentLevel === "program" ||
                  (currentLevel === "sub_program" && action === "edit")) && (
                  <>
                    <Col className="col-md-6 mb-3">
                      <DatePicker
                        isRequired={true}
                        componentId={"pri_start_date"}
                        validation={validation}
                      />
                    </Col>
                    <Col className="col-md-6 mb-3">
                      <DatePicker
                        isRequired={true}
                        componentId={"pri_end_date"}
                        validation={validation}
                        minDate={
                          currentLevel === "sector"
                            ? minEndDateForProgram
                            : validation.values.pri_start_date
                        }
                      />
                    </Col>
                  </>
                )}
                <Col className="col-md-12 mb-3">
                  <Label>{t("pri_description")}</Label>
                  <Input
                    name="pri_description"
                    type="textarea"
                    rows={4}
                    placeholder={t("pri_description")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pri_description || ""}
                    invalid={
                      validation.touched.pri_description &&
                      validation.errors.pri_description
                        ? true
                        : false
                    }
                    maxLength={400}
                  />
                  {validation.touched.pri_description &&
                  validation.errors.pri_description ? (
                    <FormFeedback type="invalid">
                      {validation.errors.pri_description}
                    </FormFeedback>
                  ) : null}
                </Col>
              </Row>
              <Button
                type="submit"
                color={action === "add" ? "primary" : "success"}
                style={{ width: "120px" }}
                disabled={
                  addProgramInfo.isPending || updateProgramInfo.isPending
                }
              >
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  {addProgramInfo.isPending || updateProgramInfo.isPending ? (
                    <Spinner size={"sm"} />
                  ) : (
                    ""
                  )}
                  <span> {action === "add" ? t("add") : t("edit")}</span>
                </div>
              </Button>
            </Form>
          </ModalBody>
        </div>
      </Modal>
    </>
  );
};

FormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  action: PropTypes.oneOf(["add", "edit"]),
  selectedRow: PropTypes.object,
};

export default FormModal;
