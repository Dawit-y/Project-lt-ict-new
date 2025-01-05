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
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchProjectPerformances,
  useSearchProjectPerformances,
  useAddProjectPerformance,
  useDeleteProjectPerformance,
  useUpdateProjectPerformance,
} from "../../queries/projectperformance_query";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import ProjectPerformanceModal from "./ProjectPerformanceModal";
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
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createSelectOptions } from "../../utils/commonMethods";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { formatDate } from "../../utils/commonMethods";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPerformanceModel = (props) => {
  const { passedId, isActive } = props;
  const param = { prp_project_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectPerformance, setProjectPerformance] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchProjectPerformances(param, isActive);
  const { data: projectCategoryData } = useFetchProjectStatuss();
  const projectStatusOptions = createSelectOptions(
    projectCategoryData?.data || [],
    "prs_id",
    "prs_status_name_or"
  );

  const addProjectPerformance = useAddProjectPerformance();
  const updateProjectPerformance = useUpdateProjectPerformance();
  const deleteProjectPerformance = useDeleteProjectPerformance();
  //START CRUD
  const handleAddProjectPerformance = async (data) => {
    try {
      await addProjectPerformance.mutateAsync(data);
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

  const handleUpdateProjectPerformance = async (data) => {
    try {
      await updateProjectPerformance.mutateAsync(data);
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
  const handleDeleteProjectPerformance = async () => {
    if (projectPerformance && projectPerformance.prp_id) {
      try {
        const id = projectPerformance.prp_id;
        await deleteProjectPerformance.mutateAsync(id);
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
      prp_project_id:
        (projectPerformance && projectPerformance.prp_project_id) || "",
      prp_project_status_id:
        (projectPerformance && projectPerformance.prp_project_status_id) || "",
      prp_record_date_ec:
        (projectPerformance && projectPerformance.prp_record_date_ec) || "",
      prp_record_date_gc:
        (projectPerformance && projectPerformance.prp_record_date_gc) || "",
      prp_total_budget_used:
        (projectPerformance && projectPerformance.prp_total_budget_used) || "",
      prp_physical_performance:
        (projectPerformance && projectPerformance.prp_physical_performance) ||
        "",
      prp_description:
        (projectPerformance && projectPerformance.prp_description) || "",
      prp_status: (projectPerformance && projectPerformance.prp_status) || "",
      prp_created_date:
        (projectPerformance && projectPerformance.prp_created_date) || "",
      prp_termination_reason_id:
        (projectPerformance && projectPerformance.prp_termination_reason_id) ||
        "",

      is_deletable:
        (projectPerformance && projectPerformance.is_deletable) || 1,
      is_editable: (projectPerformance && projectPerformance.is_editable) || 1,
    },

    validationSchema: Yup.object({
      // prp_project_id: Yup.string().required(t('prp_project_id')),
      prp_project_status_id: Yup.string().required(t("prp_project_status_id")),
      //prp_record_date_ec: Yup.string().required(t('prp_record_date_ec')),
      //prp_record_date_gc: Yup.string().required(t('prp_record_date_gc')),
      prp_total_budget_used: Yup.string().required(t("prp_total_budget_used")),
      prp_physical_performance: Yup.string().required(
        t("prp_physical_performance")
      ),
      //prp_description: Yup.string().required(t("prp_description")),
      // prp_status: Yup.string().required(t('prp_status')),
      //prp_created_date: Yup.string().required(t('prp_created_date')),
      //prp_termination_reason_id: Yup.string().required(t('prp_termination_reason_id')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectPerformance = {
          prp_id: projectPerformance?.prp_id,
          //prp_project_id: passedId,
          prp_project_status_id: parseInt(values.prp_project_status_id),
          prp_record_date_ec: values.prp_record_date_ec,
          prp_record_date_gc: values.prp_record_date_gc,
          prp_total_budget_used: values.prp_total_budget_used,
          prp_physical_performance: values.prp_physical_performance,
          prp_description: values.prp_description,
          prp_status: 0,
          prp_created_date: values.prp_created_date,
          prp_termination_reason_id: values.prp_termination_reason_id,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectPerformance
        handleUpdateProjectPerformance(updateProjectPerformance);
        validation.resetForm();
      } else {
        const newProjectPerformance = {
          prp_project_id: passedId,
          prp_project_status_id: parseInt(values.prp_project_status_id),
          prp_record_date_ec: values.prp_record_date_ec,
          prp_record_date_gc: values.prp_record_date_gc,
          prp_total_budget_used: values.prp_total_budget_used,
          prp_physical_performance: values.prp_physical_performance,
          prp_description: values.prp_description,
          prp_status: 0,
          prp_created_date: 2024,
          prp_termination_reason_id: values.prp_termination_reason_id,
        };
        // save new ProjectPerformance
        handleAddProjectPerformance(newProjectPerformance);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectPerformance on component mount
  useEffect(() => {
    setProjectPerformance(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectPerformance(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectPerformance(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectPerformanceClick = (arg) => {
    const projectPerformance = arg;
    // console.log("handleProjectPerformanceClick", projectPerformance);
    setProjectPerformance({
      prp_id: projectPerformance.prp_id,
      prp_project_id: projectPerformance.prp_project_id,
      prp_project_status_id: projectPerformance.prp_project_status_id,
      prp_record_date_ec: projectPerformance.prp_record_date_ec,
      prp_record_date_gc: projectPerformance.prp_record_date_gc,
      prp_total_budget_used: projectPerformance.prp_total_budget_used,
      prp_physical_performance: projectPerformance.prp_physical_performance,
      prp_description: projectPerformance.prp_description,
      prp_status: projectPerformance.prp_status,
      prp_created_date: projectPerformance.prp_created_date,
      prp_termination_reason_id: projectPerformance.prp_termination_reason_id,

      is_deletable: projectPerformance.is_deletable,
      is_editable: projectPerformance.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectPerformance) => {
    setProjectPerformance(projectPerformance);
    setDeleteModal(true);
  };

  const handleProjectPerformanceClicks = () => {
    setIsEdit(false);
    setProjectPerformance("");
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
        accessorKey: "prp_project_status_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prp_project_status_id, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prp_record_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prp_record_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prp_total_budget_used",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prp_total_budget_used, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prp_physical_performance",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.prp_physical_performance,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prp_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prp_description, 30) || "-"}
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
                    handleProjectPerformanceClick(data);
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
  }, [handleProjectPerformanceClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectPerformanceModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectPerformance}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectPerformance.isPending}
      />
      <div className="page-content1">
        <div className="container-fluid1">
          {isLoading || isSearchLoading ? (
            <Spinners top={isActive ? "top-70" : ""} />
          ) : (
            <TableContainer
              columns={columns}
              data={showSearchResult ? searchResults?.data : data?.data || []}
              isGlobalFilter={true}
              isAddButton={true}
              isCustomPageSize={true}
              handleUserClick={handleProjectPerformanceClicks}
              isPagination={true}
              // SearchPlaceholder="26 records..."
              SearchPlaceholder={t("filter_placeholder")}
              buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
              buttonName={t("add") + " " + t("project_performance")}
              tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
              theadClass="table-light"
              pagination="pagination"
              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("project_performance")
                : t("add") + " " + t("project_performance")}
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
                    <Label>
                      {t("prp_project_status_id")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="prp_project_status_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prp_project_status_id || ""}
                      invalid={
                        validation.touched.prp_project_status_id &&
                        validation.errors.prp_project_status_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Project Category</option>
                      {projectStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.prp_project_status_id &&
                    validation.errors.prp_project_status_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prp_project_status_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <FormGroup>
                      <Label>{t("prp_record_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${
                            validation.touched.prp_record_date_gc &&
                            validation.errors.prp_record_date_gc
                              ? "is-invalid"
                              : ""
                          }`}
                          name="prp_record_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.prp_record_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "prp_record_date_gc",
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
                      {validation.touched.prp_record_date_gc &&
                      validation.errors.prp_record_date_gc ? (
                        <FormFeedback>
                          {validation.errors.prp_record_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prp_total_budget_used")}</Label>
                    <Input
                      name="prp_total_budget_used"
                      type="number"
                      placeholder={t("prp_total_budget_used")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prp_total_budget_used || ""}
                      invalid={
                        validation.touched.prp_total_budget_used &&
                        validation.errors.prp_total_budget_used
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prp_total_budget_used &&
                    validation.errors.prp_total_budget_used ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prp_total_budget_used}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prp_physical_performance")}</Label>
                    <Input
                      name="prp_physical_performance"
                      type="number"
                      placeholder={t("prp_physical_performance")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prp_physical_performance || ""}
                      invalid={
                        validation.touched.prp_physical_performance &&
                        validation.errors.prp_physical_performance
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prp_physical_performance &&
                    validation.errors.prp_physical_performance ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prp_physical_performance}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prp_description")}</Label>
                    <Input
                      name="prp_description"
                      type="textarea"
                      placeholder={t("prp_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prp_description || ""}
                      invalid={
                        validation.touched.prp_description &&
                        validation.errors.prp_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prp_description &&
                    validation.errors.prp_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prp_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectPerformance.isPending ||
                      updateProjectPerformance.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectPerformance.isPending ||
                            updateProjectPerformance.isPending ||
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
                            addProjectPerformance.isPending ||
                            updateProjectPerformance.isPending ||
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
ProjectPerformanceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectPerformanceModel;
