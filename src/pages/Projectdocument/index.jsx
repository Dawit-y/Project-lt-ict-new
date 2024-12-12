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
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import Dropzone from "react-dropzone";

import {
  getProjectDocument as onGetProjectDocument,
  addProjectDocument as onAddProjectDocument,
  updateProjectDocument as onUpdateProjectDocument,
  deleteProjectDocument as onDeleteProjectDocument,
} from "../../store/projectdocument/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ProjectDocumentModal from "./ProjectDocumentModal";
import { useTranslation } from "react-i18next";
import "../../App.css";

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
  CardSubtitle,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectDocumentModel = (props) => {
  // get passed data from the right of canva
  const { passedId } = props;

  //meta title
  document.title = " ProjectDocument";

  const { t } = useTranslation();
  // add new file
  const [file, setFile] = useState(null);

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [projectDocument, setProjectDocument] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);

  /**
   * Handles accepted files from the Dropzone
   */
  function handleAcceptedFiles(files) {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(updatedFiles);
  }

  /**
   * Formats file sizes into readable format
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Get the file size in bytes
      const fileSizeInBytes = file.size;

      // Convert the size to KB or MB (here, it’s converted to KB)
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2); // Convert to KB

      //Update form values with the file path, extension, and size
      validation.setFieldValue("prd_file_path", file.name);
      validation.setFieldValue(
        "prd_file_extension",
        file.name.split(".").pop()
      );
      validation.setFieldValue("prd_size", `${fileSizeInKB} KB`); // Set the size in KB
    }
  };

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}document_type/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.pdt_doc_name_or.toString(),
          value: item.pdt_id.toString(),
        }));
        const optionsWithDefault = [
          { label: "Select Document type", value: "" },
          ...transformedData,
        ];
        setDocumentTypeOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching Document Type:", error);
      }
    };
    fetchDocumentType();
  }, []);
  const handleDocumentTypeChange = (e) => {
    setSelectedDocumentType(e.target.value);
    validation.setFieldValue("prd_document_type_id", e.target.value);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      prd_project_id: passedId,
      prd_file: file,
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
      // prd_file:Yup.string().required(t('prd_file')),
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
        dispatch(onUpdateProjectDocument(updateProjectDocument));
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
        dispatch(onAddProjectDocument(newProjectDocument));

        validation.resetForm();
        // Reset the form
        setFile(null);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch ProjectDocument on component mount
  useEffect(() => {
    dispatch(onGetProjectDocument(passedId));
  }, [dispatch]);

  const projectDocumentProperties = createSelector(
    (state) => state.ProjectDocumentR, // this is geting from  reducer
    (ProjectDocumentReducer) => ({
      // this is from Project.reducer
      projectDocument: ProjectDocumentReducer.projectDocument,
      loading: ProjectDocumentReducer.loading,
      update_loading: ProjectDocumentReducer.update_loading,
    })
  );

  const {
    projectDocument: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectDocumentProperties);

  useEffect(() => {
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

  const handleDeleteProjectDocument = () => {
    if (projectDocument && projectDocument.prd_id) {
      dispatch(onDeleteProjectDocument(projectDocument.prd_id));
      setDeleteModal(false);
    }
  };
  const handleProjectDocumentClicks = () => {
    setIsEdit(false);
    setProjectDocument("");
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
                    handleProjectDocumentClick(data);
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
  }, [handleProjectDocumentClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
          <Spinners setLoading={setLoading} />
        ) : (
          <TableContainer
            columns={columns}
            data={showSearchResults ? results : data}
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
                const modalCallback = () => setModal(false);
                if (isEdit) {
                  onUpdateProjectDocument(validation.values, modalCallback);
                } else {
                  onAddProjectDocument(validation.values, modalCallback);
                }
                return false;
              }}
            >
              <Row>
                {/* Document Type (Unchanged) */}
                <Col className="col-md-4 mb-3">
                  <Label>
                    {t("prd_document_type_id")}{" "}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="prd_document_type_id"
                    id="prd_document_type_id"
                    type="select"
                    className="form-select"
                    onChange={handleDocumentTypeChange}
                    onBlur={validation.handleBlur}
                    value={selectedDocumentType}
                  >
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(`${option.label}`)}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.prd_document_type_id &&
                  validation.errors.prd_document_type_id ? (
                    <FormFeedback type="invalid">
                      {validation.errors.prd_document_type_id}
                    </FormFeedback>
                  ) : null}
                </Col>

                {/* Name */}
                <Col className="col-md-4 mb-3">
                  <Label>
                    {t("prd_name")} <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="prd_name"
                    type="text"
                    placeholder={t("prd_name")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.prd_name || ""}
                    invalid={
                      validation.touched.prd_name && validation.errors.prd_name
                        ? true
                        : false
                    }
                    maxLength={20}
                  />
                  {validation.touched.prd_name && validation.errors.prd_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.prd_name}
                    </FormFeedback>
                  ) : null}
                </Col>
                {/* document status */}

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

                <Col className="col-md-4 mb-3">
                  <Label>{t("prd_description")}</Label>
                  <Input
                    name="prd_description"
                    type="text"
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

                {/* PDF File Picker */}

                <Row>
                  <Col className="col-12">
                    <Card>
                      <CardBody>
                        <CardSubtitle className="mb-3">
                          Attach or upload your PDF file here!
                        </CardSubtitle>
                        <Form>
                          <Dropzone
                            accept={{ "application/pdf": [] }} // Only allow PDF files
                            onDrop={(acceptedFiles, rejectedFiles) => {
                              const maxSize = 5 * 1024 * 1024; // 5 MB limit

                              // Filter out files larger than the max size
                              const validFiles = acceptedFiles.filter(
                                (file) => file.size <= maxSize
                              );
                              const oversizedFiles = acceptedFiles.filter(
                                (file) => file.size > maxSize
                              );

                              // Handle oversized files
                              if (oversizedFiles.length > 0) {
                                const oversizedFileNames = oversizedFiles
                                  .map((file) => file.name)
                                  .join(", ");
                                alert(
                                  `The following files exceed the 5 MB size limit and were rejected: ${oversizedFileNames}`
                                );
                              }

                              // Handle rejected files (non-PDFs)
                              if (rejectedFiles.length > 0) {
                                const invalidFiles = rejectedFiles
                                  .map((file) => file.file.name)
                                  .join(", ");
                                alert(
                                  `These files are not PDFs and were rejected: ${invalidFiles}`
                                );
                              }

                              // Proceed only with valid files that are PDFs and within size limit
                              if (validFiles.length > 0) {
                                handleAcceptedFiles(validFiles);

                                // Create a synthetic event for handleFileChange
                                const syntheticEvent = {
                                  target: {
                                    files: validFiles,
                                    name: "prd_file", // Pass the name of the file input
                                  },
                                };

                                handleFileChange(syntheticEvent); // Call handleFileChange with the synthetic event
                              }
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div className="dropzone">
                                <div
                                  className="dz-message needsclick mt-2"
                                  {...getRootProps()}
                                >
                                  <input
                                    {...getInputProps({ name: "prd_file" })}
                                  />
                                  <div className="mb-3">
                                    <i className="display-4 text-muted bx bxs-cloud-upload" />
                                  </div>
                                  <h4>
                                    Drop PDF files here or click to upload (Max
                                    size: 5 MB).
                                  </h4>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          <div
                            className="dropzone-previews mt-3"
                            id="file-previews"
                          >
                            {selectedFiles.map((f, i) => (
                              <Card
                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                key={i + "-file"}
                              >
                                <div className="p-2">
                                  <Row className="align-items-center">
                                    <Col className="col-auto">
                                      <i
                                        className="bx bxs-file-pdf text-danger"
                                        style={{ fontSize: "80px" }}
                                      />
                                    </Col>
                                    <Col>
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
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
