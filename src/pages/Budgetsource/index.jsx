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
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";

import {
  useFetchBudgetSources,
  useSearchBudgetSources,
  useAddBudgetSource,
  useDeleteBudgetSource,
  useUpdateBudgetSource,
} from "../../queries/budgetsource_query";
import BudgetSourceModal from "./BudgetSourceModal";
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
import { budgetSourceExportColumns } from "../../utils/exportColumnsForLookups";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const BudgetSourceModel = () => {
  //meta title
  document.title = " BudgetSource";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetSource, setBudgetSource] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchBudgetSources();

  const addBudgetSource = useAddBudgetSource();
  const updateBudgetSource = useUpdateBudgetSource();
  const deleteBudgetSource = useDeleteBudgetSource();
  //START CRUD
  const handleAddBudgetSource = async (data) => {
		try {
			await addBudgetSource.mutateAsync(data);
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

	const handleUpdateBudgetSource = async (data) => {
		try {
			await updateBudgetSource.mutateAsync(data);
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
  const handleDeleteBudgetSource = async () => {
    if (budgetSource && budgetSource.pbs_id) {
      try {
        const id = budgetSource.pbs_id;
        await deleteBudgetSource.mutateAsync(id);
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
      pbs_name_or: (budgetSource && budgetSource.pbs_name_or) || "",
      pbs_name_am: (budgetSource && budgetSource.pbs_name_am) || "",
      pbs_name_en: (budgetSource && budgetSource.pbs_name_en) || "",
      pbs_code: (budgetSource && budgetSource.pbs_code) || "",
      pbs_description: (budgetSource && budgetSource.pbs_description) || "",
      pbs_status: (budgetSource && budgetSource.pbs_status) || false,

      is_deletable: (budgetSource && budgetSource.is_deletable) || 1,
      is_editable: (budgetSource && budgetSource.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pbs_name_or: alphanumericValidation(2, 100, true).test(
        "unique-pbs_name_or",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.pbs_name_or == value && item.pbs_id !== budgetSource?.pbs_id,
          );
        },
      ),
      pbs_name_am: Yup.string().required(t("pbs_name_am")),
      pbs_name_en: alphanumericValidation(2, 100, true),
      pbs_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetSource = {
          pbs_id: budgetSource?.pbs_id,
          pbs_name_or: values.pbs_name_or,
          pbs_name_am: values.pbs_name_am,
          pbs_name_en: values.pbs_name_en,
          pbs_code: values.pbs_code,
          pbs_description: values.pbs_description,
          pbs_status: values.pbs_status ? 1 : 0,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetSource
        handleUpdateBudgetSource(updateBudgetSource);
      } else {
        const newBudgetSource = {
          pbs_name_or: values.pbs_name_or,
          pbs_name_am: values.pbs_name_am,
          pbs_name_en: values.pbs_name_en,
          pbs_code: values.pbs_code,
          pbs_description: values.pbs_description,
          pbs_status: values.pbs_status ? 1 : 0,
        };
        // save new BudgetSource
        handleAddBudgetSource(newBudgetSource);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetSource on component mount
  useEffect(() => {
    setBudgetSource(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetSource(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetSource(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetSourceClick = (arg) => {
    const budgetSource = arg;
    // console.log("handleBudgetSourceClick", budgetSource);
    setBudgetSource({
      pbs_id: budgetSource.pbs_id,
      pbs_name_or: budgetSource.pbs_name_or,
      pbs_name_am: budgetSource.pbs_name_am,
      pbs_name_en: budgetSource.pbs_name_en,
      pbs_code: budgetSource.pbs_code,
      pbs_description: budgetSource.pbs_description,
      pbs_status: budgetSource.pbs_status === 1,
      is_deletable: budgetSource.is_deletable,
      is_editable: budgetSource.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetSource) => {
    setBudgetSource(budgetSource);
    setDeleteModal(true);
  };

  const handleBudgetSourceClicks = () => {
    setIsEdit(false);
    setBudgetSource("");
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
        accessorKey: "pbs_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pbs_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pbs_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pbs_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pbs_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pbs_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pbs_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pbs_code, 30) || "-"}
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
                cellProps.row.original.pbs_status === 1
                  ? "btn btn-sm btn-soft-danger"
                  : ""
              }
            >
              {cellProps.row.original.pbs_status === 1 ? t("yes") : t("no")}
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
										handleBudgetSourceClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip placement="top" target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Link>
							)}
							{cellProps.row.original.is_deletable == 1 && (
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
  }, [handleBudgetSourceClick, toggleViewModal, onClickDelete]);
  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
		<React.Fragment>
			<BudgetSourceModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
				pageTitle={transaction.pbs_name_or}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteBudgetSource}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteBudgetSource.isPending}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs
						title={t("budget_source")}
						breadcrumbItem={t("budget_source")}
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
											handleUserClick={handleBudgetSourceClicks}
											isPagination={true}
											SearchPlaceholder={t("filter_placeholder")}
											buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
											buttonName={t("add") + " " + t("budget_source")}
											tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
											theadClass="table-light"
											pagination="pagination"
											paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
											refetch={refetch}
											isFetching={isFetching}
											isExcelExport={true}
											isPdfExport={true}
											isPrint={true}
											tableName="Budget Source"
											exportColumns={budgetSourceExportColumns}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{!!isEdit
								? t("edit") + " " + t("budget_source")
								: t("add") + " " + t("budget_source")}
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
											{t("pbs_name_or")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="pbs_name_or"
											type="text"
											placeholder={t("pbs_name_or")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.pbs_name_or || ""}
											invalid={
												validation.touched.pbs_name_or &&
												validation.errors.pbs_name_or
													? true
													: false
											}
											maxLength={100}
										/>
										{validation.touched.pbs_name_or &&
										validation.errors.pbs_name_or ? (
											<FormFeedback type="invalid">
												{validation.errors.pbs_name_or}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>
											{t("pbs_name_am")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="pbs_name_am"
											type="text"
											placeholder={t("pbs_name_am")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.pbs_name_am || ""}
											invalid={
												validation.touched.pbs_name_am &&
												validation.errors.pbs_name_am
													? true
													: false
											}
											maxLength={100}
										/>
										{validation.touched.pbs_name_am &&
										validation.errors.pbs_name_am ? (
											<FormFeedback type="invalid">
												{validation.errors.pbs_name_am}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>
											{t("pbs_name_en")}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="pbs_name_en"
											type="text"
											placeholder={t("pbs_name_en")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.pbs_name_en || ""}
											invalid={
												validation.touched.pbs_name_en &&
												validation.errors.pbs_name_en
													? true
													: false
											}
											maxLength={100}
										/>
										{validation.touched.pbs_name_en &&
										validation.errors.pbs_name_en ? (
											<FormFeedback type="invalid">
												{validation.errors.pbs_name_en}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>{t("pbs_code")}</Label>
										<Input
											name="pbs_code"
											type="text"
											placeholder={t("pbs_code")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.pbs_code || ""}
											invalid={
												validation.touched.pbs_code &&
												validation.errors.pbs_code
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.pbs_code &&
										validation.errors.pbs_code ? (
											<FormFeedback type="invalid">
												{validation.errors.pbs_code}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-6 mb-3">
										<Label>{t("pbs_description")}</Label>
										<Input
											name="pbs_description"
											type="textarea"
											placeholder={t("pbs_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.pbs_description || ""}
											invalid={
												validation.touched.pbs_description &&
												validation.errors.pbs_description
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.pbs_description &&
										validation.errors.pbs_description ? (
											<FormFeedback type="invalid">
												{validation.errors.pbs_description}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<div className="form-check mb-4">
											<Label className="me-1" for="pbs_status">
												{t("is_inactive")}
											</Label>

											<Input
												id="pbs_status"
												name="pbs_status"
												type="checkbox"
												placeholder={t("pbs_status")}
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												checked={validation.values.pbs_status}
												invalid={
													validation.touched.pbs_status &&
													validation.errors.pbs_status
												}
											/>
											{validation.touched.pbs_status &&
												validation.errors.pbs_status && (
													<FormFeedback type="invalid">
														{validation.errors.pbs_status}
													</FormFeedback>
												)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addBudgetSource.isPending ||
											updateBudgetSource.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addBudgetSource.isPending ||
														updateBudgetSource.isPending ||
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
														addBudgetSource.isPending ||
														updateBudgetSource.isPending ||
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
BudgetSourceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetSourceModel;
