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
  useFetchDocumentTypes,
  useSearchDocumentTypes,
  useAddDocumentType,
  useDeleteDocumentType,
  useUpdateDocumentType,
} from "../../queries/documenttype_query";
import DocumentTypeModal from "./DocumentTypeModal";
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

const DocumentTypeModel = () => {
  //meta title
  document.title = " DocumentType";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [documentType, setDocumentType] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchDocumentTypes();

  const addDocumentType = useAddDocumentType();
  const updateDocumentType = useUpdateDocumentType();
  const deleteDocumentType = useDeleteDocumentType();
  //START CRUD
  const handleAddDocumentType = async (data) => {
    try {
      await addDocumentType.mutateAsync(data);
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

  const handleUpdateDocumentType = async (data) => {
    try {
      await updateDocumentType.mutateAsync(data);
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
  const handleDeleteDocumentType = async () => {
    if (documentType && documentType.pdt_id) {
      try {
        const id = documentType.pdt_id;
        await deleteDocumentType.mutateAsync(id);
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
      pdt_doc_name_or: (documentType && documentType.pdt_doc_name_or) || "",
      pdt_doc_name_am: (documentType && documentType.pdt_doc_name_am) || "",
      pdt_doc_name_en: (documentType && documentType.pdt_doc_name_en) || "",
      pdt_code: (documentType && documentType.pdt_code) || "",
      pdt_description: (documentType && documentType.pdt_description) || "",
      pdt_status: (documentType && documentType.pdt_status) || "",

      is_deletable: (documentType && documentType.is_deletable) || 1,
      is_editable: (documentType && documentType.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pdt_doc_name_or: Yup.string()
        .required(t("pdt_doc_name_or"))
        .test("unique-pdt_doc_name_or", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.pdt_doc_name_or == value &&
              item.pdt_id !== documentType?.pdt_id
          );
        }),
      pdt_doc_name_am: Yup.string().required(t("pdt_doc_name_am")),
      pdt_doc_name_en: Yup.string().required(t("pdt_doc_name_en")),
      pdt_code: Yup.string().required(t("pdt_code")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateDocumentType = {
          pdt_id: documentType?.pdt_id,
          pdt_doc_name_or: values.pdt_doc_name_or,
          pdt_doc_name_am: values.pdt_doc_name_am,
          pdt_doc_name_en: values.pdt_doc_name_en,
          pdt_code: values.pdt_code,
          pdt_description: values.pdt_description,
          pdt_status: values.pdt_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update DocumentType
        handleUpdateDocumentType(updateDocumentType);
        validation.resetForm();
      } else {
        const newDocumentType = {
          pdt_doc_name_or: values.pdt_doc_name_or,
          pdt_doc_name_am: values.pdt_doc_name_am,
          pdt_doc_name_en: values.pdt_doc_name_en,
          pdt_code: values.pdt_code,
          pdt_description: values.pdt_description,
          pdt_status: values.pdt_status,
        };
        // save new DocumentType
        handleAddDocumentType(newDocumentType);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch DocumentType on component mount
  useEffect(() => {
    setDocumentType(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setDocumentType(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setDocumentType(null);
    } else {
      setModal(true);
    }
  };

  const handleDocumentTypeClick = (arg) => {
    const documentType = arg;
    // console.log("handleDocumentTypeClick", documentType);
    setDocumentType({
      pdt_id: documentType.pdt_id,
      pdt_doc_name_or: documentType.pdt_doc_name_or,
      pdt_doc_name_am: documentType.pdt_doc_name_am,
      pdt_doc_name_en: documentType.pdt_doc_name_en,
      pdt_code: documentType.pdt_code,
      pdt_description: documentType.pdt_description,
      pdt_status: documentType.pdt_status,

      is_deletable: documentType.is_deletable,
      is_editable: documentType.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (documentType) => {
    setDocumentType(documentType);
    setDeleteModal(true);
  };

  const handleDocumentTypeClicks = () => {
    setIsEdit(false);
    setDocumentType("");
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
        accessorKey: "pdt_doc_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pdt_doc_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pdt_doc_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pdt_doc_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pdt_doc_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pdt_doc_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pdt_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pdt_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pdt_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pdt_description, 30) || "-"}
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
                    handleDocumentTypeClick(data);
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
  }, [handleDocumentTypeClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <DocumentTypeModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteDocumentType}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteDocumentType.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("document_type")}
            breadcrumbItem={t("document_type")}
          />
          <AdvancedSearch
            searchHook={useSearchDocumentTypes}
            textSearchKeys={["pdt_doc_name_or"]}
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
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleDocumentTypeClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("document_type")}
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
                ? t("edit") + " " + t("document_type")
                : t("add") + " " + t("document_type")}
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
                    <Label>{t("pdt_doc_name_or")}</Label>
                    <Input
                      name="pdt_doc_name_or"
                      type="text"
                      placeholder={t("pdt_doc_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pdt_doc_name_or || ""}
                      invalid={
                        validation.touched.pdt_doc_name_or &&
                        validation.errors.pdt_doc_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pdt_doc_name_or &&
                    validation.errors.pdt_doc_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pdt_doc_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pdt_doc_name_am")}</Label>
                    <Input
                      name="pdt_doc_name_am"
                      type="text"
                      placeholder={t("pdt_doc_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pdt_doc_name_am || ""}
                      invalid={
                        validation.touched.pdt_doc_name_am &&
                        validation.errors.pdt_doc_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pdt_doc_name_am &&
                    validation.errors.pdt_doc_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pdt_doc_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pdt_doc_name_en")}</Label>
                    <Input
                      name="pdt_doc_name_en"
                      type="text"
                      placeholder={t("pdt_doc_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pdt_doc_name_en || ""}
                      invalid={
                        validation.touched.pdt_doc_name_en &&
                        validation.errors.pdt_doc_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pdt_doc_name_en &&
                    validation.errors.pdt_doc_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pdt_doc_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pdt_code")}</Label>
                    <Input
                      name="pdt_code"
                      type="text"
                      placeholder={t("pdt_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pdt_code || ""}
                      invalid={
                        validation.touched.pdt_code &&
                        validation.errors.pdt_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pdt_code &&
                    validation.errors.pdt_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pdt_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pdt_description")}</Label>
                    <Input
                      name="pdt_description"
                      type="textarea"
                      placeholder={t("pdt_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pdt_description || ""}
                      invalid={
                        validation.touched.pdt_description &&
                        validation.errors.pdt_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pdt_description &&
                    validation.errors.pdt_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pdt_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addDocumentType.isPending ||
                      updateDocumentType.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addDocumentType.isPending ||
                            updateDocumentType.isPending ||
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
                            addDocumentType.isPending ||
                            updateDocumentType.isPending ||
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
DocumentTypeModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default DocumentTypeModel;
