import React, { useMemo } from "react";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Spinner,
  Table,
} from "reactstrap";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import InputField from "../../components/Common/InputField";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import { useTranslation } from "react-i18next";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import {
  createMultiLangKeyValueMap,
  addMonths,
  addYears,
} from "../../utils/commonMethods";

const ActivityForm = ({
  isOpen,
  toggle,
  isEdit,
  activeTabName,
  validation,
  isPending,
  leftBudget,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const {
    data: projectCategoryData,
    isLoading: isPctLoading,
    isError: isPctError,
  } = useFetchProjectCategorys();
  const projectCategoryMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      projectCategoryData?.data || [],
      "pct_id",
      {
        en: "pct_name_en",
        am: "pct_name_am",
        or: "pct_name_or",
      },
      lang,
      (item) => item.pct_owner_type_id === 2,
    );
  }, [projectCategoryData, lang]);

  return (
    <Modal centered isOpen={isOpen} toggle={toggle} className="modal-xl">
      <ModalHeader toggle={toggle} tag="h4">
        {!!isEdit
          ? t("edit") + " " + t(activeTabName)
          : t("add") + " " + t(activeTabName)}
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
            <InputField
              type="text"
              validation={validation}
              fieldId={"prj_name"}
              label={"Activity Title"}
              isRequired={false}
              className="col-md-4 mb-3"
              maxLength={300}
            />
            <AsyncSelectField
              fieldId="prj_project_category_id"
              validation={validation}
              isRequired
              label={"Activity Category"}
              className="col-md-4 mb-3"
              optionMap={projectCategoryMap}
              isLoading={isPctLoading}
              isError={isPctError}
            />
            <FormattedAmountField
              validation={validation}
              fieldId={"prj_total_actual_budget"}
              sideLabel={`Left Budget: ${parseFloat(leftBudget).toLocaleString()}`}
              isRequired={true}
              className="col-md-4 mb-3"
              allowDecimal={true}
            />
            <InputField
              type="text"
              validation={validation}
              fieldId={"prj_measurement_unit"}
              isRequired={false}
              className="col-md-4 mb-3"
              maxLength={200}
            />
            <FormattedAmountField
              validation={validation}
              fieldId={"prj_measured_figure"}
              isRequired={false}
              allowDecimal={true}
              className="col-md-4 mb-3"
            />
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <Button
                  color="success"
                  type="submit"
                  className="save-user"
                  disabled={isPending || !validation.dirty}
                >
                  {isPending && (
                    <Spinner size="sm" color="light" className="me-2" />
                  )}
                  {t("Save")}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ActivityForm;
