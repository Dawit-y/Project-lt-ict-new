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
  useFetchProjectStatuss,
  useSearchProjectStatuss,
  useAddProjectStatus,
  useDeleteProjectStatus,
  useUpdateProjectStatus,
} from "../../queries/projectstatus_query";
import ProjectStatusModal from "./ProjectStatusModal";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { alphanumericValidation,amountValidation,numberValidation } from '../../utils/Validation/validation';
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

const ProjectStatusModel = () => {
  //meta title
  document.title = " ProjectStatus";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectStatus, setProjectStatus] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProjectStatuss();

  const addProjectStatus = useAddProjectStatus();
  const updateProjectStatus = useUpdateProjectStatus();
  const deleteProjectStatus = useDeleteProjectStatus();
  //START CRUD
  const handleAddProjectStatus = async (data) => {
    try {
      await addProjectStatus.mutateAsync(data);
    toast.success(t('add_success'), {
        autoClose: 2000,
      });
    validation.resetForm();
    } catch (error) {
     toast.success(t('add_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateProjectStatus = async (data) => {
    try {
      await updateProjectStatus.mutateAsync(data);
     toast.success(t('update_success'), {
        autoClose: 2000,
      });
     validation.resetForm();
    } catch (error) {
     toast.success(t('update_failure'), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProjectStatus = async () => {
    if (projectStatus && projectStatus.prs_id) {
      try {
        const id = projectStatus.prs_id;
        await deleteProjectStatus.mutateAsync(id);
       toast.success(t('delete_success'), {
        autoClose: 2000,
      });
      } catch (error) {
       toast.success(t('delete_failure'), {
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
      prs_status_name_or:
        (projectStatus && projectStatus.prs_status_name_or) || "",
      prs_status_name_am:
        (projectStatus && projectStatus.prs_status_name_am) || "",
      prs_status_name_en:
        (projectStatus && projectStatus.prs_status_name_en) || "",
      prs_color_code: (projectStatus && projectStatus.prs_color_code) || "",
      prs_order_number: (projectStatus && projectStatus.prs_order_number) || "",
      prs_description: (projectStatus && projectStatus.prs_description) || "",
      prs_status: (projectStatus && projectStatus.prs_status) || "",
      prs_spare_column: (projectStatus && projectStatus.prs_spare_column) || "",

      is_deletable: (projectStatus && projectStatus.is_deletable) || 1,
      is_editable: (projectStatus && projectStatus.is_editable) || 1,
    },
    validationSchema: Yup.object({
      prs_status_name_or: alphanumericValidation(4,100,true)
        .test("unique-prs_status_name_or", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) =>
              item.prs_status_name_or == value &&
              item.prs_id !== projectStatus?.prs_id
          );
        }),
      prs_status_name_am: Yup.string().required(t("prs_status_name_am")),
      prs_status_name_en: alphanumericValidation(2,100,true),
      prs_color_code: alphanumericValidation(6,20,false),
      prs_order_number: numberValidation(1,10,true),
      prs_description: alphanumericValidation(2,425,false)
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectStatus = {
          prs_id: projectStatus ? projectStatus.prs_id : 0,
          prs_status_name_or: values.prs_status_name_or,
          prs_status_name_am: values.prs_status_name_am,
          prs_status_name_en: values.prs_status_name_en,
          prs_color_code: values.prs_color_code,
          prs_order_number: values.prs_order_number,
          prs_description: values.prs_description,
          prs_status: values.prs_status,
          //prs_spare_column: values.prs_spare_column,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectStatus
        handleUpdateProjectStatus(updateProjectStatus);
      } else {
        const newProjectStatus = {
          prs_status_name_or: values.prs_status_name_or,
          prs_status_name_am: values.prs_status_name_am,
          prs_status_name_en: values.prs_status_name_en,
          prs_color_code: values.prs_color_code,
          prs_order_number: values.prs_order_number,
          prs_description: values.prs_description,
          prs_status: values.prs_status,
          //prs_spare_column: values.prs_spare_column,
        };
        // save new ProjectStatus
        handleAddProjectStatus(newProjectStatus);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectStatus on component mount
  useEffect(() => {
    setProjectStatus(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectStatus(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectStatus(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectStatusClick = (arg) => {
    const projectStatus = arg;
    // console.log("handleProjectStatusClick", projectStatus);
    setProjectStatus({
      prs_id: projectStatus.prs_id,
      prs_status_name_or: projectStatus.prs_status_name_or,
      prs_status_name_am: projectStatus.prs_status_name_am,
      prs_status_name_en: projectStatus.prs_status_name_en,
      prs_color_code: projectStatus.prs_color_code,
      prs_order_number: projectStatus.prs_order_number,
      prs_description: projectStatus.prs_description,
      prs_status: projectStatus.prs_status,
      prs_spare_column: projectStatus.prs_spare_column,

      is_deletable: projectStatus.is_deletable,
      is_editable: projectStatus.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectStatus) => {
    setProjectStatus(projectStatus);
    setDeleteModal(true);
  };

  const handleProjectStatusClicks = () => {
    setIsEdit(false);
    setProjectStatus("");
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
        accessorKey: "prs_status_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_or, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_am, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_status_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_status_name_en, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_color_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_color_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "prs_order_number",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prs_order_number, 30) || "-"}
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
              {cellProps.row.original.is_editable && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProjectStatusClick(data);
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
  }, [handleProjectStatusClick, toggleViewModal, onClickDelete]);
 if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <ProjectStatusModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectStatus}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectStatus.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("project_status")}
            breadcrumbItem={t("project_status")}
          />
          <AdvancedSearch
            searchHook={useSearchProjectStatuss}
            textSearchKeys={["prs_status_name_or"]}
            dropdownSearchKeys={[]}
            checkboxSearchKeys={[]}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          />
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
                      handleUserClick={handleProjectStatusClicks}
                      isPagination={true}
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_status")}
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
                ? t("edit") + " " + t("project_status")
                : t("add") + " " + t("project_status")}
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
                    <Label>{t("prs_status_name_or")}<span className="text-danger">*</span></Label>
                    <Input
                      name="prs_status_name_or"
                      type="text"
                      placeholder={t("prs_status_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_or || ""}
                      invalid={
                        validation.touched.prs_status_name_or &&
                        validation.errors.prs_status_name_or
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.prs_status_name_or &&
                    validation.errors.prs_status_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status_name_am")}<span className="text-danger">*</span></Label>
                    <Input
                      name="prs_status_name_am"
                      type="text"
                      placeholder={t("prs_status_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_am || ""}
                      invalid={
                        validation.touched.prs_status_name_am &&
                        validation.errors.prs_status_name_am
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.prs_status_name_am &&
                    validation.errors.prs_status_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_status_name_en")}<span className="text-danger">*</span></Label>
                    <Input
                      name="prs_status_name_en"
                      type="text"
                      placeholder={t("prs_status_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_status_name_en || ""}
                      invalid={
                        validation.touched.prs_status_name_en &&
                        validation.errors.prs_status_name_en
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.prs_status_name_en &&
                    validation.errors.prs_status_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_status_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_color_code")}</Label>
                    <Input
                      name="prs_color_code"
                      type="text"
                      placeholder={t("prs_color_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_color_code || ""}
                      invalid={
                        validation.touched.prs_color_code &&
                        validation.errors.prs_color_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_color_code &&
                    validation.errors.prs_color_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_color_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_order_number")}</Label>
                    <Input
                      name="prs_order_number"
                      type="text"
                      placeholder={t("prs_order_number")}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only integers (numeric values)
                        if (/^\d*$/.test(value)) {
                          validation.handleChange(e);
                        }
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.prs_order_number || ""}
                      invalid={
                        validation.touched.prs_order_number &&
                        validation.errors.prs_order_number
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.prs_order_number &&
                    validation.errors.prs_order_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_order_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("prs_description")}</Label>
                    <Input
                      name="prs_description"
                      type="textarea"
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
                      maxLength={425}
                    />
                    {validation.touched.prs_description &&
                    validation.errors.prs_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.prs_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectStatus.isPending ||
                      updateProjectStatus.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectStatus.isPending ||
                            updateProjectStatus.isPending ||
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
                            addProjectStatus.isPending ||
                            updateProjectStatus.isPending ||
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
ProjectStatusModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectStatusModel;
