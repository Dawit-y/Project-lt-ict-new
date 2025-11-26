import React, { useMemo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Spinner,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	createMultiLangKeyValueMap,
	createKeyValueMap,
} from "../../utils/commonMethods";
import {
	alphanumericValidation,
	numberValidation,
	onlyAmharicValidation,
	formattedAmountValidation,
} from "../../utils/Validation/validation";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import DatePicker from "../../components/Common/DatePicker";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import InputField from "../../components/Common/InputField";
import AsyncSelectField from "../../components/Common/AsyncSelectField";

const CitizenshipProjectForm = ({
	isOpen,
	toggle,
	project,
	isEdit,
	onSave,
	onUpdate,
	searchResults,
	projectCategoryData,
	prCategoryLoading,
	prCategoryIsError,
	prjLocationRegionId,
	prjLocationZoneId,
	prjLocationWoredaId,
	lang,
}) => {
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState("1");
	const [tabErrors, setTabErrors] = useState({
		tab1: false,
		tab2: false,
		tab3: false,
	});

	// Project status data
	const {
		data: projectStatusData,
		isLoading: prsIsLoading,
		isError: prsIsError,
	} = useFetchProjectStatuss();

	// Sector categories data
	const {
		data: sectorCategories,
		isLoading: isSectorCatLoading,
		isError: isSectorCatError,
	} = useFetchSectorCategorys();

	// Memoized option maps
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
			(item) => item.pct_owner_type_id === 3
		);
	}, [projectCategoryData, lang]);

	const projectStatusMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectStatusData?.data || [],
			"prs_id",
			{
				en: "prs_status_name_en",
				am: "prs_status_name_am",
				or: "prs_status_name_or",
			},
			lang
		);
	}, [projectStatusData, lang]);

	const sectorCategoryMap = useMemo(() => {
		return createKeyValueMap(
			sectorCategories?.data || [],
			"psc_id",
			"psc_name",
			(item) => item.psc_citizenship_active === 1
		);
	}, [sectorCategories]);

	// Form validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prj_name: (project && project.prj_name) || "",
			prj_name_am: (project && project.prj_name_am) || "",
			prj_name_en: (project && project.prj_name_en) || "",
			prj_code: (project && project.prj_code) || "",
			prj_project_status_id: (project && project.prj_project_status_id) || "",
			prj_cluster_id: (project && project.prj_cluster_id) || "",
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
			prj_location_region_id: isEdit
				? (project && project.prj_location_region_id) || ""
				: prjLocationRegionId,
			prj_location_zone_id: isEdit
				? (project && project.prj_location_zone_id) || ""
				: prjLocationZoneId,
			prj_location_woreda_id: isEdit
				? (project && project.prj_location_woreda_id) || ""
				: prjLocationWoredaId,
			prj_location_description:
				(project && project.prj_location_description) || "",
			prj_owner_region_id:
				(project && project.prj_owner_region_id) || Number(prjLocationRegionId),
			prj_owner_zone_id:
				(project && project.prj_owner_zone_id) || Number(prjLocationZoneId),
			prj_owner_woreda_id:
				(project && project.prj_owner_woreda_id) || Number(prjLocationWoredaId),
			prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",
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
			is_deletable: (project && project.is_deletable) || 1,
			is_editable: (project && project.is_editable) || 1,
			prj_male_participant: (project && project.prj_male_participant) || "",
			prj_female_participant: (project && project.prj_female_participant) || "",
			prj_job_opportunity: (project && project.prj_job_opportunity) || "",
		},

		validationSchema: Yup.object({
			prj_name: alphanumericValidation(3, 200, true).test(
				"unique-prj_name",
				t("Already exists"),
				(value) => {
					return !searchResults?.data.some(
						(item) => item.prj_name == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_name_am: onlyAmharicValidation(3, 200, false),
			prj_name_en: alphanumericValidation(3, 200, true).test(
				"unique-prj_name_en",
				t("Already exists"),
				(value) => {
					return !searchResults?.data.some(
						(item) =>
							item.prj_name_en == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_code: alphanumericValidation(3, 20, false),
			prj_project_status_id: Yup.number().required(t("prj_project_status_id")),
			prj_cluster_id: Yup.number().required(t("prj_cluster_id")),
			prj_project_category_id: numberValidation(1, 200, true),
			prj_total_estimate_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_total_actual_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_location_region_id: Yup.string().required(
				t("prj_location_region_id")
			),
			prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
			prj_location_woreda_id: Yup.string().required(
				t("prj_location_woreda_id")
			),
			prj_start_date_plan_gc: Yup.string().required(
				t("prj_start_date_plan_gc")
			),
			prj_start_date_gc: Yup.string().required(t("prj_start_date_gc")),
			prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
			prj_urban_ben_number: numberValidation(10, 10000000, false),
			prj_rural_ben_number: numberValidation(10, 10000000, false),
			prj_location_description: alphanumericValidation(3, 425, false),
			prj_remark: alphanumericValidation(3, 425, false),
			prj_male_participant: numberValidation(10, 10000000, false),
			prj_female_participant: numberValidation(10, 10000000, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProject = {
					prj_id: project.prj_id,
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
					prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
					prj_geo_location: values.prj_geo_location,
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
					prj_owner_kebele_id: values.prj_owner_kebele_id,
					prj_owner_description: values.prj_owner_description,
					prj_start_date_et: values.prj_start_date_et,
					prj_start_date_gc: values.prj_start_date_gc,
					prj_start_date_plan_et: values.prj_start_date_plan_et,
					prj_start_date_plan_gc: values.prj_start_date_plan_gc,
					prj_end_date_actual_et: values.prj_end_date_actual_et,
					prj_end_date_actual_gc: values.prj_end_date_actual_gc,
					prj_end_date_plan_gc: values.prj_end_date_plan_gc,
					prj_end_date_plan_et: values.prj_end_date_plan_et,
					prj_outcome: values.prj_outcome,
					prj_deleted: values.prj_deleted,
					prj_remark: values.prj_remark,
					prj_created_date: values.prj_created_date,
					prj_owner_id: values.prj_owner_id,
					prj_urban_ben_number: parseInt(values.prj_urban_ben_number),
					prj_rural_ben_number: parseInt(values.prj_rural_ben_number),
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					prj_male_participant: parseInt(values.prj_male_participant),
					prj_female_participant: parseInt(values.prj_female_participant),
					prj_job_opportunity: values.prj_job_opportunity,
				};
				onUpdate(updateProject);
			} else {
				const newProject = {
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
					prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
					prj_geo_location: values.prj_geo_location,
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
					prj_owner_kebele_id: values.prj_owner_kebele_id,
					prj_owner_description: values.prj_owner_description,
					prj_start_date_et: values.prj_start_date_et,
					prj_start_date_gc: values.prj_start_date_gc,
					prj_start_date_plan_et: values.prj_start_date_plan_et,
					prj_start_date_plan_gc: values.prj_start_date_plan_gc,
					prj_end_date_actual_et: values.prj_end_date_actual_et,
					prj_end_date_actual_gc: values.prj_end_date_actual_gc,
					prj_end_date_plan_gc: values.prj_end_date_plan_gc,
					prj_end_date_plan_et: values.prj_end_date_plan_et,
					prj_outcome: values.prj_outcome,
					prj_deleted: values.prj_deleted,
					prj_remark: values.prj_remark,
					prj_created_date: values.prj_created_date,
					prj_owner_id: values.prj_owner_id,
					prj_urban_ben_number: parseInt(values.prj_urban_ben_number),
					prj_rural_ben_number: parseInt(values.prj_rural_ben_number),
					prj_male_participant: parseInt(values.prj_male_participant),
					prj_female_participant: parseInt(values.prj_female_participant),
					prj_job_opportunity: values.prj_job_opportunity,
				};
				onSave(newProject);
			}
		},
	});

	// Memoize the hasRequiredFieldErrors function to prevent unnecessary re-renders
	const hasRequiredFieldErrors = useCallback(
		(fields) => {
			return fields.some(
				(field) => validation.touched[field] && validation.errors[field]
			);
		},
		[validation.errors, validation.touched]
	);

	// Update tab errors when validation changes
	useEffect(() => {
		setTabErrors({
			tab1: hasRequiredFieldErrors([
				"prj_name",
				"prj_name_am",
				"prj_name_en",
				"prj_project_category_id",
				"prj_cluster_id",
				"prj_location_region_id",
				"prj_location_zone_id",
				"prj_location_woreda_id",
			]),
			tab2: hasRequiredFieldErrors([
				"prj_start_date_plan_gc",
				"prj_end_date_plan_gc",
				"prj_start_date_gc",
				"prj_project_status_id",
				"prj_total_estimate_budget",
				"prj_total_actual_budget",
			]),
			tab3: false,
		});
	}, [validation.errors, validation.touched, hasRequiredFieldErrors]);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		validation.handleSubmit();
		return false;
	};

	return (
		<Modal isOpen={isOpen} toggle={toggle} className="modal-xl">
			<ModalHeader toggle={toggle} tag="h4">
				{!!isEdit
					? t("edit") + " " + t("project")
					: t("add") + " " + t("project")}
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={handleFormSubmit}>
					<div className="mb-3">
						<Nav tabs>
							<NavItem>
								<NavLink
									className={classnames({
										active: activeTab === "1",
										"text-danger": tabErrors.tab1,
									})}
									onClick={() => {
										setActiveTab("1");
									}}
								>
									<i className="bx bx-info-circle me-1"></i>
									{t("basic_info")}
									{tabErrors.tab1 && <span className="ms-1">*</span>}
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({
										active: activeTab === "2",
										"text-danger": tabErrors.tab2,
									})}
									onClick={() => {
										setActiveTab("2");
									}}
								>
									<i className="bx bx-calendar me-1"></i>
									{t("project_details")}
									{tabErrors.tab2 && <span className="ms-1">*</span>}
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({
										active: activeTab === "3",
										"text-danger": tabErrors.tab3,
									})}
									onClick={() => {
										setActiveTab("3");
									}}
								>
									<i className="bx bx-note me-1"></i>
									{t("additional_info")}
								</NavLink>
							</NavItem>
						</Nav>

						<TabContent
							activeTab={activeTab}
							className="p-3 border border-top-0 rounded-bottom"
						>
							<TabPane tabId="1">
								<Col md={12}>
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
								<Col md={12} className="mb-3">
									<InputField
										type="textarea"
										validation={validation}
										fieldId={"prj_location_description"}
										isRequired={false}
										maxLength={400}
									/>
								</Col>
								<Row>
									<Col md={6} className="mb-3">
										<InputField
											type="text"
											validation={validation}
											fieldId={"prj_name"}
											isRequired={true}
											maxLength={200}
										/>
									</Col>
									<Col md={6}>
										<InputField
											type="text"
											validation={validation}
											fieldId={"prj_code"}
											isRequired={false}
											maxLength={20}
										/>
									</Col>
									<Col md={6} className="mb-3">
										<InputField
											type="text"
											validation={validation}
											fieldId={"prj_name_am"}
											isRequired={true}
											maxLength={200}
										/>
									</Col>
									<Col md={6}>
										<InputField
											type="text"
											validation={validation}
											fieldId={"prj_name_en"}
											isRequired={true}
											maxLength={200}
										/>
									</Col>
									<Col md={6}>
										<AsyncSelectField
											fieldId="prj_project_category_id"
											validation={validation}
											isRequired
											label={t("project_category")}
											optionMap={projectCategoryMap}
											isLoading={prCategoryLoading}
											isError={prCategoryIsError}
										/>
									</Col>
									<Col md={6}>
										<AsyncSelectField
											fieldId="prj_cluster_id"
											validation={validation}
											isRequired
											label={t("cluster")}
											optionMap={sectorCategoryMap}
											isLoading={isSectorCatLoading}
											isError={isSectorCatError}
										/>
									</Col>
								</Row>
							</TabPane>

							<TabPane tabId="2">
								<Row>
									<Col md={6} className="mb-3">
										<DatePicker
											isRequired={true}
											componentId={"prj_start_date_plan_gc"}
											validation={validation}
										/>
									</Col>
									<Col md={6}>
										<DatePicker
											isRequired={true}
											componentId={"prj_end_date_plan_gc"}
											validation={validation}
											minDate={validation.values.prj_start_date_plan_gc}
										/>
									</Col>
									<Col md={6} className="mb-3">
										<DatePicker
											isRequired={true}
											componentId={"prj_start_date_gc"}
											validation={validation}
										/>
									</Col>
									<Col md={6}>
										<AsyncSelectField
											fieldId="prj_project_status_id"
											validation={validation}
											isRequired
											label={t("project_status")}
											optionMap={projectStatusMap}
											isLoading={prsIsLoading}
											isError={prsIsError}
										/>
									</Col>

									<Col md={6}>
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_total_estimate_budget"}
											isRequired={true}
											allowDecimal={true}
										/>
									</Col>
									<Col md={6}>
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_total_actual_budget"}
											isRequired={true}
											allowDecimal={true}
										/>
									</Col>
								</Row>
							</TabPane>

							<TabPane tabId="3">
								<Row>
									<Col md={6} className="mb-3">
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_urban_ben_number"}
											isRequired={false}
											allowDecimal={false}
										/>
									</Col>
									<Col md={6}>
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_rural_ben_number"}
											isRequired={false}
											allowDecimal={false}
										/>
									</Col>
									<Col md={6} className="mb-3">
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_male_participant"}
											isRequired={false}
											allowDecimal={false}
										/>
									</Col>
									<Col md={6}>
										<FormattedAmountField
											validation={validation}
											fieldId={"prj_female_participant"}
											isRequired={false}
											allowDecimal={false}
										/>
									</Col>
									<Col md={6} className="mb-3">
										<InputField
											type="textarea"
											validation={validation}
											fieldId={"prj_job_opportunity"}
											isRequired={false}
											maxLength={400}
											rows={3}
										/>
									</Col>
									<Col md={6}>
										<InputField
											type="textarea"
											validation={validation}
											fieldId={"prj_outcome"}
											isRequired={false}
											maxLength={400}
											rows={3}
										/>
									</Col>
									<Col md={12}>
										<InputField
											type="textarea"
											validation={validation}
											fieldId={"prj_remark"}
											isRequired={false}
											maxLength={400}
											rows={3}
										/>
									</Col>
								</Row>
							</TabPane>
						</TabContent>
					</div>

					<Row className="mt-3">
						<Col className="text-end">
							<Button color="light" className="me-2" onClick={toggle}>
								{t("cancel")}
							</Button>
							<Button
								color="success"
								type="submit"
								disabled={!validation.dirty}
							>
								{t("save")}
							</Button>
						</Col>
					</Row>
				</Form>
			</ModalBody>
		</Modal>
	);
};

CitizenshipProjectForm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	project: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	onSave: PropTypes.func.isRequired,
	onUpdate: PropTypes.func.isRequired,
	searchResults: PropTypes.object,
	projectCategoryData: PropTypes.object,
	prCategoryLoading: PropTypes.bool,
	prCategoryIsError: PropTypes.bool,
	prjLocationRegionId: PropTypes.string,
	prjLocationZoneId: PropTypes.string,
	prjLocationWoredaId: PropTypes.string,
	lang: PropTypes.string.isRequired,
};

export default CitizenshipProjectForm;
