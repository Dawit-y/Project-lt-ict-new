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
import DatePicker from "../../components/Common/DatePicker";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns";
import { useTranslation } from "react-i18next";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import {
  createMultiLangKeyValueMap,
  addMonths,
  addYears,
  createKeyValueMap,
} from "../../utils/commonMethods";

const ProjectForm = ({
  isOpen,
  toggle,
  isEdit,
  activeTabName,
  validation,
  isPending,
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

  const {
    data: sectorCategories,
    isLoading: isSectorCatLoading,
    isError: isSectorCatError,
  } = useFetchSectorCategorys();
  const sectorCategoryMap = useMemo(() => {
    return createKeyValueMap(
      sectorCategories?.data || [],
      "psc_id",
      "psc_name",
      (item) => item.psc_cso_active === 1,
    );
  }, [sectorCategories]);

  const rawStartDate = validation.values.prj_start_date_plan_gc;
  const startDate = rawStartDate
    ? new Date(rawStartDate.replace(/\//g, "-"))
    : null;

  const minEndDate = startDate ? addMonths(startDate, 1) : null;
  const maxEndDate = startDate ? addYears(startDate, 5) : null;
  return (
		<Modal isOpen={isOpen} toggle={toggle} className="modal-xl">
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
						<Col className="col-md-12 mb-3">
							<CascadingDropdowns
								validation={validation}
								dropdown1name="prj_location_region_id"
								dropdown2name="prj_location_zone_id"
								dropdown3name="prj_location_woreda_id"
								required={true}
								layout="horizontal"
								colSizes={{ md: 6, sm: 12, lg: 4 }}
							/>
						</Col>
						<InputField
							type="textarea"
							validation={validation}
							fieldId={"prj_location_description"}
							isRequired={false}
							className="col-md-12 mb-3"
							maxLength={400}
						/>
						<Col className="col-md-4 mb-3">
							<Label>
								{t("prj_name")}
								<span className="text-danger">*</span>
							</Label>
							<Input
								name="prj_name"
								type="text"
								placeholder={t("prj_name")}
								onChange={(e) => {
									validation.handleChange(e);
									validation.setFieldValue("prj_name_en", e.target.value);
								}}
								onBlur={validation.handleBlur}
								value={validation.values.prj_name || ""}
								invalid={
									validation.touched.prj_name && validation.errors.prj_name
										? true
										: false
								}
								maxLength={200}
							/>
							{validation.touched.prj_name && validation.errors.prj_name ? (
								<FormFeedback type="invalid">
									{validation.errors.prj_name}
								</FormFeedback>
							) : null}
						</Col>
						<InputField
							type="text"
							validation={validation}
							fieldId={"prj_name_am"}
							isRequired={false}
							className="col-md-4 mb-3"
							maxLength={200}
						/>
						<InputField
							type="text"
							validation={validation}
							fieldId={"prj_name_en"}
							isRequired={true}
							className="col-md-4 mb-3"
							maxLength={200}
						/>
						<InputField
							type="text"
							validation={validation}
							fieldId={"prj_code"}
							isRequired={false}
							className="col-md-4 mb-3"
							maxLength={20}
						/>
						<AsyncSelectField
							fieldId="prj_project_category_id"
							validation={validation}
							isRequired
							className="col-md-4 mb-3"
							optionMap={projectCategoryMap}
							isLoading={isPctLoading}
							isError={isPctError}
						/>
						<AsyncSelectField
							fieldId="prj_cluster_id"
							validation={validation}
							isRequired
							className="col-md-4 mb-3"
							optionMap={sectorCategoryMap}
							isLoading={isSectorCatLoading}
							isError={isSectorCatError}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_total_estimate_budget"}
							isRequired={true}
							className="col-md-4 mb-3"
							allowDecimal={true}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_total_actual_budget"}
							isRequired={true}
							className="col-md-4 mb-3"
							allowDecimal={true}
						/>
						<Col className="col-md-4 mb-3">
							<DatePicker
								isRequired={true}
								componentId={"prj_start_date_plan_gc"}
								validation={validation}
							/>
						</Col>
						<Col className="col-md-4 mb-3">
							<DatePicker
								isRequired={true}
								componentId={"prj_end_date_plan_gc"}
								validation={validation}
								minDate={minEndDate}
								maxDate={maxEndDate}
							/>
						</Col>
						<Row>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_urban_ben_number"}
								isRequired={false}
								className="col-md-3 mb-3"
								allowDecimal={false}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_rural_ben_number"}
								isRequired={false}
								className="col-md-3 mb-3"
								allowDecimal={false}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_male_participant"}
								isRequired={true}
								className="col-md-3 mb-3"
								allowDecimal={false}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"prj_female_participant"}
								isRequired={true}
								className="col-md-3 mb-3"
								allowDecimal={false}
							/>
						</Row>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_admin_cost"}
							isRequired={true}
							className="col-md-4 mb-3"
							allowDecimal={true}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_program_cost"}
							isRequired={true}
							className="col-md-4 mb-3"
							allowDecimal={true}
						/>
						<InputField
							type="textarea"
							validation={validation}
							fieldId={"prj_outcome"}
							isRequired={false}
							className="col-md-6 mb-3"
							maxLength={400}
						/>
						<InputField
							type="textarea"
							validation={validation}
							fieldId={"prj_remark"}
							isRequired={false}
							className="col-md-6 mb-3"
							maxLength={400}
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

export default ProjectForm;
