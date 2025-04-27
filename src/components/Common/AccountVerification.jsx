import React, { useState, useMemo, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import FileUploadField from './FileUploadField'
import DeleteModal from './DeleteModal'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { useTranslation } from 'react-i18next'
import { useAddProjectDocument, useUpdateProjectDocument, useDeleteProjectDocument, useFetchProjectDocuments } from '../../queries/projectdocument_query'
import { Modal, ModalBody, ModalHeader, Form, Col, Row, Button, Spinner, Card, CardBody, Container } from 'reactstrap'
import { toast } from 'react-toastify'
import { useSearchCsoInfos } from '../../queries/csoinfo_query'
import Spinners from './Spinner'
import FetchErrorHandler from './FetchErrorHandler'
import ProjectDocumentModal from '../../pages/Projectdocument/ProjectDocumentModal'
import { PAGE_ID } from '../../constants/constantFile'
import FileList from '../../pages/Projectdocument/FileManager/FileList'
import ConversationInformationModal from '../../pages/Conversationinformation/ConvInfoModal'

const AccountVerification = () => {
  document.title = "Operational Agreement is Required"

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const ownerId = storedUser?.user?.usr_owner_id
  const userType = storedUser?.user?.usr_user_type
  const { param, isValidParam } = useMemo(() => {
    const param = {
      cso_id: ownerId
    };

    const isValidParam = Object.keys(param).length > 0 &&
      Object.values(param).every((value) => value !== null && value !== undefined)

    return { param, isValidParam };
  }, [ownerId]);
  const { data: csoData, isLoading: isCsoInfoLoading } = useSearchCsoInfos(param, isValidParam)
  const csoId = csoData?.data?.length > 0 ? csoData.data[0].cso_id : null;
  const csoStatus = csoData?.data?.length > 0 ? csoData.data[0].cso_status : null;

  const docParams = { prd_owner_type_id: PAGE_ID.CSO, prd_owner_id: csoId };
  const isQueryEnabled = Object.values(docParams).every(value => value !== null && value !== undefined);
  const { data, isLoading, isError, error, refetch } = useFetchProjectDocuments(docParams, isQueryEnabled);

  const [projectDocument, setProjectDocument] = useState(null)
  const [modal, setModal] = useState(false);
  const [convModal, setConvModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false);

  const addProjectDocument = useAddProjectDocument();
  const updateProjectDocument = useUpdateProjectDocument();
  const deleteProjectDocument = useDeleteProjectDocument();

  const { t } = useTranslation()

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
      // prd_project_id: 1,
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
          // prd_project_id: 1,
          prd_owner_type_id: PAGE_ID.CSO,
          prd_owner_id: csoId,
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

  const [modal1, setModal1] = useState(false)
  const [details, setDetails] = useState({})
  const toggleViewModal = () => setModal1(!modal1);
  const toggleConvModal = () => setConvModal(!convModal)

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

  if ((csoStatus !== null && csoStatus !== 0) || userType === 4) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />
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
      <ConversationInformationModal
        isOpen={convModal}
        toggle={toggleConvModal}
        ownerId={csoId}
        ownerTypeId={PAGE_ID.CSO}
      />
      <div className='page-content'>
        <Container className=''>
          <div className="mb-5">
            <div className="text-center pt-5">
              <h2 className="">Dear {csoData?.data?.length > 0 ? csoData.data[0].cso_name : ''}, Operational Agreement is Required</h2>
              <p className="lead">
                Before you proceed with proposal submission, Operational Agreement should be approved.
              </p>
              <div className="alert alert-info mx-auto" style={{ maxWidth: '600px' }}>
                <h5>Please upload the following documents:</h5>
                <ul className="text-start">
                  <li>Legal Documents</li>
                  <li>Trade License</li>
                </ul>
                <p className="mb-0">
                  Our team will review your documents within 1-2 business days.
                  You'll receive an email notification once it is approved.
                </p>
              </div>
              <Button
                color="primary"
                size="lg"
                onClick={handleProjectDocumentClicks}
                className="mt-3"
              >
                <i className="mdi mdi-upload me-2"></i>
                Upload Required Documents
              </Button>
            </div>
          </div>
          <Card className='mb-4'>
            <CardBody>
              {isLoading ? (
                <Spinners />
              ) : data?.data?.length > 0 ? (
                <>
                  <div className="alert alert-success mb-4">
                    <i className="mdi mdi-check-circle-outline me-2"></i>
                    You've submitted {data.data.length} document(s). Our team is reviewing them.
                  </div>
                  <FileList
                    files={data?.data || []}
                    edit={handleProjectDocumentClick}
                    isDeleteLoading={deleteProjectDocument.isPending}
                    handleDeleteProjectDocument={
                      handleDeleteProjectDocument
                    }
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    onClickDelete={onClickDelete}
                  />
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="mdi mdi-file-document-outline display-4 text-muted"></i>
                  <h5 className="mt-3">No documents submitted yet</h5>
                  <p>Please upload the required documents to verify your account</p>
                </div>
              )}
            </CardBody>
          </Card>
          <div className="mt-4 mb-2 d-flex align-items-center justify-content-start gap-3">
            <p className="text-muted my-auto">
              Have questions about your document submission?
            </p>
            <Button
              size='sm'
              color="outline-primary"
              onClick={toggleConvModal}
              className="d-inline-flex align-items-center"
            >
              <i className="mdi mdi-comment-text-outline me-2"></i>
              Contact Support
            </Button>
          </div>
          <Modal isOpen={modal} toggle={toggleForm} className="modal-xl">
            <ModalHeader toggle={toggleForm} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("Document")
                : t("add") + " " + t("Document")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
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
                            <Spinner size={"sm"} color="light" className="me-2" />
                            {t("Save")}
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            type="submit"
                            className="save-user"
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
        </Container>
      </div>
    </>
  );
};
export default AccountVerification;
