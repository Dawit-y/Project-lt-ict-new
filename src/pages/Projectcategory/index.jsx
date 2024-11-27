import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getProjectCategory as onGetProjectCategory,
  addProjectCategory as onAddProjectCategory,
  updateProjectCategory as onUpdateProjectCategory,
  deleteProjectCategory as onDeleteProjectCategory,
} from "../../store/projectcategory/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ProjectCategoryModal from "./ProjectCategoryModal";
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
} from "reactstrap";
import { ToastContainer } from "react-toastify";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectCategoryModel = () => {
  //meta title
  document.title = " ProjectCategory";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [projectCategory, setProjectCategory] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      pct_name_or: (projectCategory && projectCategory.pct_name_or) || "",
      pct_name_am: (projectCategory && projectCategory.pct_name_am) || "",
      pct_name_en: (projectCategory && projectCategory.pct_name_en) || "",
      pct_code: (projectCategory && projectCategory.pct_code) || "",
      pct_description:
        (projectCategory && projectCategory.pct_description) || "",
      pct_status: (projectCategory && projectCategory.pct_status) || "",

      is_deletable: (projectCategory && projectCategory.is_deletable) || 1,
      is_editable: (projectCategory && projectCategory.is_editable) || 1,
    },

    validationSchema: Yup.object({
      pct_name_or: Yup.string()
        .required(t("pct_name_or"))
        .test("unique-code", t("Already exists"), (value) => {
          return !data.some((item) => item.pct_name_or == value);
        }),
      //pct_name_or: Yup.string().required(t("pct_name_or")),
      pct_name_am: Yup.string().required(t("pct_name_am")),
      pct_name_en: Yup.string().required(t("pct_name_en")),
      //pct_code: Yup.string().required(t("pct_code")),
      //pct_description: Yup.string().required(t("pct_description")),
      //pct_status: Yup.string().required(t("pct_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectCategory = {
          pct_id: projectCategory ? projectCategory.pct_id : 0,
          pct_name_or: values.pct_name_or,
          pct_name_am: values.pct_name_am,
          pct_name_en: values.pct_name_en,
          pct_code: values.pct_code,
          pct_description: values.pct_description,
          pct_status: values.pct_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectCategory
        dispatch(onUpdateProjectCategory(updateProjectCategory));
        validation.resetForm();
      } else {
        const newProjectCategory = {
          pct_name_or: values.pct_name_or,
          pct_name_am: values.pct_name_am,
          pct_name_en: values.pct_name_en,
          pct_code: values.pct_code,
          pct_description: values.pct_description,
          pct_status: values.pct_status,
        };
        // save new ProjectCategorys
        dispatch(onAddProjectCategory(newProjectCategory));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch ProjectCategory on component mount
  useEffect(() => {
    dispatch(onGetProjectCategory());
  }, [dispatch]);

  const projectCategoryProperties = createSelector(
    (state) => state.ProjectCategoryR, // this is geting from  reducer
    (ProjectCategoryReducer) => ({
      // this is from Project.reducer
      projectCategory: ProjectCategoryReducer.projectCategory,
      loading: ProjectCategoryReducer.loading,
      update_loading: ProjectCategoryReducer.update_loading,
    })
  );

  const {
    projectCategory: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectCategoryProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
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
    setProjectCategory(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectCategory(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectCategory(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectCategoryClick = (arg) => {
    const projectCategory = arg;
    // console.log("handleProjectCategoryClick", projectCategory);
    setProjectCategory({
      pct_id: projectCategory.pct_id,
      pct_name_or: projectCategory.pct_name_or,
      pct_name_am: projectCategory.pct_name_am,
      pct_name_en: projectCategory.pct_name_en,
      pct_code: projectCategory.pct_code,
      pct_description: projectCategory.pct_description,
      pct_status: projectCategory.pct_status,

      is_deletable: projectCategory.is_deletable,
      is_editable: projectCategory.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (projectCategory) => {
    setProjectCategory(projectCategory);
    setDeleteModal(true);
  };

  const handleDeleteProjectCategory = () => {
    if (projectCategory && projectCategory.pct_id) {
      dispatch(onDeleteProjectCategory(projectCategory.pct_id));
      setDeleteModal(false);
    }
  };
  const handleProjectCategoryClicks = () => {
    setIsEdit(false);
    setProjectCategory("");
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

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "pct_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pct_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pct_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pct_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pct_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pct_name_en, 30) || "-"}
            </span>
          );
        },
      },
    /*  {
        header: "",
        accessorKey: "pct_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pct_code, 30) || "-"}
            </span>
          );
        },
      },*/
      {
        header: "",
        accessorKey: "pct_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pct_description, 30) || "-"}
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
                    handleProjectCategoryClick(data);
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
  }, [handleProjectCategoryClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <ProjectCategoryModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectCategory}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("project_category")}
            breadcrumbItem={t("project_category")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleProjectCategoryClicks}
                      isPagination={true}
                      SearchPlaceholder={ t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_category")}
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
                ? t("edit") + " " + t("project_category")
                : t("add") + " " + t("project_category")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateProjectCategory(validation.values, modalCallback);
                  } else {
                    onAddProjectCategory(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pct_name_or")}<span className="text-danger">*</span></Label>
                    <Input
                      name="pct_name_or"
                      type="text"
                      placeholder={t("pct_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pct_name_or || ""}
                      invalid={
                        validation.touched.pct_name_or &&
                        validation.errors.pct_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pct_name_or &&
                    validation.errors.pct_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pct_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pct_name_am")}<span className="text-danger">*</span></Label>
                    <Input
                      name="pct_name_am"
                      type="text"
                      placeholder={t("pct_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pct_name_am || ""}
                      invalid={
                        validation.touched.pct_name_am &&
                        validation.errors.pct_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pct_name_am &&
                    validation.errors.pct_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pct_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pct_name_en")}<span className="text-danger">*</span></Label>
                    <Input
                      name="pct_name_en"
                      type="text"
                      placeholder={t("pct_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pct_name_en || ""}
                      invalid={
                        validation.touched.pct_name_en &&
                        validation.errors.pct_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pct_name_en &&
                    validation.errors.pct_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pct_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pct_code")}</Label>
                    <Input
                      name="pct_code"
                      type="text"
                      placeholder={t("pct_code")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pct_code || ""}
                      invalid={
                        validation.touched.pct_code &&
                        validation.errors.pct_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pct_code &&
                    validation.errors.pct_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pct_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pct_description")}</Label>
                    <Input
                      name="pct_description"
                      type="textarea"
                      rows={2}
                      placeholder={t("pct_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pct_description || ""}
                      invalid={
                        validation.touched.pct_description &&
                        validation.errors.pct_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pct_description &&
                    validation.errors.pct_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pct_description}
                      </FormFeedback>
                    ) : null}
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
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};
ProjectCategoryModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectCategoryModel;
