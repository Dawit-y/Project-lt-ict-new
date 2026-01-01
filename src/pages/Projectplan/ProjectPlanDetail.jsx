import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Spinner } from "reactstrap";
import { useFormik } from "formik";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjectPlanDetails,
	useAddProjectPlanDetail,
	useDeleteProjectPlanDetail,
	useUpdateProjectPlanDetail,
} from "../../queries/projectplan_detail_query";
import {
	Button,
	Col,
	Row,
	UncontrolledTooltip,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	Input,
	FormFeedback,
	Label,
	Card,
	CardBody,
	Badge,
	CardHeader,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { formattedAmountValidation } from "../../utils/Validation/validation";
import { toast } from "react-toastify";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import {
	convertToNumericValue,
	createKeyValueMap,
} from "../../utils/commonMethods";
import TableContainer from "../../components/Common/TableContainer";
import Spinners from "../../components/Common/Spinner";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { usePopulateBudgetYears } from "../../queries/budgetyear_query";

const PlanDetailFormModal = ({
	isOpen,
	toggle,
	planId,
	planDetail,
	isEdit,
	onSubmitSuccess,
	budgetYearData,
	totalActualBudget,
	isAdding = false,
	isUpdating = false,
}) => {
	const { t } = useTranslation();
	const [selectedYear, setSelectedYear] = useState("");
	const [activeTab, setActiveTab] = useState("Quarter1");

	// Form validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prp_plan_id: planId,
			prp_activity_name: planDetail?.prp_activity_name || "",
			prp_budget_year_id: planDetail?.prp_budget_year_id || "",
			prp_description: planDetail?.prp_description || "",

			// Monthly planned values
			...Array.from({ length: 12 }, (_, i) => ({
				[`prp_pyhsical_planned_month_${i + 1}`]: planDetail?.[
					`prp_pyhsical_planned_month_${i + 1}`
				]
					? Number(planDetail[`prp_pyhsical_planned_month_${i + 1}`])
					: "0",
				[`prp_finan_planned_month_${i + 1}`]: planDetail?.[
					`prp_finan_planned_month_${i + 1}`
				]
					? Number(planDetail[`prp_finan_planned_month_${i + 1}`])
					: "0",
			})).reduce((acc, curr) => ({ ...acc, ...curr })),

			// Summary fields (will be calculated)
			prp_physical_planned: planDetail?.prp_physical_planned || "0",
			prp_budget_planned: planDetail?.prp_budget_planned || "0",
		},

		validationSchema: Yup.object().shape({
			// Required fields
			prp_activity_name: Yup.string()
				.required(t("Activity name is required"))
				.max(200, t("Activity name cannot exceed 200 characters")),

			prp_budget_year_id: Yup.number().required(t("Year is required")),

			// Monthly validations
			...Array.from({ length: 12 }, (_, i) => ({
				[`prp_pyhsical_planned_month_${i + 1}`]: formattedAmountValidation(
					0,
					100,
					true
				),
				[`prp_finan_planned_month_${i + 1}`]: formattedAmountValidation(
					0,
					10000000000,
					true
				),
			})).reduce((acc, curr) => ({ ...acc, ...curr })),

			// Form-level validation for sums
			_sumPhysicalPlanned: Yup.string().test(
				"sum-physical-planned",
				function () {
					const sum = Array.from({ length: 12 }, (_, i) =>
						convertToNumericValue(
							this.parent[`prp_pyhsical_planned_month_${i + 1}`] || "0"
						)
					).reduce((a, b) => a + b, 0);

					if (sum > 100) {
						return this.createError({
							message: t(
								`Sum of physical planned values (${sum} %) exceeds 100%`
							),
						});
					}
					return true;
				}
			),

			_sumFinancialPlanned: Yup.string().test(
				"sum-financial-planned",
				function () {
					const sum = Array.from({ length: 12 }, (_, i) =>
						convertToNumericValue(
							this.parent[`prp_finan_planned_month_${i + 1}`] || "0"
						)
					).reduce((a, b) => a + b, 0);
					const totalBudget = convertToNumericValue(totalActualBudget || 0);

					if (totalBudget > 0 && sum > totalBudget) {
						return this.createError({
							message: t(
								`Sum of financial planned values (${sum.toLocaleString()}) exceeds total project budget (${totalBudget.toLocaleString()})`
							),
						});
					}
					return true;
				}
			),

			prp_description: Yup.string()
				.max(100, t("Description cannot exceed 100 characters"))
				.notRequired(),
		}),

		validateOnBlur: true,
		validateOnChange: true,
		validateOnMount: true,
		onSubmit: (values) => {
			onSubmitSuccess(values);
		},
	});

	// Handle year change
	const handleYearChange = (e) => {
		const yearId = e.target.value;
		setSelectedYear(yearId);
		validation.setFieldValue("prp_budget_year_id", yearId);
	};

	// Calculate totals for display
	const calculateTotals = () => {
		const totalPhysical = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(
				validation.values[`prp_pyhsical_planned_month_${i + 1}`] || "0"
			)
		).reduce((a, b) => a + b, 0);

		const totalFinancial = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(
				validation.values[`prp_finan_planned_month_${i + 1}`] || "0"
			)
		).reduce((a, b) => a + b, 0);

		return {
			totalPhysical,
			totalFinancial,
		};
	};

	const totals = calculateTotals();

	return (
		<Modal isOpen={isOpen} toggle={toggle} size="xl">
			<ModalHeader toggle={toggle} className="border-0 pb-0">
				<h4 className="mb-0">
					{isEdit ? t("Edit Activity Plan") : t("Add New Activity Plan")}
					<Badge color="info" className="ms-2">
						{t("Plan")}
					</Badge>
				</h4>
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={validation.handleSubmit}>
					<Card className="border-light shadow-sm">
						<CardBody>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<Label className="form-label fw-medium">
											{t("Activity Name")}{" "}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="prp_activity_name"
											type="text"
											placeholder={t("Enter activity name")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.prp_activity_name || ""}
											invalid={
												validation.touched.prp_activity_name &&
												!!validation.errors.prp_activity_name
											}
										/>
										<FormFeedback>
											{validation.errors.prp_activity_name}
										</FormFeedback>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<Label className="form-label fw-medium">
											{t("Budget Year")} <span className="text-danger">*</span>
										</Label>
										<Input
											name="prp_budget_year_id"
											type="select"
											className="form-select"
											onChange={handleYearChange}
											onBlur={validation.handleBlur}
											value={validation.values.prp_budget_year_id || ""}
											invalid={
												validation.touched.prp_budget_year_id &&
												!!validation.errors.prp_budget_year_id
											}
										>
											<option value="">{t("Select Year")}</option>
											{budgetYearData?.data?.map((year) => (
												<option key={year.bdy_id} value={year.bdy_id}>
													{year.bdy_name}
												</option>
											))}
										</Input>
										<FormFeedback>
											{validation.errors.prp_budget_year_id}
										</FormFeedback>
									</div>
								</Col>
							</Row>

							{/* Totals Summary */}
							<Card className="mt-3 border-light shadow-sm">
								<CardHeader className="bg-light">
									<h6 className="mb-0">{t("Summary")}</h6>
									<small className="text-muted">
										{t("total_project_budget")}:{" "}
										{Number(totalActualBudget).toLocaleString()}
									</small>
								</CardHeader>
								<CardBody>
									<Row>
										<Col md={6}>
											<div className="d-flex justify-content-between">
												<span className="fw-medium">
													{t("total_physical_planned_you_entered")}:
												</span>
												<span className="fw-bold">
													{totals.totalPhysical.toFixed(2)}%
												</span>
											</div>
											{validation.errors._sumPhysicalPlanned && (
												<div className="text-danger small mt-1">
													{validation.errors._sumPhysicalPlanned}
												</div>
											)}
										</Col>
										<Col md={6}>
											<div className="d-flex justify-content-between">
												<span className="fw-medium">
													{t("total_financial_planned_you_entered")}:
												</span>
												<span className="fw-bold">
													{totals.totalFinancial.toLocaleString()}
												</span>
											</div>
											{validation.errors._sumFinancialPlanned && (
												<div className="text-danger small mt-1">
													{validation.errors._sumFinancialPlanned}
												</div>
											)}
										</Col>
									</Row>
								</CardBody>
							</Card>

							{/* Quarterly Tabs */}
							<Nav tabs className="nav-tabs-custom mb-3 justify-content-center">
								{["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
									(quarter, idx) => (
										<NavItem key={idx} className="mx-3">
											<NavLink
												className={`cursor-pointer ${
													activeTab === quarter ? "active" : ""
												}`}
												onClick={() => setActiveTab(quarter)}
											>
												{t(quarter)}
											</NavLink>
										</NavItem>
									)
								)}
							</Nav>

							{/* Monthly Inputs in Tabs */}
							<TabContent activeTab={activeTab}>
								{["Quarter1", "Quarter2", "Quarter3", "Quarter4"].map(
									(quarter) => {
										const months = {
											Quarter1: [11, 12, 1],
											Quarter2: [2, 3, 4],
											Quarter3: [5, 6, 7],
											Quarter4: [8, 9, 10],
										}[quarter];

										return (
											<TabPane tabId={quarter} key={quarter}>
												<Card className="border-light shadow-sm">
													<CardBody>
														<Row>
															{months.map((month) => (
																<Col md={4} key={month} className="mb-3">
																	<Card className="h-100">
																		<CardHeader className="bg-light py-2">
																			<h6 className="mb-0">
																				{t("month")} {month}
																			</h6>
																		</CardHeader>
																		<CardBody>
																			<FormattedAmountField
																				allowDecimal={true}
																				validation={validation}
																				fieldId={`prp_pyhsical_planned_month_${month}`}
																				label={t("physical_planned_%")}
																				isRequired={true}
																				className={"mb-3"}
																			/>
																			<FormattedAmountField
																				allowDecimal={true}
																				validation={validation}
																				fieldId={`prp_finan_planned_month_${month}`}
																				label={t("financial_planned")}
																				isRequired={true}
																			/>
																		</CardBody>
																	</Card>
																</Col>
															))}
														</Row>
													</CardBody>
												</Card>
											</TabPane>
										);
									}
								)}
							</TabContent>

							{/* Description */}
							<Card className="mt-3 border-light shadow-sm">
								<CardBody>
									<Label className="form-label fw-medium">
										{t("description")}
										<small className="text-muted ms-1">({t("optional")})</small>
									</Label>
									<Input
										name="prp_description"
										type="textarea"
										rows="3"
										placeholder={t("Enter activity description...")}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.prp_description || ""}
										invalid={
											validation.touched.prp_description &&
											!!validation.errors.prp_description
										}
									/>
									<FormFeedback>
										{validation.errors.prp_description}
									</FormFeedback>
								</CardBody>
							</Card>

							{/* Submit Button */}
							<div className="text-end mt-4">
								<Button
									color="secondary"
									onClick={toggle}
									className="me-2"
									disabled={isAdding || isUpdating}
								>
									{t("Cancel")}
								</Button>
								<Button
									color="success"
									type="submit"
									disabled={!validation.dirty || isAdding || isUpdating}
								>
									{isAdding || isUpdating ? (
										<>
											<Spinner size="sm" className="me-2" />
											{isAdding ? t("Adding...") : t("Updating...")}
										</>
									) : isEdit ? (
										t("Update")
									) : (
										t("Add")
									)}
								</Button>
							</div>
						</CardBody>
					</Card>
				</Form>
			</ModalBody>
		</Modal>
	);
};

PlanDetailFormModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	planId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	planDetail: PropTypes.object,
	isEdit: PropTypes.bool.isRequired,
	onSubmitSuccess: PropTypes.func.isRequired,
	budgetYearData: PropTypes.object,
	totalActualBudget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	isAdding: PropTypes.bool,
	isUpdating: PropTypes.bool,
};

// Main Component
const ProjectPlanDetailModal = ({
	isOpen,
	toggle,
	planId,
	totalActualBudget,
}) => {
	const { t } = useTranslation();

	// State management
	const [planDetail, setPlanDetail] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	// Data fetching
	const param = {
		prp_plan_id: planId,
		request_type: "single",
	};
	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchProjectPlanDetails(param, true);

	const addPlanDetail = useAddProjectPlanDetail();
	const updatePlanDetail = useUpdateProjectPlanDetail();
	const deletePlanDetail = useDeleteProjectPlanDetail();

	const {
		data: budgetYearData,
		isLoading: bdyLoading,
		isError: bdyIsError,
	} = usePopulateBudgetYears();
	const budgetYearMap = useMemo(() => {
		return createKeyValueMap(budgetYearData?.data || [], "bdy_id", "bdy_name");
	}, [budgetYearData]);

	// CRUD Operations
	const handleAddPlanDetail = async (formData) => {

		// Calculate totals
		const totalPhysicalPlanned = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(
				formData[`prp_pyhsical_planned_month_${i + 1}`] || "0"
			)
		).reduce((a, b) => a + b, 0);

		const totalFinancialPlanned = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(formData[`prp_finan_planned_month_${i + 1}`] || "0")
		).reduce((a, b) => a + b, 0);

		const payload = {
			prp_plan_id: planId,
			prp_activity_name: formData.prp_activity_name,
			prp_budget_year_id: formData.prp_budget_year_id,
			prp_description: formData.prp_description || null,
			prp_physical_planned: totalPhysicalPlanned,
			prp_budget_planned: totalFinancialPlanned,
			prp_record_date_gc: new Date().toISOString().split("T")[0],
		};

		// Add monthly planned values
		for (let i = 1; i <= 12; i++) {
			payload[`prp_pyhsical_planned_month_${i}`] = convertToNumericValue(
				formData[`prp_pyhsical_planned_month_${i}`] || "0"
			);
			payload[`prp_finan_planned_month_${i}`] = convertToNumericValue(
				formData[`prp_finan_planned_month_${i}`] || "0"
			);
			// Set actual values to 0
			payload[`prp_pyhsical_actual_month_${i}`] = 0;
			payload[`prp_finan_actual_month_${i}`] = 0;
		}

		try {
			await addPlanDetail.mutateAsync(payload);
			toast.success(t("Activity plan added successfully"), { autoClose: 3000 });
			refetch();
			setFormModalOpen(false);
		} catch (error) {
			toast.error(t("Failed to add activity plan"), { autoClose: 3000 });
		}
	};

	const handleUpdatePlanDetail = async (formData) => {
		// Calculate totals
		const totalPhysicalPlanned = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(
				formData[`prp_pyhsical_planned_month_${i + 1}`] || "0"
			)
		).reduce((a, b) => a + b, 0);

		const totalFinancialPlanned = Array.from({ length: 12 }, (_, i) =>
			convertToNumericValue(formData[`prp_finan_planned_month_${i + 1}`] || "0")
		).reduce((a, b) => a + b, 0);

		const payload = {
			prp_id: planDetail.prp_id,
			prp_plan_id: planId,
			prp_activity_name: formData.prp_activity_name,
			prp_budget_year_id: formData.prp_budget_year_id,
			prp_description: formData.prp_description || null,
			prp_physical_planned: totalPhysicalPlanned,
			prp_budget_planned: totalFinancialPlanned,
		};

		// Add monthly planned values
		for (let i = 1; i <= 12; i++) {
			payload[`prp_pyhsical_planned_month_${i}`] = convertToNumericValue(
				formData[`prp_pyhsical_planned_month_${i}`] || "0"
			);
			payload[`prp_finan_planned_month_${i}`] = convertToNumericValue(
				formData[`prp_finan_planned_month_${i}`] || "0"
			);
		}

		try {
			await updatePlanDetail.mutateAsync(payload);
			toast.success(t("Activity plan updated successfully"), {
				autoClose: 3000,
			});
			refetch();
			setFormModalOpen(false);
		} catch (error) {
			toast.error(t("Failed to update activity plan"), { autoClose: 3000 });
		}
	};

	const handleDeletePlanDetail = async () => {
		if (planDetail?.prp_id) {
			try {
				await deletePlanDetail.mutateAsync(planDetail.prp_id);
				toast.success(t("Activity plan deleted successfully"), {
					autoClose: 3000,
				});
				refetch();
			} catch (error) {
				toast.error(t("Failed to delete activity plan"), { autoClose: 3000 });
			}
			setDeleteModal(false);
		}
	};

	const onClickDelete = (result) => {
		setPlanDetail(result);
		setDeleteModal(true);
	};

	// UI Handlers
	const handleClose = () => {
		setPlanDetail(null);
		setIsEdit(false);
		setFormModalOpen(false);
		toggle();
	};

	const handleEditPlanDetail = (data) => {
		setPlanDetail(data);
		setIsEdit(true);
		setFormModalOpen(true);
	};

	const handleAddNew = () => {
		setPlanDetail(null);
		setIsEdit(false);
		setFormModalOpen(true);
	};

	const handleFormSubmit = (formData) => {
		if (isEdit) {
			handleUpdatePlanDetail(formData);
		} else {
			handleAddPlanDetail(formData);
		}
	};

	const toggleFormModal = () => {
		setFormModalOpen(!formModalOpen);
		if (!formModalOpen) {
			setPlanDetail(null);
			setIsEdit(false);
		}
	};

	// Table columns
	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("Activity Name"),
				enableColumnFilter: true,
				accessorKey: "prp_activity_name",
				cell: ({ row }) => <span>{row.original.prp_activity_name || "-"}</span>,
			},
			{
				header: t("Year"),
				enableColumnFilter: false,
				accessorKey: "prp_budget_year_id",
				cell: (cellProps) =>
					budgetYearMap[cellProps.row.original.prp_budget_year_id] || "-",
			},
			{
				header: t("Total Physical (%)"),
				enableColumnFilter: false,
				accessorKey: "prp_physical_planned",
				cell: ({ row }) =>
					Number(row.original.prp_physical_planned || 0).toFixed(2) + "%",
			},
			{
				header: t("Total Financial"),
				enableColumnFilter: false,
				accessorKey: "prp_budget_planned",
				cell: ({ row }) =>
					Number(row.original.prp_budget_planned || 0).toLocaleString(),
			},
		];

		const quarterDefinitions = [
			{ key: "q1", months: [11, 12, 1] },
			{ key: "q2", months: [2, 3, 4] },
			{ key: "q3", months: [5, 6, 7] },
			{ key: "q4", months: [8, 9, 10] },
		];

		const quarterColumns = quarterDefinitions.map((quarter, qIndex) => ({
			header: `${t("q")} ${qIndex + 1}`,
			id: quarter.key,
			columns: [
				{
					header: t("Physical (%)"),
					id: `${quarter.key}_physical`,
					enableColumnFilter: false,
					cell: ({ row }) => {
						const sum = quarter.months.reduce(
							(total, m) =>
								total +
								Number(row.original[`prp_pyhsical_planned_month_${m}`] || 0),
							0
						);
						return sum ? sum.toFixed(2) + "%" : "-";
					},
				},
				{
					header: t("Financial"),
					id: `${quarter.key}_financial`,
					enableColumnFilter: false,
					cell: ({ row }) => {
						const sum = quarter.months.reduce(
							(total, m) =>
								total +
								Number(row.original[`prp_finan_planned_month_${m}`] || 0),
							0
						);
						return sum ? sum.toLocaleString() : "-";
					},
				},
			],
		}));

		const finalColumns = [
			...baseColumns,
			...quarterColumns,
			{
				header: t("Description"),
				id: "description",
				enableColumnFilter: false,
				accessorKey: "prp_description",
				cell: ({ row }) => (
					<span title={row.original.prp_description}>
						{row.original.prp_description
							? row.original.prp_description.length > 50
								? `${row.original.prp_description.substring(0, 50)}...`
								: row.original.prp_description
							: "-"}
					</span>
				),
			},
		];

		if (data?.previledge?.is_role_editable == 1) {
			finalColumns.push({
				id: "action",
				header: t("Action"),
				cell: (cellProps) => (
					<div className="d-flex gap-2">
						<Button
							color="none"
							className="text-success"
							size="sm"
							onClick={() => handleEditPlanDetail(cellProps.row.original)}
							id={`edit-${cellProps.row.id}`}
						>
							<i className="mdi mdi-pencil font-size-18" />
						</Button>
						<UncontrolledTooltip target={`edit-${cellProps.row.id}`}>
							{t("edit")}
						</UncontrolledTooltip>
						{cellProps.row.original.is_deletable == 1 && (
							<>
								<Button
									color="none"
									className="text-danger"
									size="sm"
									onClick={() => onClickDelete(cellProps.row.original)}
									id={`delete-${cellProps.row.id}`}
								>
									<i className="mdi mdi-delete font-size-18" />
								</Button>
								<UncontrolledTooltip target={`delete-${cellProps.row.id}`}>
									{t("delete")}
								</UncontrolledTooltip>
							</>
						)}
					</div>
				),
			});
		}

		return finalColumns;
	}, [data, t, budgetYearMap, handleEditPlanDetail, onClickDelete]);

	if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeletePlanDetail}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deletePlanDetail.isPending}
			/>

			{/* Form Modal */}
			<PlanDetailFormModal
				isOpen={formModalOpen}
				toggle={toggleFormModal}
				planId={planId}
				planDetail={planDetail}
				isEdit={isEdit}
				onSubmitSuccess={handleFormSubmit}
				budgetYearData={budgetYearData}
				totalActualBudget={totalActualBudget}
				isAdding={addPlanDetail.isPending}
				isUpdating={updatePlanDetail.isPending}
			/>

			{/* Main Modal with Table */}
			<Modal isOpen={isOpen} toggle={handleClose} size="xl">
				<ModalHeader toggle={handleClose} className="border-0 pb-0">
					<h4 className="mb-0">
						{t("Project Plan Activities")}
						<Badge color="info" className="ms-2">
							{t("Plan Details")}
						</Badge>
					</h4>
				</ModalHeader>

				<ModalBody className="pt-1">
					{/* Summary Card */}
					<Card className="mb-3 border-light shadow-sm">
						<CardBody>
							<Row>
								<Col md={8}>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<h6 className="mb-1">{t("Project Budget Summary")}</h6>
											<p className="mb-0 text-muted">
												{t("Manage activity plans for this project")}
											</p>
										</div>
									</div>
								</Col>
								<Col md={4}>
									<div className="text-end">
										<Card className="border-light">
											<CardBody className="py-2">
												<small className="text-muted">
													{t("Total Project Budget")}:
												</small>
												<h5 className="mb-0 text-success">
													{Number(totalActualBudget || 0).toLocaleString()}{" "}
													{t("birr")}
												</h5>
											</CardBody>
										</Card>
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>

					{/* Table Section */}
					{isLoading ? (
						<Spinners />
					) : (
						<TableContainer
							columns={columns}
							data={data?.data || []}
							isGlobalFilter={true}
							isAddButton={data?.previledge?.is_role_can_add == 1}
							isCustomPageSize={true}
							handleUserClick={handleAddNew}
							isPagination={true}
							SearchPlaceholder={t("Search activities...")}
							buttonClass="btn btn-success waves-effect waves-light mb-2 me-2"
							buttonName={t("Add Activity Plan")}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
							refetch={refetch}
							isFetching={isFetching}
						/>
					)}
				</ModalBody>
			</Modal>
		</>
	);
};

ProjectPlanDetailModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	planId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	totalActualBudget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProjectPlanDetailModal;
