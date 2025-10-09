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
									maxLength={20}
									placeholder={t("project_code")}
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
									fieldId={"prj_total_estimate_budget"}
									isRequired={true}
									className="col-md-4 mb-3"
									allowDecimal={true}
									placeholder={t("estimated_budget")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_total_actual_budget"}
									isRequired={true}
									className="col-md-4 mb-3"
									allowDecimal={true}
									placeholder={t("actual_budget")}
								/>
								<Col className="col-md-4 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"prj_start_date_plan_gc"}
										validation={validation}
										placeholder={t("planned_start_date")}
									/>
								</Col>
								<Col className="col-md-4 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"prj_end_date_plan_gc"}
										validation={validation}
										minDate={minEndDate}
										maxDate={maxEndDate}
										placeholder={t("planned_end_date")}
									/>
								</Col>
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
								{/* Geographic Distribution & Gender Distribution - First Row */}
								<Col md={12} className="mb-3">
									<h6 className="text-muted mb-3">
										{t("geographic_distribution")} & {t("gender_distribution")}
									</h6>
								</Col>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_urban_ben_number"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("urban_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_rural_ben_number"}
									isRequired={false}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("rural_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_male_participant"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("male_participants")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_female_participant"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("female_participants")}
								/>

								{/* Direct & Indirect Beneficiaries - Second Row */}
								<Col md={12} className="mt-3 mb-3">
									<h6 className="text-muted mb-3">
										{t("direct_beneficiaries")} & {t("indirect_beneficiaries")}
									</h6>
								</Col>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_direct_ben_male"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("direct_male_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_direct_ben_female"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("direct_female_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_indirect_ben_male"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("indirect_male_beneficiaries")}
								/>
								<FormattedAmountField
									validation={validation}
									fieldId={"prj_indirect_ben_female"}
									isRequired={true}
									className="col-md-3 mb-3"
									allowDecimal={false}
									placeholder={t("indirect_female_beneficiaries")}
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
								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={false}
										componentId={"prj_date_agreement_signed"}
										validation={validation}
										placeholder={t("agreement_signed_date")}
									/>
								</Col>
								<AsyncSelectField
									fieldId="prj_agreement_signed_level"
									validation={validation}
									isRequired={false}
									className="col-md-6 mb-3"
									optionMap={{
										federal: t("federal"),
										regional: t("regional"),
										zone: t("zone"),
									}}
									placeholder={t("select_agreement_level")}
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
									fieldId={"prj_outcome"}
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
