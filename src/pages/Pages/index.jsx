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
  useFetchPagess,
  useSearchPagess,
  useAddPages,
  useDeletePages,
  useUpdatePages,
} from "../../queries/pages_query";
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
import { toast } from "react-toastify";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

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

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchPagess();

  const addPages = useAddPages();
  const updatePages = useUpdatePages();
  const deletePages = useDeletePages();
  //START CRUD
  const handleAddPages = async (data) => {
    try {
      await addPages.mutateAsync(data);
      toast.success(`Data added successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add data", {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdatePages = async (data) => {
    try {
      await updatePages.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeletePages = async () => {
    if (pages && pages.pag_id) {
      try {
        const id = pages.pag_id;
        await deletePages.mutateAsync(id);
        toast.success(`Data deleted successfully`, {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(`Failed to delete Data`, {
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
          pag_id: pages?.pag_id,
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
        handleUpdatePages(updatePages);
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
        // save new Pages
        handleAddPages(newPages);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch Pages on component mount
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

  const handlePagesClicks = () => {
    setIsEdit(false);
    setPages("");
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
    if (
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
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

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

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
        isLoading={deletePages.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("pages")} breadcrumbItem={t("pages")} />
          <AdvancedSearch
            searchHook={useSearchPagess}
            textSearchKeys={["dep_name_am", "dep_name_en", "dep_name_or"]}
            dropdownSearchKeys={[
              {
                key: "example",
                options: [
                  { value: "Freelance", label: "Example1" },
                  { value: "Full Time", label: "Example2" },
                  { value: "Part Time", label: "Example3" },
                  { value: "Internship", label: "Example4" },
                ],
              },
            ]}
            checkboxSearchKeys={[
              {
                key: "example1",
                options: [
                  { value: "Engineering", label: "Example1" },
                  { value: "Science", label: "Example2" },
                ],
              },
            ]}
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
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handlePagesClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
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
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pag_name")}</Label>
                    <Input
                      name="pag_name"
                      type="text"
                      placeholder={t("pag_name")}
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
                      placeholder={t("pag_controller")}
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
                      placeholder={t("pag_modifying_days")}
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
                      placeholder={t("pag_is_deletable")}
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
                      placeholder={t("pag_display_record_no")}
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
                      placeholder={t("pag_system_module")}
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
                      placeholder={t("pag_header")}
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
                      placeholder={t("pag_footer")}
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
                      placeholder={t("pag_rule")}
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
                      placeholder={t("pag_description")}
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
                      type="text"
                      placeholder={t("pag_status")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pag_status || ""}
                      invalid={
                        validation.touched.pag_status &&
                        validation.errors.pag_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
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
                      {addPages.isPending || updatePages.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addPages.isPending ||
                            updatePages.isPending ||
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
                            addPages.isPending ||
                            updatePages.isPending ||
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
PagesModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default PagesModel;
