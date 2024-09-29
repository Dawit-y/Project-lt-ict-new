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
  getBudgetRequest as onGetBudgetRequest,
  addBudgetRequest as onAddBudgetRequest,
  updateBudgetRequest as onUpdateBudgetRequest,
  deleteBudgetRequest as onDeleteBudgetRequest,
} from "../../store/budgetrequest/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import BudgetRequestModal from "./BudgetRequestModal";
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

const BudgetRequestModel = (props) => {
  //  get passed data from tab
  const { projectid } = props;
  //meta title
  document.title = " BudgetRequest";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [budgetRequest, setBudgetRequest] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      bdr_budget_year_id:
        (budgetRequest && budgetRequest.bdr_budget_year_id) || "",
      bdr_requested_amount:
        (budgetRequest && budgetRequest.bdr_requested_amount) || "",
      bdr_released_amount:
        (budgetRequest && budgetRequest.bdr_released_amount) || "",
      bdr_project_id: (budgetRequest && budgetRequest.bdr_project_id) || "",
      bdr_requested_date_ec:
        (budgetRequest && budgetRequest.bdr_requested_date_ec) || "",
      bdr_requested_date_gc:
        (budgetRequest && budgetRequest.bdr_requested_date_gc) || "",
      bdr_released_date_ec:
        (budgetRequest && budgetRequest.bdr_released_date_ec) || "",
      bdr_released_date_gc:
        (budgetRequest && budgetRequest.bdr_released_date_gc) || "",
      bdr_description: (budgetRequest && budgetRequest.bdr_description) || "",
      bdr_status: (budgetRequest && budgetRequest.bdr_status) || "",

      is_deletable: (budgetRequest && budgetRequest.is_deletable) || 1,
      is_editable: (budgetRequest && budgetRequest.is_editable) || 1,
    },

    validationSchema: Yup.object({
      bdr_budget_year_id: Yup.string().required(t("bdr_budget_year_id")),
      bdr_requested_amount: Yup.string().required(t("bdr_requested_amount")),
      bdr_released_amount: Yup.string().required(t("bdr_released_amount")),
      // bdr_project_id: Yup.string().required(t("bdr_project_id")),
      bdr_requested_date_ec: Yup.string().required(t("bdr_requested_date_ec")),
      bdr_requested_date_gc: Yup.string().required(t("bdr_requested_date_gc")),
      bdr_released_date_ec: Yup.string().required(t("bdr_released_date_ec")),
      bdr_released_date_gc: Yup.string().required(t("bdr_released_date_gc")),
      bdr_description: Yup.string().required(t("bdr_description")),
      bdr_status: Yup.string().required(t("bdr_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetRequest = {
          bdr_id: budgetRequest ? budgetRequest.bdr_id : 0,
          bdr_budget_year_id: values.bdr_budget_year_id,
          bdr_requested_amount: values.bdr_requested_amount,
          bdr_released_amount: values.bdr_released_amount,
          bdr_project_id: values.bdr_project_id,
          bdr_requested_date_ec: values.bdr_requested_date_ec,
          bdr_requested_date_gc: values.bdr_requested_date_gc,
          bdr_released_date_ec: values.bdr_released_date_ec,
          bdr_released_date_gc: values.bdr_released_date_gc,
          bdr_description: values.bdr_description,
          bdr_status: values.bdr_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetRequest
        dispatch(onUpdateBudgetRequest(updateBudgetRequest));
        validation.resetForm();
      } else {
        const newBudgetRequest = {
          bdr_budget_year_id: values.bdr_budget_year_id,
          bdr_requested_amount: values.bdr_requested_amount,
          bdr_released_amount: values.bdr_released_amount,
          bdr_project_id: values.bdr_project_id,
          bdr_requested_date_ec: values.bdr_requested_date_ec,
          bdr_requested_date_gc: values.bdr_requested_date_gc,
          bdr_released_date_ec: values.bdr_released_date_ec,
          bdr_released_date_gc: values.bdr_released_date_gc,
          bdr_description: values.bdr_description,
          bdr_status: values.bdr_status,
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
    dispatch(onGetBudgetRequest(projectid));
  }, [dispatch]);

  const budgetRequestProperties = createSelector(
    (state) => state.BudgetRequestR, // this is geting from  reducer
    (BudgetRequestReducer) => ({
      // this is from Project.reducer
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
    // console.log("handleBudgetRequestClick", budgetRequest);
    setBudgetRequest({
      bdr_id: budgetRequest.bdr_id,
      bdr_budget_year_id: budgetRequest.bdr_budget_year_id,
      bdr_requested_amount: budgetRequest.bdr_requested_amount,
      bdr_released_amount: budgetRequest.bdr_released_amount,
      bdr_project_id: budgetRequest.bdr_project_id,
      bdr_requested_date_ec: budgetRequest.bdr_requested_date_ec,
      bdr_requested_date_gc: budgetRequest.bdr_requested_date_gc,
      bdr_released_date_ec: budgetRequest.bdr_released_date_ec,
      bdr_released_date_gc: budgetRequest.bdr_released_date_gc,
      bdr_description: budgetRequest.bdr_description,
      bdr_status: budgetRequest.bdr_status,

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
        accessorKey: "bdr_budget_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_budget_year_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_requested_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_released_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_released_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      // {
      //   header: "",
      //   accessorKey: "bdr_project_id",
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.bdr_project_id, 30) || "-"}
      //       </span>
      //     );
      //   },
      // },
      {
        header: "",
        accessorKey: "bdr_requested_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_requested_date_ec, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_requested_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_requested_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_released_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_released_date_ec, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_released_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_released_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bdr_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdr_status, 30) || "-"}
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
                    handleBudgetRequestClick(data);
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
  }, [handleBudgetRequestClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <BudgetRequestModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetRequest}
        onCloseClick={() => setDeleteModal(false)}
      />
      {/* <div className="page-content"> */}
      <div className="container-fluid">
        {/* <Breadcrumbs
            title={t("budget_request")}
            breadcrumbItem={t("budget_request")}
          /> */}
        {projectid ? null : (
          <Breadcrumbs
            title={t("budget_request")}
            breadcrumbItem={t("budget_request")}
          />
        )}
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
                    handleUserClick={handleBudgetRequestClicks}
                    isPagination={true}
                    // SearchPlaceholder="26 records..."
                    SearchPlaceholder={26 + " " + t("Results") + "..."}
                    buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                    buttonName={t("add") + " " + t("budget_request")}
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
                  <Label>{t("bdr_budget_year_id")}</Label>
                  <Input
                    name="bdr_budget_year_id"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_budget_year_id || ""}
                    invalid={
                      validation.touched.bdr_budget_year_id &&
                      validation.errors.bdr_budget_year_id
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_budget_year_id &&
                  validation.errors.bdr_budget_year_id ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_budget_year_id}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_requested_amount")}</Label>
                  <Input
                    name="bdr_requested_amount"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_requested_amount || ""}
                    invalid={
                      validation.touched.bdr_requested_amount &&
                      validation.errors.bdr_requested_amount
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_requested_amount &&
                  validation.errors.bdr_requested_amount ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_requested_amount}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_released_amount")}</Label>
                  <Input
                    name="bdr_released_amount"
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
                {/* <Col className="col-md-6 mb-3">
                    <Label>{t("bdr_project_id")}</Label>
                    <Input
                      name="bdr_project_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bdr_project_id || ""}
                      invalid={
                        validation.touched.bdr_project_id &&
                        validation.errors.bdr_project_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bdr_project_id &&
                    validation.errors.bdr_project_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bdr_project_id}
                      </FormFeedback>
                    ) : null}
                  </Col> */}
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_requested_date_ec")}</Label>
                  <Input
                    name="bdr_requested_date_ec"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_requested_date_ec || ""}
                    invalid={
                      validation.touched.bdr_requested_date_ec &&
                      validation.errors.bdr_requested_date_ec
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_requested_date_ec &&
                  validation.errors.bdr_requested_date_ec ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_requested_date_ec}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_requested_date_gc")}</Label>
                  <Input
                    name="bdr_requested_date_gc"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_requested_date_gc || ""}
                    invalid={
                      validation.touched.bdr_requested_date_gc &&
                      validation.errors.bdr_requested_date_gc
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_requested_date_gc &&
                  validation.errors.bdr_requested_date_gc ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_requested_date_gc}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_released_date_ec")}</Label>
                  <Input
                    name="bdr_released_date_ec"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_released_date_ec || ""}
                    invalid={
                      validation.touched.bdr_released_date_ec &&
                      validation.errors.bdr_released_date_ec
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_released_date_ec &&
                  validation.errors.bdr_released_date_ec ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_released_date_ec}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col className="col-md-6 mb-3">
                  <Label>{t("bdr_released_date_gc")}</Label>
                  <Input
                    name="bdr_released_date_gc"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_released_date_gc || ""}
                    invalid={
                      validation.touched.bdr_released_date_gc &&
                      validation.errors.bdr_released_date_gc
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_released_date_gc &&
                  validation.errors.bdr_released_date_gc ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_released_date_gc}
                    </FormFeedback>
                  ) : null}
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
                  <Label>{t("bdr_status")}</Label>
                  <Input
                    name="bdr_status"
                    type="text"
                    placeholder={t("insert_status_name_amharic")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bdr_status || ""}
                    invalid={
                      validation.touched.bdr_status &&
                      validation.errors.bdr_status
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.bdr_status &&
                  validation.errors.bdr_status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.bdr_status}
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
      {/* </div> */}
      <ToastContainer />
    </React.Fragment>
  );
};
BudgetRequestModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetRequestModel;
