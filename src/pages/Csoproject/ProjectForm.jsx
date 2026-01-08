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
	Card,
	CardHeader,
	CardBody,
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
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";

// utils/dateUtils.js
export const parseFormDate = (dateValue) => {
	if (dateValue === null || dateValue === undefined) {
		return null;
	}

	if (typeof dateValue === "number") {
		// Handle Excel serial date conversion
		const excelEpoch = new Date(1900, 0, 1);
		// Excel date correction: subtract 2 days due to Excel's leap year bug
		const jsDate = new Date(
			excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000
		);
		return jsDate;
	}

	if (typeof dateValue === "string") {
		// Handle string dates
		try {
			return new Date(dateValue.replace(/\//g, "-"));
		} catch (error) {
			console.warn("Failed to parse date string:", dateValue, error);
			return null;
		}
	}

	if (dateValue instanceof Date) {
		return dateValue;
	}

	return null;
};

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
			(item) => item.pct_owner_type_id === 2
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
			(item) => item.psc_cso_active === 1
		);
	}, [sectorCategories]);

	const {
		data: projectStatusData,
		isLoading: isStatusLoading,
		isError: isStatusError,
	} = useFetchProjectStatuss();
	const projectStatusMap = useMemo(() => {
		return (
			projectStatusData?.data?.reduce((acc, status) => {
				acc[status.prs_id] =
					lang === "en"
						? status.prs_status_name_en
						: lang === "am"
							? status.prs_status_name_am
							: status.prs_status_name_or;
				return acc;
			}, {}) || {}
		);
	}, [projectStatusData, lang]);

	const startDate = parseFormDate(validation.values.prj_start_date_plan_gc);
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
					{/* Project Location Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">{t("project_location")}</h5>
						</CardHeader>
						<CardBody>
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
									className="col-md-12"
									maxLength={400}
								/>
							</Row>
						</CardBody>
					</Card>

					{/* Basic Information Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">{t("basic_information")}</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<InputField
									type="text"
									validation={validation}
									fieldId={"prj_name"}
									isRequired={false}
									className="col-md-4 mb-3"
									maxLength={200}
									label={t("cso_prj_name")}
								/>
								{/*<InputField
									type="text"
									validation={validation}
									fieldId={"prj_name_am"}
									isRequired={false}
									className="col-md-4 mb-3"
									maxLength={200}
								/>*/}
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
									placeholder={t("cso_prj_code")}
									label={t("cso_prj_code")}
								/>
								<AsyncSelectField
									fieldId="prj_project_category_id"
									validation={validation}
									isRequired
									className="col-md-4 mb-3"
									optionMap={projectCategoryMap}
									isLoading={isPctLoading}
									isError={isPctError}
									placeholder={t("select_project_category")}
								/>
								<AsyncSelectField
									fieldId="prj_cluster_id"
									validation={validation}
									isRequired
									className="col-md-4 mb-3"
									optionMap={sectorCategoryMap}
									isLoading={isSectorCatLoading}
									isError={isSectorCatError}
									placeholder={t("select_cluster")}
								/>
								<AsyncSelectField
									fieldId="prj_project_status_id"
									validation={validation}
									isRequired
									className="col-md-4 mb-3"
									optionMap={projectStatusMap}
									isLoading={isStatusLoading}
									isError={isStatusError}
									placeholder={t("select_status")}
								/>
							</Row>
						</CardBody>
					</Card>
					{/* Agreement Details Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">{t("agreement_details")}</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<Col className="col-md-3 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"prj_date_agreement_signed"}
										validation={validation}
										placeholder={t("agreement_signed_date")}
									/>
								</Col>
								<AsyncSelectField
									fieldId="prj_agreement_signed_level"
									validation={validation}
									isRequired={true}
									className="col-md-3 mb-3"
									optionMap={{
										federal: t("federal"),
										regional: t("regional"),
										zone: t("zone"),
										town: t("town"),
									}}
									placeholder={t("select_agreement_level")}
								/>
								<Col className="col-md-3 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"prj_start_date_plan_gc"}
										validation={validation}
										placeholder={t("planned_start_date")}
										label={t("cso_prj_start_date_plan_gc")}
									/>
								</Col>
								<Col className="col-md-3 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"prj_end_date_plan_gc"}
										validation={validation}
										minDate={minEndDate}
										maxDate={maxEndDate}
										placeholder={t("planned_end_date")}
										label={t("cso_prj_end_date_plan_gc")}
									/>
								</Col>	
							</Row>
						</CardBody>
					</Card>
					{/* Budget & Timeline Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">{t("budget_timeline")}</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_total_actual_budget"}
									isRequired={true}
									className="col-md-4 mb-3"
									allowDecimal={true}
									placeholder={t("cso_prj_total_actual_budget")}
									label={t("cso_prj_total_actual_budget")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_admin_cost"}
									isRequired={true}
									className="col-md-4 mb-3"
									allowDecimal={true}
									placeholder={t("admin_cost")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_program_cost"}
									isRequired={true}
									className="col-md-4 mb-3"
									allowDecimal={true}
									placeholder={t("program_cost")}
								/>							
							</Row>
						</CardBody>
					</Card>
					{/* Beneficiary Information Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">
								{t("beneficiary_information")}
							</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_direct_ben_male"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("direct_male_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_direct_ben_female"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("direct_female_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_indirect_ben_male"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("indirect_male_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_indirect_ben_female"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("indirect_female_beneficiaries")}
								/>
							</Row>
						</CardBody>
					</Card>
					{/* Additional Information Card */}
					<Card className="mb-4">
						<CardHeader className="bg-light">
							<h5 className="card-title mb-0">{t("additional_information")}</h5>
						</CardHeader>
						<CardBody>
							<Row>
								<InputField
									type="textarea"
									validation={validation}
									fieldId={"cso_prj_outcome"}
									isRequired={false}
									className="col-md-6 mb-3"
									maxLength={400}
									rows={4}
								/>
								<InputField
									type="textarea"
									validation={validation}
									fieldId={"prj_remark"}
									isRequired={false}
									className="col-md-6 mb-3"
									maxLength={400}
									rows={4}
								/>
							</Row>
						</CardBody>
					</Card>

					{/* Submit Button */}
					<Card>
						<CardBody>
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
						</CardBody>
					</Card>
				</Form>
			</ModalBody>
		</Modal>
	);
};

export default ProjectForm;
