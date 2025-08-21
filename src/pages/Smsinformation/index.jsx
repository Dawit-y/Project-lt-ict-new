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
  useFetchSmsInformations,
  useSearchSmsInformations,
  useAddSmsInformation,
  useDeleteSmsInformation,
  useUpdateSmsInformation,
} from "../../queries/smsinformation_query";
import SmsInformationModal from "./SmsInformationModal";
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
const SmsInformationModel = () => {
  //meta title
  document.title = " SmsInformation";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [smsInformation, setSmsInformation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchSmsInformations();
  const addSmsInformation = useAddSmsInformation();
  const updateSmsInformation = useUpdateSmsInformation();
  const deleteSmsInformation = useDeleteSmsInformation();
  //START CRUD
  const handleAddSmsInformation = async (data) => {
    try {
      await addSmsInformation.mutateAsync(data);
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
  const handleUpdateSmsInformation = async (data) => {
    try {
      await updateSmsInformation.mutateAsync(data);
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
  const handleDeleteSmsInformation = async () => {
    if (smsInformation && smsInformation.smi_id) {
      try {
        const id = smsInformation.smi_id;
        await deleteSmsInformation.mutateAsync(id);
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
      smi_sms_template_id:
        (smsInformation && smsInformation.smi_sms_template_id) || "",
      smi_sent_to: (smsInformation && smsInformation.smi_sent_to) || "",
      smi_sent_date: (smsInformation && smsInformation.smi_sent_date) || "",
      smi_sms_content: (smsInformation && smsInformation.smi_sms_content) || "",
      smi_description: (smsInformation && smsInformation.smi_description) || "",
      smi_status: (smsInformation && smsInformation.smi_status) || "",

      is_deletable: (smsInformation && smsInformation.is_deletable) || 1,
      is_editable: (smsInformation && smsInformation.is_editable) || 1,
    },
    validationSchema: Yup.object({
      smi_sms_template_id: Yup.string().required(t("smi_sms_template_id")),
      smi_sent_to: Yup.string().required(t("smi_sent_to")),
      smi_sent_date: Yup.string().required(t("smi_sent_date")),
      smi_sms_content: Yup.string().required(t("smi_sms_content")),
      smi_description: Yup.string().required(t("smi_description")),
      smi_status: Yup.string().required(t("smi_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateSmsInformation = {
          smi_id: smsInformation?.smi_id,
          smi_sms_template_id: values.smi_sms_template_id,
          smi_sent_to: values.smi_sent_to,
          smi_sent_date: values.smi_sent_date,
          smi_sms_content: values.smi_sms_content,
          smi_description: values.smi_description,
          smi_status: values.smi_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update SmsInformation
        handleUpdateSmsInformation(updateSmsInformation);
      } else {
        const newSmsInformation = {
          smi_sms_template_id: values.smi_sms_template_id,
          smi_sent_to: values.smi_sent_to,
          smi_sent_date: values.smi_sent_date,
          smi_sms_content: values.smi_sms_content,
          smi_description: values.smi_description,
          smi_status: values.smi_status,
        };
        // save new SmsInformation
        handleAddSmsInformation(newSmsInformation);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch SmsInformation on component mount
  useEffect(() => {
    setSmsInformation(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setSmsInformation(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setSmsInformation(null);
    } else {
      setModal(true);
    }
  };

  const handleSmsInformationClick = (arg) => {
    const smsInformation = arg;
    // console.log("handleSmsInformationClick", smsInformation);
    setSmsInformation({
      smi_id: smsInformation.smi_id,
      smi_sms_template_id: smsInformation.smi_sms_template_id,
      smi_sent_to: smsInformation.smi_sent_to,
      smi_sent_date: smsInformation.smi_sent_date,
      smi_sms_content: smsInformation.smi_sms_content,
      smi_description: smsInformation.smi_description,
      smi_status: smsInformation.smi_status,

      is_deletable: smsInformation.is_deletable,
      is_editable: smsInformation.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (smsInformation) => {
    setSmsInformation(smsInformation);
    setDeleteModal(true);
  };

  const handleSmsInformationClicks = () => {
    setIsEdit(false);
    setSmsInformation("");
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
        accessorKey: "smi_sms_template_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smi_sms_template_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "smi_sent_to",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smi_sent_to, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "smi_sent_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smi_sent_date, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "smi_sms_content",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smi_sms_content, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "smi_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.smi_status, 30) || "-"}
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
  }, [handleSmsInformationClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
      <SmsInformationModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSmsInformation}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteSmsInformation.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("sms_information")}
            breadcrumbItem={t("sms_information")}
          />
          <AdvancedSearch
            searchHook={useSearchSmsInformations}
            textSearchKeys={["smi_sent_to"]}
            dropdownSearchKeys={[]}
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
                      handleUserClick={handleSmsInformationClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("sms_information")}
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
                ? t("edit") + " " + t("sms_information")
                : t("add") + " " + t("sms_information")}
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
                    <Label>{t("smi_sms_template_id")}</Label>
                    <Input
                      name="smi_sms_template_id"
                      type="text"
                      placeholder={t("smi_sms_template_id")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_sms_template_id || ""}
                      invalid={
                        validation.touched.smi_sms_template_id &&
                        validation.errors.smi_sms_template_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_sms_template_id &&
                    validation.errors.smi_sms_template_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_sms_template_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smi_sent_to")}</Label>
                    <Input
                      name="smi_sent_to"
                      type="text"
                      placeholder={t("smi_sent_to")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_sent_to || ""}
                      invalid={
                        validation.touched.smi_sent_to &&
                        validation.errors.smi_sent_to
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_sent_to &&
                    validation.errors.smi_sent_to ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_sent_to}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smi_sent_date")}</Label>
                    <Input
                      name="smi_sent_date"
                      type="text"
                      placeholder={t("smi_sent_date")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_sent_date || ""}
                      invalid={
                        validation.touched.smi_sent_date &&
                        validation.errors.smi_sent_date
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_sent_date &&
                    validation.errors.smi_sent_date ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_sent_date}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smi_sms_content")}</Label>
                    <Input
                      name="smi_sms_content"
                      type="text"
                      placeholder={t("smi_sms_content")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_sms_content || ""}
                      invalid={
                        validation.touched.smi_sms_content &&
                        validation.errors.smi_sms_content
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_sms_content &&
                    validation.errors.smi_sms_content ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_sms_content}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smi_description")}</Label>
                    <Input
                      name="smi_description"
                      type="text"
                      placeholder={t("smi_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_description || ""}
                      invalid={
                        validation.touched.smi_description &&
                        validation.errors.smi_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_description &&
                    validation.errors.smi_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("smi_status")}</Label>
                    <Input
                      name="smi_status"
                      type="text"
                      placeholder={t("smi_status")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.smi_status || ""}
                      invalid={
                        validation.touched.smi_status &&
                        validation.errors.smi_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.smi_status &&
                    validation.errors.smi_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.smi_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addSmsInformation.isPending ||
                      updateSmsInformation.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addSmsInformation.isPending ||
                            updateSmsInformation.isPending ||
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
                            addSmsInformation.isPending ||
                            updateSmsInformation.isPending ||
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
SmsInformationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default SmsInformationModel;
