import React, { useMemo, useState, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
	Badge,
	Spinner,
} from "reactstrap";

import {
	useSearchCsoReports,
	useAddCsoReport,
	useUpdateCsoReport,
	useDeleteCsoReport,
} from "../../queries/cso_report_query";

import { alphanumericValidation } from "../../utils/Validation/validation";
import { PAGE_ID } from "../../constants/constantFile";

// Lazy-loaded components
const TableContainer = lazy(
	() => import("../../components/Common/TableContainer"),
);
const Spinners = lazy(() => import("../../components/Common/Spinner"));
const DeleteModal = lazy(() => import("../../components/Common/DeleteModal"));
const FetchErrorHandler = lazy(
	() => import("../../components/Common/FetchErrorHandler"),
);
import AttachFileModal from "../../components/Common/AttachFileModal";
import ConvInfoModal from "../../pages/Conversationinformation/ConvInfoModal";
import CsoReportDetailModal from "./CsoReportDetailModal";
import DatePicker from "../../components/Common/DatePicker";

// Report type constants
const REPORT_TYPES = {
	1: { name: "Monitoring Report", badgeColor: "primary" },
	2: { name: "Evaluation Report", badgeColor: "success" },
	3: { name: "Progress Report", badgeColor: "info" },
};

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const CsoReportModel = ({ projectId, isActive }) => {
	const param = { project_id: projectId };
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [detailModal, setDetailModal] = useState(false);
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [csoReport, setCsoReport] = useState(null);
	const [selectedReport, setSelectedReport] = useState(null);

	const { data, isLoading, isFetching, isError, error, refetch } =
		useSearchCsoReports(param, isActive);

	const addCsoReport = useAddCsoReport();
	const updateCsoReport = useUpdateCsoReport();
	const deleteCsoReport = useDeleteCsoReport();

	const handleAddCsoReport = async (data) => {
		try {
			await addCsoReport.mutateAsync(data);
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

	const handleUpdateCsoReport = async (data) => {
		try {
			await updateCsoReport.mutateAsync(data);
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

	// validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			rpt_name: (csoReport && csoReport.rpt_name) || "",
			rpt_type_id: (csoReport && csoReport.rpt_type_id) || "",
			rpt_report_date: (csoReport && csoReport.rpt_report_date) || "",
			rpt_description: (csoReport && csoReport.rpt_description) || "",
			is_deletable: (csoReport && csoReport.is_deletable) || 1,
			is_editable: (csoReport && csoReport.is_editable) || 1,
		},

		validationSchema: Yup.object({
			rpt_name: Yup.string()
				.required(t("rpt_name_required"))
				.max(50, t("max_50_chars")),
			rpt_type_id: Yup.string().required(t("rpt_type_id_required")),
			rpt_report_date: Yup.string().required(t("rpt_report_date_required")),
			rpt_description: alphanumericValidation(3, 425, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updatedCsoReport = {
					rpt_id: csoReport ? csoReport.rpt_id : 0,
					rpt_name: values.rpt_name,
					rpt_project_id: projectId,
					rpt_type_id: parseInt(values.rpt_type_id),
					rpt_report_date: values.rpt_report_date,
					rpt_description: values.rpt_description,
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				handleUpdateCsoReport(updatedCsoReport);
			} else {
				const newCsoReport = {
					rpt_name: values.rpt_name,
					rpt_project_id: projectId,
					rpt_type_id: parseInt(values.rpt_type_id),
					rpt_report_date: values.rpt_report_date,
					rpt_description: values.rpt_description,
				};
				handleAddCsoReport(newCsoReport);
			}
		},
	});

	const toggleDetailModal = () => setDetailModal(!detailModal);
	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);

	const toggle = () => {
		if (modal) {
			setModal(false);
			setCsoReport(null);
		} else {
			setModal(true);
		}
	};

	const handleCsoReportClick = (arg) => {
		const report = arg;
		setCsoReport({
			rpt_id: report.rpt_id,
			rpt_name: report.rpt_name,
			rpt_type_id: report.rpt_type_id,
			rpt_report_date: report.rpt_report_date,
			rpt_description: report.rpt_description,
			is_deletable: report.is_deletable,
			is_editable: report.is_editable,
		});
		setIsEdit(true);
		toggle();
	};

	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);

	const onClickDelete = (report) => {
		setCsoReport(report);
		setDeleteModal(true);
	};

	const handleDeleteCsoReport = async () => {
		if (csoReport && csoReport.rpt_id) {
			try {
				const id = csoReport.rpt_id;
				await deleteCsoReport.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
			} catch (error) {
				toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	};

	const handleAddCsoReportClick = () => {
		setIsEdit(false);
		setCsoReport("");
		toggle();
	};

	const handleViewDetail = (report) => {
		setSelectedReport(report);
		toggleDetailModal();
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("rpt_name"),
				accessorKey: "rpt_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.rpt_name, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: t("rpt_type_id"),
				accessorKey: "rpt_type_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					const typeId = cellProps.row.original.rpt_type_id;
					const reportType = REPORT_TYPES[typeId] || {
						name: "-",
						badgeColor: "secondary",
					};
					return (
						<Badge
							className={`font-size-12 badge-soft-${reportType.badgeColor}`}
						>
							{reportType.name}
						</Badge>
					);
				},
			},
			{
				header: t("rpt_report_date"),
				accessorKey: "rpt_report_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return <span>{cellProps.row.original.rpt_report_date || "-"}</span>;
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
							onClick={() => handleViewDetail(cellProps.row.original)}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
			{
				header: t("attach_files"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<Button
							outline
							type="button"
							color="success"
							className="btn-sm"
							onClick={() => {
								toggleFileModal();
								setSelectedReport(cellProps.row.original);
							}}
						>
							{t("attach_files")}
						</Button>
					);
				},
			},
			{
				header: t("Message"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<Button
							outline
							type="button"
							color="primary"
							className="btn-sm"
							onClick={() => {
								toggleConvModal();
								setSelectedReport(cellProps.row.original);
							}}
						>
							{t("Message")}
						</Button>
					);
				},
			},
		];

		// Add action column with edit/delete buttons
		baseColumns.push({
			header: t("Action"),
			accessorKey: t("Action"),
			enableColumnFilter: false,
			enableSorting: false,
			cell: (cellProps) => {
				return (
					<div className="d-flex gap-1">
						{data?.previledge?.is_role_editable == 1 &&
							cellProps.row.original?.is_editable == 1 && (
								<Button
									size="sm"
									color="none"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleCsoReportClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}
						{data?.previledge?.is_role_deletable == 1 &&
							cellProps.row.original?.is_deletable == 1 && (
								<div>
									<Button
										size="sm"
										color="none"
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
								</div>
							)}
					</div>
				);
			},
		});

		return baseColumns;
	}, [handleCsoReportClick, onClickDelete, handleViewDetail, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			{/* Detail Modal */}
			<CsoReportDetailModal
				isOpen={detailModal}
				toggle={toggleDetailModal}
				report={selectedReport}
				reportTypes={REPORT_TYPES}
			/>

			{/* Attach File Modal */}
			<AttachFileModal
				isOpen={fileModal}
				toggle={toggleFileModal}
				projectId={projectId}
				ownerTypeId={PAGE_ID.CSO_REPORT}
				ownerId={selectedReport?.rpt_id}
				accept={{
					"application/pdf": [],
					"application/msword": [],
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
						[],
					"application/vnd.ms-excel": [],
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						[],
				}}
				title={t("Report Files")}
			/>

			{/* Conversation Modal */}
			<ConvInfoModal
				isOpen={convModal}
				toggle={toggleConvModal}
				ownerTypeId={PAGE_ID.CSO_REPORT}
				ownerId={selectedReport?.rpt_id ?? null}
			/>

			{/* Delete Modal */}
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteCsoReport}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteCsoReport.isPending}
			/>

			{/* Main Table */}
			{isLoading ? (
				<Spinners />
			) : (
				<TableContainer
					columns={columns}
					data={data?.data || []}
					isGlobalFilter={true}
					isAddButton={true}
					isCustomPageSize={true}
					handleUserClick={handleAddCsoReportClick}
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
				/>
			)}

			{/* Add/Edit Modal */}
			<Modal isOpen={modal} toggle={toggle} className="modal-lg">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("report")
						: t("add") + " " + t("report")}
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
								<Label>
									{t("rpt_name")}
									<span className="text-danger">*</span>
								</Label>
								<Input
									name="rpt_name"
									type="text"
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.rpt_name || ""}
									invalid={
										validation.touched.rpt_name && validation.errors.rpt_name
											? true
											: false
									}
									maxLength={50}
								/>
								{validation.touched.rpt_name && validation.errors.rpt_name ? (
									<FormFeedback type="invalid">
										{validation.errors.rpt_name}
									</FormFeedback>
								) : null}
							</Col>

							<Col className="col-md-6 mb-3">
								<Label>
									{t("rpt_type_id")}
									<span className="text-danger">*</span>
								</Label>
								<Input
									name="rpt_type_id"
									type="select"
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.rpt_type_id || ""}
									invalid={
										validation.touched.rpt_type_id &&
										validation.errors.rpt_type_id
											? true
											: false
									}
								>
									<option value="">{t("select_report_type")}</option>
									{Object.entries(REPORT_TYPES).map(([id, type]) => (
										<option key={id} value={id}>
											{type.name}
										</option>
									))}
								</Input>
								{validation.touched.rpt_type_id &&
								validation.errors.rpt_type_id ? (
									<FormFeedback type="invalid">
										{validation.errors.rpt_type_id}
									</FormFeedback>
								) : null}
							</Col>

							<Col className="col-md-6 mb-3">
								<DatePicker
									isRequired="true"
									validation={validation}
									componentId="rpt_report_date"
								/>
							</Col>

							<Col className="col-md-12 mb-3">
								<Label>{t("rpt_description")}</Label>
								<Input
									name="rpt_description"
									type="textarea"
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.rpt_description || ""}
									invalid={
										validation.touched.rpt_description &&
										validation.errors.rpt_description
											? true
											: false
									}
									maxLength={425}
									rows={4}
								/>
								{validation.touched.rpt_description &&
								validation.errors.rpt_description ? (
									<FormFeedback type="invalid">
										{validation.errors.rpt_description}
									</FormFeedback>
								) : null}
								<div className="text-end text-muted">
									<small>
										{validation.values.rpt_description?.length || 0}/425
									</small>
								</div>
							</Col>
						</Row>

						<Row>
							<Col>
								<div className="text-end">
									{addCsoReport.isPending || updateCsoReport.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addCsoReport.isPending ||
												updateCsoReport.isPending ||
												!validation.dirty
											}
										>
											<Spinner size={"sm"} color="#fff" className="me-2" />
											{t("Save")}
										</Button>
									) : (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addCsoReport.isPending ||
												updateCsoReport.isPending ||
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

CsoReportModel.propTypes = {
	projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	isActive: PropTypes.bool,
	preGlobalFilteredRows: PropTypes.any,
};

export default CsoReportModel;
