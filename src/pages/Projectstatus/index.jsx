import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getProjectStatus as onGetProjectStatus,
  addProjectStatus as onAddProjectStatus,
  updateProjectStatus as onUpdateProjectStatus,
  deleteProjectStatus as onDeleteProjectStatus,
} from "../../store/projectstatus/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ProjectStatusModal from "./ProjectStatusModal";
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
import { ToastContainer } from "react-toastify";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectStatusModel = () => {
  //meta title
  document.title = " ProjectStatus";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [projectStatus, setProjectStatus] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      prs_status_name_or:
        (projectStatus && projectStatus.prs_status_name_or) || "",
      prs_status_name_am:
        (projectStatus && projectStatus.prs_status_name_am) || "",
      prs_status_name_en:
        (projectStatus && projectStatus.prs_status_name_en) || "",
      prs_color_code: (projectStatus && projectStatus.prs_color_code) || "",
      prs_order_number: (projectStatus && projectStatus.prs_order_number) || "",
      prs_description: (projectStatus && projectStatus.prs_description) || "",
      prs_status: (projectStatus && projectStatus.prs_status) || "",
      prs_spare_column: (projectStatus && projectStatus.prs_spare_column) || "",

      is_deletable: (projectStatus && projectStatus.is_deletable) || 1,
      is_editable: (projectStatus && projectStatus.is_editable) || 1,
    },

    validationSchema: Yup.object({
      prs_status_name_or: Yup.string().required(t("prs_status_name_or")),
      prs_status_name_am: Yup.string().required(t("prs_status_name_am")),
      prs_status_name_en: Yup.string().required(t("prs_status_name_en")),
      prs_color_code: Yup.string().required(t("prs_color_code")),
      prs_order_number: Yup.string().required(t("prs_order_number")),
      prs_description: Yup.string().required(t("prs_description")),
      prs_status: Yup.string().required(t("prs_status")),
      prs_spare_column: Yup.string().required(t("prs_spare_column")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectStatus = {
          prs_id: projectStatus ? projectStatus.prs_id : 0,
          // prs_id:projectStatus.prs_id,
          prs_status_name_or: values.prs_status_name_or,
          prs_status_name_am: values.prs_status_name_am,
          prs_status_name_en: values.prs_status_name_en,
          prs_color_code: values.prs_color_code,
          prs_order_number: values.prs_order_number,
          prs_description: values.prs_description,
          prs_status: values.prs_status,
          prs_spare_column: values.prs_spare_column,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectStatus
        dispatch(onUpdateProjectStatus(updateProjectStatus));
        validation.resetForm();
      } else {
        const newProjectStatus = {
          prs_status_name_or: values.prs_status_name_or,
          prs_status_name_am: values.prs_status_name_am,
          prs_status_name_en: values.prs_status_name_en,
          prs_color_code: values.prs_color_code,
          prs_order_number: values.prs_order_number,
          prs_description: values.prs_description,
          prs_status: values.prs_status,
          prs_spare_column: values.prs_spare_column,
        };
        // save new ProjectStatuss
        dispatch(onAddProjectStatus(newProjectStatus));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch ProjectStatus on component mount
  useEffect(() => {
    dispatch(onGetProjectStatus());
  }, [dispatch]);

  const projectStatusProperties = createSelector(
    (state) => state.ProjectStatusR, // this is geting from  reducer
    (ProjectStatusReducer) => ({
      // this is from Project.reducer
      projectStatus: ProjectStatusReducer.projectStatus,
      loading: ProjectStatusReducer.loading,
      update_loading: ProjectStatusReducer.update_loading,
    })
  );

  const {
    projectStatus: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectStatusProperties);

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
    setProjectStatus(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectStatus(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectStatus(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectStatusClick = (arg) => {
    const projectStatus = arg;
    // console.log("handleProjectStatusClick", projectStatus);
    setProjectStatus({
      prs_id: projectStatus.prs_id,
      prs_status_name_or: projectStatus.prs_status_name_or,
      prs_status_name_am: projectStatus.prs_status_name_am,
      prs_status_name_en: projectStatus.prs_status_name_en,
      prs_color_code: projectStatus.prs_color_code,
      prs_order_number: projectStatus.prs_order_number,
      prs_description: projectStatus.prs_description,
      prs_status: projectStatus.prs_status,
      prs_spare_column: projectStatus.prs_spare_column,

      is_deletable: projectStatus.is_deletable,
      is_editable: projectStatus.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (projectStatus) => {
    setProjectStatus(projectStatus);
    setDeleteModal(true);
  };

  const handleDeleteProjectStatus = () => {
    if (projectStatus && projectStatus.prs_id) {
      dispatch(onDeleteProjectStatus(projectStatus.prs_id));
      setDeleteModal(false);
    }
  };
  const handleProjectStatusClicks = () => {
    setIsEdit(false);
    setProjectStatus("");
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
        accessorKey: "prs_status_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_or, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_am, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_en, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_color_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_color_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_order_number",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_order_number, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_spare_column",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_spare_column, 30) || "-"}
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
                    handleProjectStatusClick(data);
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
  }, [handleProjectStatusClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <ProjectStatusModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectStatus}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("project_status")}
            breadcrumbItem={t("project_status")}
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
                      handleUserClick={handleProjectStatusClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_status")}
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
                ? t("edit") + " " + t("project_status")
                : t("add") + " " + t("project_status")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateProjectStatus(validation.values, modalCallback);
                  } else {
                    onAddProjectStatus(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status_name_or")}</Label>
                    <Input
                      name="prs_status_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_or || ""}
                      invalid={
                        validation.touched.prs_status_name_or &&
                        validation.errors.prs_status_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_status_name_or &&
                    validation.errors.prs_status_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status_name_am")}</Label>
                    <Input
                      name="prs_status_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_am || ""}
                      invalid={
                        validation.touched.prs_status_name_am &&
                        validation.errors.prs_status_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_status_name_am &&
                    validation.errors.prs_status_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status_name_en")}</Label>
                    <Input
                      name="prs_status_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_en || ""}
                      invalid={
                        validation.touched.prs_status_name_en &&
                        validation.errors.prs_status_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_status_name_en &&
                    validation.errors.prs_status_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_color_code")}</Label>
                    <Input
                      name="prs_color_code"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_color_code || ""}
                      invalid={
                        validation.touched.prs_color_code &&
                        validation.errors.prs_color_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_color_code &&
                    validation.errors.prs_color_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_color_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_order_number")}</Label>
                    <Input
                      name="prs_order_number"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_order_number || ""}
                      invalid={
                        validation.touched.prs_order_number &&
                        validation.errors.prs_order_number
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_order_number &&
                    validation.errors.prs_order_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_order_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_description")}</Label>
                    <Input
                      name="prs_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_description || ""}
                      invalid={
                        validation.touched.prs_description &&
                        validation.errors.prs_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_description &&
                    validation.errors.prs_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status")}</Label>
                    <Input
                      name="prs_status"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status || ""}
                      invalid={
                        validation.touched.prs_status &&
                        validation.errors.prs_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_status &&
                    validation.errors.prs_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_spare_column")}</Label>
                    <Input
                      name="prs_spare_column"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_spare_column || ""}
                      invalid={
                        validation.touched.prs_spare_column &&
                        validation.errors.prs_spare_column
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_spare_column &&
                    validation.errors.prs_spare_column ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_spare_column}
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
ProjectStatusModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectStatusModel;
