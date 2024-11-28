import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getProjectStakeholder as onGetProjectStakeholder,
  addProjectStakeholder as onAddProjectStakeholder,
  updateProjectStakeholder as onUpdateProjectStakeholder,
  deleteProjectStakeholder as onDeleteProjectStakeholder,
} from "../../store/projectstakeholder/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ProjectStakeholderModal from "./ProjectStakeholderModal";
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

const ProjectStakeholderModel = (props) => {
  //  get passed data from tab
  const { passedId } = props;
  //meta title
  document.title = " ProjectStakeholder";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [projectStakeholder, setProjectStakeholder] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS
  const [stakeholderTypeOptions, setStakeholderTypeOptions] = useState([]);
  const [selectedStakeholderType, setSelectedStakeholderType] = useState("");

  useEffect(() => {
    const fetchStakeholderType = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}stakeholder_type/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.sht_type_name_or.toString(),
          value: item.sht_id.toString(),
        }));
        const optionsWithDefault = [
          { label: "Select Stakeholder Type", value: "" },
          ...transformedData,
        ];
        setStakeholderTypeOptions(optionsWithDefault);
      } catch (error) {
        console.error("Error fetching budget years:", error);
      }
    };
    fetchStakeholderType();
  }, []);
  const handleStakeholderTypeChange = (e) => {
    setSelectedStakeholderType(e.target.value);
    validation.setFieldValue("psh_stakeholder_type", e.target.value);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      psh_project_id: passedId,
      psh_name: (projectStakeholder && projectStakeholder.psh_name) || "",
      psh_representative_name:
        (projectStakeholder && projectStakeholder.psh_representative_name) ||
        "",
      psh_representative_phone:
        (projectStakeholder && projectStakeholder.psh_representative_phone) ||
        "",
      psh_role: (projectStakeholder && projectStakeholder.psh_role) || "",
      psh_description:
        (projectStakeholder && projectStakeholder.psh_description) || "",
      psh_status: (projectStakeholder && projectStakeholder.psh_status) || "",

      is_deletable:
        (projectStakeholder && projectStakeholder.is_deletable) || 1,
      is_editable: (projectStakeholder && projectStakeholder.is_editable) || 1,
    },

    validationSchema: Yup.object({
      // psh_project_id: Yup.string().required(t("psh_project_id")),
      psh_name: Yup.string().required(t("psh_name")),
      psh_representative_name: Yup.string().required(
        t("psh_representative_name")
      ),
      psh_representative_phone: Yup.string().required(
        t("psh_representative_phone")
      ),
      //psh_role: Yup.string().required(t("psh_role")),
      //psh_description: Yup.string().required(t("psh_description")),
      //psh_status: Yup.string().required(t("psh_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectStakeholder = {
          psh_id: projectStakeholder ? projectStakeholder.psh_id : 0,
          psh_project_id: values.psh_project_id,
          psh_name: values.psh_name,
          psh_representative_name: values.psh_representative_name,
          psh_representative_phone: values.psh_representative_phone,
          psh_role: values.psh_role,
          psh_description: values.psh_description,
          psh_status: values.psh_status,
          psh_stakeholder_type: values.psh_stakeholder_type,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectStakeholder
        dispatch(onUpdateProjectStakeholder(updateProjectStakeholder));
        validation.resetForm();
      } else {
        const newProjectStakeholder = {
          psh_project_id: values.psh_project_id,
          psh_name: values.psh_name,
          psh_representative_name: values.psh_representative_name,
          psh_representative_phone: values.psh_representative_phone,
          psh_role: values.psh_role,
          psh_description: values.psh_description,
          psh_status: values.psh_status,
          psh_stakeholder_type: values.psh_stakeholder_type,

        };
        // save new ProjectStakeholders
        dispatch(onAddProjectStakeholder(newProjectStakeholder));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch ProjectStakeholder on component mount
  useEffect(() => {
    dispatch(onGetProjectStakeholder(passedId));
  }, [dispatch]);

  const projectStakeholderProperties = createSelector(
    (state) => state.ProjectStakeholderR, // this is geting from  reducer
    (ProjectStakeholderReducer) => ({
      // this is from Project.reducer
      projectStakeholder: ProjectStakeholderReducer.projectStakeholder,
      loading: ProjectStakeholderReducer.loading,
      update_loading: ProjectStakeholderReducer.update_loading,
    })
  );

  const {
    projectStakeholder: { data, previledge },
    loading,
    update_loading,
  } = useSelector(projectStakeholderProperties);

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
    setProjectStakeholder(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectStakeholder(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectStakeholder(null);
    } else {
      setModal(true);
    }
  };

  const handleProjectStakeholderClick = (arg) => {
    const projectStakeholder = arg;
    // console.log("handleProjectStakeholderClick", projectStakeholder);
    setProjectStakeholder({
      psh_id: projectStakeholder.psh_id,
      psh_project_id: projectStakeholder.psh_project_id,
      psh_name: projectStakeholder.psh_name,
      psh_representative_name: projectStakeholder.psh_representative_name,
      psh_representative_phone: projectStakeholder.psh_representative_phone,
      psh_role: projectStakeholder.psh_role,
      psh_description: projectStakeholder.psh_description,
      psh_status: projectStakeholder.psh_status,
      psh_stakeholder_type: projectStakeholder.psh_stakeholder_type,
      is_deletable: projectStakeholder.is_deletable,
      is_editable: projectStakeholder.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (projectStakeholder) => {
    setProjectStakeholder(projectStakeholder);
    setDeleteModal(true);
  };

  const handleDeleteProjectStakeholder = () => {
    if (projectStakeholder && projectStakeholder.psh_id) {
      dispatch(onDeleteProjectStakeholder(projectStakeholder.psh_id));
      setDeleteModal(false);
    }
  };
  const handleProjectStakeholderClicks = () => {
    setIsEdit(false);
    setProjectStakeholder("");
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
        accessorKey: "psh_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_representative_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.psh_representative_name,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_representative_phone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.psh_representative_phone,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_role",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_role, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "psh_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_description, 30) || "-"}
            </span>
          );
        },
      },
      /*{
        header: "",
        accessorKey: "psh_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.psh_status, 30) || "-"}
            </span>
          );
        },
      },*/

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
                    handleProjectStakeholderClick(data);
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
  }, [handleProjectStakeholderClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <ProjectStakeholderModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProjectStakeholder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className={passedId ? "" : "page-content"}>
        <div className="container-fluid1">
          {/* <Breadcrumbs
            title={t("project_stakeholder")}
            breadcrumbItem={t("project_stakeholder")}
          /> */}
          {passedId ? null : (
            <Breadcrumbs
              title={t("project_stakeholder")}
              breadcrumbItem={t("project_stakeholder")}
            />
          )}
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleProjectStakeholderClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("project_stakeholder")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("project_stakeholder")
                : t("add") + " " + t("project_stakeholder")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateProjectStakeholder(
                      validation.values,
                      modalCallback
                    );
                  } else {
                    onAddProjectStakeholder(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
               
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_name")}<span className="text-danger">*</span></Label>
                    <Input
                      name="psh_name"
                      type="text"
                      placeholder={t("psh_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_name || ""}
                      invalid={
                        validation.touched.psh_name &&
                        validation.errors.psh_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_name &&
                    validation.errors.psh_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_stakeholder_type")}<span className="text-danger">*</span></Label>
                    <Input
                      name="psh_stakeholder_type"
                      type="select"
                      className="form-select"
                      onChange={handleStakeholderTypeChange}
                      onBlur={validation.handleBlur}
                      value={selectedStakeholderType}
                    >
                      {stakeholderTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.psh_stakeholder_type &&
                    validation.errors.psh_stakeholder_type ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_stakeholder_type}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_representative_name")}<span className="text-danger">*</span></Label>
                    <Input
                      name="psh_representative_name"
                      type="text"
                      placeholder={t("psh_representative_name")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_representative_name || ""}
                      invalid={
                        validation.touched.psh_representative_name &&
                        validation.errors.psh_representative_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_representative_name &&
                    validation.errors.psh_representative_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_representative_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_representative_phone")}<span className="text-danger">*</span></Label>
                    <Input
                      name="psh_representative_phone"
                      type="text"
                      placeholder={t("psh_representative_phone")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_representative_phone || ""}
                      invalid={
                        validation.touched.psh_representative_phone &&
                        validation.errors.psh_representative_phone
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_representative_phone &&
                    validation.errors.psh_representative_phone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_representative_phone}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_role")}</Label>
                    <Input
                      name="psh_role"
                      type="text"
                      placeholder={t("psh_role")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_role || ""}
                      invalid={
                        validation.touched.psh_role &&
                        validation.errors.psh_role
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_role &&
                    validation.errors.psh_role ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_role}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("psh_description")}</Label>
                    <Input
                      name="psh_description"
                      type="text"
                      placeholder={t("psh_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_description || ""}
                      invalid={
                        validation.touched.psh_description &&
                        validation.errors.psh_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.psh_description &&
                    validation.errors.psh_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3" style={{ display: 'none'}}>
                    <Label>{t("psh_status")}</Label>
                    <Input
                      name="psh_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "psh_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.psh_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.psh_status &&
                    validation.errors.psh_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.psh_status}
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
ProjectStakeholderModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectStakeholderModel;
