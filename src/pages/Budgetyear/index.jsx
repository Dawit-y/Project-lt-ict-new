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
  useFetchBudgetYears,
  useSearchBudgetYears,
  useAddBudgetYear,
  useDeleteBudgetYear,
  useUpdateBudgetYear,
} from "../../queries/budgetyear_query";
import BudgetYearModal from "./BudgetYearModal";
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

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const BudgetYearModel = () => {
  //meta title
  document.title = " BudgetYear";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetYear, setBudgetYear] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchBudgetYears();

  const addBudgetYear = useAddBudgetYear();
  const updateBudgetYear = useUpdateBudgetYear();
  const deleteBudgetYear = useDeleteBudgetYear();
  //START CRUD
  const handleAddBudgetYear = async (data) => {
    try {
      await addBudgetYear.mutateAsync(data);
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

  const handleUpdateBudgetYear = async (data) => {
    try {
      await updateBudgetYear.mutateAsync(data);
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

  const handleDeleteBudgetYear = async () => {
    if (budgetYear && budgetYear.bdy_id) {
      try {
        const id = budgetYear.bdy_id;
        await deleteBudgetYear.mutateAsync(id);
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
      bdy_name: (budgetYear && budgetYear.bdy_name) || "",
      bdy_code: (budgetYear && budgetYear.bdy_code) || "",
      bdy_description: (budgetYear && budgetYear.bdy_description) || "",
      bdy_status: (budgetYear && budgetYear.bdy_status) || "",
      is_deletable: (budgetYear && budgetYear.is_deletable) || 1,
      is_editable: (budgetYear && budgetYear.is_editable) || 1,
    },
    validationSchema: Yup.object({
      bdy_name: numberValidation(2017, 2040, true).test(
        "unique-bdy_name",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.bdy_name == value && item.bdy_id !== budgetYear?.bdy_id
          );
        }
      ),
      bdy_description: alphanumericValidation(3, 425, false),
    }),

    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetYear = {
          bdy_id: budgetYear?.bdy_id,
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetYear
        handleUpdateBudgetYear(updateBudgetYear);
      } else {
        const newBudgetYear = {
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status,
          is_deletable: 1,
          is_editable: 1,
        };
        // save new BudgetYear
        handleAddBudgetYear(newBudgetYear);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetYear on component mount
  useEffect(() => {
    setBudgetYear(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetYear(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetYear(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetYearClick = (arg) => {
    const budgetYear = arg;
    // console.log("handleBudgetYearClick", budgetYear);
    setBudgetYear({
      bdy_id: budgetYear.bdy_id,
      bdy_name: budgetYear.bdy_name,
      bdy_code: budgetYear.bdy_code,
      bdy_description: budgetYear.bdy_description,
      bdy_status: budgetYear.bdy_status,

      is_deletable: budgetYear.is_deletable,
      is_editable: budgetYear.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetYear) => {
    setBudgetYear(budgetYear);
    setDeleteModal(true);
  };

  const handleBudgetYearClicks = () => {
    setIsEdit(false);
    setBudgetYear("");
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
        accessorKey: "bdy_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdy_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdy_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdy_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdy_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdy_description, 30) || "-"}
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
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable == 1 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleBudgetYearClick(data);
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
  }, [handleBudgetYearClick, toggleViewModal, onClickDelete]);
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
          <AdvancedSearch
            searchHook={useSearchBudgetYears}
            textSearchKeys={["bdy_name", "bdy_code"]}
            dropdownSearchKeys={[]}
            checkboxSearchKeys={[]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
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
                      handleUserClick={handleBudgetYearClicks}
                      isPagination={true}
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("budget_year")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("budget_year")
                : t("add") + " " + t("budget_year")}
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
                        // Allow only integers (numeric values)
                        if (/^\d*$/.test(value)) {
                          validation.handleChange(e);
                        }
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_name || ""}
                      invalid={
                        validation.touched.bdy_name &&
                        validation.errors.bdy_name
                          ? true
                          : false
                      }
                      maxLength={4}
                    />
                    {validation.touched.bdy_name &&
                    validation.errors.bdy_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdy_name}
                      </FormFeedback>
                    ) : null}
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
                          ? true
                          : false
                      }
                      maxLength={10}
                    />
                    {validation.touched.bdy_code &&
                    validation.errors.bdy_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdy_code}
                      </FormFeedback>
                    ) : null}
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
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.bdy_description &&
                    validation.errors.bdy_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdy_description}
                      </FormFeedback>
                    ) : null}
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
};
BudgetYearModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetYearModel;
