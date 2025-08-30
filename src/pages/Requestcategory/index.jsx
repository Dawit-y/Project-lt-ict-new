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
  useFetchRequestCategorys,
  useSearchRequestCategorys,
  useAddRequestCategory,
  useDeleteRequestCategory,
  useUpdateRequestCategory,
} from "../../queries/requestcategory_query";
import RequestCategoryModal from "./RequestCategoryModal";
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
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { alphanumericValidation } from "../../utils/Validation/validation";
import { requestCategoryExportColumns } from "../../utils/exportColumnsForLookups";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const RequestCategoryModel = () => {
  //meta title
  document.title = " RequestCategory";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestCategory, setRequestCategory] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchRequestCategorys();
  const addRequestCategory = useAddRequestCategory();
  const updateRequestCategory = useUpdateRequestCategory();
  const deleteRequestCategory = useDeleteRequestCategory();
  //START CRUD
  const handleAddRequestCategory = async (data) => {
		try {
			await addRequestCategory.mutateAsync(data);
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
	const handleUpdateRequestCategory = async (data) => {
		try {
			await updateRequestCategory.mutateAsync(data);
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
  const handleDeleteRequestCategory = async () => {
    if (requestCategory && requestCategory.rqc_id) {
      try {
        const id = requestCategory.rqc_id;
        await deleteRequestCategory.mutateAsync(id);
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
      rqc_name_or: (requestCategory && requestCategory.rqc_name_or) || "",
      rqc_name_am: (requestCategory && requestCategory.rqc_name_am) || "",
      rqc_name_en: (requestCategory && requestCategory.rqc_name_en) || "",
      rqc_description:
        (requestCategory && requestCategory.rqc_description) || "",
      rqc_status: requestCategory?.rqc_status || false,
      rqc_gov_active: requestCategory?.rqc_gov_active || false,
      rqc_cso_active: requestCategory?.rqc_cso_active || false,
      is_deletable: (requestCategory && requestCategory.is_deletable) || 1,
      is_editable: (requestCategory && requestCategory.is_editable) || 1,
    },
    validationSchema: Yup.object({
      rqc_name_or: alphanumericValidation(2, 100, true),
      rqc_name_am: alphanumericValidation(2, 100, true),
      rqc_name_en: alphanumericValidation(2, 100, true),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateRequestCategory = {
          rqc_id: requestCategory?.rqc_id,
          rqc_name_or: values.rqc_name_or,
          rqc_name_am: values.rqc_name_am,
          rqc_name_en: values.rqc_name_en,
          rqc_description: values.rqc_description,
          rqc_status: values?.rqc_status ? 1 : 0,
          rqc_gov_active: values?.rqc_gov_active ? 1 : 0,
          rqc_cso_active: values?.rqc_cso_active ? 1 : 0,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update RequestCategory
        handleUpdateRequestCategory(updateRequestCategory);
      } else {
        const newRequestCategory = {
          rqc_name_or: values.rqc_name_or,
          rqc_name_am: values.rqc_name_am,
          rqc_name_en: values.rqc_name_en,
          rqc_description: values.rqc_description,
          rqc_status: values?.rqc_status ? 1 : 0,
          rqc_gov_active: values?.rqc_gov_active ? 1 : 0,
          rqc_cso_active: values?.rqc_cso_active ? 1 : 0,
        };
        // save new RequestCategory
        handleAddRequestCategory(newRequestCategory);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch RequestCategory on component mount
  useEffect(() => {
    setRequestCategory(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setRequestCategory(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setRequestCategory(null);
    } else {
      setModal(true);
    }
  };
  const handleRequestCategoryClick = (arg) => {
    const requestCategory = arg;
    // console.log("handleRequestCategoryClick", requestCategory);
    setRequestCategory({
      rqc_id: requestCategory.rqc_id,
      rqc_name_or: requestCategory.rqc_name_or,
      rqc_name_am: requestCategory.rqc_name_am,
      rqc_name_en: requestCategory.rqc_name_en,
      rqc_description: requestCategory.rqc_description,
      rqc_status: requestCategory.rqc_status === 1,
      rqc_gov_active: requestCategory.rqc_gov_active === 1,
      rqc_cso_active: requestCategory.rqc_cso_active === 1,
      is_deletable: requestCategory.is_deletable,
      is_editable: requestCategory.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (requestCategory) => {
    setRequestCategory(requestCategory);
    setDeleteModal(true);
  };
  const handleRequestCategoryClicks = () => {
    setIsEdit(false);
    setRequestCategory("");
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
        accessorKey: "rqc_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqc_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "rqc_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqc_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "rqc_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqc_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t("rqc_gov_active"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span
            className={
              cellProps.row.original.rqc_gov_active === 1
                ? "btn btn-sm btn-soft-success"
                : ""
            }
          >
            {cellProps.row.original.rqc_gov_active === 1 ? t("yes") : t("no")}
          </span>
        ),
      },
      {
        header: t("rqc_cso_active"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span
            className={
              cellProps.row.original.rqc_cso_active === 1
                ? "btn btn-sm btn-soft-success"
                : ""
            }
          >
            {cellProps.row.original.rqc_cso_active === 1 ? t("yes") : t("no")}
          </span>
        ),
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
                cellProps.row.original.rqc_status === 1
                  ? "btn btn-sm btn-soft-danger"
                  : ""
              }
            >
              {cellProps.row.original.rqc_status === 1 ? t("yes") : t("no")}
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
						<div className="d-flex gap-3">
							{cellProps.row.original.is_editable == 1 && (
								<Link
									to="#"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleRequestCategoryClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Link>
							)}
							{cellProps.row.original.is_deletable == 9 && (
								<Link
									to="#"
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
								</Link>
							)}
						</div>
					);
				},
			});
    }
    return baseColumns;
  }, [handleRequestCategoryClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
		<React.Fragment>
			<RequestCategoryModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteRequestCategory}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteRequestCategory.isPending}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs
						title={t("request_category")}
						breadcrumbItem={t("request_category")}
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
											handleUserClick={handleRequestCategoryClicks}
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
											tableName="Request Category"
											exportColumns={requestCategoryExportColumns}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("request_category")
								: t("add") + " " + t("request_category")}
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
											{t("rqc_name_or")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqc_name_or"
											type="text"
											placeholder={t("rqc_name_or")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqc_name_or || ""}
											invalid={
												validation.touched.rqc_name_or &&
												validation.errors.rqc_name_or
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqc_name_or &&
										validation.errors.rqc_name_or ? (
											<FormFeedback type="invalid">
												{validation.errors.rqc_name_or}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>
											{t("rqc_name_am")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqc_name_am"
											type="text"
											placeholder={t("rqc_name_am")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqc_name_am || ""}
											invalid={
												validation.touched.rqc_name_am &&
												validation.errors.rqc_name_am
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqc_name_am &&
										validation.errors.rqc_name_am ? (
											<FormFeedback type="invalid">
												{validation.errors.rqc_name_am}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>
											{t("rqc_name_en")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="rqc_name_en"
											type="text"
											placeholder={t("rqc_name_en")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqc_name_en || ""}
											invalid={
												validation.touched.rqc_name_en &&
												validation.errors.rqc_name_en
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.rqc_name_en &&
										validation.errors.rqc_name_en ? (
											<FormFeedback type="invalid">
												{validation.errors.rqc_name_en}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>{t("rqc_description")}</Label>
										<Input
											name="rqc_description"
											type="textarea"
											rows={5}
											placeholder={t("rqc_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.rqc_description || ""}
											invalid={
												validation.touched.rqc_description &&
												validation.errors.rqc_description
													? true
													: false
											}
										/>
										{validation.touched.rqc_description &&
										validation.errors.rqc_description ? (
											<FormFeedback type="invalid">
												{validation.errors.rqc_description}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="rqc_gov_active">
												{t("rqc_gov_active")}
											</Label>
											<Input
												id="rqc_gov_active"
												name="rqc_gov_active"
												type="checkbox"
												placeholder={t("rqc_gov_active")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.rqc_gov_active}
												invalid={
													validation.touched.rqc_gov_active &&
													validation.errors.rqc_gov_active
												}
											/>
											{validation.touched.rqc_gov_active &&
												validation.errors.rqc_gov_active && (
													<FormFeedback type="invalid">
														{validation.errors.rqc_gov_active}
													</FormFeedback>
												)}
										</div>
									</Col>
									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="rqc_cso_active">
												{t("rqc_cso_active")}
											</Label>
											<Input
												id="rqc_cso_active"
												name="rqc_cso_active"
												type="checkbox"
												placeholder={t("rqc_cso_active")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.rqc_cso_active}
												invalid={
													validation.touched.rqc_cso_active &&
													validation.errors.rqc_cso_active
												}
											/>
											{validation.touched.rqc_cso_active &&
												validation.errors.rqc_cso_active && (
													<FormFeedback type="invalid">
														{validation.errors.rqc_cso_active}
													</FormFeedback>
												)}
										</div>
									</Col>

									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="rqc_status">
												{t("is_inactive")}
											</Label>
											<Input
												id="rqc_status"
												name="rqc_status"
												type="checkbox"
												placeholder={t("rqc_status")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.rqc_status}
												invalid={
													validation.touched.rqc_status &&
													validation.errors.rqc_status
												}
											/>
											{validation.touched.rqc_status &&
												validation.errors.rqc_status && (
													<FormFeedback type="invalid">
														{validation.errors.rqc_status}
													</FormFeedback>
												)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addRequestCategory.isPending ||
											updateRequestCategory.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addRequestCategory.isPending ||
														updateRequestCategory.isPending ||
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
														addRequestCategory.isPending ||
														updateRequestCategory.isPending ||
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
RequestCategoryModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default RequestCategoryModel;
