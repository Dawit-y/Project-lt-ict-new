import React, { useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  alphanumericValidation,
  numberValidation,
} from "../../utils/Validation/validation";
import {
  useFetchBudgetYears,
  useAddBudgetYear,
  useDeleteBudgetYear,
  useUpdateBudgetYear,
} from "../../queries/budgetyear_query";
import BudgetYearModal from "./BudgetYearModal";
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
import { budgetYearExportColumns } from "../../utils/exportColumnsForLookups";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

function getCurrentEthiopianYear() {
  const today = new Date();
  const ethYear = today.getFullYear() - 8;
  const month = today.getMonth() + 1;
  return month >= 9 ? ethYear + 1 : ethYear;
}

const BudgetYearModel = React.memo(() => {
  document.title = "BudgetYear";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetYear, setBudgetYear] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchBudgetYears();
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = useCallback(() => setModal1((prev) => !prev), []);

  useEffect(() => {
    setBudgetYear(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && isEdit) {
      setBudgetYear(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = useCallback(() => setModal((prev) => !prev), []);
  const addBudgetYear = useAddBudgetYear();
  const updateBudgetYear = useUpdateBudgetYear();
  const deleteBudgetYear = useDeleteBudgetYear();

  const handleAddBudgetYear = useCallback(
    async (data) => {
      try {
        await addBudgetYear.mutateAsync(data);
        toast.success(t("add_success"), { autoClose: 2000 });
      } catch {
        toast.error(t("add_failure"), { autoClose: 2000 });
      }
      toggle();
    },
    [addBudgetYear, t, toggle]
  );

  const handleUpdateBudgetYear = useCallback(
    async (data) => {
      try {
        await updateBudgetYear.mutateAsync(data);
        toast.success(t("update_success"), { autoClose: 2000 });
      } catch {
        toast.error(t("update_failure"), { autoClose: 2000 });
      }
      toggle();
    },
    [updateBudgetYear, t, toggle]
  );

  const handleDeleteBudgetYear = useCallback(async () => {
    if (budgetYear?.bdy_id) {
      try {
        await deleteBudgetYear.mutateAsync(budgetYear.bdy_id);
        toast.success(t("delete_success"), { autoClose: 2000 });
      } catch {
        toast.error(t("delete_failure"), { autoClose: 2000 });
      }
      setDeleteModal(false);
    }
  }, [budgetYear, deleteBudgetYear, t]);

  const minYear = 2010;
  const maxYear = getCurrentEthiopianYear() + 1;

  const validationSchema = Yup.object({
    bdy_name: Yup.number()
      .typeError("Budget year must be a number")
      .required("Budget year is required")
      .integer("Budget year must be an integer")
      .test(
        "len",
        "Budget year must be a 4-digit number",
        (val) => String(val).length === 4
      )
      .min(minYear, `Budget year must be >= ${minYear}`)
      .max(maxYear, `Budget year must not be beyond ${maxYear}`)
      .test("unique-bdy_name", t("Already exists"), function (value) {
        const existing = data?.data || [];
        return !existing.some(
          (item) =>
            item.bdy_name === value &&
            (!isEdit || item.bdy_id !== budgetYear?.bdy_id)
        );
      }),

    bdy_code: Yup.string()
      .max(10, "Code must be at most 10 characters")
      .test("unique-bdy_code", t("Already exists"), function (value) {
        if (!value) return true;
        const existing = data?.data || [];
        return !existing.some(
          (item) =>
            item.bdy_code === value &&
            (!isEdit || item.bdy_id !== budgetYear?.bdy_id)
        );
      }),

    bdy_description: alphanumericValidation(3, 425, false),
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      bdy_name: budgetYear?.bdy_name || "",
      bdy_code: budgetYear?.bdy_code || "",
      bdy_description: budgetYear?.bdy_description || "",
      bdy_status: budgetYear?.bdy_status || false,
      is_deletable: budgetYear?.is_deletable || 1,
      is_editable: budgetYear?.is_editable || 1,
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetYear = {
          bdy_id: budgetYear?.bdy_id,
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status ? 1 : 0,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateBudgetYear(updateBudgetYear);
      } else {
        const newBudgetYear = {
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status ? 1 : 0,
        };
        handleAddBudgetYear(newBudgetYear);
      }
    },
  });

  const handleBudgetYearClick = useCallback(
    (arg) => {
      setBudgetYear({
        bdy_id: arg.bdy_id,
        bdy_name: arg.bdy_name,
        bdy_code: arg.bdy_code,
        bdy_description: arg.bdy_description,
        bdy_status: arg.bdy_status === 1,
        is_deletable: arg.is_deletable,
        is_editable: arg.is_editable,
      });
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = useCallback((budgetYear) => {
    setBudgetYear(budgetYear);
    setDeleteModal(true);
  }, []);

  const handleBudgetYearClicks = useCallback(() => {
    setIsEdit(false);
    setBudgetYear("");
    toggle();
  }, [toggle]);

  const handleSearchResults = useCallback(({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "bdy_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          truncateText(cellProps.row.original.bdy_name, 30) || "-",
      },
      {
        header: "",
        accessorKey: "bdy_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          truncateText(cellProps.row.original.bdy_code, 30) || "-",
      },
      {
        header: t("is_inactive"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span
            className={
              cellProps.row.original.bdy_status === 1
                ? "btn btn-sm btn-soft-danger"
                : ""
            }
          >
            {cellProps.row.original.bdy_status === 1 ? t("yes") : t("no")}
          </span>
        ),
      },
      {
        header: t("view_detail"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
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
        ),
      },
    ];

    if (
      data?.previledge?.is_role_editable === 1 ||
      data?.previledge?.is_role_deletable === 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <div className="d-flex gap-3">
            {cellProps.row.original.is_editable === 1 && (
              <Link
                to="#"
                className="text-success"
                onClick={() => handleBudgetYearClick(cellProps.row.original)}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            )}
          </div>
        ),
      });
    }
    return baseColumns;
  }, [handleBudgetYearClick, toggleViewModal, data]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <BudgetYearModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetYear}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetYear.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_year")}
            breadcrumbItem={t("budget_year")}
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
                      isAddButton={data?.previledge?.is_role_can_add === 1}
                      isCustomPageSize={true}
                      handleUserClick={handleBudgetYearClicks}
                      isPagination={true}
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={`${t("add")} ${t("budget_year")}`}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      divClassName="-"
                      refetch={refetch}
                      isFetching={isFetching}
                      isExcelExport={true}
                      isPdfExport={true}
                      isPrint={true}
                      tableName="Budget Year"
                      exportColumns={budgetYearExportColumns}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {isEdit
                ? `${t("edit")} ${t("budget_year")}`
                : `${t("add")} ${t("budget_year")}`}
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
                      {t("bdy_name")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="bdy_name"
                      type="number"
                      placeholder={t("bdy_name")}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          validation.handleChange(e);
                        }
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_name || ""}
                      invalid={
                        validation.touched.bdy_name &&
                        validation.errors.bdy_name
                      }
                      maxLength={4}
                    />
                    {validation.touched.bdy_name &&
                      validation.errors.bdy_name && (
                        <FormFeedback type="invalid">
                          {validation.errors.bdy_name}
                        </FormFeedback>
                      )}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdy_code")}</Label>
                    <Input
                      name="bdy_code"
                      type="text"
                      placeholder={t("bdy_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_code || ""}
                      invalid={
                        validation.touched.bdy_code &&
                        validation.errors.bdy_code
                      }
                      maxLength={10}
                    />
                    {validation.touched.bdy_code &&
                      validation.errors.bdy_code && (
                        <FormFeedback type="invalid">
                          {validation.errors.bdy_code}
                        </FormFeedback>
                      )}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="bdy_status">
                        {t("is_inactive")}
                      </Label>

                      <Input
                        id="bdy_status"
                        name="bdy_status"
                        type="checkbox"
                        placeholder={t("is_deleted")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.bdy_status}
                        invalid={
                          validation.touched.bdy_status &&
                          validation.errors.bdy_status
                        }
                      />
                      {validation.touched.bdy_status &&
                        validation.errors.bdy_status && (
                          <FormFeedback type="invalid">
                            {validation.errors.bdy_status}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdy_description")}</Label>
                    <Input
                      name="bdy_description"
                      type="textarea"
                      placeholder={t("bdy_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_description || ""}
                      invalid={
                        validation.touched.bdy_description &&
                        validation.errors.bdy_description
                      }
                      maxLength={425}
                    />
                    {validation.touched.bdy_description &&
                      validation.errors.bdy_description && (
                        <FormFeedback type="invalid">
                          {validation.errors.bdy_description}
                        </FormFeedback>
                      )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addBudgetYear.isPending || updateBudgetYear.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addBudgetYear.isPending ||
                            updateBudgetYear.isPending ||
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
                            addBudgetYear.isPending ||
                            updateBudgetYear.isPending ||
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
});

BudgetYearModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetYearModel;
