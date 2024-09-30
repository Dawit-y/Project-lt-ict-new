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
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";

import {
  getDepartment as onGetDepartment,
  addDepartment as onAddDepartment,
  updateDepartment as onUpdateDepartment,
  deleteDepartment as onDeleteDepartment,
} from "../../store/department/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import DepartmentModal from "./DepartmentModal";
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
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { error } from "toastr";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const DepartmentModel = () => {
  //meta title
  document.title = " Department";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [department, setDepartment] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
  //START FOREIGN CALLS

  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      dep_name_or: (department && department.dep_name_or) || "",
      dep_name_am: (department && department.dep_name_am) || "",
      dep_name_en: (department && department.dep_name_en) || "",
      dep_code: (department && department.dep_code) || "",
      dep_available_at_region:
        (department && department.dep_available_at_region) || "",
      dep_available_at_zone:
        (department && department.dep_available_at_zone) || "",
      dep_available_at_woreda:
        (department && department.dep_available_at_woreda) || "",
      dep_description: (department && department.dep_description) || "",
      dep_status: (department && department.dep_status) || "",

      is_deletable: (department && department.is_deletable) || 1,
      is_editable: (department && department.is_editable) || 1,
    },

    validationSchema: Yup.object({
      dep_name_or: Yup.string().required(t("dep_name_or")),
      dep_name_am: Yup.string().required(t("dep_name_am")),
      dep_name_en: Yup.string().required(t("dep_name_en")),
      dep_code: Yup.string().required(t("dep_code")),
      dep_available_at_region: Yup.string().required(
        t("dep_available_at_region")
      ),
      dep_available_at_zone: Yup.string().required(t("dep_available_at_zone")),
      dep_available_at_woreda: Yup.string().required(
        t("dep_available_at_woreda")
      ),
      dep_description: Yup.string().required(t("dep_description")),
      dep_status: Yup.string().required(t("dep_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateDepartment = {
          dep_id: department ? department.dep_id : 0,
          // dep_id:department.dep_id,
          dep_name_or: values.dep_name_or,
          dep_name_am: values.dep_name_am,
          dep_name_en: values.dep_name_en,
          dep_code: values.dep_code,
          dep_available_at_region: values.dep_available_at_region,
          dep_available_at_zone: values.dep_available_at_zone,
          dep_available_at_woreda: values.dep_available_at_woreda,
          dep_description: values.dep_description,
          dep_status: values.dep_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Department
        dispatch(onUpdateDepartment(updateDepartment));
        validation.resetForm();
      } else {
        const newDepartment = {
          dep_name_or: values.dep_name_or,
          dep_name_am: values.dep_name_am,
          dep_name_en: values.dep_name_en,
          dep_code: values.dep_code,
          dep_available_at_region: values.dep_available_at_region,
          dep_available_at_zone: values.dep_available_at_zone,
          dep_available_at_woreda: values.dep_available_at_woreda,
          dep_description: values.dep_description,
          dep_status: values.dep_status,
        };
        // save new Departments
        console.log("added dept", newDepartment);
        dispatch(onAddDepartment(newDepartment));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch Department on component mount
  useEffect(() => {
    dispatch(onGetDepartment());
  }, [dispatch]);

  const departmentProperties = createSelector(
    (state) => state.DepartmentR, // this is geting from  reducer
    (DepartmentReducer) => ({
      // this is from Project.reducer
      department: DepartmentReducer.department,
      loading: DepartmentReducer.loading,
      update_loading: DepartmentReducer.update_loading,
      error: DepartmentReducer.error,
    })
  );

  const {
    department: { data, previledge },
    loading,
    update_loading,
  } = useSelector(departmentProperties);

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
    setDepartment(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setDepartment(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setDepartment(null);
    } else {
      setModal(true);
    }
  };

  const handleDepartmentClick = (arg) => {
    const department = arg;
    // console.log("handleDepartmentClick", department);
    setDepartment({
      dep_id: department.dep_id,
      dep_name_or: department.dep_name_or,
      dep_name_am: department.dep_name_am,
      dep_name_en: department.dep_name_en,
      dep_code: department.dep_code,
      dep_available_at_region: department.dep_available_at_region,
      dep_available_at_zone: department.dep_available_at_zone,
      dep_available_at_woreda: department.dep_available_at_woreda,
      dep_description: department.dep_description,
      dep_status: department.dep_status,

      is_deletable: department.is_deletable,
      is_editable: department.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (department) => {
    setDepartment(department);
    setDeleteModal(true);
  };

  const handleDeleteDepartment = () => {
    if (department && department.dep_id) {
      dispatch(onDeleteDepartment(department.dep_id));
      setDeleteModal(false);
    }
  };
  const handleDepartmentClicks = () => {
    setIsEdit(false);
    setDepartment("");
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
        accessorKey: "dep_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_available_at_region",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.dep_available_at_region,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_available_at_zone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_available_at_zone, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_available_at_woreda",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(
                cellProps.row.original.dep_available_at_woreda,
                30
              ) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "dep_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dep_status, 30) || "-"}
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
                    handleDepartmentClick(data);
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
  }, [handleDepartmentClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  return (
    <React.Fragment>
      <DepartmentModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteDepartment}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("department")}
            breadcrumbItem={t("department")}
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
                      handleUserClick={handleDepartmentClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("department")}
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
                ? t("edit") + " " + t("department")
                : t("add") + " " + t("department")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateDepartment(validation.values, modalCallback);
                  } else {
                    onAddDepartment(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_name_or")}</Label>
                    <Input
                      name="dep_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_name_or || ""}
                      invalid={
                        validation.touched.dep_name_or &&
                        validation.errors.dep_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_name_or &&
                    validation.errors.dep_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_name_am")}</Label>
                    <Input
                      name="dep_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_name_am || ""}
                      invalid={
                        validation.touched.dep_name_am &&
                        validation.errors.dep_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_name_am &&
                    validation.errors.dep_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_name_en")}</Label>
                    <Input
                      name="dep_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_name_en || ""}
                      invalid={
                        validation.touched.dep_name_en &&
                        validation.errors.dep_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_name_en &&
                    validation.errors.dep_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_code")}</Label>
                    <Input
                      name="dep_code"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_code || ""}
                      invalid={
                        validation.touched.dep_code &&
                        validation.errors.dep_code
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_code &&
                    validation.errors.dep_code ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_code}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  {/* region form Area 
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_available_at_region")}</Label>
                    <Input
                      name="dep_available_at_region"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_available_at_region || ""}
                      invalid={
                        validation.touched.dep_available_at_region &&
                        validation.errors.dep_available_at_region
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_available_at_region &&
                    validation.errors.dep_available_at_region ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_available_at_region}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_available_at_zone")}</Label>
                    <Input
                      name="dep_available_at_zone"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_available_at_zone || ""}
                      invalid={
                        validation.touched.dep_available_at_zone &&
                        validation.errors.dep_available_at_zone
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_available_at_zone &&
                    validation.errors.dep_available_at_zone ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_available_at_zone}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_available_at_woreda")}</Label>
                    <Input
                      name="dep_available_at_woreda"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_available_at_woreda || ""}
                      invalid={
                        validation.touched.dep_available_at_woreda &&
                        validation.errors.dep_available_at_woreda
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_available_at_woreda &&
                    validation.errors.dep_available_at_woreda ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_available_at_woreda}
                      </FormFeedback>
                    ) : null}
                  </Col> */}
                  <CascadingDropdowns
                    validation={validation}
                    dropdown1name="dep_available_at_region"
                    dropdown2name="dep_available_at_zone"
                    dropdown3name="dep_available_at_woreda"
                  />
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_description")}</Label>
                    <Input
                      name="dep_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_description || ""}
                      invalid={
                        validation.touched.dep_description &&
                        validation.errors.dep_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_description &&
                    validation.errors.dep_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("dep_status")}</Label>
                    <Input
                      name="dep_status"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.dep_status || ""}
                      invalid={
                        validation.touched.dep_status &&
                        validation.errors.dep_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.dep_status &&
                    validation.errors.dep_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.dep_status}
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
DepartmentModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default DepartmentModel;
