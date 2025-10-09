import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchRequestStatuss,
	useSearchRequestStatuss,
	useAddRequestStatus,
	useDeleteRequestStatus,
	useUpdateRequestStatus,
} from "../../queries/requeststatus_query";
import RequestStatusModal from "./RequestStatusModal";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
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
	FormGroup,
	Badge,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { alphanumericValidation } from "../../utils/Validation/validation";
import { requestStatusExportColumns } from "../../utils/exportColumnsForLookups";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const RequestStatusModel = () => {
	document.title = "Request Status";
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [requestStatus, setRequestStatus] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);

	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchRequestStatuss();
	const addRequestStatus = useAddRequestStatus();
	const updateRequestStatus = useUpdateRequestStatus();
	const deleteRequestStatus = useDeleteRequestStatus();
	//START CRUD
	const handleAddRequestStatus = async (data) => {
		try {
			await addRequestStatus.mutateAsync(data);
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
	const handleUpdateRequestStatus = async (data) => {
		try {
			await updateRequestStatus.mutateAsync(data);
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
	const handleDeleteRequestStatus = async () => {
		if (requestStatus && requestStatus.rqs_id) {
			try {
				const id = requestStatus.rqs_id;
				await deleteRequestStatus.mutateAsync(id);
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
	//START FOREIGN CALLS

	// validation
	const validation = useFormik({
		// enableReinitialize: use this flag when initial values need to be changed
		enableReinitialize: true,
		initialValues: {
			rqs_name_or: (requestStatus && requestStatus.rqs_name_or) || "",
			rqs_name_am: (requestStatus && requestStatus.rqs_name_am) || "",
			rqs_name_en: (requestStatus && requestStatus.rqs_name_en) || "",
			rqs_description: (requestStatus && requestStatus.rqs_description) || "",
			rqs_status: (requestStatus && requestStatus.rqs_status) || false,
			is_deletable: (requestStatus && requestStatus.is_deletable) || 1,
			is_editable: (requestStatus && requestStatus.is_editable) || 1,
		},
		validationSchema: Yup.object({
			rqs_name_or: alphanumericValidation(2, 100, true),
			rqs_name_am: alphanumericValidation(2, 100, true),
			rqs_name_en: alphanumericValidation(2, 100, true),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateRequestStatus = {
					rqs_id: requestStatus?.rqs_id,
					rqs_name_or: values.rqs_name_or,
					rqs_name_am: values.rqs_name_am,
					rqs_name_en: values.rqs_name_en,
					rqs_description: values.rqs_description,
					rqs_status: values.rqs_status ? 1 : 0,
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update RequestStatus
				handleUpdateRequestStatus(updateRequestStatus);
			} else {
				const newRequestStatus = {
					rqs_name_or: values.rqs_name_or,
					rqs_name_am: values.rqs_name_am,
					rqs_name_en: values.rqs_name_en,
					rqs_description: values.rqs_description,
					rqs_status: values.rqs_status ? 1 : 0,
				};
				// save new RequestStatus
				handleAddRequestStatus(newRequestStatus);
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);
	// Fetch RequestStatus on component mount
	useEffect(() => {
		setRequestStatus(data);
	}, [data]);
	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setRequestStatus(data);
			setIsEdit(false);
		}
	}, [data]);
	const toggle = () => {
		if (modal) {
			setModal(false);
			setRequestStatus(null);
		} else {
			setModal(true);
		}
	};
	const handleRequestStatusClick = (arg) => {
		const requestStatus = arg;
		setRequestStatus({
			rqs_id: requestStatus.rqs_id,
			rqs_name_or: requestStatus.rqs_name_or,
			rqs_name_am: requestStatus.rqs_name_am,
			rqs_name_en: requestStatus.rqs_name_en,
			rqs_description: requestStatus.rqs_description,
			rqs_status: requestStatus.rqs_status === 1,

			is_deletable: requestStatus.is_deletable,
			is_editable: requestStatus.is_editable,
		});
		setIsEdit(true);
		toggle();
	};
	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (requestStatus) => {
		setRequestStatus(requestStatus);
		setDeleteModal(true);
	};
	const handleRequestStatusClicks = () => {
		setIsEdit(false);
		setRequestStatus("");
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
				accessorKey: "rqs_name_or",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.rqs_name_or, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "rqs_name_am",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.rqs_name_am, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "rqs_name_en",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.rqs_name_en, 30) || "-"}
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
								cellProps.row.original.rqs_status === 1
									? "btn btn-sm btn-soft-danger"
									: ""
							}
						>
							{cellProps.row.original.rqs_status === 1 ? t("yes") : t("no")}
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
										handleRequestStatusClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}
							{cellProps.row.original.is_deletable == 9 && (
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
	}, [handleRequestStatusClick, toggleViewModal, onClickDelete, data, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			<RequestStatusModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteRequestStatus}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteRequestStatus.isPending}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs
						title={t("request_status")}
						breadcrumbItem={t("request_status")}
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
											handleUserClick={handleRequestStatusClicks}
											isPagination={true}
											// SearchPlaceholder="26 records..."
											SearchPlaceholder={26 + " " + t("Results") + "..."}
											buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
											buttonName={t("add")}
											tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
											theadClass="table-light"
											pagination="pagination"
											paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
											refetch={refetch}
											isFetching={isFetching}
											isExcelExport={true}
											isPdfExport={true}
											isPrint={true}
											tableName="Request Status"
											exportColumns={requestStatusExportColumns}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("request_status")
								: t("add") + " " + t("request_status")}
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
									<Col className="col-md-4 mb-3">
										<Label>
											{t("rqs_name_or")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqs_name_or"
											type="text"
											placeholder={t("rqs_name_or")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqs_name_or || ""}
											invalid={
												validation.touched.rqs_name_or &&
												validation.errors.rqs_name_or
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqs_name_or &&
										validation.errors.rqs_name_or ? (
											<FormFeedback type="invalid">
												{validation.errors.rqs_name_or}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<Label>
											{t("rqs_name_am")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqs_name_am"
											type="text"
											placeholder={t("rqs_name_am")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqs_name_am || ""}
											invalid={
												validation.touched.rqs_name_am &&
												validation.errors.rqs_name_am
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqs_name_am &&
										validation.errors.rqs_name_am ? (
											<FormFeedback type="invalid">
												{validation.errors.rqs_name_am}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<Label>
											{t("rqs_name_en")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqs_name_en"
											type="text"
											placeholder={t("rqs_name_en")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqs_name_en || ""}
											invalid={
												validation.touched.rqs_name_en &&
												validation.errors.rqs_name_en
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqs_name_en &&
										validation.errors.rqs_name_en ? (
											<FormFeedback type="invalid">
												{validation.errors.rqs_name_en}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-8 mb-3">
										<Label>{t("rqs_description")}</Label>
										<Input
											name="rqs_description"
											rows={5}
											type="textarea"
											placeholder={t("rqs_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqs_description || ""}
											invalid={
												validation.touched.rqs_description &&
												validation.errors.rqs_description
													? true
													: false
											}
										/>
										{validation.touched.rqs_description &&
										validation.errors.rqs_description ? (
											<FormFeedback type="invalid">
												{validation.errors.rqs_description}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="rqs_status">
												{t("is_inactive")}
											</Label>
											<Input
												id="rqs_status"
												name="rqs_status"
												type="checkbox"
												placeholder={t("rqs_status")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.rqs_status}
												invalid={
													validation.touched.rqs_status &&
													validation.errors.rqs_status
												}
											/>
											{validation.touched.rqs_status &&
												validation.errors.rqs_status && (
													<FormFeedback type="invalid">
														{validation.errors.rqs_status}
													</FormFeedback>
												)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addRequestStatus.isPending ||
											updateRequestStatus.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addRequestStatus.isPending ||
														updateRequestStatus.isPending ||
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
														addRequestStatus.isPending ||
														updateRequestStatus.isPending ||
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
RequestStatusModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default RequestStatusModel;
