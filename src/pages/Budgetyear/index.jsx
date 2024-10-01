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
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getBudgetYear as onGetBudgetYear,
  addBudgetYear as onAddBudgetYear,
  updateBudgetYear as onUpdateBudgetYear,
  deleteBudgetYear as onDeleteBudgetYear,
} from "../../store/budgetyear/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
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
import { ToastContainer } from "react-toastify";

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
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
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
      bdy_name: Yup.string().required(t("bdy_name")),
      bdy_code: Yup.string().required(t("bdy_code")),
      bdy_description: Yup.string().required(t("bdy_description")),
      bdy_status: Yup.string().required(t("bdy_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetYear = {
          bdy_id: budgetYear ? budgetYear.bdy_id : 0,
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetYear
        dispatch(onUpdateBudgetYear(updateBudgetYear));
        validation.resetForm();
      } else {
        const newBudgetYear = {
          bdy_name: values.bdy_name,
          bdy_code: values.bdy_code,
          bdy_description: values.bdy_description,
          bdy_status: values.bdy_status,
        };
        // save new BudgetYears
        dispatch(onAddBudgetYear(newBudgetYear));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch BudgetYear on component mount
  useEffect(() => {
    dispatch(onGetBudgetYear());
  }, [dispatch]);

  const budgetYearProperties = createSelector(
    (state) => state.BudgetYearR, // this is geting from  reducer
    (BudgetYearReducer) => ({
      // this is from Project.reducer
      budgetYear: BudgetYearReducer.budgetYear,
      loading: BudgetYearReducer.loading,
      update_loading: BudgetYearReducer.update_loading,
    })
  );

  const {
    budgetYear: { data, previledge },
    loading,
    update_loading,
  } = useSelector(budgetYearProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
    setModal(false);
  }, [update_loading]);

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
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

  const handleDeleteBudgetYear = () => {
    if (budgetYear && budgetYear.bdy_id) {
      dispatch(onDeleteBudgetYear(budgetYear.bdy_id));
      setDeleteModal(false);
    }
  };
  const handleBudgetYearClicks = () => {
    setIsEdit(false);
    setBudgetYear("");
    toggle();
  };
  const handleSearch = () => {
    setSearchLoading(true); // Set loading to true when search is initiated// Update filtered data with search results
    setShowSearchResults(true); // Show search results
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setShowSearchResults(false);
  };

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
        header: "",
        accessorKey: "bdy_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdy_status, 30) || "-"}
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
    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.is_editable && (
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

              {cellProps.row.original.is_deletable && (
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

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_year")}
            breadcrumbItem={t("budget_year")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleBudgetYearClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
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
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateBudgetYear(validation.values, modalCallback);
                  } else {
                    onAddBudgetYear(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdy_name")}</Label>
                    <Input
                      name="bdy_name"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_name || ""}
                      invalid={
                        validation.touched.bdy_name &&
                        validation.errors.bdy_name
                          ? true
                          : false
                      }
                      maxLength={20}
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
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_code || ""}
                      invalid={
                        validation.touched.bdy_code &&
                        validation.errors.bdy_code
                          ? true
                          : false
                      }
                      maxLength={20}
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
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_description || ""}
                      invalid={
                        validation.touched.bdy_description &&
                        validation.errors.bdy_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bdy_description &&
                    validation.errors.bdy_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdy_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdy_status")}</Label>
                    <Input
                      name="bdy_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "bdy_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdy_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.bdy_status &&
                    validation.errors.bdy_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdy_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {update_loading ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
                        >
                          <Spinner size={"sm"} color="#fff" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
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
      <ToastContainer />
    </React.Fragment>
  );
};
BudgetYearModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetYearModel;
