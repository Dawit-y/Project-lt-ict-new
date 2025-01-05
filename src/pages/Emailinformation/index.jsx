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
  useFetchEmailInformations,
  useSearchEmailInformations,
  useAddEmailInformation,
  useDeleteEmailInformation,
  useUpdateEmailInformation,
} from "../../queries/emailinformation_query";
import EmailInformationModal from "./EmailInformationModal";
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
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const EmailInformationModel = () => {
  //meta title
  document.title = " EmailInformation";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [emailInformation, setEmailInformation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchEmailInformations();
  const addEmailInformation = useAddEmailInformation();
  const updateEmailInformation = useUpdateEmailInformation();
  const deleteEmailInformation = useDeleteEmailInformation();
  //START CRUD
  const handleAddEmailInformation = async (data) => {
    try {
      await addEmailInformation.mutateAsync(data);
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
  const handleUpdateEmailInformation = async (data) => {
    try {
      await updateEmailInformation.mutateAsync(data);
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
  const handleDeleteEmailInformation = async () => {
    if (emailInformation && emailInformation.emi_id) {
      try {
        const id = emailInformation.emi_id;
        await deleteEmailInformation.mutateAsync(id);
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
      emi_email_template_id:
        (emailInformation && emailInformation.emi_email_template_id) || "",
      emi_sent_to: (emailInformation && emailInformation.emi_sent_to) || "",
      emi_sent_date: (emailInformation && emailInformation.emi_sent_date) || "",
      emi_email_content:
        (emailInformation && emailInformation.emi_email_content) || "",
      emi_description:
        (emailInformation && emailInformation.emi_description) || "",
      emi_status: (emailInformation && emailInformation.emi_status) || "",

      is_deletable: (emailInformation && emailInformation.is_deletable) || 1,
      is_editable: (emailInformation && emailInformation.is_editable) || 1,
    },
    validationSchema: Yup.object({
      emi_email_template_id: Yup.string().required(t("emi_email_template_id")),
      emi_sent_to: Yup.string().required(t("emi_sent_to")),
      emi_sent_date: Yup.string().required(t("emi_sent_date")),
      emi_email_content: Yup.string().required(t("emi_email_content")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateEmailInformation = {
          emi_id: emailInformation?.emi_id,
          emi_email_template_id: values.emi_email_template_id,
          emi_sent_to: values.emi_sent_to,
          emi_sent_date: values.emi_sent_date,
          emi_email_content: values.emi_email_content,
          emi_description: values.emi_description,
          emi_status: values.emi_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update EmailInformation
        handleUpdateEmailInformation(updateEmailInformation);
      } else {
        const newEmailInformation = {
          emi_email_template_id: values.emi_email_template_id,
          emi_sent_to: values.emi_sent_to,
          emi_sent_date: values.emi_sent_date,
          emi_email_content: values.emi_email_content,
          emi_description: values.emi_description,
          emi_status: values.emi_status,
        };
        // save new EmailInformation
        handleAddEmailInformation(newEmailInformation);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch EmailInformation on component mount
  useEffect(() => {
    setEmailInformation(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setEmailInformation(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setEmailInformation(null);
    } else {
      setModal(true);
    }
  };

  const handleEmailInformationClick = (arg) => {
    const emailInformation = arg;
    // console.log("handleEmailInformationClick", emailInformation);
    setEmailInformation({
      emi_id: emailInformation.emi_id,
      emi_email_template_id: emailInformation.emi_email_template_id,
      emi_sent_to: emailInformation.emi_sent_to,
      emi_sent_date: emailInformation.emi_sent_date,
      emi_email_content: emailInformation.emi_email_content,
      emi_description: emailInformation.emi_description,
      emi_status: emailInformation.emi_status,

      is_deletable: emailInformation.is_deletable,
      is_editable: emailInformation.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (emailInformation) => {
    setEmailInformation(emailInformation);
    setDeleteModal(true);
  };

  const handleEmailInformationClicks = () => {
    setIsEdit(false);
    setEmailInformation("");
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
        accessorKey: "emi_email_template_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emi_email_template_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emi_sent_to",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emi_sent_to, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emi_sent_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emi_sent_date, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emi_email_content",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emi_email_content, 30) ||
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
    return baseColumns;
  }, [handleEmailInformationClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <EmailInformationModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEmailInformation}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteEmailInformation.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("email_information")}
            breadcrumbItem={t("email_information")}
          />
          <AdvancedSearch
            searchHook={useSearchEmailInformations}
            textSearchKeys={["emi_sent_to"]}
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
                      isAddButton={false}
                      isCustomPageSize={true}
                      handleUserClick={handleEmailInformationClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("email_information")}
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
                ? t("edit") + " " + t("email_information")
                : t("add") + " " + t("email_information")}
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
                    <Label>{t("emi_email_template_id")}</Label>
                    <Input
                      name="emi_email_template_id"
                      type="text"
                      placeholder={t("emi_email_template_id")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emi_email_template_id || ""}
                      invalid={
                        validation.touched.emi_email_template_id &&
                        validation.errors.emi_email_template_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emi_email_template_id &&
                    validation.errors.emi_email_template_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emi_email_template_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emi_sent_to")}</Label>
                    <Input
                      name="emi_sent_to"
                      type="text"
                      placeholder={t("emi_sent_to")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emi_sent_to || ""}
                      invalid={
                        validation.touched.emi_sent_to &&
                        validation.errors.emi_sent_to
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emi_sent_to &&
                    validation.errors.emi_sent_to ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emi_sent_to}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emi_sent_date")}</Label>
                    <Input
                      name="emi_sent_date"
                      type="text"
                      placeholder={t("emi_sent_date")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emi_sent_date || ""}
                      invalid={
                        validation.touched.emi_sent_date &&
                        validation.errors.emi_sent_date
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emi_sent_date &&
                    validation.errors.emi_sent_date ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emi_sent_date}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emi_email_content")}</Label>
                    <Input
                      name="emi_email_content"
                      type="textarea"
                      placeholder={t("emi_email_content")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emi_email_content || ""}
                      invalid={
                        validation.touched.emi_email_content &&
                        validation.errors.emi_email_content
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emi_email_content &&
                    validation.errors.emi_email_content ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emi_email_content}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emi_description")}</Label>
                    <Input
                      name="emi_description"
                      type="textarea"
                      placeholder={t("emi_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emi_description || ""}
                      invalid={
                        validation.touched.emi_description &&
                        validation.errors.emi_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emi_description &&
                    validation.errors.emi_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emi_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addEmailInformation.isPending ||
                      updateEmailInformation.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addEmailInformation.isPending ||
                            updateEmailInformation.isPending ||
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
                            addEmailInformation.isPending ||
                            updateEmailInformation.isPending ||
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
EmailInformationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default EmailInformationModel;
