import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import { AgGridReact } from "ag-grid-react";
// import { Button, Input, Row, Col } from 'reactstrap';  // Importing reactstrap components
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  getBudgetSource as onGetBudgetSource,
  addBudgetSource as onAddBudgetSource,
  updateBudgetSource as onUpdateBudgetSource,
  deleteBudgetSource as onDeleteBudgetSource,
} from "../../store/budgetsource/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import BudgetSourceModal from "./BudgetSourceModal";
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
} from "reactstrap";
import { ToastContainer } from "react-toastify";

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

  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [budgetSource, setBudgetSource] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
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
      pbs_status: (budgetSource && budgetSource.pbs_status) || "",

      is_deletable: (budgetSource && budgetSource.is_deletable) || 1,
      is_editable: (budgetSource && budgetSource.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pbs_name_or: Yup.string().required(t("pbs_name_or")),
      pbs_name_am: Yup.string().required(t("pbs_name_am")),
      pbs_name_en: Yup.string().required(t("pbs_name_en")),
      pbs_code: Yup.string().required(t("pbs_code")),
      pbs_description: Yup.string().required(t("pbs_description")),
      pbs_status: Yup.string().required(t("pbs_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetSource = {
          pbs_id: budgetSource ? budgetSource.pbs_id : 0,
          // pbs_id:budgetSource.pbs_id,
          pbs_name_or: values.pbs_name_or,
          pbs_name_am: values.pbs_name_am,
          pbs_name_en: values.pbs_name_en,
          pbs_code: values.pbs_code,
          pbs_description: values.pbs_description,
          pbs_status: values.pbs_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetSource
        dispatch(onUpdateBudgetSource(updateBudgetSource));
        validation.resetForm();
      } else {
        const newBudgetSource = {
          pbs_name_or: values.pbs_name_or,
          pbs_name_am: values.pbs_name_am,
          pbs_name_en: values.pbs_name_en,
          pbs_code: values.pbs_code,
          pbs_description: values.pbs_description,
          pbs_status: values.pbs_status,
        };
        // save new BudgetSources
        dispatch(onAddBudgetSource(newBudgetSource));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch BudgetSource on component mount
  useEffect(() => {
    dispatch(onGetBudgetSource());
  }, [dispatch]);

  const budgetSourceProperties = createSelector(
    (state) => state.BudgetSourceR, // this is geting from  reducer
    (BudgetSourceReducer) => ({
      // this is from Project.reducer
      budgetSource: BudgetSourceReducer.budgetSource,
      loading: BudgetSourceReducer.loading,
      update_loading: BudgetSourceReducer.update_loading,
    })
  );

  const {
    budgetSource: { data, previledge },
    loading,
    update_loading,
  } = useSelector(budgetSourceProperties);

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
      pbs_status: budgetSource.pbs_status,

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

  const handleDeleteBudgetSource = () => {
    if (budgetSource && budgetSource.pbs_id) {
      dispatch(onDeleteBudgetSource(budgetSource.pbs_id));
      setDeleteModal(false);
    }
  };
  const handleBudgetSourceClicks = () => {
    setIsEdit(false);
    setBudgetSource("");
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

  const columnDefs = useMemo(() => {
    const baseColumns = [
      // {
      //   headerCheckboxSelection: true, // Header checkbox for selecting all
      //   checkboxSelection: true, // Checkbox per row
      //   width: 50, // Set width for the checkbox column
      // },

      {
        headerName: t("pbs_name_or"),
        field: "pbs_name_or",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pbs_name_or, 30) || "-",
      },
      {
        headerName: t("pbs_name_am"),
        field: "pbs_name_am",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pbs_name_am, 30) || "-",
      },
      {
        headerName: t("pbs_name_en"),
        field: "pbs_name_en",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pbs_name_en, 30) || "-",
      },
      {
        headerName: t("pbs_code"),
        field: "pbs_code",
        sortable: true,
        filter: true,
        cellRenderer: (params) => truncateText(params.data.pbs_code, 30) || "-",
      },
      {
        headerName: t("pbs_description"),
        field: "pbs_description",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pbs_description, 30) || "-",
      },
      {
        headerName: t("pbs_status"),
        field: "pbs_status",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.pbs_status, 30) || "-",
      },
      {
        headerName: t("view_detail"),
        sortable: true,
        filter: false,
        cellRenderer: (params) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm"
            onClick={() => {
              const data = params.data;
              toggleViewModal(data);
              setTransaction(data);
            }}
          >
            {t("view_detail")}
          </Button>
        ),
      },
    ];

    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
      baseColumns.push({
        headerName: t("Action"),
        sortable: true,
        filter: false,
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            {params.data.is_editable && (
              <Link
                to="#"
                className="text-success"
                onClick={() => handleBudgetSourceClick(params.data)}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            )}

            {params.data.is_deletable && (
              <Link
                to="#"
                className="text-danger"
                onClick={() => onClickDelete(params.data)}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [handleBudgetSourceClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  // When selection changes, update selectedRows
  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  // Filter by marked rows
  const filterMarked = () => {
    if (gridRef.current) {
      gridRef.current.api.setRowData(selectedRows);
    }
  };
  // Clear the filter and show all rows again
  const clearFilter = () => {
    gridRef.current.api.setRowData(showSearchResults ? results : data);
  };

  return (
    <React.Fragment>
      <BudgetSourceModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetSource}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_source")}
            breadcrumbItem={t("budget_source")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <div
              className="ag-theme-alpine"
              style={{ height: "100%", width: "100%" }}
            >
              {/* Row for search input and buttons */}
              <Row className="mb-3">
                <Col sm="12" md="6">
                  {/* Search Input for  Filter */}
                  <Input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setQuickFilterText(e.target.value)}
                    className="mb-2"
                  />
                </Col>
                <Col sm="12" md="6" className="text-md-end">
                  <Button
                    color="primary"
                    className="me-2"
                    onClick={filterMarked}
                  >
                    Filter Marked
                  </Button>
                  <Button
                    color="secondary"
                    className="me-2"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                  <Button color="success" onClick={handleBudgetSourceClicks}>
                    Add New
                  </Button>
                </Col>
              </Row>

              {/* AG Grid */}
              <div style={{ height: "400px" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={showSearchResults ? results : data}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                  paginationPageSize={10}
                  quickFilterText={quickFilterText}
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
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
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateBudgetSource(validation.values, modalCallback);
                  } else {
                    onAddBudgetSource(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pbs_name_or")}</Label>
                    <Input
                      name="pbs_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pbs_name_or || ""}
                      invalid={
                        validation.touched.pbs_name_or &&
                        validation.errors.pbs_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pbs_name_or &&
                    validation.errors.pbs_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pbs_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pbs_name_am")}</Label>
                    <Input
                      name="pbs_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pbs_name_am || ""}
                      invalid={
                        validation.touched.pbs_name_am &&
                        validation.errors.pbs_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pbs_name_am &&
                    validation.errors.pbs_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pbs_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pbs_name_en")}</Label>
                    <Input
                      name="pbs_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pbs_name_en || ""}
                      invalid={
                        validation.touched.pbs_name_en &&
                        validation.errors.pbs_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
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
                      placeholder={t("insert_status_name_amharic")}
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
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pbs_status")}</Label>
                    <Input
                      name="pbs_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "pbs_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.pbs_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.pbs_status &&
                    validation.errors.pbs_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pbs_status}
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

BudgetSourceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetSourceModel;
