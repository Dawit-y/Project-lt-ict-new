import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useParams } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import ProjectGannt from "../../pages/GanttChart";

import {
  useFetchProjectPlans,
  useSearchProjectPlans,
  useAddProjectPlan,
  useDeleteProjectPlan,
  useUpdateProjectPlan,
} from "../../queries/projectplan_query";
import ProjectPlanModal from "./ProjectPlanModal";
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
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createSelectOptions, formatDate } from "../../utils/commonMethods";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPlanModel = () => {
  const location = useLocation();
  const id = Number(location.pathname.split("/")[2]);
  const param = { pld_project_id: id };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectPlan, setProjectPlan] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchProjectPlans(param);
  const { data: budgetYearData } = useFetchBudgetYears();
  const budgetYearOptions = createSelectOptions(
    budgetYearData?.data || [],
    "bdy_id",
    "bdy_name"
  );

  const addProjectPlan = useAddProjectPlan();
  const updateProjectPlan = useUpdateProjectPlan();
  const deleteProjectPlan = useDeleteProjectPlan();

  //START CRUD
  const handleAddProjectPlan = async (data) => {
    try {
      await addProjectPlan.mutateAsync(data);
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

  const handleUpdateProjectPlan = async (data) => {
    try {
      await updateProjectPlan.mutateAsync(data);
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
  const handleDeleteProjectPlan = async () => {
    if (projectPlan && projectPlan.pld_id) {
      try {
        const id = projectPlan.pld_id;
        await deleteProjectPlan.mutateAsync(id);
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
      pld_name: (projectPlan && projectPlan.pld_name) || "",
      pld_project_id: (projectPlan && projectPlan.pld_id) || "",
      pld_budget_year_id: (projectPlan && projectPlan.pld_budget_year_id) || "",
      pld_start_date_ec: (projectPlan && projectPlan.pld_start_date_ec) || "",
      pld_start_date_gc: (projectPlan && projectPlan.pld_start_date_gc) || "",
      pld_end_date_ec: (projectPlan && projectPlan.pld_end_date_ec) || "",
      pld_end_date_gc: (projectPlan && projectPlan.pld_end_date_gc) || "",
      pld_description: (projectPlan && projectPlan.pld_description) || "",
      pld_status: (projectPlan && projectPlan.pld_status) || "",
      is_deletable: (projectPlan && projectPlan.is_deletable) || 1,
      is_editable: (projectPlan && projectPlan.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pld_name: Yup.string().required(t("pld_name")),
      //pld_project_id: Yup.string().required(t("pld_project_id")),
      pld_budget_year_id: Yup.string().required(t("pld_budget_year_id")),
      //pld_start_date_ec: Yup.string().required(t("pld_start_date_ec")),
      pld_start_date_gc: Yup.string().required(t("pld_start_date_gc")),
      // pld_end_date_ec: Yup.string().required(t("pld_end_date_ec")),
      pld_end_date_gc: Yup.string().required(t("pld_end_date_gc")),
      //pld_description: Yup.string().required(t("pld_description")),
      //pld_status: Yup.string().required(t("pld_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectPlan = {
          pld_id: projectPlan?.pld_id,
          pld_name: values.pld_name,
          pld_project_id: values.pld_project_id,
          pld_budget_year_id: Number(values.pld_budget_year_id),
          pld_start_date_ec: values.pld_start_date_ec,
          pld_start_date_gc: values.pld_start_date_gc,
          pld_end_date_ec: values.pld_end_date_ec,
          pld_end_date_gc: values.pld_end_date_gc,
          pld_description: values.pld_description,
          pld_status: values.pld_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectPlan
        handleUpdateProjectPlan(updateProjectPlan);
        validation.resetForm();
      } else {
        const newProjectPlan = {
          pld_name: values.pld_name,
          pld_project_id: id,
          pld_budget_year_id: Number(values.pld_budget_year_id),
          pld_start_date_ec: values.pld_start_date_ec,
          pld_start_date_gc: values.pld_start_date_gc,
          pld_end_date_ec: values.pld_end_date_ec,
          pld_end_date_gc: values.pld_end_date_gc,
          pld_description: values.pld_description,
          pld_status: values.pld_status,
        };
        // save new ProjectPlan
        handleAddProjectPlan(newProjectPlan);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const [projectPlanSelected, setProjectPlanSelected] = useState(null);

  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectPlan on component mount
  useEffect(() => {
    setProjectPlan(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectPlan(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectPlan(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectPlanClick = (arg) => {
    const projectPlan = arg;
    setProjectPlan({
      pld_id: projectPlan.pld_id,
      pld_name: projectPlan.pld_name,
      pld_project_id: projectPlan.pld_project_id,
      pld_budget_year_id: projectPlan.pld_budget_year_id,
      pld_start_date_ec: projectPlan.pld_start_date_ec,
      pld_start_date_gc: projectPlan.pld_start_date_gc,
      pld_end_date_ec: projectPlan.pld_end_date_ec,
      pld_end_date_gc: projectPlan.pld_end_date_gc,
      pld_description: projectPlan.pld_description,
      pld_status: projectPlan.pld_status,
      is_deletable: projectPlan.is_deletable,
      is_editable: projectPlan.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectPlan) => {
    setProjectPlan(projectPlan);
    setDeleteModal(true);
  };

  const handleProjectPlanClicks = () => {
    setIsEdit(false);
    setProjectPlan("");
    toggle();
  };

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  //START UNCHANGED projectPlanSelected
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "pld_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pld_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pld_budget_year_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdy_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pld_start_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pld_start_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pld_end_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pld_end_date_gc, 30) || "-"}
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
      {
        header: t("view_gannt"),
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
                //toggleViewModal(data);

                console.log("selected project plan", data);
                setProjectPlanSelected(cellProps.row.original);
              }}
            >
              {t("view_gannt")}
            </Button>
          );
        },
      },
    ];
    // const baseColumnSelected = [
    //   {
    //     header: "",
    //     accessorKey: "pld_name",
    //     enableColumnFilter: false,
    //     enableSorting: true,
    //     cell: (cellProps) => {
    //       return (
    //         <span>
    //           {truncateText(cellProps.row.original.pld_name, 30) || "-"}
    //         </span>
    //       );
    //     },
    //   },
    // ];

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
                    handleProjectPlanClick(data);
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
  }, [handleProjectPlanClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectPlanModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectPlan}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectPlan.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          {isLoading || isSearchLoading ? (
            <Spinners />
          ) : (
            <Row>
              {/* TableContainer for displaying data */}
              <Col lg={12}>
                <TableContainer
                  columns={columns}
                  data={
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  isGlobalFilter={true}
                  isAddButton={true}
                  isCustomPageSize={true}
                  handleUserClick={handleProjectPlanClicks}
                  isPagination={true}
                  SearchPlaceholder={`${26} ${t("Results")}...`}
                  buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                  buttonName={`${t("add")} ${t("project_plan")}`}
                  tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                  theadClass="table-light"
                  pagination="pagination"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                />
              </Col>

              {/* Conditionally render ProjectGantt or an alternative card */}
              {projectPlanSelected ? (
                <Col lg={12}>
                  <ProjectGannt data={projectPlanSelected} />
                </Col>
              ) : (
                <Col lg={projectPlanSelected ? 0 : 0}>
                  <Card>
                    <p>Gannt chart</p>
                  </Card>
                </Col>
              )}
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("project_plan")
                : t("add") + " " + t("project_plan")}
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
                    <Label>{t("pld_name")}</Label>
                    <Input
                      name="pld_name"
                      type="text"
                      placeholder={t("pld_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pld_name || ""}
                      invalid={
                        validation.touched.pld_name &&
                        validation.errors.pld_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pld_name &&
                    validation.errors.pld_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pld_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pld_budget_year_id")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pld_budget_year_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pld_budget_year_id || ""}
                      invalid={
                        validation.touched.pld_budget_year_id &&
                        validation.errors.pld_budget_year_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Project Category</option>
                      {budgetYearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.pld_budget_year_id &&
                    validation.errors.pld_budget_year_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pld_budget_year_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <FormGroup>
                      <Label>{t("pld_start_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${
                            validation.touched.pld_start_date_gc &&
                            validation.errors.pld_start_date_gc
                              ? "is-invalid"
                              : ""
                          }`}
                          name="pld_start_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.pld_start_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "pld_start_date_gc",
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
                      {validation.touched.pld_start_date_gc &&
                      validation.errors.pld_start_date_gc ? (
                        <FormFeedback>
                          {validation.errors.pld_start_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <FormGroup>
                      <Label>{t("pld_end_date_gc")}</Label>
                      <InputGroup>
                        <Flatpickr
                          id="DataPicker"
                          className={`form-control ${
                            validation.touched.pld_end_date_gc &&
                            validation.errors.pld_end_date_gc
                              ? "is-invalid"
                              : ""
                          }`}
                          name="pld_end_date_gc"
                          options={{
                            altInput: true,
                            altFormat: "Y/m/d",
                            dateFormat: "Y/m/d",
                            enableTime: false,
                          }}
                          value={validation.values.pld_end_date_gc || ""}
                          onChange={(date) => {
                            const formatedDate = formatDate(date[0]);
                            validation.setFieldValue(
                              "pld_end_date_gc",
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
                      {validation.touched.pld_end_date_gc &&
                      validation.errors.pld_end_date_gc ? (
                        <FormFeedback>
                          {validation.errors.pld_end_date_gc}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pld_description")}</Label>
                    <Input
                      name="pld_description"
                      type="textarea"
                      placeholder={t("pld_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pld_description || ""}
                      invalid={
                        validation.touched.pld_description &&
                        validation.errors.pld_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pld_description &&
                    validation.errors.pld_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pld_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectPlan.isPending ||
                      updateProjectPlan.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectPlan.isPending ||
                            updateProjectPlan.isPending ||
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
                            addProjectPlan.isPending ||
                            updateProjectPlan.isPending ||
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
ProjectPlanModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectPlanModel;
