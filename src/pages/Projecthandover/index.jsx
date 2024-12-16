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
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  useFetchProjectHandovers,
  useSearchProjectHandovers,
  useAddProjectHandover,
  useDeleteProjectHandover,
  useUpdateProjectHandover,
} from "../../queries/projecthandover_query";
import { useAddProjectDocument } from "../../queries/projectdocument_query";
import ProjectHandoverModal from "./ProjectHandoverModal";
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
  InputGroup,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../utils/commonMethods";
import FileUploadField from "../../components/Common/FileUploadField";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectHandoverModel = (props) => {
  document.title = " ProjectHandover";
  const { passedId, isActive } = props;
  const param = { prh_project_id: passedId };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectHandover, setProjectHandover] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProjectHandovers(
    param,
    isActive
  );

  const addProjectHandover = useAddProjectHandover();
  const updateProjectHandover = useUpdateProjectHandover();
  const deleteProjectHandover = useDeleteProjectHandover();
  const addProjectDocument = useAddProjectDocument();
  //START CRUD
  const handleAddProjectHandover = async (
    newProjectHandover,
    handoverDocumentData
  ) => {
    try {
      const response = await addProjectHandover.mutateAsync(newProjectHandover);
      const handoverId = response?.data?.prh_id;
      handoverDocumentData["prd_owner_id"] = handoverId;
      await addProjectDocument.mutateAsync(handoverDocumentData);
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

  const handleUpdateProjectHandover = async (data) => {
    try {
      await updateProjectHandover.mutateAsync(data);
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

  const handleDeleteProjectHandover = async () => {
    if (projectHandover && projectHandover.prh_id) {
      try {
        const id = projectHandover.prh_id;
        await deleteProjectHandover.mutateAsync(id);
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
    enableReinitialize: true,
    initialValues: {
      prh_project_id: (projectHandover && projectHandover.prh_project_id) || "",
      prh_handover_date_ec:
        (projectHandover && projectHandover.prh_handover_date_ec) ||
        "2017/04/07",
      prh_handover_date_gc:
        (projectHandover && projectHandover.prh_handover_date_gc) || "",
      prh_description:
        (projectHandover && projectHandover.prh_description) || "",
      prh_status: (projectHandover && projectHandover.prh_status) || "",

      is_deletable: (projectHandover && projectHandover.is_deletable) || 1,
      is_editable: (projectHandover && projectHandover.is_editable) || 1,
    },

    validationSchema: Yup.object({
      //prh_project_id: Yup.string().required(t("prh_project_id")),
      // prh_handover_date_ec: Yup.string().required(t("prh_handover_date_ec")),
      prh_handover_date_gc: Yup.string().required(t("prh_handover_date_gc")),
      //prh_description: Yup.string().required(t("prh_description")),
      //prh_status: Yup.string().required(t("prh_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectHandover = {
          prh_id: projectHandover?.prh_id,
          // prh_project_id: values.prh_project_id,
          prh_handover_date_ec: values.prh_handover_date_ec,
          prh_handover_date_gc: values.prh_handover_date_gc,
          prh_description: values.prh_description,
          prh_status: values.prh_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectHandover
        handleUpdateProjectHandover(updateProjectHandover);
        validation.resetForm();
      } else {
        const newProjectHandover = {
          prh_project_id: passedId,
          prh_handover_date_ec: values.prh_handover_date_ec,
          prh_handover_date_gc: values.prh_handover_date_gc,
          prh_description: values.prh_description,
          prh_status: values.prh_status,
        };
        const handoverDocumentData = {
          prd_owner_type_id: 1,
          prd_project_id: passedId,
          prd_document_type_id: 1,
          prd_name: 1,
          prd_file: values.prd_file,
          prd_file_path: values.prd_file_path,
          prd_size: values.prd_size,
          prd_file_extension: values.prd_file_extension,
        };

        // save new ProjectHandover
        handleAddProjectHandover(newProjectHandover, handoverDocumentData);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setProjectHandover(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectHandover(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectHandover(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectHandoverClick = (arg) => {
    const projectHandover = arg;
    // console.log("handleProjectHandoverClick", projectHandover);
    setProjectHandover({
      prh_id: projectHandover.prh_id,
      prh_project_id: projectHandover.prh_project_id,
      prh_handover_date_ec: projectHandover.prh_handover_date_ec,
      prh_handover_date_gc: projectHandover.prh_handover_date_gc,
      prh_description: projectHandover.prh_description,
      prh_status: projectHandover.prh_status,
      is_deletable: projectHandover.is_deletable,
      is_editable: projectHandover.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectHandover) => {
    setProjectHandover(projectHandover);
    setDeleteModal(true);
  };

  const handleProjectHandoverClicks = () => {
    setIsEdit(false);
    setProjectHandover("");
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
        accessorKey: "prh_handover_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prh_handover_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prh_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prh_description, 30) || "-"}
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
                    handleProjectHandoverClick(data);
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
  }, [handleProjectHandoverClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectHandoverModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectHandover}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectHandover.isPending}
      />
      <>
        <div className="container-fluid1">
          {/* <Breadcrumbs
            title={t("project_handover")}
            breadcrumbItem={t("project_handover")}
          />
          <AdvancedSearch
            searchHook={useSearchProjectHandovers}
            textSearchKeys={["dep_name_am", "dep_name_en", "dep_name_or"]}
            dropdownSearchKeys={[
              {
                key: "example",
                options: [
                  { value: "Freelance", label: "Example1" },
                  { value: "Full Time", label: "Example2" },
                  { value: "Part Time", label: "Example3" },
                  { value: "Internship", label: "Example4" },
                ],
              },
            ]}
            checkboxSearchKeys={[
              {
                key: "example1",
                options: [
                  { value: "Engineering", label: "Example1" },
                  { value: "Science", label: "Example2" },
                ],
              },
            ]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          /> */}
          {isLoading || isSearchLoading ? (
            <Spinners top={isActive ? "top-70" : ""} />
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
                      handleUserClick={handleProjectHandoverClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_handover")}
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
                ? t("edit") + " " + t("project_handover")
                : t("add") + " " + t("project_handover")}
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
                    <FormGroup>
                      <Label>{t("prh_handover_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${
                            validation.touched.prh_handover_date_gc &&
                            validation.errors.prh_handover_date_gc
                              ? "is-invalid"
                              : ""
                          }`}
                          name="prh_handover_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.prh_handover_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "prh_handover_date_gc",
                              formatedDate
                            ); // Set value in Formik
                          }}
                          onBlur={validation.handleBlur}
                        />

                        <Button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled
                        >
                          <i className="fa fa-calendar" aria-hidden="true" />
                        </Button>
                      </InputGroup>
                      {validation.touched.prh_handover_date_gc &&
                      validation.errors.prh_handover_date_gc ? (
                        <FormFeedback>
                          {validation.errors.prh_handover_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prh_description")}</Label>
                    <Input
                      name="prh_description"
                      type="textarea"
                      placeholder={t("prh_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prh_description || ""}
                      invalid={
                        validation.touched.prh_description &&
                        validation.errors.prh_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prh_description &&
                    validation.errors.prh_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prh_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <FileUploadField validation={validation} />
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectHandover.isPending ||
                      updateProjectHandover.isPending ||
                      addProjectDocument.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectHandover.isPending ||
                            updateProjectHandover.isPending ||
                            addProjectDocument.isPending ||
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
                            addProjectHandover.isPending ||
                            updateProjectHandover.isPending ||
                            addProjectDocument.isPending ||
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
      </>
    </React.Fragment>
  );
};
ProjectHandoverModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectHandoverModel;
