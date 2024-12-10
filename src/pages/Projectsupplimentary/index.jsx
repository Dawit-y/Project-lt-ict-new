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
  useFetchProjectSupplimentarys,
  useSearchProjectSupplimentarys,
  useAddProjectSupplimentary,
  useDeleteProjectSupplimentary,
  useUpdateProjectSupplimentary,
} from "../../queries/projectsupplimentary_query";
import ProjectSupplimentaryModal from "./ProjectSupplimentaryModal";
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

const ProjectSupplimentaryModel = (props) => {
  document.title = " ProjectSupplimentary";
  const { passedId } = props;
  const param = { prs_project_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectSupplimentary, setProjectSupplimentary] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } =
    useFetchProjectSupplimentarys(param);

  const addProjectSupplimentary = useAddProjectSupplimentary();
  const updateProjectSupplimentary = useUpdateProjectSupplimentary();
  const deleteProjectSupplimentary = useDeleteProjectSupplimentary();
  //START CRUD
  const handleAddProjectSupplimentary = async (data) => {
    try {
      await addProjectSupplimentary.mutateAsync(data);
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

  const handleUpdateProjectSupplimentary = async (data) => {
    try {
      await updateProjectSupplimentary.mutateAsync(data);
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
  const handleDeleteProjectSupplimentary = async () => {
    if (projectSupplimentary && projectSupplimentary.prs_id) {
      try {
        const id = projectSupplimentary.prs_id;
        await deleteProjectSupplimentary.mutateAsync(id);
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
      prs_requested_amount:
        (projectSupplimentary && projectSupplimentary.prs_requested_amount) ||
        "",
      prs_released_amount:
        (projectSupplimentary && projectSupplimentary.prs_released_amount) ||
        "",
      prs_project_id:
        (projectSupplimentary && projectSupplimentary.prs_project_id) || "",
      prs_requested_date_ec:
        (projectSupplimentary && projectSupplimentary.prs_requested_date_ec) ||
        "",
      prs_requested_date_gc:
        (projectSupplimentary && projectSupplimentary.prs_requested_date_gc) ||
        "",
      prs_released_date_ec:
        (projectSupplimentary && projectSupplimentary.prs_released_date_ec) ||
        "",
      prs_released_date_gc:
        (projectSupplimentary && projectSupplimentary.prs_released_date_gc) ||
        "",
      prs_description:
        (projectSupplimentary && projectSupplimentary.prs_description) || "",
      prs_status:
        (projectSupplimentary && projectSupplimentary.prs_status) || "",

      is_deletable:
        (projectSupplimentary && projectSupplimentary.is_deletable) || 1,
      is_editable:
        (projectSupplimentary && projectSupplimentary.is_editable) || 1,
    },

    validationSchema: Yup.object({
      prs_requested_amount: Yup.string().required(t("prs_requested_amount")),
      prs_released_amount: Yup.string().required(t("prs_released_amount")),
      prs_project_id: Yup.string().required(t("prs_project_id")),
      prs_requested_date_ec: Yup.string().required(t("prs_requested_date_ec")),
      prs_requested_date_gc: Yup.string().required(t("prs_requested_date_gc")),
      prs_released_date_ec: Yup.string().required(t("prs_released_date_ec")),
      prs_released_date_gc: Yup.string().required(t("prs_released_date_gc")),
      prs_description: Yup.string().required(t("prs_description")),
      prs_status: Yup.string().required(t("prs_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectSupplimentary = {
          prs_id: projectSupplimentary?.prs_id,
          prs_requested_amount: values.prs_requested_amount,
          prs_released_amount: values.prs_released_amount,
          prs_project_id: values.prs_project_id,
          prs_requested_date_ec: values.prs_requested_date_ec,
          prs_requested_date_gc: values.prs_requested_date_gc,
          prs_released_date_ec: values.prs_released_date_ec,
          prs_released_date_gc: values.prs_released_date_gc,
          prs_description: values.prs_description,
          prs_status: values.prs_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectSupplimentary
        handleUpdateProjectSupplimentary(updateProjectSupplimentary);
        validation.resetForm();
      } else {
        const newProjectSupplimentary = {
          prs_requested_amount: values.prs_requested_amount,
          prs_released_amount: values.prs_released_amount,
          prs_project_id: values.prs_project_id,
          prs_requested_date_ec: values.prs_requested_date_ec,
          prs_requested_date_gc: values.prs_requested_date_gc,
          prs_released_date_ec: values.prs_released_date_ec,
          prs_released_date_gc: values.prs_released_date_gc,
          prs_description: values.prs_description,
          prs_status: values.prs_status,
        };
        // save new ProjectSupplimentary
        handleAddProjectSupplimentary(newProjectSupplimentary);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectSupplimentary on component mount
  useEffect(() => {
    setProjectSupplimentary(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectSupplimentary(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectSupplimentary(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectSupplimentaryClick = (arg) => {
    const projectSupplimentary = arg;
    // console.log("handleProjectSupplimentaryClick", projectSupplimentary);
    setProjectSupplimentary({
      prs_id: projectSupplimentary.prs_id,
      prs_requested_amount: projectSupplimentary.prs_requested_amount,
      prs_released_amount: projectSupplimentary.prs_released_amount,
      prs_project_id: projectSupplimentary.prs_project_id,
      prs_requested_date_ec: projectSupplimentary.prs_requested_date_ec,
      prs_requested_date_gc: projectSupplimentary.prs_requested_date_gc,
      prs_released_date_ec: projectSupplimentary.prs_released_date_ec,
      prs_released_date_gc: projectSupplimentary.prs_released_date_gc,
      prs_description: projectSupplimentary.prs_description,
      prs_status: projectSupplimentary.prs_status,

      is_deletable: projectSupplimentary.is_deletable,
      is_editable: projectSupplimentary.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectSupplimentary) => {
    setProjectSupplimentary(projectSupplimentary);
    setDeleteModal(true);
  };

  const handleProjectSupplimentaryClicks = () => {
    setIsEdit(false);
    setProjectSupplimentary("");
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
        accessorKey: "prs_requested_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_requested_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_released_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_released_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_project_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_project_id, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_requested_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_requested_date_ec, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_requested_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_requested_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_released_date_ec",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_released_date_ec, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_released_date_gc",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_released_date_gc, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status, 30) || "-"}
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
                    handleProjectSupplimentaryClick(data);
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
  }, [handleProjectSupplimentaryClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <ProjectSupplimentaryModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectSupplimentary}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectSupplimentary.isPending}
      />
      <>
        <div className="container-fluid1">
          {/* <Breadcrumbs
            title={t("project_supplimentary")}
            breadcrumbItem={t("project_supplimentary")}
          />
          <AdvancedSearch
            searchHook={useSearchProjectSupplimentarys}
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
                      handleUserClick={handleProjectSupplimentaryClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_supplimentary")}
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
                ? t("edit") + " " + t("project_supplimentary")
                : t("add") + " " + t("project_supplimentary")}
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
                    <Label>{t("prs_requested_amount")}</Label>
                    <Input
                      name="prs_requested_amount"
                      type="text"
                      placeholder={t("prs_requested_amount")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_requested_amount || ""}
                      invalid={
                        validation.touched.prs_requested_amount &&
                        validation.errors.prs_requested_amount
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_requested_amount &&
                    validation.errors.prs_requested_amount ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_requested_amount}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_released_amount")}</Label>
                    <Input
                      name="prs_released_amount"
                      type="text"
                      placeholder={t("prs_released_amount")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_released_amount || ""}
                      invalid={
                        validation.touched.prs_released_amount &&
                        validation.errors.prs_released_amount
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_released_amount &&
                    validation.errors.prs_released_amount ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_released_amount}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_project_id")}</Label>
                    <Input
                      name="prs_project_id"
                      type="text"
                      placeholder={t("prs_project_id")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_project_id || ""}
                      invalid={
                        validation.touched.prs_project_id &&
                        validation.errors.prs_project_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_project_id &&
                    validation.errors.prs_project_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_project_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_requested_date_ec")}</Label>
                    <Input
                      name="prs_requested_date_ec"
                      type="text"
                      placeholder={t("prs_requested_date_ec")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_requested_date_ec || ""}
                      invalid={
                        validation.touched.prs_requested_date_ec &&
                        validation.errors.prs_requested_date_ec
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_requested_date_ec &&
                    validation.errors.prs_requested_date_ec ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_requested_date_ec}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_requested_date_gc")}</Label>
                    <Input
                      name="prs_requested_date_gc"
                      type="text"
                      placeholder={t("prs_requested_date_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_requested_date_gc || ""}
                      invalid={
                        validation.touched.prs_requested_date_gc &&
                        validation.errors.prs_requested_date_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_requested_date_gc &&
                    validation.errors.prs_requested_date_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_requested_date_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_released_date_ec")}</Label>
                    <Input
                      name="prs_released_date_ec"
                      type="text"
                      placeholder={t("prs_released_date_ec")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_released_date_ec || ""}
                      invalid={
                        validation.touched.prs_released_date_ec &&
                        validation.errors.prs_released_date_ec
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_released_date_ec &&
                    validation.errors.prs_released_date_ec ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_released_date_ec}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_released_date_gc")}</Label>
                    <Input
                      name="prs_released_date_gc"
                      type="text"
                      placeholder={t("prs_released_date_gc")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_released_date_gc || ""}
                      invalid={
                        validation.touched.prs_released_date_gc &&
                        validation.errors.prs_released_date_gc
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_released_date_gc &&
                    validation.errors.prs_released_date_gc ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_released_date_gc}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_description")}</Label>
                    <Input
                      name="prs_description"
                      type="text"
                      placeholder={t("prs_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_description || ""}
                      invalid={
                        validation.touched.prs_description &&
                        validation.errors.prs_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_description &&
                    validation.errors.prs_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status")}</Label>
                    <Input
                      name="prs_status"
                      type="text"
                      placeholder={t("prs_status")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status || ""}
                      invalid={
                        validation.touched.prs_status &&
                        validation.errors.prs_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_status &&
                    validation.errors.prs_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectSupplimentary.isPending ||
                      updateProjectSupplimentary.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectSupplimentary.isPending ||
                            updateProjectSupplimentary.isPending ||
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
                            addProjectSupplimentary.isPending ||
                            updateProjectSupplimentary.isPending ||
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
      <ToastContainer />
    </React.Fragment>
  );
};
ProjectSupplimentaryModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectSupplimentaryModel;
