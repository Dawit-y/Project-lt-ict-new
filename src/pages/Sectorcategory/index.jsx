import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";

//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	alphanumericValidation,
	amountValidation,
	numberValidation,
} from "../../utils/Validation/validation";

import {
	useFetchSectorCategorys,
	useSearchSectorCategorys,
	useAddSectorCategory,
	useDeleteSectorCategory,
	useUpdateSectorCategory,
} from "../../queries/sectorcategory_query";
import SectorCategoryModal from "./SectorCategoryModal";
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
	FormGroup,
	Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { sectorCategoryExportColumns } from "../../utils/exportColumnsForLookups";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const SectorCategoryModel = () => {
	//meta title
	document.title = " SectorCategory";
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [sectorCategory, setSectorCategory] = useState(null);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);

	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchSectorCategorys();

	const addSectorCategory = useAddSectorCategory();
	const updateSectorCategory = useUpdateSectorCategory();
	const deleteSectorCategory = useDeleteSectorCategory();
	//START CRUD
	const handleAddSectorCategory = async (data) => {
		try {
			await addSectorCategory.mutateAsync(data);
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

	const handleUpdateSectorCategory = async (data) => {
		try {
			await updateSectorCategory.mutateAsync(data);
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

	const handleDeleteSectorCategory = async () => {
		if (sectorCategory && sectorCategory.psc_id) {
			try {
				const id = sectorCategory.psc_id;
				await deleteSectorCategory.mutateAsync(id);
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
	//END CRUD
	//START FOREIGN CALLS

	// validation
	const validation = useFormik({
		// enableReinitialize: use this flag when initial values need to be changed
		enableReinitialize: true,

		initialValues: {
			psc_name: (sectorCategory && sectorCategory.psc_name) || "",
			psc_code: (sectorCategory && sectorCategory.psc_code) || "",
			psc_sector_id: (sectorCategory && sectorCategory.psc_sector_id) || "",
			psc_description: (sectorCategory && sectorCategory.psc_description) || "",
			psc_status: (sectorCategory && sectorCategory.psc_status) || false,
			psc_gov_active:
				(sectorCategory && sectorCategory.psc_gov_active) || false,
			psc_cso_active:
				(sectorCategory && sectorCategory.psc_cso_active) || false,
			psc_citizenship_active:
				(sectorCategory && sectorCategory.psc_citizenship_active) || false,

			is_deletable: (sectorCategory && sectorCategory.is_deletable) || 1,
			is_editable: (sectorCategory && sectorCategory.is_editable) || 1,
		},

		validationSchema: Yup.object({
			psc_gov_active: Yup.string().required(t("psc_gov_active")),
			psc_cso_active: Yup.string().required(t("psc_cso_active")),
			psc_citizenship_active: Yup.string().required(
				t("psc_citizenship_active")
			),
			psc_name: alphanumericValidation(2, 100, true).test(
				"unique-psc_name",
				t("Already exists"),
				(value) => {
					return !data?.data.some(
						(item) =>
							item.psc_name == value && item.psc_id !== sectorCategory?.psc_id
					);
				}
			),
			psc_code: numberValidation(2, 5, false),
			psc_description: alphanumericValidation(3, 425, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateSectorCategory = {
					psc_id: sectorCategory?.psc_id,
					psc_name: values.psc_name,
					psc_code: values.psc_code,
					psc_sector_id: values.psc_sector_id,
					psc_description: values.psc_description,
					psc_status: values.psc_status ? 1 : 0,

					psc_gov_active: values.psc_gov_active ? 1 : 0,
					psc_cso_active: values.psc_cso_active ? 1 : 0,
					psc_citizenship_active: values.psc_citizenship_active ? 1 : 0,

					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update SectorCategory
				handleUpdateSectorCategory(updateSectorCategory);
			} else {
				const newSectorCategory = {
					psc_name: values.psc_name,
					psc_code: values.psc_code,
					psc_sector_id: values.psc_sector_id,
					psc_description: values.psc_description,
					psc_status: values.psc_status ? 1 : 0,

					psc_gov_active: values.psc_gov_active ? 1 : 0,
					psc_cso_active: values.psc_cso_active ? 1 : 0,
					psc_citizenship_active: values.psc_citizenship_active ? 1 : 0,
				};
				// save new SectorCategory
				handleAddSectorCategory(newSectorCategory);
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	// Fetch SectorCategory on component mount
	useEffect(() => {
		setSectorCategory(data);
	}, [data]);
	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setSectorCategory(data);
			setIsEdit(false);
		}
	}, [data]);
	const toggle = () => {
		if (modal) {
			setModal(false);
			setSectorCategory(null);
		} else {
			setModal(true);
		}
	};

	const handleSectorCategoryClick = (arg) => {
		const sectorCategory = arg;
		// console.log("handleSectorCategoryClick", sectorCategory);
		setSectorCategory({
			psc_id: sectorCategory.psc_id,
			psc_name: sectorCategory.psc_name,
			psc_code: sectorCategory.psc_code,
			psc_sector_id: sectorCategory.psc_sector_id,
			psc_description: sectorCategory.psc_description,
			psc_status: sectorCategory.psc_status === 1,

			psc_gov_active: sectorCategory.psc_gov_active === 1,
			psc_cso_active: sectorCategory.psc_cso_active === 1,
			psc_citizenship_active: sectorCategory.psc_citizenship_active === 1,

			is_deletable: sectorCategory.is_deletable,
			is_editable: sectorCategory.is_editable,
		});
		setIsEdit(true);
		toggle();
	};

	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (sectorCategory) => {
		setSectorCategory(sectorCategory);
		setDeleteModal(true);
	};

	const handleSectorCategoryClicks = () => {
		setIsEdit(false);
		setSectorCategory("");
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
				accessorKey: "psc_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.psc_name, 80) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "psc_code",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.psc_code, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "psc_gov_active",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span
							className={
								cellProps.row.original.psc_gov_active === 1
									? "btn btn-sm btn-soft-success"
									: ""
							}
						>
							{cellProps.row.original.psc_gov_active === 1 ? t("yes") : t("no")}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "psc_cso_active",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span
							className={
								cellProps.row.original.psc_cso_active === 1
									? "btn btn-sm btn-soft-success"
									: ""
							}
						>
							{cellProps.row.original.psc_cso_active === 1 ? t("yes") : t("no")}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "psc_citizenship_active",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span
							className={
								cellProps.row.original.psc_citizenship_active === 1
									? "btn btn-sm btn-soft-success"
									: ""
							}
						>
							{cellProps.row.original.psc_citizenship_active === 1
								? t("yes")
								: t("no")}
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
								cellProps.row.original.psc_status === 1
									? "btn btn-sm btn-soft-danger"
									: ""
							}
						>
							{cellProps.row.original.psc_status === 1 ? t("yes") : t("no")}
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
										handleSectorCategoryClick(data);
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
	}, [handleSectorCategoryClick, toggleViewModal, onClickDelete, data, t]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}
	
	return (
		<React.Fragment>
			<SectorCategoryModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteSectorCategory}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteSectorCategory.isPending}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs
						title={t("sector_category")}
						breadcrumbItem={t("sector_category")}
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
											handleUserClick={handleSectorCategoryClicks}
											isPagination={true}
											SearchPlaceholder={t("filter_placeholder")}
											buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
											buttonName={t("add") + " " + t("sector_category")}
											tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
											theadClass="table-light"
											pagination="pagination"
											paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
											refetch={refetch}
											isFetching={isFetching}
											isExcelExport={true}
											isPdfExport={true}
											isPrint={true}
											tableName="Sector Category"
											exportColumns={sectorCategoryExportColumns}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("sector_category")
								: t("add") + " " + t("sector_category")}
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
									<Col className="col-md-6 mb-3">
										<Label>
											{t("psc_name")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="psc_name"
											type="text"
											placeholder={t("psc_name")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.psc_name || ""}
											invalid={
												validation.touched.psc_name &&
												validation.errors.psc_name
													? true
													: false
											}
											maxLength={100}
										/>
										{validation.touched.psc_name &&
										validation.errors.psc_name ? (
											<FormFeedback type="invalid">
												{validation.errors.psc_name}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>{t("psc_code")}</Label>
										<Input
											name="psc_code"
											type="text"
											placeholder={t("psc_code")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.psc_code || ""}
											invalid={
												validation.touched.psc_code &&
												validation.errors.psc_code
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.psc_code &&
										validation.errors.psc_code ? (
											<FormFeedback type="invalid">
												{validation.errors.psc_code}
											</FormFeedback>
										) : null}
									</Col>

									<Col className="col-md-3 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="psc_gov_active">
												{t("psc_gov_active")}
											</Label>
											<Input
												id="psc_gov_active"
												name="psc_gov_active"
												type="checkbox"
												placeholder={t("psc_gov_active")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.psc_gov_active}
												invalid={
													validation.touched.psc_gov_active &&
													validation.errors.psc_gov_active
												}
											/>
											{validation.touched.psc_gov_active &&
												validation.errors.psc_gov_active && (
													<FormFeedback type="invalid">
														{validation.errors.psc_gov_active}
													</FormFeedback>
												)}
										</div>
									</Col>

									<Col className="col-md-3 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="psc_cso_active">
												{t("psc_cso_active")}
											</Label>
											<Input
												id="psc_cso_active"
												name="psc_cso_active"
												type="checkbox"
												placeholder={t("psc_cso_active")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.psc_cso_active}
												invalid={
													validation.touched.psc_cso_active &&
													validation.errors.psc_cso_active
												}
											/>
											{validation.touched.psc_cso_active &&
												validation.errors.psc_cso_active && (
													<FormFeedback type="invalid">
														{validation.errors.psc_cso_active}
													</FormFeedback>
												)}
										</div>
									</Col>

									<Col className="col-md-3 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="psc_citizenship_active">
												{t("psc_citizenship_active")}
											</Label>
											<Input
												id="psc_citizenship_active"
												name="psc_citizenship_active"
												type="checkbox"
												placeholder={t("psc_citizenship_active")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.psc_citizenship_active}
												invalid={
													validation.touched.psc_citizenship_active &&
													validation.errors.psc_citizenship_active
												}
											/>
											{validation.touched.psc_citizenship_active &&
												validation.errors.psc_citizenship_active && (
													<FormFeedback type="invalid">
														{validation.errors.psc_citizenship_active}
													</FormFeedback>
												)}
										</div>
									</Col>

									<Col className="col-md-3 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="psc_status">
												{t("is_inactive")}
											</Label>
											<Input
												id="psc_status"
												name="psc_status"
												type="checkbox"
												placeholder={t("psc_status")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.psc_status}
												invalid={
													validation.touched.psc_status &&
													validation.errors.psc_status
												}
											/>
											{validation.touched.psc_status &&
												validation.errors.psc_status && (
													<FormFeedback type="invalid">
														{validation.errors.psc_status}
													</FormFeedback>
												)}
										</div>
									</Col>

									<Col className="col-md-12 mb-3">
										<Label>{t("psc_description")}</Label>
										<Input
											name="psc_description"
											type="textarea"
											placeholder={t("psc_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.psc_description || ""}
											invalid={
												validation.touched.psc_description &&
												validation.errors.psc_description
													? true
													: false
											}
											maxLength={425}
										/>
										{validation.touched.psc_description &&
										validation.errors.psc_description ? (
											<FormFeedback type="invalid">
												{validation.errors.psc_description}
											</FormFeedback>
										) : null}
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addSectorCategory.isPending ||
											updateSectorCategory.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addSectorCategory.isPending ||
														updateSectorCategory.isPending ||
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
														addSectorCategory.isPending ||
														updateSectorCategory.isPending ||
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
SectorCategoryModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default SectorCategoryModel;
