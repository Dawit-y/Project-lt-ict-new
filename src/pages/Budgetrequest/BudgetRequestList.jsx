import React, { useEffect, useMemo, useState, useRef } from "react";
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
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import {
  getBudgetRequest as onGetBudgetRequest,
  addBudgetRequest as onAddBudgetRequest,
  updateBudgetRequest as onUpdateBudgetRequest,
  deleteBudgetRequest as onDeleteBudgetRequest,
} from "../../store/budgetrequest/actions";
import { getBudgetYear } from "../../store/budgetyear/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import BudgetRequestListModal from "./BudgetRequestListModal";
import ProjectDocument from "../../pages/Projectdocument/index";
import ProjectPayment from "../../pages/Projectpayment";
import ProjectStakeholder from "../../pages/Projectstakeholder";
import Projectcontractor from "../../pages/Projectcontractor";
import Budgetrequest from "../../pages/Budgetrequest";
import GeoLocation from "../../pages/GeoLocation";
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
  FormGroup,
  InputGroup,
  Badge,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../utils/commonMethods";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const statusClasses = {
  Approved: "success",
  Rejected: "danger",
  Requested: "secondary",
};

const BudgetRequestListModel = () => {
  //  get passed data from tab

  document.title = " BudgetRequest";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [budgetRequest, setBudgetRequest] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed

  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [budgetRequestMetaData, setBudgetRequestMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      bdr_released_amount:
        (budgetRequest && budgetRequest.bdr_released_amount) || "",
      bdr_released_date_gc:
        (budgetRequest && budgetRequest.bdr_released_date_gc) || "",

      bdr_description: (budgetRequest && budgetRequest.bdr_description) || "",
      bdr_request_status:
        (budgetRequest && budgetRequest.bdr_request_status) || "",

      is_deletable: (budgetRequest && budgetRequest.is_deletable) || 1,
      is_editable: (budgetRequest && budgetRequest.is_editable) || 1,
    },

    validationSchema: Yup.object({
      bdr_released_amount: Yup.number().required(t(" bdr_released_amount")),
      // bdr_released_amount: Yup.number().required(t("bdr_released_amount")),
      // bdr_project_id: Yup.string().required(t("bdr_project_id")),
      //  bdr_released_date_gc: Yup.string().required(t(" bdr_released_date_gc")),
      bdr_released_date_gc: Yup.string().required(t(" bdr_released_date_gc")),
      // bdr_released_date_ec: Yup.string().required(t("bdr_released_date_ec")),
      // bdr_released_date_gc: Yup.string().required(t("bdr_released_date_gc")),
      bdr_description: Yup.string(),
      bdr_request_status: Yup.string(),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetRequest = {
          bdr_id: budgetRequest ? budgetRequest.bdr_id : 0,
          bdr_released_amount: values.bdr_released_amount,
          bdr_project_id: values.bdr_project_id,
          bdr_released_date_gc: values.bdr_released_date_gc,
          bdr_description: values.bdr_description,
          bdr_request_status: values.bdr_request_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetRequest
        dispatch(onUpdateBudgetRequest(updateBudgetRequest));
        validation.resetForm();
      } else {
        const newBudgetRequest = {
          bdr_released_amount: values.bdr_released_amount,
          bdr_project_id: values.bdr_project_id,
          bdr_released_date_gc: values.bdr_released_date_gc,
          bdr_description: values.bdr_description,
          bdr_request_status: values.bdr_request_status,
        };
        // save new BudgetRequests
        dispatch(onAddBudgetRequest(newBudgetRequest));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch BudgetRequest on component mount
  useEffect(() => {
    dispatch(onGetBudgetRequest());
    dispatch(getBudgetYear());
  }, [dispatch]);

  const budgetRequestProperties = createSelector(
    (state) => state.BudgetRequestR,
    (BudgetRequestReducer) => ({
      budgetRequest: BudgetRequestReducer.budgetRequest,
      loading: BudgetRequestReducer.loading,
      update_loading: BudgetRequestReducer.update_loading,
    })
  );

  const {
    budgetRequest: { data, previledge },
    loading,
    update_loading,
  } = useSelector(budgetRequestProperties);

  const budgetYearProperties = createSelector(
    (state) => state.BudgetYearR,
    (BudgetYearReducer) => ({
      budgetYear: BudgetYearReducer.budgetYear,
      loading: BudgetYearReducer.loading,
      update_loading: BudgetYearReducer.update_loading,
    })
  );

  const {
    budgetYear: { data: budgetYearData, previledge: budgetYearPreviledge },
    loading: budgetYearLoading,
    update_loading: budgetYearUpdateLoading,
  } = useSelector(budgetYearProperties);

  const budgetYearMap = useMemo(() => {
    return budgetYearData.reduce((acc, year) => {
      acc[year.bdy_id] = year.bdy_name;
      return acc;
    }, {});
  }, [budgetYearData]);

  useEffect(() => {
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
    setBudgetRequest(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetRequest(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetRequest(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetRequestClick = (arg) => {
    const budgetRequest = arg;
    setBudgetRequest({
      bdr_id: budgetRequest.bdr_id,
      bdr_budget_year_id: budgetRequest.bdr_budget_year_id,
      bdr_released_amount: budgetRequest.bdr_released_amount,
      bdr_project_id: budgetRequest.bdr_project_id,
      bdr_released_date_gc: budgetRequest.bdr_released_date_gc,
      bdr_description: budgetRequest.bdr_description,
      bdr_request_status: budgetRequest.bdr_request_status,

      is_deletable: budgetRequest.is_deletable,
      is_editable: budgetRequest.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (budgetRequest) => {
    setBudgetRequest(budgetRequest);
    setDeleteModal(true);
  };

  const handleDeleteBudgetRequest = () => {
    if (budgetRequest && budgetRequest.bdr_id) {
      dispatch(onDeleteBudgetRequest(budgetRequest.bdr_id));
      setDeleteModal(false);
    }
  };
  const handleBudgetRequestClicks = () => {
    setIsEdit(false);
    setBudgetRequest("");
    toggle();
  };

  const handleEyeClick = (data) => {
    setShowCanvas(!showCanvas);
    setBudgetRequestMetaData(data);
  };

  const columnDefs = useMemo(() => {
    const baseColumnDefs = [
      {
        headerName: t("bdr_budget_year_id"),
        field: "bdr_budget_year_id",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const budgetYearName = budgetYearMap[params.value] || "";
          return budgetYearName;
        },
      },
      {
        headerName: t("bdr_requested_amount"),
        field: "bdr_requested_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_amount, 30) || "-";
        },
      },
      {
        headerName: t("bdr_released_amount"),
        field: "bdr_released_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_released_amount, 30) || "-";
        },
      },
      {
        headerName: t("bdr_requested_date_gc"),
        field: "bdr_requested_date_gc",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_released_date_gc"),
        field: "bdr_released_date_gc",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_released_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("bdr_request_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          const badgeClass = statusClasses[params.value] || "secondary";
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {params.value}
            </Badge>
          );
        },
      },
      {
        headerName: t("take_action"),
        field: "take_action",
        cellRenderer: (params) => {
          return (
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
              {t("take_action")}
            </Button>
          );
        },
      },
    ];

    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
      baseColumnDefs.push({
        headerName: t("view_detail"),
        field: "view_detail",
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            {params.data.is_editable ? (
              <Link
                to="#"
                className="text-secondary"
                onClick={() => handleEyeClick(params.data)}
              >
                <i className="mdi mdi-eye font-size-18 ms-2" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            ) : (
              ""
            )}
          </div>
        ),
      });
    }

    return baseColumnDefs;
  }, [handleBudgetRequestClick, toggleViewModal, onClickDelete]);

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
      <BudgetRequestListModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
        budgetYearMap={budgetYearMap}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetRequest}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_request")}
            breadcrumbItem={t("budget_request")}
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
                  <Button color="success" onClick={handleBudgetRequestClicks}>
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
                ? t("edit") + " " + t("budget_request")
                : t("add") + " " + t("budget_request")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateBudgetRequest(validation.values, modalCallback);
                  } else {
                    onAddBudgetRequest(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t(" bdr_released_amount")}</Label>
                    <Input
                      name=" bdr_released_amount"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdr_released_amount || ""}
                      invalid={
                        validation.touched.bdr_released_amount &&
                        validation.errors.bdr_released_amount
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bdr_released_amount &&
                    validation.errors.bdr_released_amount ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdr_released_amount}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <FormGroup>
                      <Label>{t(" bdr_released_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${
                            validation.touched.bdr_released_date_gc &&
                            validation.errors.bdr_released_date_gc
                              ? "is-invalid"
                              : ""
                          }`}
                          name=" bdr_released_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.bdr_released_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              " bdr_released_date_gc",
                              formatedDate
                            ); // Set value in Formik
                          }}
                          onBlur={validation.handleBlur}
                        />

                        <Button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled
                        >
                          <i className="fa fa-calendar" aria-hidden="true" />
                        </Button>
                      </InputGroup>
                      {validation.touched.bdr_released_date_gc &&
                      validation.errors.bdr_released_date_gc ? (
                        <FormFeedback>
                          {validation.errors.bdr_released_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdr_description")}</Label>
                    <Input
                      name="bdr_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdr_description || ""}
                      invalid={
                        validation.touched.bdr_description &&
                        validation.errors.bdr_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bdr_description &&
                    validation.errors.bdr_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdr_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bdr_request_status")}</Label>
                    <Input
                      name="bdr_request_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "bdr_request_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdr_request_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={"Approved"}>{t("Approved")}</option>
                      <option value={"Rejected"}>{t("Rejected")}</option>
                    </Input>
                    {validation.touched.bdr_request_status &&
                    validation.errors.bdr_request_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdr_request_status}
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
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleEyeClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={"Detail"}
          id={budgetRequestMetaData.bdr_project_id}
          navItems={[
            "Documents",
            "Payments",
            "Project Stakeholder",
            "Project Contractor",
            "Budget Request",
            "Geo Location",
          ]}
          components={[
            ProjectDocument,
            ProjectPayment,
            ProjectStakeholder,
            Projectcontractor,
            Budgetrequest,
            GeoLocation,
          ]}
        />
      )}
    </React.Fragment>
  );
};
BudgetRequestListModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetRequestListModel;
