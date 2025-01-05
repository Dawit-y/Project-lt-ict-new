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
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchEmailTemplates,
  useSearchEmailTemplates,
  useAddEmailTemplate,
  useDeleteEmailTemplate,
  useUpdateEmailTemplate,
} from "../../queries/emailtemplate_query";
import EmailTemplateModal from "./EmailTemplateModal";
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
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const EmailTemplateModel = () => {
  //meta title
  document.title = " EmailTemplate";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchEmailTemplates();
  const addEmailTemplate = useAddEmailTemplate();
  const updateEmailTemplate = useUpdateEmailTemplate();
  const deleteEmailTemplate = useDeleteEmailTemplate();
  //START CRUD
  const handleAddEmailTemplate = async (data) => {
    try {
      await addEmailTemplate.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateEmailTemplate = async (data) => {
    try {
      await updateEmailTemplate.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteEmailTemplate = async () => {
    if (emailTemplate && emailTemplate.emt_id) {
      try {
        const id = emailTemplate.emt_id;
        await deleteEmailTemplate.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
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
      emt_template_name:
        (emailTemplate && emailTemplate.emt_template_name) || "",
      emt_template_content:
        (emailTemplate && emailTemplate.emt_template_content) || "",
        emt_template_content_am:
        (emailTemplate && emailTemplate.emt_template_content_am) || "",
  emt_template_content_en:
        (emailTemplate && emailTemplate.emt_template_content_en) || "",
      emt_description: (emailTemplate && emailTemplate.emt_description) || "",

      is_deletable: (emailTemplate && emailTemplate.is_deletable) || 1,
      is_editable: (emailTemplate && emailTemplate.is_editable) || 1,
    },
    validationSchema: Yup.object({
      emt_template_name: alphanumericValidation(3, 200, true),
      emt_template_content: alphanumericValidation(10, 200, true),
      //emt_template_content_am: alphanumericValidation(10, 200, false),
      emt_template_content_en: alphanumericValidation(10, 200, false),
      emt_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateEmailTemplate = {
          emt_id: emailTemplate?.emt_id,
          emt_template_name: values.emt_template_name,
          emt_template_content: values.emt_template_content,
          emt_template_content_am: values.emt_template_content_am,
          emt_template_content_en: values.emt_template_content_en,
          emt_description: values.emt_description,
          emt_status: values.emt_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update EmailTemplate
        handleUpdateEmailTemplate(updateEmailTemplate);
      } else {
        const newEmailTemplate = {
          emt_template_name: values.emt_template_name,
          emt_template_content: values.emt_template_content,
          emt_template_content_am: values.emt_template_content_am,
          emt_template_content_en: values.emt_template_content_en,
          emt_description: values.emt_description,
          emt_status: values.emt_status,
        };
        // save new EmailTemplate
        handleAddEmailTemplate(newEmailTemplate);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch EmailTemplate on component mount
  useEffect(() => {
    setEmailTemplate(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setEmailTemplate(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEmailTemplate(null);
    } else {
      setModal(true);
    }
  };

  const handleEmailTemplateClick = (arg) => {
    const emailTemplate = arg;
    // console.log("handleEmailTemplateClick", emailTemplate);
    setEmailTemplate({
      emt_id: emailTemplate.emt_id,
      emt_template_name: emailTemplate.emt_template_name,
      emt_template_content: emailTemplate.emt_template_content,
       emt_template_content_am: emailTemplate.emt_template_content_am,
        emt_template_content_en: emailTemplate.emt_template_content_en,
      emt_description: emailTemplate.emt_description,
      emt_status: emailTemplate.emt_status,

      is_deletable: emailTemplate.is_deletable,
      is_editable: emailTemplate.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (emailTemplate) => {
    setEmailTemplate(emailTemplate);
    setDeleteModal(true);
  };

  const handleEmailTemplateClicks = () => {
    setIsEdit(false);
    setEmailTemplate("");
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
        accessorKey: "emt_template_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emt_template_name, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emt_template_content",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emt_template_content, 30) ||
                "-"}
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
                    handleEmailTemplateClick(data);
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
  }, [handleEmailTemplateClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
      <EmailTemplateModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEmailTemplate}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteEmailTemplate.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("email_template")}
            breadcrumbItem={t("email_template")}
          />
          <AdvancedSearch
            searchHook={useSearchEmailTemplates}
            textSearchKeys={["emt_template_name"]}
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
                      handleUserClick={handleEmailTemplateClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("email_template")}
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
                ? t("edit") + " " + t("email_template")
                : t("add") + " " + t("email_template")}
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
                    <Label>{t("emt_template_name")}</Label>
                    <Input
                      name="emt_template_name"
                      type="text"
                      placeholder={t("emt_template_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emt_template_name || ""}
                      invalid={
                        validation.touched.emt_template_name &&
                        validation.errors.emt_template_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emt_template_name &&
                    validation.errors.emt_template_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emt_template_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emt_template_content")}</Label>
                    <Input
                      name="emt_template_content"
                      type="textarea"
                      placeholder={t("emt_template_content")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emt_template_content || ""}
                      invalid={
                        validation.touched.emt_template_content &&
                        validation.errors.emt_template_content
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.emt_template_content &&
                    validation.errors.emt_template_content ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emt_template_content}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emt_template_content_am")}</Label>
                    <Input
                      name="emt_template_content_am"
                      type="textarea"
                      placeholder={t("emt_template_content_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emt_template_content_am || ""}
                      invalid={
                        validation.touched.emt_template_content_am &&
                        validation.errors.emt_template_content_am
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.emt_template_content_am &&
                    validation.errors.emt_template_content_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emt_template_content_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emt_template_content_en")}</Label>
                    <Input
                      name="emt_template_content_en"
                      type="textarea"
                      placeholder={t("emt_template_content_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emt_template_content_en || ""}
                      invalid={
                        validation.touched.emt_template_content_en &&
                        validation.errors.emt_template_content_en
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.emt_template_content_en &&
                    validation.errors.emt_template_content_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emt_template_content_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emt_description")}</Label>
                    <Input
                      name="emt_description"
                      type="textarea"
                      placeholder={t("emt_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emt_description || ""}
                      invalid={
                        validation.touched.emt_description &&
                        validation.errors.emt_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emt_description &&
                    validation.errors.emt_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emt_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addEmailTemplate.isPending ||
                      updateEmailTemplate.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addEmailTemplate.isPending ||
                            updateEmailTemplate.isPending ||
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
                            addEmailTemplate.isPending ||
                            updateEmailTemplate.isPending ||
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
      <ToastContainer />
    </React.Fragment>
  );
};
EmailTemplateModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default EmailTemplateModel;
