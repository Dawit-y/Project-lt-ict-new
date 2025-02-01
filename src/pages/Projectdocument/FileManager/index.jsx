import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../../components/Common/Spinner";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DeleteModal from "../../../components/Common/DeleteModal";
import {
  useFetchProjectDocuments,
  useSearchProjectDocuments,
  useAddProjectDocument,
  useUpdateProjectDocument,
  useDeleteProjectDocument,
} from "../../../queries/projectdocument_query";
import { useFetchDocumentTypes } from "../../../queries/documenttype_query";
import ProjectDocumentModal from "../ProjectDocumentModal";
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
  Container,
} from "reactstrap";
import FetchErrorHandler from "../../../components/Common/FetchErrorHandler";
import FileUploadField from "../../../components/Common/FileUploadField";
import { toast } from "react-toastify";
import FileList from "./FileList";


const Index = (props) => {
  const { passedId, isActive } = props;
  const param = { project_id: passedId };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams, setSearchParams] = useState({ project_id: passedId });

  const [projectDocument, setProjectDocument] = useState(null);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(null);
  const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(
    param,
    isActive
  );
  const { data: searchedDocs, isLoading: isSearchLoading } =
    useSearchProjectDocuments(searchParams);
  const { data: docTypeData } = useFetchDocumentTypes();

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

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
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
      <div className="">
        <Container>
          <div className="d-xl-flex">
            <div className="w-100">
              <div className="d-md-flex">
                {/* FileRightBar */}
                <Card
                  className="filemanager-sidebar me-md-2"
                  style={{ minHeight: "500px" }}
                >
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="mb-4">
                        <div className="mb-3">
                          <Button
                            className="btn btn-light w-100"
                            type="button"
                            onClick={toggle}
                          >
                            <i className="mdi mdi-plus me-1"></i> Create New
                          </Button>
                        </div>
                        <ul className="list-unstyled categories-list">
                          <li>
                            <div
                              className={`${
                                selectedDocumentTypeId === null
                                  ? "border border-info-subtle"
                                  : ""
                              }`}
                            >
                              <Link
                                className="text-body fw-medium py-1 d-flex align-items-center"
                                to="#"
                                onClick={() => {
                                  setSearchParams({ project_id: passedId });
                                  setSelectedDocumentTypeId(null);
                                }} // Reset search params
                              >
                                <i className="mdi mdi-folder font-size-16 text-warning me-2"></i>
                                All Documents
                              </Link>
                            </div>
                          </li>
                          {docTypeData?.data?.map((type) => (
                            <li key={type.pdt_id}>
                              <div
                                className={`${
                                  selectedDocumentTypeId === type.pdt_id
                                    ? "border border-info-subtle"
                                    : ""
                                }`}
                              >
                                <Link
                                  className="text-body fw-medium py-1 d-flex align-items-center"
                                  to="#"
                                  onClick={() => {
                                    setSelectedDocumentTypeId(type.pdt_id);
                                    setSearchParams({
                                      project_id: passedId,
                                      prd_document_type_id: type.pdt_id,
                                    });
                                  }}
                                >
                                  <i className="mdi mdi-folder font-size-16 text-warning me-2"></i>
                                  {type.pdt_doc_name_or}
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Main Content */}
                <div className="w-100 h-100">
                  <Card style={{ minHeight: "500px" }}>
                    <CardBody>
                      {isSearchLoading || isLoading ? (
                        <Spinners />
                      ) : (
                        <FileList
                          files={searchedDocs?.data || data?.data || []}
                          edit={handleProjectDocumentClick}
                          isDeleteLoading={deleteProjectDocument.isPending}
                          handleDeleteProjectDocument={
                            handleDeleteProjectDocument
                          }
                          deleteModal={deleteModal}
                          setDeleteModal={setDeleteModal}
                          onClickDelete={onClickDelete}
                        />
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

Index.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default Index;
