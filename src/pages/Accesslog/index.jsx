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
  getAccessLog as onGetAccessLog,
  addAccessLog as onAddAccessLog,
  updateAccessLog as onUpdateAccessLog,
  deleteAccessLog as onDeleteAccessLog,
} from "../../store/accesslog/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import AccessLogModal from "./AccessLogModal";
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

const AccessLogModel = () => {
  //meta title
  document.title = " AccessLog";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [accessLog, setAccessLog] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      acl_ip: (accessLog && accessLog.acl_ip) || "",
      acl_user_id: (accessLog && accessLog.acl_user_id) || "",
      acl_role_id: (accessLog && accessLog.acl_role_id) || "",
      acl_object_name: (accessLog && accessLog.acl_object_name) || "",
      acl_object_id: (accessLog && accessLog.acl_object_id) || "",
      acl_remark: (accessLog && accessLog.acl_remark) || "",
      acl_detail: (accessLog && accessLog.acl_detail) || "",
      acl_object_action: (accessLog && accessLog.acl_object_action) || "",
      acl_description: (accessLog && accessLog.acl_description) || "",
      acl_status: (accessLog && accessLog.acl_status) || "",

      is_deletable: (accessLog && accessLog.is_deletable) || 1,
      is_editable: (accessLog && accessLog.is_editable) || 1,
    },

    validationSchema: Yup.object({
      acl_ip: Yup.string().required(t("acl_ip")),
      acl_user_id: Yup.string().required(t("acl_user_id")),
      acl_role_id: Yup.string().required(t("acl_role_id")),
      acl_object_name: Yup.string().required(t("acl_object_name")),
      acl_object_id: Yup.string().required(t("acl_object_id")),
      acl_remark: Yup.string().required(t("acl_remark")),
      acl_detail: Yup.string().required(t("acl_detail")),
      acl_object_action: Yup.string().required(t("acl_object_action")),
      acl_description: Yup.string().required(t("acl_description")),
      acl_status: Yup.string().required(t("acl_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateAccessLog = {
          acl_id: accessLog ? accessLog.acl_id : 0,
          // acl_id:accessLog.acl_id,
          acl_ip: values.acl_ip,
          acl_user_id: values.acl_user_id,
          acl_role_id: values.acl_role_id,
          acl_object_name: values.acl_object_name,
          acl_object_id: values.acl_object_id,
          acl_remark: values.acl_remark,
          acl_detail: values.acl_detail,
          acl_object_action: values.acl_object_action,
          acl_description: values.acl_description,
          acl_status: values.acl_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update AccessLog
        dispatch(onUpdateAccessLog(updateAccessLog));
        validation.resetForm();
      } else {
        const newAccessLog = {
          acl_ip: values.acl_ip,
          acl_user_id: values.acl_user_id,
          acl_role_id: values.acl_role_id,
          acl_object_name: values.acl_object_name,
          acl_object_id: values.acl_object_id,
          acl_remark: values.acl_remark,
          acl_detail: values.acl_detail,
          acl_object_action: values.acl_object_action,
          acl_description: values.acl_description,
          acl_status: values.acl_status,
        };
        // save new AccessLogs
        dispatch(onAddAccessLog(newAccessLog));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch AccessLog on component mount
  useEffect(() => {
    dispatch(onGetAccessLog());
  }, [dispatch]);

  const accessLogProperties = createSelector(
    (state) => state.AccessLogR, // this is geting from  reducer
    (AccessLogReducer) => ({
      // this is from Project.reducer
      accessLog: AccessLogReducer.accessLog,
      loading: AccessLogReducer.loading,
      update_loading: AccessLogReducer.update_loading,
    })
  );

  const {
    accessLog: { data, previledge },
    loading,
    update_loading,
  } = useSelector(accessLogProperties);

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
    setAccessLog(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setAccessLog(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setAccessLog(null);
    } else {
      setModal(true);
    }
  };

  const handleAccessLogClick = (arg) => {
    const accessLog = arg;
    // console.log("handleAccessLogClick", accessLog);
    setAccessLog({
      acl_id: accessLog.acl_id,
      acl_ip: accessLog.acl_ip,
      acl_user_id: accessLog.acl_user_id,
      acl_role_id: accessLog.acl_role_id,
      acl_object_name: accessLog.acl_object_name,
      acl_object_id: accessLog.acl_object_id,
      acl_remark: accessLog.acl_remark,
      acl_detail: accessLog.acl_detail,
      acl_object_action: accessLog.acl_object_action,
      acl_description: accessLog.acl_description,
      acl_status: accessLog.acl_status,

      is_deletable: accessLog.is_deletable,
      is_editable: accessLog.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (accessLog) => {
    setAccessLog(accessLog);
    setDeleteModal(true);
  };

  const handleDeleteAccessLog = () => {
    if (accessLog && accessLog.acl_id) {
      dispatch(onDeleteAccessLog(accessLog.acl_id));
      setDeleteModal(false);
    }
  };
  const handleAccessLogClicks = () => {
    setIsEdit(false);
    setAccessLog("");
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
        accessorKey: "acl_ip",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_ip, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_user_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_user_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_role_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_role_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_object_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_object_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_object_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_object_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_remark",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_remark, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_detail",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_detail, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_object_action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_object_action, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "acl_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.acl_status, 30) || "-"}
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
                    handleAccessLogClick(data);
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
  }, [handleAccessLogClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <AccessLogModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteAccessLog}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("access_log")}
            breadcrumbItem={t("access_log")}
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
                      handleUserClick={handleAccessLogClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("access_log")}
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
                ? t("edit") + " " + t("access_log")
                : t("add") + " " + t("access_log")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateAccessLog(validation.values, modalCallback);
                  } else {
                    onAddAccessLog(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_ip")}</Label>
                    <Input
                      name="acl_ip"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_ip || ""}
                      invalid={
                        validation.touched.acl_ip && validation.errors.acl_ip
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_ip && validation.errors.acl_ip ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_ip}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_user_id")}</Label>
                    <Input
                      name="acl_user_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_user_id || ""}
                      invalid={
                        validation.touched.acl_user_id &&
                        validation.errors.acl_user_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_user_id &&
                    validation.errors.acl_user_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_user_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_role_id")}</Label>
                    <Input
                      name="acl_role_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_role_id || ""}
                      invalid={
                        validation.touched.acl_role_id &&
                        validation.errors.acl_role_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_role_id &&
                    validation.errors.acl_role_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_role_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_object_name")}</Label>
                    <Input
                      name="acl_object_name"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_object_name || ""}
                      invalid={
                        validation.touched.acl_object_name &&
                        validation.errors.acl_object_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_object_name &&
                    validation.errors.acl_object_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_object_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_object_id")}</Label>
                    <Input
                      name="acl_object_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_object_id || ""}
                      invalid={
                        validation.touched.acl_object_id &&
                        validation.errors.acl_object_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_object_id &&
                    validation.errors.acl_object_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_object_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_remark")}</Label>
                    <Input
                      name="acl_remark"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_remark || ""}
                      invalid={
                        validation.touched.acl_remark &&
                        validation.errors.acl_remark
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_remark &&
                    validation.errors.acl_remark ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_remark}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_detail")}</Label>
                    <Input
                      name="acl_detail"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_detail || ""}
                      invalid={
                        validation.touched.acl_detail &&
                        validation.errors.acl_detail
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_detail &&
                    validation.errors.acl_detail ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_detail}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_object_action")}</Label>
                    <Input
                      name="acl_object_action"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_object_action || ""}
                      invalid={
                        validation.touched.acl_object_action &&
                        validation.errors.acl_object_action
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_object_action &&
                    validation.errors.acl_object_action ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_object_action}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_description")}</Label>
                    <Input
                      name="acl_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_description || ""}
                      invalid={
                        validation.touched.acl_description &&
                        validation.errors.acl_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_description &&
                    validation.errors.acl_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("acl_status")}</Label>
                    <Input
                      name="acl_status"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.acl_status || ""}
                      invalid={
                        validation.touched.acl_status &&
                        validation.errors.acl_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.acl_status &&
                    validation.errors.acl_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.acl_status}
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
AccessLogModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default AccessLogModel;
