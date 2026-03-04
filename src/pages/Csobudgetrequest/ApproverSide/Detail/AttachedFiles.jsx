import { useState, useMemo } from "react";
import { Row, Col, Card, CardBody, Spinner, Button } from "reactstrap";
import { useFetchProjectDocuments } from "../../../../queries/projectdocument_query";
import { PAGE_ID } from "../../../../constants/constantFile";
import FetchErrorHandler from "../../../../components/Common/FetchErrorHandler";
import TableContainer from "../../../../components/Common/TableContainer";
import FileUploadField from "../../../../components/Common/FileUploadField";
import DeleteModal from "../../../../components/Common/DeleteModal";
import ProjectDocumentModal from "../../../Projectdocument/ProjectDocumentModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
	useAddProjectDocument,
	useUpdateProjectDocument,
	useDeleteProjectDocument,
} from "../../../../queries/projectdocument_query";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalHeader, Form } from "reactstrap";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const formatFileSize = (bytes) => {
	if (isNaN(bytes) || bytes < 0) return "0 KB";
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(2)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function AttachedFiles({ requestData, isActive }) {
	const { t } = useTranslation();
	const [projectDocument, setProjectDocument] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [modal, setModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [details, setDetails] = useState();
	const [viewModal, setViewModal] = useState(false);
	const toggleViewModal = () => setViewModal(!viewModal);

	const ownerTypeId = PAGE_ID.PROJ_BUDGET_REQUEST;
	const param = {
		project_id: requestData?.bdr_project_id,
		prd_owner_type_id: ownerTypeId,
		prd_owner_id: requestData?.bdr_id,
	};

	const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
		param,
		isActive
	);
	const addProjectDocument = useAddProjectDocument();
	const updateProjectDocument = useUpdateProjectDocument();
	const deleteProjectDocument = useDeleteProjectDocument();

	const handleAddProjectDocument = async (data) => {
		try {
			await addProjectDocument.mutateAsync(data);
			toast.success(t("Data added successfully"), { autoClose: 3000 });
			validation.resetForm();
		} catch (error) {
			toast.error(t("Failed to add data"), { autoClose: 3000 });
		}
		toggleForm();
	};

	const handleUpdateProjectDocument = async (data) => {
		try {
			await updateProjectDocument.mutateAsync(data);
			toast.success(t("Data updated successfully"), { autoClose: 3000 });
			validation.resetForm();
		} catch (error) {
			toast.error(t("Failed to update data"), { autoClose: 3000 });
		}
		toggleForm();
	};

	const handleDeleteProjectDocument = async () => {
		if (projectDocument && projectDocument.prd_id) {
			try {
				const id = projectDocument.prd_id;
				await deleteProjectDocument.mutateAsync(id);
				toast.success(t("Data deleted successfully"), { autoClose: 3000 });
			} catch (error) {
				toast.error(t("Failed to delete data"), { autoClose: 3000 });
			}
			setDeleteModal(false);
		}
	};

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prd_project_id: requestData?.bdr_project_id,
			prd_file: null,
			prd_name: (projectDocument && projectDocument.prd_name) || "",
			prd_document_type_id:
				(projectDocument && projectDocument.prd_document_type_id) || "",
			prd_file_path: (projectDocument && projectDocument.prd_file_path) || "",
			prd_size: (projectDocument && projectDocument.prd_size) || "",
			prd_file_extension:
				(projectDocument && projectDocument.prd_file_extension) || "",
			prd_uploaded_date:
				(projectDocument && projectDocument.prd_uploaded_date) || "",
			prd_description:
				(projectDocument && projectDocument.prd_description) || "",
			prd_status: (projectDocument && projectDocument.prd_status) || "",
			is_deletable: (projectDocument && projectDocument.is_deletable) || 1,
			is_editable: (projectDocument && projectDocument.is_editable) || 1,
		},
		validationSchema: Yup.object({
			prd_file: !isEdit && Yup.mixed().required(t("File is required")),
			prd_document_type_id: Yup.string().required(
				t("Document type is required")
			),
			prd_name: Yup.string().required(t("Document name is required")),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateData = {
					prd_id: projectDocument?.prd_id,
					prd_project_id: values.prd_project_id,
					prd_file: values.prd_file,
					prd_name: values.prd_name,
					prd_file_path: values.prd_file_path,
					prd_size: values.prd_size,
					prd_file_extension: values.prd_file_extension,
					prd_uploaded_date: values.prd_uploaded_date,
					prd_description: values.prd_description,
					prd_status: values.prd_status,
					prd_document_type_id: values.prd_document_type_id,
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				handleUpdateProjectDocument(updateData);
			} else {
				const newData = {
					prd_project_id: requestData?.bdr_project_id,
					prd_owner_type_id: ownerTypeId,
					prd_owner_id: requestData?.bdr_id,
					prd_name: values.prd_name,
					prd_file: values.prd_file,
					prd_file_path: values.prd_file_path,
					prd_size: values.prd_size,
					prd_file_extension: values.prd_file_extension,
					prd_uploaded_date: values.prd_uploaded_date,
					prd_description: values.prd_description,
					prd_status: values.prd_status,
					prd_document_type_id: values.prd_document_type_id,
				};
				handleAddProjectDocument(newData);
			}
		},
	});

	const toggleForm = () => {
		if (modal) {
			setModal(false);
			setProjectDocument(null);
		} else {
			setModal(true);
		}
	};

	const handleProjectDocumentClick = (projectDocument) => {
		setProjectDocument(projectDocument);
		setIsEdit(true);
		toggleForm();
	};

	const handleAddNewDocument = () => {
		setIsEdit(false);
		setProjectDocument(null);
		toggleForm();
	};

	const onClickDelete = (projectDocument) => {
		setProjectDocument(projectDocument);
		setDeleteModal(true);
	};

	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("Document Name"),
				accessorKey: "prd_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.prd_name, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: t("Created By"),
				accessorKey: "created_by",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.created_by, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: t("File Path"),
				accessorKey: "prd_file_path",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.prd_file_path, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: t("Size"),
				accessorKey: "prd_size",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{formatFileSize(cellProps.row.original.prd_size) || "-"}
						</span>
					);
				},
			},
			{
				header: t("Extension"),
				accessorKey: "prd_file_extension",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.prd_file_extension, 10) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: t("Upload Date"),
				accessorKey: "prd_uploaded_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{`${cellProps.row.original.prd_create_time}`.split("T")[0]}
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
								toggleViewModal();
								setDetails(cellProps.row.original);
							}}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
		];

		// Add action columns if user has privileges
		if (
			data?.previledge?.is_role_editable &&
			data?.previledge?.is_role_deletable
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: "action",
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-2">
							{(cellProps.row.original?.is_editable ||
								cellProps.row.original?.is_role_editable) && (
								<Button
									color="none"
									className="text-success"
									size="sm"
									onClick={() =>
										handleProjectDocumentClick(cellProps.row.original)
									}
								>
									<i className="mdi mdi-pencil font-size-14" />
								</Button>
							)}
							{(cellProps.row.original?.is_deletable ||
								cellProps.row.original?.is_role_deletable) && (
								<Button
									color="none"
									className="text-danger"
									size="sm"
									onClick={() => onClickDelete(cellProps.row.original)}
								>
									<i className="mdi mdi-delete font-size-14" />
								</Button>
							)}
						</div>
					);
				},
			});
		}

		return baseColumns;
	}, [data, t]);

	const files = data?.data || [];

	const totalFiles = files.length;
	const totalSize = files.reduce((sum, file) => sum + (file.prd_size || 0), 0);
	const totalSizeFormatted = formatFileSize(totalSize);
	const categories = new Set(files.map((f) => f.prd_document_type_id));
	const totalCategories = categories.size;
	const lastUpload = files.length
		? new Date(
				Math.max(
					...files.map((f) =>
						f.prd_create_time ? new Date(f.prd_create_time).getTime() : 0
					)
				)
			)
		: null;
	const lastUploadLabel = lastUpload
		? lastUpload.toDateString() === new Date().toDateString()
			? "Today"
			: lastUpload.toLocaleDateString()
		: "-";

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<div>
			<ProjectDocumentModal
				isOpen={viewModal}
				toggle={toggleViewModal}
				transaction={details}
			/>
			{isLoading ? (
				<div className="w-full h-full d-flex align-items-center justify-content-center">
					<Spinner color="primary" />
				</div>
			) : (
				<>
					{/* Summary Cards */}
					<Row className="mb-4">
						<Col md={3}>
							<Card className="border-start-primary h-100">
								<CardBody>
									<div className="d-flex justify-content-between">
										<div>
											<h6 className="text-muted mb-1">{t("Total Files")}</h6>
											<h4 className="mb-0 text-primary">{totalFiles}</h4>
										</div>
										<div className="text-primary">
											<i className="bi bi-files fs-2"></i>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col md={3}>
							<Card className="border-start-success h-100">
								<CardBody>
									<div className="d-flex justify-content-between">
										<div>
											<h6 className="text-muted mb-1">{t("Total Size")}</h6>
											<h4 className="mb-0 text-success">
												{totalSizeFormatted}
											</h4>
										</div>
										<div className="text-success">
											<i className="bi bi-hdd fs-2"></i>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col md={3}>
							<Card className="border-start-info h-100">
								<CardBody>
									<div className="d-flex justify-content-between">
										<div>
											<h6 className="text-muted mb-1">{t("Categories")}</h6>
											<h4 className="mb-0 text-info">{totalCategories}</h4>
										</div>
										<div className="text-info">
											<i className="bi bi-tags fs-2"></i>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
						<Col md={3}>
							<Card className="border-start-warning h-100">
								<CardBody>
									<div className="d-flex justify-content-between">
										<div>
											<h6 className="text-muted mb-1">{t("Last Upload")}</h6>
											<h4 className="mb-0 text-warning">{lastUploadLabel}</h4>
										</div>
										<div className="text-warning">
											<i className="bi bi-clock fs-2"></i>
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>

					{/* Files Table with Actions */}
					<Card>
						<CardBody>
							<TableContainer
								columns={columns}
								data={files}
								isGlobalFilter={true}
								isAddButton={true}
								isCustomPageSize={true}
								handleUserClick={handleAddNewDocument}
								isPagination={true}
								SearchPlaceholder={t("Search documents...")}
								size="lg"
								buttonName={t("Add Document")}
								buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
								tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
								theadClass="table-light"
								pagination="pagination"
								paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
								refetch={refetch}
							/>
						</CardBody>
					</Card>

					{/* Add/Edit Modal */}
					<Modal isOpen={modal} toggle={toggleForm} className="modal-lg">
						<ModalHeader toggle={toggleForm}>
							{isEdit ? t("Edit Document") : t("Add Document")}
						</ModalHeader>
						<ModalBody>
							<Form
								onSubmit={(e) => {
									e.preventDefault();
									validation.handleSubmit();
								}}
							>
								<FileUploadField validation={validation} />
								<div className="text-end mt-3">
									<Button
										color="success"
										type="submit"
										disabled={
											addProjectDocument.isPending ||
											updateProjectDocument.isPending ||
											!validation.dirty
										}
									>
										{addProjectDocument.isPending ||
										updateProjectDocument.isPending ? (
											<Spinner size="sm" color="light" className="me-2" />
										) : null}
										{t("Save")}
									</Button>
								</div>
							</Form>
						</ModalBody>
					</Modal>

					{/* Delete Confirmation Modal */}
					<DeleteModal
						show={deleteModal}
						onDeleteClick={handleDeleteProjectDocument}
						onCloseClick={() => setDeleteModal(false)}
						isLoading={deleteProjectDocument.isPending}
					/>
				</>
			)}
		</div>
	);
}
