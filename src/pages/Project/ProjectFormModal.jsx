import React, { useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Input,
	Label,
} from "reactstrap";
import {
	alphanumericValidation,
	numberValidation,
	onlyAmharicValidation,
	formattedAmountValidation,
} from "../../utils/Validation/validation";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import DatePicker from "../../components/Common/DatePicker";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import InputField from "../../components/Common/InputField";

const ProjectFormModal = ({
	isOpen,
	toggle,
	isEdit,
	project = {},
	selectedNode,
	onSubmit,
	projectsData,
	isLoading: isFormLoading,
}) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const {
		data: projectCategoryData,
		isLoading: prCategoryLoading,
		isError: prCategoryIsError,
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
			(item) => item.pct_owner_type_id === 1
		);
	}, [projectCategoryData, lang]);

	// validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prj_name: (project && project.prj_name) || "",
			prj_name_am: (project && project.prj_name_am) || "",
			prj_name_en: (project && project.prj_name_en) || "",
			prj_code: (project && project.prj_code) || "",
			prj_project_status_id: (project && project.prj_project_status_id) || "",
			prj_project_category_id:
				(project && project.prj_project_category_id) || "",
			prj_project_budget_source_id:
				(project && project.prj_project_budget_source_id) || "",
			prj_total_estimate_budget:
				(project && project.prj_total_estimate_budget) || "",
			prj_total_actual_budget:
				(project && project.prj_total_actual_budget) || "",
			prj_geo_location: (project && project.prj_geo_location) || "",
			prj_sector_id: (project && project.prj_sector_id) || "",
			prj_location_region_id:
				(project && project.prj_location_region_id) ||
				selectedNode?.data?.region_id,
			prj_location_zone_id:
				(project && project.prj_location_zone_id) ||
				selectedNode?.data?.zone_id,
			prj_location_woreda_id:
				(project && project.prj_location_woreda_id) ||
				selectedNode?.data?.woreda_id,
			prj_owner_region_id: (project && project.prj_owner_region_id) || "",
			prj_owner_zone_id: (project && project.prj_owner_zone_id) || "",
			prj_owner_woreda_id: (project && project.prj_owner_woreda_id) || "",
			prj_location_description:
				(project && project.prj_location_description) || "",
			prj_owner_description: (project && project.prj_owner_description) || "",
			prj_start_date_et: (project && project.prj_start_date_et) || "",
			prj_start_date_gc: (project && project.prj_start_date_gc) || "",
			prj_start_date_plan_et: (project && project.prj_start_date_plan_et) || "",
			prj_start_date_plan_gc: (project && project.prj_start_date_plan_gc) || "",
			prj_end_date_actual_et: (project && project.prj_end_date_actual_et) || "",
			prj_end_date_actual_gc: (project && project.prj_end_date_actual_gc) || "",
			prj_end_date_plan_gc: (project && project.prj_end_date_plan_gc) || "",
			prj_end_date_plan_et: (project && project.prj_end_date_plan_et) || "",
			prj_outcome: (project && project.prj_outcome) || "",
			prj_deleted: (project && project.prj_deleted) || "",
			prj_remark: (project && project.prj_remark) || "",
			prj_created_date: (project && project.prj_created_date) || "",
			prj_owner_id: (project && project.prj_owner_id) || "",
			prj_urban_ben_number: (project && project.prj_urban_ben_number) || "",
			prj_rural_ben_number: (project && project.prj_rural_ben_number) || "",
			prj_measurement_unit: (project && project.prj_measurement_unit) || "",
			prj_measured_figure: (project && project.prj_measured_figure) || "",
			prj_parent_id: (project && project.prj_parent_id) || "",
			prj_object_type_id: (project && project.prj_object_type_id) || "",
		},

		validationSchema: Yup.object({
			prj_name: alphanumericValidation(3, 200, true).test(
				"unique-prj_name",
				t("Already exists"),
				(value) => {
					return !projectsData?.data.some(
						(item) => item.prj_name == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_name_am: onlyAmharicValidation(3, 200, false),
			prj_name_en: alphanumericValidation(3, 200, true).test(
				"unique-prj_name_en",
				t("Already exists"),
				(value) => {
					return !projectsData?.data.some(
						(item) =>
							item.prj_name_en == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_code: Yup.string(),
			prj_project_category_id: numberValidation(1, 200, true),
			prj_total_estimate_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_total_actual_budget: formattedAmountValidation(
				1000,
				1000000000000,
				false
			),
			prj_start_date_plan_gc: Yup.string().required(
				t("prj_start_date_plan_gc")
			),
			prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
			prj_urban_ben_number: numberValidation(0, 10000000, false),
			prj_rural_ben_number: numberValidation(0, 10000000, false),
			prj_measured_figure: formattedAmountValidation(1, 100000000000, true),
			prj_measurement_unit: Yup.string().required(t("prj_measurement_unit")),
			prj_location_description: alphanumericValidation(3, 425, false),
			prj_remark: alphanumericValidation(3, 425, false),

			// prj_owner_region_id: Yup.string().required(t("val_required")),
			// prj_owner_zone_id: Yup.string().required(t("val_required")),
			// prj_owner_woreda_id: Yup.string().required(t("val_required")),
			// prj_cluster_id: Yup.string().required(t("val_required")),
			// prj_sector_id: Yup.string().required(t("val_required")),
			// prj_program_id: Yup.string().required(t("val_required")),
			// prj_sub_program_id: Yup.string().required(t("val_required")),
			// prj_parent_id: Yup.string().required(t("val_required")),
		}),
		validateOnBlur: true,
		validateOnChange: true,
		onSubmit: (values) => {
			onSubmit(values, isEdit, project, selectedNode);
		},
	});

	return (
		<Modal isOpen={isOpen} toggle={toggle} className="modal-xl">
			<ModalHeader toggle={toggle} tag="h4">
				{!!isEdit
					? t("edit") + " " + t("project")
					: t("add") + " " + t("project")}
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
								required={false}
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
						<InputField
							type="text"
							validation={validation}
							fieldId="prj_name"
							label={t("prj_name_or")}
							isRequired={true}
							className="col-md-4 mb-3"
							maxLength={200}
						/>
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
							maxLength={200}
						/>
						<AsyncSelectField
							fieldId="prj_project_category_id"
							validation={validation}
							isRequired
							className="col-md-4 mb-3"
							optionMap={projectCategoryMap}
							isLoading={prCategoryLoading}
							isError={prCategoryIsError}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_total_estimate_budget"}
							isRequired={true}
							allowDecimal={true}
							className={"col-md-4 mb-3"}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_total_actual_budget"}
							isRequired={false}
							allowDecimal={true}
							className={"col-md-4 mb-3"}
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
								minDate={validation.values.prj_start_date_plan_gc}
							/>
						</Col>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_urban_ben_number"}
							isRequired={false}
							className="col-md-2 mb-3"
							allowDecimal={false}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_rural_ben_number"}
							isRequired={false}
							className="col-md-2 mb-3"
							allowDecimal={false}
						/>
						<Col className="col-md-2 mb-3">
							<Label>{t("Total Beneficiaries")}</Label>
							<Input
								type="number"
								readOnly
								value={
									(Number(validation.values.prj_urban_ben_number) || 0) +
									(Number(validation.values.prj_rural_ben_number) || 0)
								}
								className="bg-light"
							/>
						</Col>
						<InputField
							type="text"
							validation={validation}
							fieldId={"prj_measurement_unit"}
							isRequired={true}
							className="col-md-3 mb-3"
							maxLength={200}
						/>
						<FormattedAmountField
							validation={validation}
							fieldId={"prj_measured_figure"}
							isRequired={true}
							allowDecimal={true}
						/>
						<InputField
							type="textarea"
							validation={validation}
							fieldId={"prj_outcome"}
							isRequired={false}
							className="col-md-6 mb-3"
							maxLength={400}
							rows={3}
						/>
						<InputField
							type="textarea"
							validation={validation}
							fieldId={"prj_remark"}
							isRequired={false}
							className="col-md-6 mb-3"
							maxLength={400}
							rows={3}
						/>
					</Row>

					<Row className="mt-3">
						<Col>
							<div className="text-end">
								<Button
									color="success"
									type="submit"
									className="save-user"
									disabled={isFormLoading || !validation.dirty}
								>
									{isFormLoading && (
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

ProjectFormModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	isEdit: PropTypes.bool.isRequired,
	project: PropTypes.object,
	selectedNode: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	projectsData: PropTypes.object,
	isLoading: PropTypes.bool,
};

export default ProjectFormModal;
