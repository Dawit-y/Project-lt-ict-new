import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjectKpis,
	useSearchProjectKpis,
	useAddProjectKpi,
	useDeleteProjectKpi,
	useUpdateProjectKpi,
} from "../../queries/projectkpi_query";
import ProjectKpiModal from "./ProjectKpiModal";
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
	Card,
	CardBody,
	Label,
	Input,
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import InputField from "../../components/Common/InputField";
import { kpiExportColumns } from "../../utils/exportColumnsForLookups";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectKpiModel = () => {
	document.title = "Project Kpi";
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectKpi, setProjectKpi] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const { data, isLoading, error, isError, isFetching, refetch } =
		useFetchProjectKpis();
	const addProjectKpi = useAddProjectKpi();
	const updateProjectKpi = useUpdateProjectKpi();
	const deleteProjectKpi = useDeleteProjectKpi();
	//START CRUD
	const handleAddProjectKpi = async (data) => {
		try {
			await addProjectKpi.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
			refetch();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};
	const handleUpdateProjectKpi = async (data) => {
		try {
			await updateProjectKpi.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
			refetch();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};
	const handleDeleteProjectKpi = async () => {
		if (projectKpi && projectKpi.kpi_id) {
			try {
				const id = projectKpi.kpi_id;
				await deleteProjectKpi.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
				refetch();
			} catch (error) {
				toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};
	//END CRUD
	//START FOREIGN CALLS

	// validation
	const validation = useFormik({
		// enableReinitialize: use this flag when initial values need to be changed
		enableReinitialize: true,
		initialValues: {
			kpi_name_or: (projectKpi && projectKpi.kpi_name_or) || "",
			kpi_name_am: (projectKpi && projectKpi.kpi_name_am) || "",
			kpi_name_en: (projectKpi && projectKpi.kpi_name_en) || "",
			kpi_unit_measurement:
				(projectKpi && projectKpi.kpi_unit_measurement) || "",
			kpi_description: (projectKpi && projectKpi.kpi_description) || "",
			kpi_status: (projectKpi && projectKpi.kpi_status) || false,

			is_deletable: (projectKpi && projectKpi.is_deletable) || 1,
			is_editable: (projectKpi && projectKpi.is_editable) || 1,
		},
		validationSchema: Yup.object({
			kpi_name_or: Yup.string().required(t("kpi_name_or")),
			kpi_name_am: Yup.string().required(t("kpi_name_am")),
			kpi_name_en: Yup.string().required(t("kpi_name_en")),
			kpi_unit_measurement: Yup.string().required(t("kpi_unit_measurement")),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProjectKpi = {
					// kpi_id: projectKpi ? projectKpi.kpi_id : 0,
					kpi_id: projectKpi?.kpi_id,
					kpi_name_or: values.kpi_name_or,
					kpi_name_am: values.kpi_name_am,
					kpi_name_en: values.kpi_name_en,
					kpi_unit_measurement: values.kpi_unit_measurement,
					kpi_description: values.kpi_description,
					kpi_status: values.kpi_status ? 1 : 0,

					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update ProjectKpi
				handleUpdateProjectKpi(updateProjectKpi);
			} else {
				const newProjectKpi = {
					kpi_name_or: values.kpi_name_or,
					kpi_name_am: values.kpi_name_am,
					kpi_name_en: values.kpi_name_en,
					kpi_unit_measurement: values.kpi_unit_measurement,
					kpi_description: values.kpi_description,
					kpi_status: values.kpi_status ? 1 : 0,
				};
				// save new ProjectKpi
				handleAddProjectKpi(newProjectKpi);
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);
	// Fetch ProjectKpi on component mount
	useEffect(() => {
		setProjectKpi(data);
	}, [data]);
	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setProjectKpi(data);
			setIsEdit(false);
		}
	}, [data]);
	const toggle = () => {
		if (modal) {
			setModal(false);
			setProjectKpi(null);
		} else {
			setModal(true);
		}
	};
	const handleProjectKpiClick = (arg) => {
		const projectKpi = arg;
		// console.log("handleProjectKpiClick", projectKpi);
		setProjectKpi({
			kpi_id: projectKpi.kpi_id,
			kpi_name_or: projectKpi.kpi_name_or,
			kpi_name_am: projectKpi.kpi_name_am,
			kpi_name_en: projectKpi.kpi_name_en,
			kpi_unit_measurement: projectKpi.kpi_unit_measurement,
			kpi_description: projectKpi.kpi_description,
			kpi_status: projectKpi.kpi_status === 1,

			is_deletable: projectKpi.is_deletable,
			is_editable: projectKpi.is_editable,
		});
		setIsEdit(true);
		toggle();
	};
	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (projectKpi) => {
		setProjectKpi(projectKpi);
		setDeleteModal(true);
	};
	const handleProjectKpiClicks = () => {
		setIsEdit(false);
		setProjectKpi("");
		toggle();
	};
	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};
	//START UNCHANGED
	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: "",
				accessorKey: "kpi_name_or",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.kpi_name_or, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "kpi_name_am",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.kpi_name_am, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "kpi_name_en",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.kpi_name_en, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "kpi_unit_measurement",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.kpi_unit_measurement, 30) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "kpi_description",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.kpi_description, 30) || "-"}
						</span>
					);
				},
			},

			{
				header: "",
				accessorKey: t("is_inactive"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span
							className={
								cellProps.row.original.kpi_status === 1
									? "btn btn-sm btn-soft-danger"
									: ""
							}
						>
							{cellProps.row.original.kpi_status === 1 ? t("yes") : t("no")}
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
									color="None"
									size="sm"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleProjectKpiClick(data);
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
	}, [handleProjectKpiClick, toggleViewModal, onClickDelete, data, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}
	return (
		<React.Fragment>
			<ProjectKpiModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectKpi}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectKpi.isPending}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs
						title={t("project_kpi")}
						breadcrumbItem={t("project_kpi")}
					/>

					{isLoading || isSearchLoading ? (
						<Spinners />
					) : (
						<Row>
							<Col xs="12">
								<Card>
									<CardBody>
										<TableContainer
											columns={columns}
											data={
												showSearchResult
													? searchResults?.data
													: data?.data || []
											}
											isGlobalFilter={true}
											isAddButton={data?.previledge?.is_role_can_add == 1}
											isCustomPageSize={true}
											handleUserClick={handleProjectKpiClicks}
											isPagination={true}
											SearchPlaceholder={t("filter") + "..."}
											buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
											buttonName={t("add")}
											tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
											theadClass="table-light"
											pagination="pagination"
											paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
											exportColumns={kpiExportColumns}
											refetch={refetch}
											isFetching={isFetching}
											isExcelExport={true}
											isPdfExport={true}
											isPrint={true}
											tableName="Project Kpi"
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("project_kpi")
								: t("add") + " " + t("project_kpi")}
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
										fieldId={"kpi_name_or"}
										isRequired={true}
										className="col-md-6 mb-3"
										maxLength={200}
									/>
									<InputField
										type="text"
										validation={validation}
										fieldId={"kpi_name_am"}
										isRequired={true}
										className="col-md-6 mb-3"
										maxLength={200}
									/>

									<InputField
										type="text"
										validation={validation}
										fieldId={"kpi_name_en"}
										isRequired={true}
										className="col-md-6 mb-3"
										maxLength={200}
									/>
									<InputField
										type="text"
										validation={validation}
										fieldId={"kpi_unit_measurement"}
										isRequired={true}
										className="col-md-6 mb-3"
										maxLength={200}
									/>
									<InputField
										type="textarea"
										validation={validation}
										fieldId={"kpi_description"}
										isRequired={false}
										className="col-md-6 mb-3"
										maxLength={400}
									/>

									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="kpi_status">
												{t("is_inactive")}
											</Label>

											<Input
												id="kpi_status"
												name="kpi_status"
												type="checkbox"
												placeholder={t("kpi_status")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.kpi_status}
												invalid={
													validation.touched.kpi_status &&
													validation.errors.kpi_status
														? true
														: false
												}
											/>
											{validation.touched.kpi_status &&
												validation.errors.kpi_status && (
													<FormFeedback type="invalid">
														{validation.errors.kpi_status}
													</FormFeedback>
												)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addProjectKpi.isPending || updateProjectKpi.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addProjectKpi.isPending ||
														updateProjectKpi.isPending ||
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
														addProjectKpi.isPending ||
														updateProjectKpi.isPending ||
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
ProjectKpiModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProjectKpiModel;
