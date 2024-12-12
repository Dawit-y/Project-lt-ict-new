import React, { useEffect, useMemo, useState, useLayoutEffect } from "react";
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
  useFetchProjectEmployees,
  useSearchProjectEmployees,
  useAddProjectEmployee,
  useDeleteProjectEmployee,
  useUpdateProjectEmployee,
} from "../../queries/projectemployee_query";
import ProjectEmployeeModal from "./ProjectEmployeeModal";
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

const ProjectEmployeeModel = (props) => {
  //meta title
  document.title = " ProjectEmployee";
  const { passedId } = props;
  const param = { emp_project_id: passedId };

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectEmployee, setProjectEmployee] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchProjectEmployees(param);

  const addProjectEmployee = useAddProjectEmployee();
  const updateProjectEmployee = useUpdateProjectEmployee();
  const deleteProjectEmployee = useDeleteProjectEmployee();
  //START CRUD
  const handleAddProjectEmployee = async (data) => {
    try {
      await addProjectEmployee.mutateAsync(data);
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

  const handleUpdateProjectEmployee = async (data) => {
    try {
      await updateProjectEmployee.mutateAsync(data);
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
  const handleDeleteProjectEmployee = async () => {
    if (projectEmployee && projectEmployee.emp_id) {
      try {
        const id = projectEmployee.emp_id;
        await deleteProjectEmployee.mutateAsync(id);
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
      emp_id_no: (projectEmployee && projectEmployee.emp_id_no) || "",
      emp_full_name: (projectEmployee && projectEmployee.emp_full_name) || "",
      emp_email: (projectEmployee && projectEmployee.emp_email) || "",
      emp_phone_num: (projectEmployee && projectEmployee.emp_phone_num) || "",
      emp_role: (projectEmployee && projectEmployee.emp_role) || "",
      emp_project_id: (projectEmployee && projectEmployee.emp_project_id) || "",
      emp_start_date_ec:
        (projectEmployee && projectEmployee.emp_start_date_ec) || "",
      emp_start_date_gc:
        (projectEmployee && projectEmployee.emp_start_date_gc) || "",
      emp_end_date_ec:
        (projectEmployee && projectEmployee.emp_end_date_ec) || "",
      emp_end_date_gc:
        (projectEmployee && projectEmployee.emp_end_date_gc) || "",
      emp_address: (projectEmployee && projectEmployee.emp_address) || "",
      emp_description:
        (projectEmployee && projectEmployee.emp_description) || "",
      emp_current_status:
        (projectEmployee && projectEmployee.emp_current_status) || "",

      is_deletable: (projectEmployee && projectEmployee.is_deletable) || 1,
      is_editable: (projectEmployee && projectEmployee.is_editable) || 1,
    },

    validationSchema: Yup.object({
      emp_id_no: Yup.string().required(t("emp_id_no")),
      emp_full_name: Yup.string().required(t("emp_full_name")),
      emp_email: Yup.string().required(t("emp_email")),
      emp_phone_num: Yup.string().required(t("emp_phone_num")),
      emp_role: Yup.string().required(t("emp_role")),
      emp_project_id: Yup.string().required(t("emp_project_id")),
      emp_start_date_ec: Yup.string().required(t("emp_start_date_ec")),
      emp_start_date_gc: Yup.string().required(t("emp_start_date_gc")),
      emp_end_date_ec: Yup.string().required(t("emp_end_date_ec")),
      emp_end_date_gc: Yup.string().required(t("emp_end_date_gc")),
      emp_address: Yup.string().required(t("emp_address")),
      emp_description: Yup.string().required(t("emp_description")),
      emp_current_status: Yup.string().required(t("emp_current_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectEmployee = {
          emp_id: projectEmployee?.emp_id,
          emp_id_no: values.emp_id_no,
          emp_full_name: values.emp_full_name,
          emp_email: values.emp_email,
          emp_phone_num: values.emp_phone_num,
          emp_role: values.emp_role,
          emp_project_id: values.emp_project_id,
          emp_start_date_ec: values.emp_start_date_ec,
          emp_start_date_gc: values.emp_start_date_gc,
          emp_end_date_ec: values.emp_end_date_ec,
          emp_end_date_gc: values.emp_end_date_gc,
          emp_address: values.emp_address,
          emp_description: values.emp_description,
          emp_current_status: values.emp_current_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectEmployee
        handleUpdateProjectEmployee(updateProjectEmployee);
        validation.resetForm();
      } else {
        const newProjectEmployee = {
          emp_id_no: values.emp_id_no,
          emp_full_name: values.emp_full_name,
          emp_email: values.emp_email,
          emp_phone_num: values.emp_phone_num,
          emp_role: values.emp_role,
          emp_project_id: values.emp_project_id,
          emp_start_date_ec: values.emp_start_date_ec,
          emp_start_date_gc: values.emp_start_date_gc,
          emp_end_date_ec: values.emp_end_date_ec,
          emp_end_date_gc: values.emp_end_date_gc,
          emp_address: values.emp_address,
          emp_description: values.emp_description,
          emp_current_status: values.emp_current_status,
        };
        // save new ProjectEmployee
        handleAddProjectEmployee(newProjectEmployee);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setProjectEmployee(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectEmployee(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectEmployee(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectEmployeeClick = (arg) => {
    const projectEmployee = arg;
    // console.log("handleProjectEmployeeClick", projectEmployee);
    setProjectEmployee({
      emp_id: projectEmployee.emp_id,
      emp_id_no: projectEmployee.emp_id_no,
      emp_full_name: projectEmployee.emp_full_name,
      emp_email: projectEmployee.emp_email,
      emp_phone_num: projectEmployee.emp_phone_num,
      emp_role: projectEmployee.emp_role,
      emp_project_id: projectEmployee.emp_project_id,
      emp_start_date_ec: projectEmployee.emp_start_date_ec,
      emp_start_date_gc: projectEmployee.emp_start_date_gc,
      emp_end_date_ec: projectEmployee.emp_end_date_ec,
      emp_end_date_gc: projectEmployee.emp_end_date_gc,
      emp_address: projectEmployee.emp_address,
      emp_description: projectEmployee.emp_description,
      emp_current_status: projectEmployee.emp_current_status,

      is_deletable: projectEmployee.is_deletable,
      is_editable: projectEmployee.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectEmployee) => {
    setProjectEmployee(projectEmployee);
    setDeleteModal(true);
  };

  const handleProjectEmployeeClicks = () => {
    setIsEdit(false);
    setProjectEmployee("");
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
        accessorKey: "emp_id_no",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_id_no, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_full_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_full_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_email",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_email, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_phone_num",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_phone_num, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_role",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_role, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_project_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_project_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_start_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_start_date_ec, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_start_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_start_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_end_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_end_date_ec, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_end_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_end_date_gc, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_address",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_address, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "emp_current_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.emp_current_status, 30) ||
                "-"}
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
                    handleProjectEmployeeClick(data);
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
  }, [handleProjectEmployeeClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectEmployeeModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectEmployee}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectEmployee.isPending}
      />
      <>
        <div className="container-fluid1">
          {/* <Breadcrumbs
            title={t("project_employee")}
            breadcrumbItem={t("project_employee")}
          />
          <AdvancedSearch
            searchHook={useSearchProjectEmployees}
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
                      handleUserClick={handleProjectEmployeeClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_employee")}
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
                ? t("edit") + " " + t("project_employee")
                : t("add") + " " + t("project_employee")}
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
                    <Label>{t("emp_id_no")}</Label>
                    <Input
                      name="emp_id_no"
                      type="text"
                      placeholder={t("emp_id_no")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_id_no || ""}
                      invalid={
                        validation.touched.emp_id_no &&
                        validation.errors.emp_id_no
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_id_no &&
                    validation.errors.emp_id_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_id_no}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_full_name")}</Label>
                    <Input
                      name="emp_full_name"
                      type="text"
                      placeholder={t("emp_full_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_full_name || ""}
                      invalid={
                        validation.touched.emp_full_name &&
                        validation.errors.emp_full_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_full_name &&
                    validation.errors.emp_full_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_full_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_email")}</Label>
                    <Input
                      name="emp_email"
                      type="text"
                      placeholder={t("emp_email")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_email || ""}
                      invalid={
                        validation.touched.emp_email &&
                        validation.errors.emp_email
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_email &&
                    validation.errors.emp_email ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_email}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_phone_num")}</Label>
                    <Input
                      name="emp_phone_num"
                      type="text"
                      placeholder={t("emp_phone_num")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_phone_num || ""}
                      invalid={
                        validation.touched.emp_phone_num &&
                        validation.errors.emp_phone_num
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_phone_num &&
                    validation.errors.emp_phone_num ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_phone_num}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_role")}</Label>
                    <Input
                      name="emp_role"
                      type="text"
                      placeholder={t("emp_role")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_role || ""}
                      invalid={
                        validation.touched.emp_role &&
                        validation.errors.emp_role
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_role &&
                    validation.errors.emp_role ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_role}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_project_id")}</Label>
                    <Input
                      name="emp_project_id"
                      type="text"
                      placeholder={t("emp_project_id")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_project_id || ""}
                      invalid={
                        validation.touched.emp_project_id &&
                        validation.errors.emp_project_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_project_id &&
                    validation.errors.emp_project_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_project_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_start_date_ec")}</Label>
                    <Input
                      name="emp_start_date_ec"
                      type="text"
                      placeholder={t("emp_start_date_ec")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_start_date_ec || ""}
                      invalid={
                        validation.touched.emp_start_date_ec &&
                        validation.errors.emp_start_date_ec
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_start_date_ec &&
                    validation.errors.emp_start_date_ec ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_start_date_ec}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_start_date_gc")}</Label>
                    <Input
                      name="emp_start_date_gc"
                      type="text"
                      placeholder={t("emp_start_date_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_start_date_gc || ""}
                      invalid={
                        validation.touched.emp_start_date_gc &&
                        validation.errors.emp_start_date_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_start_date_gc &&
                    validation.errors.emp_start_date_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_start_date_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_end_date_ec")}</Label>
                    <Input
                      name="emp_end_date_ec"
                      type="text"
                      placeholder={t("emp_end_date_ec")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_end_date_ec || ""}
                      invalid={
                        validation.touched.emp_end_date_ec &&
                        validation.errors.emp_end_date_ec
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_end_date_ec &&
                    validation.errors.emp_end_date_ec ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_end_date_ec}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_end_date_gc")}</Label>
                    <Input
                      name="emp_end_date_gc"
                      type="text"
                      placeholder={t("emp_end_date_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_end_date_gc || ""}
                      invalid={
                        validation.touched.emp_end_date_gc &&
                        validation.errors.emp_end_date_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_end_date_gc &&
                    validation.errors.emp_end_date_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_end_date_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_address")}</Label>
                    <Input
                      name="emp_address"
                      type="text"
                      placeholder={t("emp_address")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_address || ""}
                      invalid={
                        validation.touched.emp_address &&
                        validation.errors.emp_address
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_address &&
                    validation.errors.emp_address ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_address}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_description")}</Label>
                    <Input
                      name="emp_description"
                      type="text"
                      placeholder={t("emp_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_description || ""}
                      invalid={
                        validation.touched.emp_description &&
                        validation.errors.emp_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_description &&
                    validation.errors.emp_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("emp_current_status")}</Label>
                    <Input
                      name="emp_current_status"
                      type="text"
                      placeholder={t("emp_current_status")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.emp_current_status || ""}
                      invalid={
                        validation.touched.emp_current_status &&
                        validation.errors.emp_current_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.emp_current_status &&
                    validation.errors.emp_current_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.emp_current_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectEmployee.isPending ||
                      updateProjectEmployee.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectEmployee.isPending ||
                            updateProjectEmployee.isPending ||
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
                            addProjectEmployee.isPending ||
                            updateProjectEmployee.isPending ||
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
      {/*   */}
    </React.Fragment>
  );
};
ProjectEmployeeModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectEmployeeModel;
