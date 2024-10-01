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
  getPages as onGetPages,
  addPages as onAddPages,
  updatePages as onUpdatePages,
  deletePages as onDeletePages,
} from "../../store/pages/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import PagesModal from "./PagesModal";
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

const PagesModel = () => {
  //meta title
  document.title = " Pages";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [pages, setPages] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      pag_name: (pages && pages.pag_name) || "",
      pag_controller: (pages && pages.pag_controller) || "",
      pag_modifying_days: (pages && pages.pag_modifying_days) || "",
      pag_is_deletable: (pages && pages.pag_is_deletable) || "",
      pag_display_record_no: (pages && pages.pag_display_record_no) || "",
      pag_system_module: (pages && pages.pag_system_module) || "",
      pag_header: (pages && pages.pag_header) || "",
      pag_footer: (pages && pages.pag_footer) || "",
      pag_rule: (pages && pages.pag_rule) || "",
      pag_description: (pages && pages.pag_description) || "",
      pag_status: (pages && pages.pag_status) || "",

      is_deletable: (pages && pages.is_deletable) || 1,
      is_editable: (pages && pages.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pag_name: Yup.string().required(t("pag_name")),
      pag_controller: Yup.string().required(t("pag_controller")),
      pag_modifying_days: Yup.string().required(t("pag_modifying_days")),
      pag_is_deletable: Yup.string().required(t("pag_is_deletable")),
      pag_display_record_no: Yup.string().required(t("pag_display_record_no")),
      pag_system_module: Yup.string().required(t("pag_system_module")),
      pag_header: Yup.string().required(t("pag_header")),
      pag_footer: Yup.string().required(t("pag_footer")),
      pag_rule: Yup.string().required(t("pag_rule")),
      pag_description: Yup.string().required(t("pag_description")),
      pag_status: Yup.string().required(t("pag_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updatePages = {
          pag_id: pages ? pages.pag_id : 0,
          pag_name: values.pag_name,
          pag_controller: values.pag_controller,
          pag_modifying_days: values.pag_modifying_days,
          pag_is_deletable: values.pag_is_deletable,
          pag_display_record_no: values.pag_display_record_no,
          pag_system_module: values.pag_system_module,
          pag_header: values.pag_header,
          pag_footer: values.pag_footer,
          pag_rule: values.pag_rule,
          pag_description: values.pag_description,
          pag_status: values.pag_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Pages
        dispatch(onUpdatePages(updatePages));
        validation.resetForm();
      } else {
        const newPages = {
          pag_name: values.pag_name,
          pag_controller: values.pag_controller,
          pag_modifying_days: values.pag_modifying_days,
          pag_is_deletable: values.pag_is_deletable,
          pag_display_record_no: values.pag_display_record_no,
          pag_system_module: values.pag_system_module,
          pag_header: values.pag_header,
          pag_footer: values.pag_footer,
          pag_rule: values.pag_rule,
          pag_description: values.pag_description,
          pag_status: values.pag_status,
        };
        // save new Pagess
        dispatch(onAddPages(newPages));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch Pages on component mount
  useEffect(() => {
    dispatch(onGetPages());
  }, [dispatch]);

  const pagesProperties = createSelector(
    (state) => state.PagesR, // this is geting from  reducer
    (PagesReducer) => ({
      // this is from Project.reducer
      pages: PagesReducer.pages,
      loading: PagesReducer.loading,
      update_loading: PagesReducer.update_loading,
    })
  );

  const {
    pages: { data, previledge },
    loading,
    update_loading,
  } = useSelector(pagesProperties);

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
    setPages(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setPages(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setPages(null);
    } else {
      setModal(true);
    }
  };

  const handlePagesClick = (arg) => {
    const pages = arg;
    // console.log("handlePagesClick", pages);
    setPages({
      pag_id: pages.pag_id,
      pag_name: pages.pag_name,
      pag_controller: pages.pag_controller,
      pag_modifying_days: pages.pag_modifying_days,
      pag_is_deletable: pages.pag_is_deletable,
      pag_display_record_no: pages.pag_display_record_no,
      pag_system_module: pages.pag_system_module,
      pag_header: pages.pag_header,
      pag_footer: pages.pag_footer,
      pag_rule: pages.pag_rule,
      pag_description: pages.pag_description,
      pag_status: pages.pag_status,

      is_deletable: pages.is_deletable,
      is_editable: pages.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (pages) => {
    setPages(pages);
    setDeleteModal(true);
  };

  const handleDeletePages = () => {
    if (pages && pages.pag_id) {
      dispatch(onDeletePages(pages.pag_id));
      setDeleteModal(false);
    }
  };
  const handlePagesClicks = () => {
    setIsEdit(false);
    setPages("");
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
        accessorKey: "pag_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_controller",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_controller, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_modifying_days",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_modifying_days, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_is_deletable",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_is_deletable, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_display_record_no",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_display_record_no, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_system_module",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_system_module, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_header",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_header, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_footer",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_footer, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_rule",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_rule, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pag_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pag_status, 30) || "-"}
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
                    handlePagesClick(data);
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
  }, [handlePagesClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <PagesModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePages}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("pages")} breadcrumbItem={t("pages")} />
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
                      handleUserClick={handlePagesClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("pages")}
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
                ? t("edit") + " " + t("pages")
                : t("add") + " " + t("pages")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdatePages(validation.values, modalCallback);
                  } else {
                    onAddPages(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_name")}</Label>
                    <Input
                      name="pag_name"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_name || ""}
                      invalid={
                        validation.touched.pag_name &&
                        validation.errors.pag_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_name &&
                    validation.errors.pag_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_controller")}</Label>
                    <Input
                      name="pag_controller"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_controller || ""}
                      invalid={
                        validation.touched.pag_controller &&
                        validation.errors.pag_controller
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_controller &&
                    validation.errors.pag_controller ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_controller}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_modifying_days")}</Label>
                    <Input
                      name="pag_modifying_days"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_modifying_days || ""}
                      invalid={
                        validation.touched.pag_modifying_days &&
                        validation.errors.pag_modifying_days
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_modifying_days &&
                    validation.errors.pag_modifying_days ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_modifying_days}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_is_deletable")}</Label>
                    <Input
                      name="pag_is_deletable"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_is_deletable || ""}
                      invalid={
                        validation.touched.pag_is_deletable &&
                        validation.errors.pag_is_deletable
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_is_deletable &&
                    validation.errors.pag_is_deletable ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_is_deletable}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_display_record_no")}</Label>
                    <Input
                      name="pag_display_record_no"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_display_record_no || ""}
                      invalid={
                        validation.touched.pag_display_record_no &&
                        validation.errors.pag_display_record_no
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_display_record_no &&
                    validation.errors.pag_display_record_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_display_record_no}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_system_module")}</Label>
                    <Input
                      name="pag_system_module"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_system_module || ""}
                      invalid={
                        validation.touched.pag_system_module &&
                        validation.errors.pag_system_module
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_system_module &&
                    validation.errors.pag_system_module ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_system_module}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_header")}</Label>
                    <Input
                      name="pag_header"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_header || ""}
                      invalid={
                        validation.touched.pag_header &&
                        validation.errors.pag_header
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_header &&
                    validation.errors.pag_header ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_header}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_footer")}</Label>
                    <Input
                      name="pag_footer"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_footer || ""}
                      invalid={
                        validation.touched.pag_footer &&
                        validation.errors.pag_footer
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_footer &&
                    validation.errors.pag_footer ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_footer}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_rule")}</Label>
                    <Input
                      name="pag_rule"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_rule || ""}
                      invalid={
                        validation.touched.pag_rule &&
                        validation.errors.pag_rule
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_rule &&
                    validation.errors.pag_rule ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_rule}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_description")}</Label>
                    <Input
                      name="pag_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_description || ""}
                      invalid={
                        validation.touched.pag_description &&
                        validation.errors.pag_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pag_description &&
                    validation.errors.pag_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_status")}</Label>
                    <Input
                      name="pag_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "pag_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.pag_status &&
                    validation.errors.pag_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pag_status}
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
PagesModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default PagesModel;
