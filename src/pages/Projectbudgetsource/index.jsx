import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjectBudgetSources,
	useAddProjectBudgetSource,
	useDeleteProjectBudgetSource,
	useUpdateProjectBudgetSource,
} from "../../queries/projectbudgetsource_query";
import { useFetchBudgetSources } from "../../queries/budgetsource_query";
import ProjectBudgetSourceModal from "./ProjectBudgetSourceModal";
import { useTranslation } from "react-i18next";
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
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import { budgetSourceExportColumns } from "../../utils/exportColumnsForDetails";
import AsyncSelectField from "../../components/Common/AsyncSelectField";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectBudgetSourceModel = (props) => {
	document.title = "Project Budget Source";
	const { passedId, isActive, totalActualBudget } = props;
	const param = {
		project_id: passedId,
		request_type: "single",
	};
	const { t, i18n } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectBudgetSource, setProjectBudgetSource] = useState(null);

	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchProjectBudgetSources(param, isActive);
	const addProjectBudgetSource = useAddProjectBudgetSource();
	const updateProjectBudgetSource = useUpdateProjectBudgetSource();
	const deleteProjectBudgetSource = useDeleteProjectBudgetSource();

	const {
		data: budgetSourceData,
		isLoading: isBsLoading,
		isError: isBsError,
	} = useFetchBudgetSources();
	const budgetSourceMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			budgetSourceData?.data || [],
			"pbs_id",
			{
				en: "pbs_name_en",
				am: "pbs_name_am",
				or: "pbs_name_or",
			},
			i18n.language
		);
	}, [budgetSourceData, i18n.language]);

	const handleAddProjectBudgetSource = async (data) => {
		try {
			await addProjectBudgetSource.mutateAsync(data);
			toast.success(`Data added successfully`, {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			toast.error("Failed to add data", {
				autoClose: 3000,
			});
		}
	};

	const handleUpdateProjectBudgetSource = async (data) => {
		try {
			await updateProjectBudgetSource.mutateAsync(data);
			toast.success(`data updated successfully`, {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			toast.error(`Failed to update Data`, {
				autoClose: 3000,
			});
		}
	};
	const handleDeleteProjectBudgetSource = async () => {
		if (projectBudgetSource && projectBudgetSource.bsr_id) {
			try {
				const id = projectBudgetSource.bsr_id;
				await deleteProjectBudgetSource.mutateAsync(id);
				toast.success(`Data deleted successfully`, {
					autoClose: 3000,
				});
			} catch (error) {
				toast.error(`Failed to delete Data`, {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};

	const calculateCurrentTotal = (
		currentData,
		editingId = null,
		newAmount = 0
	) => {
		if (!currentData || !currentData.data) return 0;

		return currentData.data.reduce((total, item) => {
			// If editing, exclude the item being edited from the total
			if (editingId && item.bsr_id === editingId) {
				return total + Number(newAmount || 0);
			}
			return total + Number(item.bsr_amount || 0);
		}, 0);
	};

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			bsr_name: (projectBudgetSource && projectBudgetSource.bsr_name) || "",
			bsr_project_id:
				(projectBudgetSource && projectBudgetSource.bsr_project_id) || "",
			bsr_budget_source_id:
				(projectBudgetSource && projectBudgetSource.bsr_budget_source_id) || "",
			bsr_amount: (projectBudgetSource && projectBudgetSource.bsr_amount) || "",
			bsr_status: (projectBudgetSource && projectBudgetSource.bsr_status) || "",
			bsr_description:
				(projectBudgetSource && projectBudgetSource.bsr_description) || "",
			bsr_created_date:
				(projectBudgetSource && projectBudgetSource.bsr_created_date) || "",

			is_deletable:
				(projectBudgetSource && projectBudgetSource.is_deletable) || 1,
			is_editable:
				(projectBudgetSource && projectBudgetSource.is_editable) || 1,
		},

		validationSchema: Yup.object({
			bsr_name: Yup.string(),
			bsr_budget_source_id: Yup.string().required(t("bsr_budget_source_id")),
			bsr_amount: Yup.number()
				.required(t("bsr_amount"))
				.positive("Amount must be positive")
				.test(
					"total-budget",
					"Amount exceeds remaining project budget",
					function (value) {
						if (!value || isNaN(value)) return true;

						const editingId = isEdit ? projectBudgetSource?.bsr_id : null;

						// Calculate total without the current edited item
						const currentTotalWithoutThis =
							data?.data?.reduce((total, item) => {
								if (editingId && item.bsr_id === editingId) return total;
								return total + Number(item.bsr_amount || 0);
							}, 0) || 0;

						// Calculate new total if this amount is added/updated
						const newTotal = currentTotalWithoutThis + Number(value);

						return newTotal <= totalActualBudget;
					}
				),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProjectBudgetSource = {
					bsr_id: projectBudgetSource?.bsr_id,
					bsr_name: values.bsr_name,
					// bsr_project_id: values.bsr_project_id,
					bsr_budget_source_id: values.bsr_budget_source_id,
					bsr_amount: values.bsr_amount,
					bsr_status: values.bsr_status,
					bsr_description: values.bsr_description,
					bsr_created_date: values.bsr_created_date,

					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update ProjectBudgetSource
				handleUpdateProjectBudgetSource(updateProjectBudgetSource);
				validation.resetForm();
			} else {
				const newProjectBudgetSource = {
					bsr_name: values.bsr_name,
					bsr_project_id: passedId,
					bsr_budget_source_id: values.bsr_budget_source_id,
					bsr_amount: values.bsr_amount,
					bsr_status: values.bsr_status,
					bsr_description: values.bsr_description,
					bsr_created_date: values.bsr_created_date,
				};
				// save new ProjectBudgetSource
				handleAddProjectBudgetSource(newProjectBudgetSource);
				validation.resetForm();
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	const toggle = () => {
		if (modal) {
			setModal(false);
			setProjectBudgetSource(null);
		} else {
			setModal(true);
		}
	};

	const handleProjectBudgetSourceClick = (arg) => {
		const projectBudgetSource = arg;
		setProjectBudgetSource({
			bsr_id: projectBudgetSource.bsr_id,
			bsr_name: projectBudgetSource.bsr_name,
			bsr_project_id: projectBudgetSource.bsr_project_id,
			bsr_budget_source_id: projectBudgetSource.bsr_budget_source_id,
			bsr_amount: projectBudgetSource.bsr_amount,
			bsr_status: projectBudgetSource.bsr_status,
			bsr_description: projectBudgetSource.bsr_description,
			bsr_created_date: projectBudgetSource.bsr_created_date,
			is_deletable: projectBudgetSource.is_deletable,
			is_editable: projectBudgetSource.is_editable,
		});
		setIsEdit(true);
		toggle();
	};

	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (projectBudgetSource) => {
		setProjectBudgetSource(projectBudgetSource);
		setDeleteModal(true);
	};

	const handleProjectBudgetSourceClicks = () => {
		setIsEdit(false);
		setProjectBudgetSource("");
		toggle();
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: "",
				accessorKey: "bsr_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.bsr_name, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "bsr_budget_source_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(
								budgetSourceMap[cellProps.row.original.bsr_budget_source_id],
								30
							) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "bsr_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(
								Number(cellProps.row.original.bsr_amount).toLocaleString(),
								30
							) || "-"}
						</span>
					);
				},
			},
			{
				header: t("view_detail"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<Button
							type="button"
							color="primary"
							className="btn-sm"
							onClick={() => {
								const data = cellProps.row.original;
								toggleViewModal(data);
								setTransaction(cellProps.row.original);
							}}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
		];
		if (
			data?.previledge?.is_role_editable &&
			data?.previledge?.is_role_deletable
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-1">
							{cellProps.row.original.is_editable && (
								<Button
									color="None"
									size="sm"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleProjectBudgetSourceClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}

							{cellProps.row.original.is_deletable && (
								<Button
									color="None"
									size="sm"
									className="text-danger"
									onClick={() => {
										const data = cellProps.row.original;
										onClickDelete(data);
									}}
								>
									<i
										className="mdi mdi-delete font-size-18"
										id="deletetooltip"
									/>
									<UncontrolledTooltip placement="top" target="deletetooltip">
										Delete
									</UncontrolledTooltip>
								</Button>
							)}
						</div>
					);
				},
			});
		}

		return baseColumns;
	}, [handleProjectBudgetSourceClick, toggleViewModal, onClickDelete, data, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			<ProjectBudgetSourceModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
				budgetSourceMap={budgetSourceMap}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectBudgetSource}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectBudgetSource.isPending}
			/>
			<div className="page-content1">
				<div className="container-fluid1">
					{isLoading ? (
						<Spinners top={isActive ? "top-70" : ""} />
					) : (
						<TableContainer
							columns={columns}
							data={data?.data || []}
							isGlobalFilter={true}
							isAddButton={true}
							isCustomPageSize={true}
							handleUserClick={handleProjectBudgetSourceClicks}
							isPagination={true}
							SearchPlaceholder={t("filter_placeholder")}
							buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
							buttonName={t("add")}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
							refetch={refetch}
							isFetching={isFetching}
							exportColumns={[
								{
									key: "bsr_name",
									label: "bsr_name",
									format: (val) => val ?? "-",
								},
								{
									key: "bsr_budget_source_id",
									label: "bsr_budget_source_id",
									format: (val) =>
										budgetSourceMap?.[val] ?? `Source ID: ${val}`,
								},
								...budgetSourceExportColumns,
							]}
							isSummaryRow={true}
							summaryColumns={["bsr_amount"]}
						/>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("project_budget_source")
								: t("add") + " " + t("project_budget_source")}
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
									<Col className="col-12 mb-3">
										<Card>
											<CardBody>
												<div className="d-flex justify-content-between">
													<div>
														<strong>{t("Total_Project_Budget")} : </strong>{" "}
														{totalActualBudget
															? totalActualBudget.toLocaleString()
															: "0"}
													</div>
													<div>
														<strong>{t("Allocated")} : </strong>{" "}
														{calculateCurrentTotal(data)
															? calculateCurrentTotal(data).toLocaleString()
															: "0"}
													</div>
													<div
														className={
															calculateCurrentTotal(data) >
															(totalActualBudget || 0)
																? "text-danger"
																: "text-success"
														}
													>
														<strong>{t("Remaining")} : </strong>{" "}
														{(
															(totalActualBudget || 0) -
															(calculateCurrentTotal(data) || 0)
														).toLocaleString()}
													</div>
												</div>
											</CardBody>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="col-md-6 mb-3">
										<Label>{t("bsr_name")}</Label>
										<Input
											name="bsr_name"
											type="text"
											placeholder={t("bsr_name")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.bsr_name || ""}
											invalid={
												validation.touched.bsr_name &&
												validation.errors.bsr_name
													? true
													: false
											}
											maxLength={100}
										/>
										{validation.touched.bsr_name &&
										validation.errors.bsr_name ? (
											<FormFeedback type="invalid">
												{validation.errors.bsr_name}
											</FormFeedback>
										) : null}
									</Col>
									<AsyncSelectField
										fieldId="bsr_budget_source_id"
										validation={validation}
										isRequired
										className="col-md-6 mb-3"
										optionMap={budgetSourceMap}
										isLoading={isBsLoading}
										isError={isBsError}
									/>
									<Col className="col-md-6 mb-3">
										<FormattedAmountField
											validation={validation}
											fieldId="bsr_amount"
											label={t("bsr_amount")}
											isRequired={true}
											max={totalActualBudget}
										/>
										<small className="text-muted">
											Available budget:{" "}
											{(
												(totalActualBudget || 0) -
												(calculateCurrentTotal(
													data,
													isEdit ? projectBudgetSource?.bsr_id : null
												) || 0)
											).toLocaleString()}
										</small>
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>{t("bsr_description")}</Label>
										<Input
											name="bsr_description"
											type="textarea"
											placeholder={t("bsr_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.bsr_description || ""}
											invalid={
												validation.touched.bsr_description &&
												validation.errors.bsr_description
													? true
													: false
											}
											maxLength={400}
										/>
										{validation.touched.bsr_description &&
										validation.errors.bsr_description ? (
											<FormFeedback type="invalid">
												{validation.errors.bsr_description}
											</FormFeedback>
										) : null}
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addProjectBudgetSource.isPending ||
											updateProjectBudgetSource.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addProjectBudgetSource.isPending ||
														updateProjectBudgetSource.isPending ||
														!validation.dirty
													}
												>
													<Spinner size={"sm"} color="light" className="me-2" />
													{t("Save")}
												</Button>
											) : (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addProjectBudgetSource.isPending ||
														updateProjectBudgetSource.isPending ||
														!validation.dirty
													}
												>
													{t("Save")}
												</Button>
											)}
										</div>
									</Col>
								</Row>
							</Form>
						</ModalBody>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	);
};
ProjectBudgetSourceModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default ProjectBudgetSourceModel;
