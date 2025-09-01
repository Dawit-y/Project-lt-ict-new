import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjectComponents,
	useAddProjectComponent,
	useDeleteProjectComponent,
	useUpdateProjectComponent,
} from "../../queries/projectcomponent_query";
import ProjectComponentModal from "./ProjectComponentModal";
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
import { projectComponentExportColumns } from "../../utils/exportColumnsForDetails";
import FormattedAmountField from "../../components/Common/FormattedAmountField";

const RequiredIndicator = () => <span className="text-danger">*</span>;

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectComponentModel = (props) => {
	document.title = "Project Component";
	const { passedId, isActive, totalActualBudget } = props;
	const param = { project_id: passedId, request_type: "single" };
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectComponent, setProjectComponent] = useState(null);

	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchProjectComponents(param, isActive);
	const addProjectComponent = useAddProjectComponent();
	const updateProjectComponent = useUpdateProjectComponent();
	const deleteProjectComponent = useDeleteProjectComponent();

	// Calculate current total allocated budget
	const calculateCurrentTotal = (
		currentData,
		editingId = null,
		newAmount = 0
	) => {
		if (!currentData || !currentData.data) return 0;

		return currentData.data.reduce((total, item) => {
			// If editing, exclude the item being edited from the total
			if (editingId && item.pcm_id === editingId) {
				return total + Number(newAmount || 0);
			}
			return total + Number(item.pcm_budget_amount || 0);
		}, 0);
	};

	//START CRUD
	const handleAddProjectComponent = async (data) => {
		try {
			await addProjectComponent.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateProjectComponent = async (data) => {
		try {
			await updateProjectComponent.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleDeleteProjectComponent = async () => {
		if (projectComponent && projectComponent.pcm_id) {
			try {
				const id = projectComponent.pcm_id;
				await deleteProjectComponent.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
			} catch (error) {
				toast.success(t("delete_failure"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};
	//END CRUD

	// validation
	const validation = useFormik({
		// enableReinitialize: use this flag when initial values need to be changed
		enableReinitialize: true,
		initialValues: {
			pcm_project_id: passedId,
			pcm_component_name:
				(projectComponent && projectComponent.pcm_component_name) || "",
			pcm_unit_measurement:
				(projectComponent && projectComponent.pcm_unit_measurement) || "",
			pcm_amount: (projectComponent && projectComponent.pcm_amount) || "",
			pcm_budget_amount:
				(projectComponent && projectComponent.pcm_budget_amount) || "",
			pcm_description:
				(projectComponent && projectComponent.pcm_description) || "",
		},
		validationSchema: Yup.object({
			pcm_project_id: Yup.string().required(t("pcm_project_id")),
			pcm_component_name: Yup.string().required(t("pcm_component_name")),
			pcm_unit_measurement: Yup.string().required(t("pcm_unit_measurement")),
			pcm_amount: Yup.string().required(t("pcm_amount")),
			pcm_budget_amount: Yup.number()
				.required(t("pcm_budget_amount"))
				.positive("Amount must be positive")
				.test(
					"total-budget",
					"Amount exceeds remaining project budget",
					function (value) {
						if (!value || isNaN(value)) return true;

						const currentData = data;
						const editingId = isEdit ? projectComponent?.pcm_id : null;

						// Calculate total without the current edited item
						const currentTotalWithoutThis =
							currentData?.data?.reduce((total, item) => {
								if (editingId && item.pcm_id === editingId) return total;
								return total + Number(item.pcm_budget_amount || 0);
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
				const updateProjectComponent = {
					pcm_id: projectComponent ? projectComponent.pcm_id : 0,
					pcm_project_id: passedId,
					pcm_component_name: values.pcm_component_name,
					pcm_unit_measurement: values.pcm_unit_measurement,
					pcm_amount: values.pcm_amount,
					pcm_budget_amount: values.pcm_budget_amount,
					pcm_description: values.pcm_description,
				};
				// update ProjectComponent
				handleUpdateProjectComponent(updateProjectComponent);
			} else {
				const newProjectComponent = {
					pcm_project_id: passedId,
					pcm_component_name: values.pcm_component_name,
					pcm_unit_measurement: values.pcm_unit_measurement,
					pcm_amount: values.pcm_amount,
					pcm_budget_amount: values.pcm_budget_amount,
					pcm_description: values.pcm_description,
				};
				// save new ProjectComponent
				handleAddProjectComponent(newProjectComponent);
			}
		},
	});

	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	const toggle = () => {
		if (modal) {
			setModal(false);
			setProjectComponent(null);
		} else {
			setModal(true);
		}
	};

	const handleProjectComponentClick = (arg) => {
		const projectComponent = arg;
		setProjectComponent({
			pcm_id: projectComponent.pcm_id,
			pcm_project_id: projectComponent.pcm_project_id,
			pcm_component_name: projectComponent.pcm_component_name,
			pcm_unit_measurement: projectComponent.pcm_unit_measurement,
			pcm_amount: projectComponent.pcm_amount,
			pcm_budget_amount: projectComponent.pcm_budget_amount,
			pcm_description: projectComponent.pcm_description,
		});
		setIsEdit(true);
		toggle();
	};

	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (projectComponent) => {
		setProjectComponent(projectComponent);
		setDeleteModal(true);
	};

	const handleProjectComponentClicks = () => {
		setIsEdit(false);
		setProjectComponent("");
		toggle();
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: "",
				accessorKey: "pcm_component_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.pcm_component_name, 30) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pcm_unit_measurement",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.pcm_unit_measurement, 30) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pcm_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => parseFloat(getValue()).toLocaleString() ?? "-",
			},
			{
				header: "",
				accessorKey: "pcm_budget_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => parseFloat(getValue()).toLocaleString() ?? "-",
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
								toggleViewModal();
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
			data?.previledge?.is_role_editable == 1 ||
			data?.previledge?.is_role_deletable == 1
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-1">
							{cellProps.row.original.is_editable == 1 && (
								<Button
									size="sm"
									color="None"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleProjectComponentClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}
							{cellProps.row.original.is_deletable == 1 && (
								<Button
									size="sm"
									color="None"
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
	}, [handleProjectComponentClick, toggleViewModal, onClickDelete]);

	if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<React.Fragment>
			<ProjectComponentModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectComponent}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectComponent.isPending}
			/>
			{isLoading ? (
				<Spinners />
			) : (
				<TableContainer
					columns={columns}
					data={data?.data || []}
					isGlobalFilter={true}
					isAddButton={data?.previledge?.is_role_can_add == 1}
					isCustomPageSize={true}
					handleUserClick={handleProjectComponentClicks}
					isPagination={true}
					SearchPlaceholder={26 + " " + t("Results") + "..."}
					buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
					buttonName={t("add")}
					tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
					theadClass="table-light"
					pagination="pagination"
					paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
					refetch={refetch}
					isFetching={isFetching}
					exportColumns={projectComponentExportColumns}
				/>
			)}
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("project_component")
						: t("add") + " " + t("project_component")}
				</ModalHeader>
				<ModalBody>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						{/* Budget Summary Card */}
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
													calculateCurrentTotal(data) > (totalActualBudget || 0)
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
								<Label>
									{t("pcm_component_name")} <RequiredIndicator />
								</Label>
								<Input
									name="pcm_component_name"
									type="text"
									placeholder={t("pcm_component_name")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_component_name || ""}
									invalid={
										validation.touched.pcm_component_name &&
										validation.errors.pcm_component_name
											? true
											: false
									}
								/>
								{validation.touched.pcm_component_name &&
								validation.errors.pcm_component_name ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_component_name}
									</FormFeedback>
								) : null}
							</Col>
							<Col className="col-md-6 mb-3">
								<Label>
									{t("pcm_unit_measurement")} <RequiredIndicator />
								</Label>
								<Input
									name="pcm_unit_measurement"
									type="text"
									placeholder={t("pcm_unit_measurement")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_unit_measurement || ""}
									invalid={
										validation.touched.pcm_unit_measurement &&
										validation.errors.pcm_unit_measurement
											? true
											: false
									}
								/>
								{validation.touched.pcm_unit_measurement &&
								validation.errors.pcm_unit_measurement ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_unit_measurement}
									</FormFeedback>
								) : null}
							</Col>
							<FormattedAmountField
								fieldId="pcm_amount"
								validation={validation}
								isRequired
								className={"col-md-6 mb-3"}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId="pcm_budget_amount"
								label={t("pcm_budget_amount")}
								className={"col-md-6 mb-3"}
								isRequired={true}
							/>
							<Col className="col-md-12 mb-3">
								<Label>{t("pcm_description")}</Label>
								<Input
									name="pcm_description"
									type="textarea"
									placeholder={t("pcm_description")}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.pcm_description || ""}
									invalid={
										validation.touched.pcm_description &&
										validation.errors.pcm_description
											? true
											: false
									}
									rows="3"
								/>
								{validation.touched.pcm_description &&
								validation.errors.pcm_description ? (
									<FormFeedback type="invalid">
										{validation.errors.pcm_description}
									</FormFeedback>
								) : null}
							</Col>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addProjectComponent.isPending ||
									updateProjectComponent.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addProjectComponent.isPending ||
												updateProjectComponent.isPending ||
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
												addProjectComponent.isPending ||
												updateProjectComponent.isPending ||
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
		</React.Fragment>
	);
};

ProjectComponentModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default ProjectComponentModel;
