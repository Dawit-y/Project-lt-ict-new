import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchBudgetRequestAmounts,
  useSearchBudgetRequestAmounts,
  useAddBudgetRequestAmount,
  useDeleteBudgetRequestAmount,
  useUpdateBudgetRequestAmount,
} from "../../queries/budgetrequestamount_query";
import BudgetRequestAmountModal from "./BudgetRequestAmountModal";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const BudgetRequestAmountModel = ({ passedId, isActive }) => {
  const param = { budget_request_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetRequestAmount, setBudgetRequestAmount] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchBudgetRequestAmounts(param, isActive);
  const addBudgetRequestAmount = useAddBudgetRequestAmount();
  const updateBudgetRequestAmount = useUpdateBudgetRequestAmount();
  const deleteBudgetRequestAmount = useDeleteBudgetRequestAmount();

  const today = new Date();
  const formattedDate = today.getFullYear() + '/' +
    String(today.getMonth() + 1).padStart(2, '0') + '/' +
    String(today.getDate()).padStart(2, '0');
  //START CRUD
  const handleAddBudgetRequestAmount = async (data) => {
    try {
      await addBudgetRequestAmount.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateBudgetRequestAmount = async (data) => {
    try {
      await updateBudgetRequestAmount.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteBudgetRequestAmount = async () => {
    if (budgetRequestAmount && budgetRequestAmount.bra_id) {
      try {
        const id = budgetRequestAmount.bra_id;
        await deleteBudgetRequestAmount.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t("delete_failure"), {
          autoClose: 2000,
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
      bra_expenditure_code_id:
        (budgetRequestAmount && budgetRequestAmount.bra_expenditure_code_id) ||
        "",
      bra_budget_request_id:
        (budgetRequestAmount && budgetRequestAmount.bra_budget_request_id) ||
        "",
      bra_current_year_expense:
        (budgetRequestAmount && budgetRequestAmount.bra_current_year_expense) ||
        "",
      bra_requested_amount:
        (budgetRequestAmount && budgetRequestAmount.bra_requested_amount) || "",
      bra_approved_amount:
        (budgetRequestAmount && budgetRequestAmount.bra_approved_amount) || "",
      bra_source_government_requested:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_government_requested) ||
        "",
      bra_source_government_approved:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_government_approved) ||
        "",
      bra_source_internal_requested:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_internal_requested) ||
        "",
      bra_source_internal_approved:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_internal_approved) ||
        "",
      bra_source_support_requested:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_support_requested) ||
        "",
      bra_source_support_approved:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_support_approved) ||
        "",
      bra_source_support_code:
        (budgetRequestAmount && budgetRequestAmount.bra_source_support_code) ||
        "",
      bra_source_credit_requested:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_credit_requested) ||
        "",
      bra_source_credit_approved:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_credit_approved) ||
        "",
      bra_source_credit_code:
        (budgetRequestAmount && budgetRequestAmount.bra_source_credit_code) ||
        "",
      bra_source_other_requested:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_other_requested) ||
        "",
      bra_source_other_approved:
        (budgetRequestAmount &&
          budgetRequestAmount.bra_source_other_approved) ||
        "",
      bra_source_other_code:
        (budgetRequestAmount && budgetRequestAmount.bra_source_other_code) ||
        "",
      bra_requested_date:
        (budgetRequestAmount && budgetRequestAmount.bra_requested_date) || "",
      bra_approved_date:
        (budgetRequestAmount && budgetRequestAmount.bra_approved_date) || "",
      bra_description:
        (budgetRequestAmount && budgetRequestAmount.bra_description) || "",
      bra_status: (budgetRequestAmount && budgetRequestAmount.bra_status) || "",

      is_deletable:
        (budgetRequestAmount && budgetRequestAmount.is_deletable) || 1,
      is_editable:
        (budgetRequestAmount && budgetRequestAmount.is_editable) || 1,
    },
    validationSchema: Yup.object({
      bra_expenditure_code_id: Yup.number().required(
        t("bra_expenditure_code_id")
      ),
      bra_current_year_expense: amountValidation(0, 10000000000, false),
      bra_requested_amount: amountValidation(0, 10000000000, true),
      bra_approved_amount: amountValidation(0, 10000000000, false),
      bra_source_government_requested: amountValidation(0, 10000000000, false),
      bra_source_government_approved: amountValidation(0, 10000000000, false),
      bra_source_internal_requested: amountValidation(0, 10000000000, false),
      bra_source_internal_approved: amountValidation(0, 10000000000, false),
      bra_source_support_requested: amountValidation(0, 10000000000, false),
      bra_source_support_approved: amountValidation(0, 10000000000, false),
      bra_source_support_code: alphanumericValidation(0, 10, false),
      bra_source_credit_requested: amountValidation(0, 10000000000, false),
      bra_source_credit_approved: amountValidation(0, 10000000000, false),
      bra_source_credit_code: alphanumericValidation(0, 10, false),
      /*bra_source_other_requested: Yup.string().required(t('bra_source_other_requested')),
bra_source_other_approved: Yup.string().required(t('bra_source_other_approved')),
bra_source_other_code: Yup.string().required(t('bra_source_other_code')),*/
      bra_requested_date: alphanumericValidation(0, 50, false),
      bra_approved_date: alphanumericValidation(0, 50, false),
      bra_description: alphanumericValidation(0, 425, false),
      //bra_status: Yup.string().required(t('bra_status')),*/
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetRequestAmount = {
          bra_id: budgetRequestAmount.bra_id,
          bra_expenditure_code_id: values.bra_expenditure_code_id,
          bra_budget_request_id: values.bra_budget_request_id,
          bra_current_year_expense: values.bra_current_year_expense,
          bra_requested_amount: values.bra_requested_amount,
          bra_approved_amount: values.bra_approved_amount,
          bra_source_government_requested:
            values.bra_source_government_requested,
          bra_source_government_approved: values.bra_source_government_approved,
          bra_source_internal_requested: values.bra_source_internal_requested,
          bra_source_internal_approved: values.bra_source_internal_approved,
          bra_source_support_requested: values.bra_source_support_requested,
          bra_source_support_approved: values.bra_source_support_approved,
          bra_source_support_code: values.bra_source_support_code,
          bra_source_credit_requested: values.bra_source_credit_requested,
          bra_source_credit_approved: values.bra_source_credit_approved,
          bra_source_credit_code: values.bra_source_credit_code,
          bra_source_other_requested: values.bra_source_other_requested,
          bra_source_other_approved: values.bra_source_other_approved,
          bra_source_other_code: values.bra_source_other_code,
          bra_requested_date: values.bra_requested_date,
          bra_approved_date: values.bra_approved_date,
          bra_description: values.bra_description,
          bra_status: values.bra_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetRequestAmount
        handleUpdateBudgetRequestAmount(updateBudgetRequestAmount);
      } else {
        const newBudgetRequestAmount = {
          bra_expenditure_code_id: values.bra_expenditure_code_id,
          bra_budget_request_id: passedId,
          bra_current_year_expense: values.bra_current_year_expense,
          bra_requested_amount: values.bra_requested_amount,
          bra_approved_amount: values.bra_approved_amount,
          bra_source_government_requested:
            values.bra_source_government_requested,
          bra_source_government_approved: values.bra_source_government_approved,
          bra_source_internal_requested: values.bra_source_internal_requested,
          bra_source_internal_approved: values.bra_source_internal_approved,
          bra_source_support_requested: values.bra_source_support_requested,
          bra_source_support_approved: values.bra_source_support_approved,
          bra_source_support_code: values.bra_source_support_code,
          bra_source_credit_requested: values.bra_source_credit_requested,
          bra_source_credit_approved: values.bra_source_credit_approved,
          bra_source_credit_code: values.bra_source_credit_code,
          bra_source_other_requested: values.bra_source_other_requested,
          bra_source_other_approved: values.bra_source_other_approved,
          bra_source_other_code: values.bra_source_other_code,
          bra_requested_date: formattedDate,
          bra_approved_date: values.bra_approved_date,
          bra_description: values.bra_description,
          bra_status: values.bra_status,
        };
        // save new BudgetRequestAmount
        handleAddBudgetRequestAmount(newBudgetRequestAmount);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetRequestAmount on component mount
  useEffect(() => {
    setBudgetRequestAmount(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetRequestAmount(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetRequestAmount(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetRequestAmountClick = (arg) => {
    const budgetRequestAmount = arg;
    // console.log("handleBudgetRequestAmountClick", budgetRequestAmount);
    setBudgetRequestAmount({
      bra_id: budgetRequestAmount.bra_id,
      bra_expenditure_code_id: budgetRequestAmount.bra_expenditure_code_id,
      bra_budget_request_id: budgetRequestAmount.bra_budget_request_id,
      bra_current_year_expense: budgetRequestAmount.bra_current_year_expense,
      bra_requested_amount: budgetRequestAmount.bra_requested_amount,
      bra_approved_amount: budgetRequestAmount.bra_approved_amount,
      bra_source_government_requested:
        budgetRequestAmount.bra_source_government_requested,
      bra_source_government_approved:
        budgetRequestAmount.bra_source_government_approved,
      bra_source_internal_requested:
        budgetRequestAmount.bra_source_internal_requested,
      bra_source_internal_approved:
        budgetRequestAmount.bra_source_internal_approved,
      bra_source_support_requested:
        budgetRequestAmount.bra_source_support_requested,
      bra_source_support_approved:
        budgetRequestAmount.bra_source_support_approved,
      bra_source_support_code: budgetRequestAmount.bra_source_support_code,
      bra_source_credit_requested:
        budgetRequestAmount.bra_source_credit_requested,
      bra_source_credit_approved:
        budgetRequestAmount.bra_source_credit_approved,
      bra_source_credit_code: budgetRequestAmount.bra_source_credit_code,
      bra_source_other_requested:
        budgetRequestAmount.bra_source_other_requested,
      bra_source_other_approved: budgetRequestAmount.bra_source_other_approved,
      bra_source_other_code: budgetRequestAmount.bra_source_other_code,
      bra_requested_date: budgetRequestAmount.bra_requested_date,
      bra_approved_date: budgetRequestAmount.bra_approved_date,
      bra_description: budgetRequestAmount.bra_description,
      bra_status: budgetRequestAmount.bra_status,

      is_deletable: budgetRequestAmount.is_deletable,
      is_editable: budgetRequestAmount.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetRequestAmount) => {
    setBudgetRequestAmount(budgetRequestAmount);
    setDeleteModal(true);
  };

  const handleBudgetRequestAmountClicks = () => {
    setIsEdit(false);
    setBudgetRequestAmount("");
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
        accessorKey: "bra_expenditure_code_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_expenditure_code_id,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_current_year_expense",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_current_year_expense,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_requested_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_approved_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bra_approved_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_government_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_government_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_government_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_government_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_internal_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_internal_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_internal_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_internal_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_support_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_support_code,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_requested",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_requested,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_approved",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_approved,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bra_source_credit_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.bra_source_credit_code,
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
      1 == 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {1 == 1 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleBudgetRequestAmountClick(data);
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
  }, [handleBudgetRequestAmountClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <BudgetRequestAmountModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetRequestAmount}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetRequestAmount.isPending}
      />
      {isLoading || isSearchLoading ? (
        <Spinners />
      ) : (
        <TableContainer
          columns={columns}
          data={
            showSearchResult ? searchResults?.data : data?.data || []
          }
          isGlobalFilter={true}
          isAddButton={true}
          //sAddButton={data?.previledge?.is_role_can_add==1}
          isCustomPageSize={true}
          handleUserClick={handleBudgetRequestAmountClicks}
          isPagination={true}
          // SearchPlaceholder="26 records..."
          SearchPlaceholder={t("filter_placeholder")}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={t("add")}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
        />
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit
            ? t("edit") + " " + t("budget_request_amount")
            : t("add") + " " + t("budget_request_amount")}
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
                <Label>{t("bra_expenditure_code_id")}<span className="text-danger">*</span></Label>
                <Input
                  name="bra_expenditure_code_id"
                  type="text"
                  placeholder={t("bra_expenditure_code_id")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_expenditure_code_id || ""}
                  invalid={
                    validation.touched.bra_expenditure_code_id &&
                      validation.errors.bra_expenditure_code_id
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_expenditure_code_id &&
                  validation.errors.bra_expenditure_code_id ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_expenditure_code_id}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bra_current_year_expense")}</Label>
                <Input
                  name="bra_current_year_expense"
                  type="number"
                  placeholder={t("bra_current_year_expense")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_current_year_expense || ""}
                  invalid={
                    validation.touched.bra_current_year_expense &&
                      validation.errors.bra_current_year_expense
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_current_year_expense &&
                  validation.errors.bra_current_year_expense ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_current_year_expense}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bra_requested_amount")}</Label>
                <Input
                  name="bra_requested_amount"
                  type="number"
                  placeholder={t("bra_requested_amount")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_requested_amount || ""}
                  invalid={
                    validation.touched.bra_requested_amount &&
                      validation.errors.bra_requested_amount
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_requested_amount &&
                  validation.errors.bra_requested_amount ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_requested_amount}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_government_requested")}</Label>
                <Input
                  name="bra_source_government_requested"
                  type="number"
                  placeholder={t("bra_source_government_requested")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={
                    validation.values.bra_source_government_requested || ""
                  }
                  invalid={
                    validation.touched.bra_source_government_requested &&
                      validation.errors.bra_source_government_requested
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_government_requested &&
                  validation.errors.bra_source_government_requested ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_government_requested}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_internal_requested")}</Label>
                <Input
                  name="bra_source_internal_requested"
                  type="number"
                  placeholder={t("bra_source_internal_requested")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_source_internal_requested || ""}
                  invalid={
                    validation.touched.bra_source_internal_requested &&
                      validation.errors.bra_source_internal_requested
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_internal_requested &&
                  validation.errors.bra_source_internal_requested ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_internal_requested}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_support_requested")}</Label>
                <Input
                  name="bra_source_support_requested"
                  type="number"
                  placeholder={t("bra_source_support_requested")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_source_support_requested || ""}
                  invalid={
                    validation.touched.bra_source_support_requested &&
                      validation.errors.bra_source_support_requested
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_support_requested &&
                  validation.errors.bra_source_support_requested ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_support_requested}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_support_code")}</Label>
                <Input
                  name="bra_source_support_code"
                  type="text"
                  placeholder={t("bra_source_support_code")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_source_support_code || ""}
                  invalid={
                    validation.touched.bra_source_support_code &&
                      validation.errors.bra_source_support_code
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_support_code &&
                  validation.errors.bra_source_support_code ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_support_code}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_credit_requested")}</Label>
                <Input
                  name="bra_source_credit_requested"
                  type="number"
                  placeholder={t("bra_source_credit_requested")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_source_credit_requested || ""}
                  invalid={
                    validation.touched.bra_source_credit_requested &&
                      validation.errors.bra_source_credit_requested
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_credit_requested &&
                  validation.errors.bra_source_credit_requested ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_credit_requested}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_source_credit_code")}</Label>
                <Input
                  name="bra_source_credit_code"
                  type="text"
                  placeholder={t("bra_source_credit_code")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_source_credit_code || ""}
                  invalid={
                    validation.touched.bra_source_credit_code &&
                      validation.errors.bra_source_credit_code
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_source_credit_code &&
                  validation.errors.bra_source_credit_code ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_source_credit_code}
                  </FormFeedback>
                ) : null}
              </Col>

              <Col className="col-md-6 mb-3">
                <Label>{t("bra_description")}</Label>
                <Input
                  name="bra_description"
                  type="textarea"
                  placeholder={t("bra_description")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bra_description || ""}
                  invalid={
                    validation.touched.bra_description &&
                      validation.errors.bra_description
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bra_description &&
                  validation.errors.bra_description ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bra_description}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addBudgetRequestAmount.isPending ||
                    updateBudgetRequestAmount.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addBudgetRequestAmount.isPending ||
                        updateBudgetRequestAmount.isPending ||
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
                        addBudgetRequestAmount.isPending ||
                        updateBudgetRequestAmount.isPending ||
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
BudgetRequestAmountModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default BudgetRequestAmountModel;
