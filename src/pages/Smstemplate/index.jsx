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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchSmsTemplates,
  useSearchSmsTemplates,
  useAddSmsTemplate,
  useDeleteSmsTemplate,
  useUpdateSmsTemplate,
} from "../../queries/smstemplate_query";
import SmsTemplateModal from "./SmsTemplateModal";
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
const SmsTemplateModel = () => {
  //meta title
  document.title = " SmsTemplate";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchSmsTemplates();
  const addSmsTemplate = useAddSmsTemplate();
  const updateSmsTemplate = useUpdateSmsTemplate();
  const deleteSmsTemplate = useDeleteSmsTemplate();
  //START CRUD
  const handleAddSmsTemplate = async (data) => {
    try {
      await addSmsTemplate.mutateAsync(data);
      toast.success(t("add_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
				autoClose: 3000,
			});
    }
    toggle();
  };
  const handleUpdateSmsTemplate = async (data) => {
    try {
      await updateSmsTemplate.mutateAsync(data);
      toast.success(t("update_success"), {
				autoClose: 3000,
			});
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
				autoClose: 3000,
			});
    }
    toggle();
  };
  const handleDeleteSmsTemplate = async () => {
    if (smsTemplate && smsTemplate.smt_id) {
      try {
        const id = smsTemplate.smt_id;
        await deleteSmsTemplate.mutateAsync(id);
        toast.success(t("delete_success"), {
					autoClose: 3000,
				});
      } catch (error) {
        toast.success(t("delete_failure"), {
					autoClose: 3000,
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
      smt_template_name: (smsTemplate && smsTemplate.smt_template_name) || "",
      smt_template_content:
        (smsTemplate && smsTemplate.smt_template_content) || "",
      smt_template_content_am:
        (smsTemplate && smsTemplate.smt_template_content_am) || "",
      smt_template_content_en:
        (smsTemplate && smsTemplate.smt_template_content_en) || "",
      smt_description: (smsTemplate && smsTemplate.smt_description) || "",
      smt_status: (smsTemplate && smsTemplate.smt_status) || "",

      is_deletable: (smsTemplate && smsTemplate.is_deletable) || 1,
      is_editable: (smsTemplate && smsTemplate.is_editable) || 1,
    },
    validationSchema: Yup.object({
      smt_template_name: alphanumericValidation(3, 200, true),
      smt_template_content: alphanumericValidation(10, 200, true),
      smt_template_content_en: alphanumericValidation(10, 200, false),
      //smt_template_content_am: alphanumericValidation(50, 200, false),
      smt_description: alphanumericValidation(3, 200, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateSmsTemplate = {
          smt_id: smsTemplate?.smt_id,
          smt_template_name: values.smt_template_name,
          smt_template_content: values.smt_template_content,
          smt_template_content_am: values.smt_template_content_am,
          smt_template_content_en: values.smt_template_content_en,
          smt_description: values.smt_description,
          smt_status: values.smt_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update SmsTemplate
        handleUpdateSmsTemplate(updateSmsTemplate);
      } else {
        const newSmsTemplate = {
          smt_template_name: values.smt_template_name,
          smt_template_content: values.smt_template_content,
          smt_template_content_am: values.smt_template_content_am,
          smt_template_content_en: values.smt_template_content_en,
          smt_description: values.smt_description,
          smt_status: values.smt_status,
        };
        // save new SmsTemplate
        handleAddSmsTemplate(newSmsTemplate);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch SmsTemplate on component mount
  useEffect(() => {
    setSmsTemplate(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setSmsTemplate(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setSmsTemplate(null);
    } else {
      setModal(true);
    }
  };

  const handleSmsTemplateClick = (arg) => {
    const smsTemplate = arg;
    // console.log("handleSmsTemplateClick", smsTemplate);
    setSmsTemplate({
      smt_id: smsTemplate.smt_id,
      smt_template_name: smsTemplate.smt_template_name,
      smt_template_content: smsTemplate.smt_template_content,
      smt_template_content_am: smsTemplate.smt_template_content_am,
      smt_template_content_en: smsTemplate.smt_template_content_en,
      smt_description: smsTemplate.smt_description,
      smt_status: smsTemplate.smt_status,

      is_deletable: smsTemplate.is_deletable,
      is_editable: smsTemplate.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (smsTemplate) => {
    setSmsTemplate(smsTemplate);
    setDeleteModal(true);
  };

  const handleSmsTemplateClicks = () => {
    setIsEdit(false);
    setSmsTemplate("");
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
        accessorKey: "smt_template_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smt_template_name, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "smt_template_content",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smt_template_content, 30) ||
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
                    handleSmsTemplateClick(data);
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
  }, [handleSmsTemplateClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <SmsTemplateModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSmsTemplate}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteSmsTemplate.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("sms_template")}
            breadcrumbItem={t("sms_template")}
          />
          <AdvancedSearch
            searchHook={useSearchSmsTemplates}
            textSearchKeys={["smt_template_name"]}
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
                      handleUserClick={handleSmsTemplateClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("sms_template")}
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
                ? t("edit") + " " + t("sms_template")
                : t("add") + " " + t("sms_template")}
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
                    <Label>{t("smt_template_name")}</Label>
                    <Input
                      name="smt_template_name"
                      type="text"
                      placeholder={t("smt_template_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smt_template_name || ""}
                      invalid={
                        validation.touched.smt_template_name &&
                        validation.errors.smt_template_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smt_template_name &&
                    validation.errors.smt_template_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smt_template_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smt_template_content")}</Label>
                    <Input
                      name="smt_template_content"
                      type="textarea"
                      placeholder={t("smt_template_content")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smt_template_content || ""}
                      invalid={
                        validation.touched.smt_template_content &&
                        validation.errors.smt_template_content
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.smt_template_content &&
                    validation.errors.smt_template_content ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smt_template_content}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smt_template_content_am")}</Label>
                    <Input
                      name="smt_template_content_am"
                      type="textarea"
                      placeholder={t("smt_template_content_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smt_template_content_am || ""}
                      invalid={
                        validation.touched.smt_template_content_am &&
                        validation.errors.smt_template_content_am
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.smt_template_content_am &&
                    validation.errors.smt_template_content_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smt_template_content_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smt_template_content_en")}</Label>
                    <Input
                      name="smt_template_content_en"
                      type="textarea"
                      placeholder={t("smt_template_content_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smt_template_content_en || ""}
                      invalid={
                        validation.touched.smt_template_content_en &&
                        validation.errors.smt_template_content_en
                          ? true
                          : false
                      }
                      maxLength={200}
                    />
                    {validation.touched.smt_template_content_en &&
                    validation.errors.smt_template_content_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smt_template_content_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smt_description")}</Label>
                    <Input
                      name="smt_description"
                      type="textarea"
                      placeholder={t("smt_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smt_description || ""}
                      invalid={
                        validation.touched.smt_description &&
                        validation.errors.smt_description
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.smt_description &&
                    validation.errors.smt_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smt_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addSmsTemplate.isPending ||
                      updateSmsTemplate.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addSmsTemplate.isPending ||
                            updateSmsTemplate.isPending ||
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
                            addSmsTemplate.isPending ||
                            updateSmsTemplate.isPending ||
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
SmsTemplateModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default SmsTemplateModel;
