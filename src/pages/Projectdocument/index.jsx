import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectDocuments,
  useAddProjectDocument,
  useUpdateProjectDocument,
  useDeleteProjectDocument,
} from "../../queries/projectdocument_query";
import ProjectDocumentModal from "./ProjectDocumentModal";
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
} from "reactstrap";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import FileUploadField from "../../components/Common/FileUploadField";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectDocumentModel = (props) => {
  document.title = " ProjectDocument";
  const { passedId, isActive } = props;
  const param = { project_id: passedId };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [projectDocument, setProjectDocument] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed

  const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
    param,
    isActive
  );
  const addProjectDocument = useAddProjectDocument();
  const updateProjectDocument = useUpdateProjectDocument();
  const deleteProjectDocument = useDeleteProjectDocument();

  const handleAddProjectDocument = async (data) => {
    try {
      await addProjectDocument.mutateAsync(data);
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

  const handleUpdateProjectDocument = async (data) => {
    try {
      await updateProjectDocument.mutateAsync(data);
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
  const handleDeleteProjectDocument = async () => {
    if (projectDocument && projectDocument.prd_id) {
      try {
        const id = projectDocument.prd_id;
        await deleteProjectDocument.mutateAsync(id);
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
  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prd_project_id: passedId,
      prd_file: null,
      prd_name: (projectDocument && projectDocument.prd_name) || "",
      prd_document_type_id:
        (projectDocument && projectDocument.prd_document_type_id) || "",
      prd_file_path: (projectDocument && projectDocument.prd_file_path) || "",

      prd_size: (projectDocument && projectDocument.prd_size) || "",
      prd_file_extension:
        (projectDocument && projectDocument.prd_file_extension) || "",
      prd_uploaded_date:
        (projectDocument && projectDocument.prd_uploaded_date) || "",
      prd_description:
        (projectDocument && projectDocument.prd_description) || "",
      prd_status: (projectDocument && projectDocument.prd_status) || "",

      is_deletable: (projectDocument && projectDocument.is_deletable) || 1,
      is_editable: (projectDocument && projectDocument.is_editable) || 1,
    },

    validationSchema: Yup.object({
      prd_file: Yup.string().required(t("prd_file")),
      prd_document_type_id: Yup.string().required(t("prd_document_type_id")),
      prd_name: Yup.string().required(t("prd_name")),
      // prd_file_path: Yup.string().required(t("prd_file_path")),
      // prd_file_path:Yup.string().required(t("prd_file_path")),
      // prd_size: Yup.string().required(t("prd_size")),
      // prd_file_extension:Yup.string().required(t("prd_file_extension")),

      //prd_description: Yup.string().required(t("prd_description")),
      //prd_status: Yup.string().required(t("prd_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectDocument = {
          prd_id: projectDocument ? projectDocument.prd_id : 0,
          prd_project_id: values.prd_project_id,
          prd_file: values.prd_file,
          prd_name: values.prd_name,
          prd_file_path: values.prd_file_path,
          prd_size: values.prd_size,
          prd_file_extension: values.prd_file_extension,
          prd_uploaded_date: values.prd_uploaded_date,
          prd_description: values.prd_description,
          prd_status: values.prd_status,
          prd_document_type_id: values.prd_document_type_id,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectDocument
        handleUpdateProjectDocument(updateProjectDocument);
        validation.resetForm();
      } else {
        const newProjectDocument = {
          prd_project_id: values.prd_project_id,
          prd_name: values.prd_name,
          prd_file: values.prd_file,
          prd_file_path: values.prd_file_path,
          prd_size: values.prd_size,
          prd_file_extension: values.prd_file_extension,
          prd_uploaded_date: values.prd_uploaded_date,
          prd_description: values.prd_description,
          prd_status: values.prd_status,
          prd_document_type_id: values.prd_document_type_id,
        };
        // save new ProjectDocuments
        handleAddProjectDocument(newProjectDocument);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setProjectDocument(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectDocument(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectDocument(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectDocumentClick = (arg) => {
    const projectDocument = arg;
    setProjectDocument({
      prd_id: projectDocument.prd_id,
      prd_file: projectDocument.prd_file,
      prd_project_id: projectDocument.prd_project_id,
      prd_document_type_id: projectDocument.prd_document_type_id,
      prd_name: projectDocument.prd_name,
      prd_file_path: projectDocument.prd_file_path,
      prd_size: projectDocument.prd_size,
      prd_file_extension: projectDocument.prd_file_extension,
      prd_uploaded_date: projectDocument.prd_uploaded_date,
      prd_description: projectDocument.prd_description,
      prd_status: projectDocument.prd_status,
      is_deletable: projectDocument.is_deletable,
      is_editable: projectDocument.is_editable,
    });

    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (projectDocument) => {
    setProjectDocument(projectDocument);
    setDeleteModal(true);
  };

  const handleProjectDocumentClicks = () => {
    setIsEdit(false);
    setProjectDocument("");
    toggle();
  };

  const bytesToMB = (bytes) => {
    if (isNaN(bytes) || bytes < 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "prd_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prd_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prd_file_path",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prd_file_path, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prd_size",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>{bytesToMB(cellProps.row.original.prd_size) || "-"}</span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prd_file_extension",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prd_file_extension, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prd_uploaded_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prd_uploaded_date, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prd_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prd_description, 30) || "-"}
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
              {(cellProps.row.original?.is_editable ||
                cellProps.row.original?.is_role_editable) && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProjectDocumentClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}

              {(cellProps.row.original?.is_deletable ||
                cellProps.row.original?.is_role_deletable) && (
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
  }, [handleProjectDocumentClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <ProjectDocumentModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectDocument}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectDocument.isPending}
      />

      <div className="container-fluid1">
        {passedId ? null : (
          <Breadcrumbs
            title={t("project_document")}
            breadcrumbItem={t("project_document")}
          />
        )}
        {/* <Breadcrumbs
            title={t("project_document")}
            breadcrumbItem={t("project_document")}
          /> */}
        {isLoading || searchLoading ? (
          <Spinners />
        ) : (
          <TableContainer
            columns={columns}
            data={showSearchResults ? results : data?.data}
            isGlobalFilter={true}
            isAddButton={true}
            isCustomPageSize={true}
            handleUserClick={handleProjectDocumentClicks}
            isPagination={true}
            SearchPlaceholder={t("Results") + "..."}
            buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
            buttonName={t("add") + " " + t("project_document")}
            tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
            theadClass="table-light"
            pagination="pagination"
            paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          />
        )}

        <Modal isOpen={modal} toggle={toggle} className="modal-xl">
          <ModalHeader toggle={toggle} tag="h4">
            {!!isEdit
              ? t("edit") + " " + t("project_document")
              : t("add") + " " + t("project_document")}
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
                {/* PDF File Picker */}
                <FileUploadField validation={validation} />

                <Col className="col-md-6 mb-3" style={{ display: "none" }}>
                  <Label>{t("prd_status")}</Label>
                  <Input
                    name="prd_status"
                    type="select"
                    className="form-select"
                    onChange={(e) => {
                      validation.setFieldValue(
                        "prd_status",
                        Number(e.target.value)
                      );
                    }}
                    onBlur={validation.handleBlur}
                    value={validation.values.prd_status}
                  >
                    <option value={""}>Select status</option>
                    <option value={1}>{t("Active")}</option>
                    <option value={0}>{t("Inactive")}</option>
                  </Input>
                  {validation.touched.prd_status &&
                  validation.errors.prd_status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.prd_status}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col className="col-md-12 mb-3">
                  <Label>{t("prd_description")}</Label>
                  <Input
                    name="prd_description"
                    type="textarea"
                    rows={3}
                    placeholder={t("prd_description")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.prd_description || ""}
                    invalid={
                      validation.touched.prd_description &&
                      validation.errors.prd_description
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.prd_description &&
                  validation.errors.prd_description ? (
                    <FormFeedback type="invalid">
                      {validation.errors.prd_description}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectDocument.isPending ||
                      updateProjectDocument.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectDocument.isPending ||
                            updateProjectDocument.isPending ||
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
                            addProjectDocument.isPending ||
                            updateProjectDocument.isPending ||
                            !validation.dirty
                          }
                        >
                          {t("Save")}
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};
ProjectDocumentModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectDocumentModel;
