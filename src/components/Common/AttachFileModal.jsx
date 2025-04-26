import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import FileUploadField from "./FileUploadField";
import DeleteModal from "./DeleteModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  useAddProjectDocument,
  useUpdateProjectDocument,
  useDeleteProjectDocument,
  useFetchProjectDocuments,
} from "../../queries/projectdocument_query";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Col,
  Row,
  Button,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import { toast } from "react-toastify";
import TableContainer from "./TableContainer";
import Spinners from "./Spinner";
import FetchErrorHandler from "./FetchErrorHandler";
import ProjectDocumentModal from "../../pages/Projectdocument/ProjectDocumentModal";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const formatFileSize = (bytes) => {
  if (isNaN(bytes) || bytes < 0) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const AttachFileModal = ({
  isOpen,
  toggle,
  ownerTypeId,
  ownerId,
  projectId,
}) => {
  const [projectDocument, setProjectDocument] = useState(null);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const param = {
    project_id: projectId,
    prd_owner_type_id: ownerTypeId,
    prd_owner_id: ownerId,
  };
  const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
    param,
    isOpen
  );
  const addProjectDocument = useAddProjectDocument();
  const updateProjectDocument = useUpdateProjectDocument();
  const deleteProjectDocument = useDeleteProjectDocument();

  const { t } = useTranslation();

  const handleAddProjectDocument = async (data) => {
    try {
      await addProjectDocument.mutateAsync(data);
      toast.success(`Data added successfully`, {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error("Failed to add data", {
        autoClose: 2000,
      });
    }
    toggleForm();
  };

  const handleUpdateProjectDocument = async (data) => {
    try {
      await updateProjectDocument.mutateAsync(data);
      toast.success(`data updated successfully`, {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(`Failed to update Data`, {
        autoClose: 2000,
      });
    }
    toggleForm();
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      prd_project_id: projectId,
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
      prd_file: !isEdit && Yup.string().required(t("prd_file")),
      prd_document_type_id: Yup.string().required(t("prd_document_type_id")),
      prd_name: Yup.string().required(t("prd_name")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectDocument = {
          prd_id: projectDocument && projectDocument?.prd_id,
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
      } else {
        const newProjectDocument = {
          prd_project_id: projectId,
          prd_owner_type_id: ownerTypeId,
          prd_owner_id: ownerId,
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
      }
    },
  });

  const [modal1, setModal1] = useState(false);
  const [details, setDetails] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  const toggleForm = () => {
    if (modal) {
      setModal(false);
      setProjectDocument(null);
    } else {
      setModal(true);
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectDocument) => {
    setProjectDocument(projectDocument);
    setDeleteModal(true);
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
    toggleForm();
  };

  const handleProjectDocumentClicks = () => {
    setIsEdit(false);
    setProjectDocument("");
    toggleForm();
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
            <span>
              {formatFileSize(cellProps.row.original.prd_size) || "-"}
            </span>
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
              {`${cellProps.row.original.prd_create_time}`.split("T")[0]}
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
                toggleViewModal();
                setDetails(cellProps.row.original);
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
  }, [handleProjectDocumentClick, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <>
      <ProjectDocumentModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={details}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectDocument}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectDocument.isPending}
      />
      <Modal
        isOpen={isOpen}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="modal-xl"
        tabIndex="-1"
        toggle={toggle}
      >
        <div className="modal-xl">
          <ModalHeader toggle={toggle}>{t("attach_files")}</ModalHeader>
          <ModalBody>
            {isLoading ? (
              <Spinners />
            ) : (
              <TableContainer
                columns={columns}
                data={data?.data || []}
                isGlobalFilter={true}
                isAddButton={true}
                isCustomPageSize={true}
                handleUserClick={handleProjectDocumentClicks}
                isPagination={true}
                SearchPlaceholder={t("filter_placeholder")}
                buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                buttonName={t("add")}
                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                theadClass="table-light"
                pagination="pagination"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                divClassName="-"
              />
            )}
            <Modal isOpen={modal} toggle={toggleForm} className="modal-xl">
              <ModalHeader toggle={toggleForm} tag="h4">
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
                              <Spinner
                                size={"sm"}
                                color="light"
                                className="me-2"
                              />
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
          </ModalBody>
        </div>
      </Modal>
    </>
  );
};

export default AttachFileModal;
