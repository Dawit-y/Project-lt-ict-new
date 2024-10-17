import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
// pages
import UserRoles from "../../pages/Userrole/index";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  getUsers as onGetUsers,
  addUsers as onAddUsers,
  updateUsers as onUpdateUsers,
  deleteUsers as onDeleteUsers,
} from "../../store/users/actions";
//  import department
import {
  getDepartment as onGetDepartment,

} from "../../store/department/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import UsersModal from "./UsersModal";
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

} from "reactstrap";
import { ToastContainer } from "react-toastify";
import RightOffCanvas from "../../components/Common/RightOffCanvas";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const UsersModel = () => {
  //meta title
  document.title = " Users";

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [users, setUsers] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed

  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedState,setselectedState]=useState("")

  const [selectedImage, setSelectedImage] = useState(null);

  const [userMetaData, setUserData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);


  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
      usr_email: (users && users.usr_email) || "",
      usr_password: (users && users.usr_password) || "",
      usr_full_name: (users && users.usr_full_name) || "",
      usr_phone_number: (users && users.usr_phone_number) || "",
      usr_role_id: (users && users.usr_role_id) || "",
      usr_region_id: (users && users.usr_region_id) || "",
      usr_woreda_id: (users && users.usr_woreda_id) || "",
      usr_kebele_id: (users && users.usr_kebele_id) || "",
      usr_sector_id: (users && users.usr_sector_id) || "",
      usr_is_active: (users && users.usr_is_active) || "",
      usr_picture: (users && users.usr_picture) || "",
      usr_last_logged_in: (users && users.usr_last_logged_in) || "",
      usr_ip: (users && users.usr_ip) || "",
      usr_remember_token: (users && users.usr_remember_token) || "",
      usr_notified: (users && users.usr_notified) || "",
      usr_description: (users && users.usr_description) || "",
      usr_status: (users && users.usr_status) || "",
      usr_department_id: (users && users.usr_department_id) || "",

      is_deletable: (users && users.is_deletable) || 1,
      is_editable: (users && users.is_editable) || 1,
    },

    validationSchema: Yup.object({
      usr_email: Yup.string().required(t("usr_email")),
      usr_password: Yup.string().required(t("usr_password")),
      usr_full_name: Yup.string().required(t("usr_full_name")),
      usr_phone_number: Yup.string().required(t("usr_phone_number")),
      usr_role_id: Yup.string().required(t("usr_role_id")),
      usr_sector_id: Yup.string().required(t("usr_sector_id")),
      usr_department_id: Yup.string().required(t("usr_department_id")),
      usr_description: Yup.string().required(t("usr_description")),
      usr_status: Yup.string().required(t("usr_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateUsers = {
          usr_id: users ? users.usr_id : 0,
          // usr_id:users.usr_id,
          usr_email: values.usr_email,
          usr_password: values.usr_password,
          usr_full_name: values.usr_full_name,
          usr_phone_number: values.usr_phone_number,
          usr_role_id: values.usr_role_id,
          usr_region_id: values.usr_region_id,
          usr_woreda_id: values.usr_woreda_id,
          usr_kebele_id: values.usr_kebele_id,
          usr_sector_id: values.usr_sector_id,
          usr_is_active: values.usr_is_active,
          usr_picture: values.usr_picture,
          usr_last_logged_in: values.usr_last_logged_in,
          usr_ip: values.usr_ip,
          usr_remember_token: values.usr_remember_token,
          usr_notified: values.usr_notified,
          usr_description: values.usr_description,
          usr_status: values.usr_status,
          usr_department_id: values.usr_department_id,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Users
        dispatch(onUpdateUsers(updateUsers));
        validation.resetForm();
      } else {
        const newUsers = {
          usr_email: values.usr_email,
          usr_password: values.usr_password,
          usr_full_name: values.usr_full_name,
          usr_phone_number: values.usr_phone_number,
          usr_role_id: Number(values.usr_role_id),
          usr_region_id: Number(values.usr_region_id),
          usr_woreda_id: Number(values.usr_woreda_id),
          usr_kebele_id: Number(values.usr_kebele_id),
          usr_sector_id: Number(values.usr_sector_id),
          usr_is_active: Number(values.usr_is_active),
          usr_picture: values.usr_picture,
          usr_last_logged_in: values.usr_last_logged_in,
          usr_ip: values.usr_ip,
          usr_remember_token: values.usr_remember_token,
          usr_notified: Number(values.usr_notified),
          usr_description: values.usr_description,
          usr_status: Number(values.usr_status),
          usr_department_id: Number(values.usr_department_id)
        };

        dispatch(onAddUsers(newUsers));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch Users on component mount
  useEffect(() => {
    dispatch(onGetUsers());
  }, [dispatch]);

  const usersProperties = createSelector(
    (state) => state.UsersR, // this is geting from  reducer
    (UsersReducer) => ({
      // this is from Project.reducer
      users: UsersReducer.users,
      loading: UsersReducer.loading,
      update_loading: UsersReducer.update_loading,
    })
  );

  const {
    users: { data, previledge },
    loading,
    update_loading,
  } = useSelector(usersProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
    setModal(false);
  }, [update_loading]);



  // fetch department form state 

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
    department: { data: datadepartment, previledge: department },
    loading_department,
    update_loading_department,
  } = useSelector(departmentProperties);



  useEffect(() => {
    console.log("update_loading in useEffect", update_loading_department);
    setModal(false);
  }, [update_loading_department]);

  // end  fetch dpt

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
  useEffect(() => {
    setUsers(data);
  }, [data]);

  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setUsers(data);
      setIsEdit(false);
    }
  }, [data]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setUsers(null);
    } else {
      setModal(true);
    }
  };

  const handleUsersClick = (arg) => {
    const users = arg;
    setUsers({
      usr_id: users.usr_id,
      usr_email: users.usr_email,
      usr_password: users.usr_password,
      usr_full_name: users.usr_full_name,
      usr_phone_number: users.usr_phone_number,
      usr_role_id: Number(users.usr_role_id),
      usr_region_id:Number( users.usr_region_id),
      usr_woreda_id:Number( users.usr_woreda_id),
      usr_kebele_id: Number(users.usr_kebele_id),
      usr_sector_id: Number(users.usr_sector_id),
      usr_is_active: users.usr_is_active,
      usr_picture: users.usr_picture,
      usr_last_logged_in: users.usr_last_logged_in,
      usr_ip: users.usr_ip,
      usr_remember_token: users.usr_remember_token,
      usr_notified: users.usr_notified,
      usr_description: users.usr_description,
      usr_status: users.usr_status,
      usr_department_id: Number(users.usr_department_id),

      is_deletable: users.is_deletable,
      is_editable: users.is_editable,
    });

    setIsEdit(true);

    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (users) => {
    setUsers(users);
    setDeleteModal(true);
  };

  const handleClick = (data) => {
    setShowCanvas(!showCanvas); // Toggle canvas visibility
    // setProjectMetaData(data);
    setUserData(data);
  };

  const handleDeleteUsers = () => {
    if (users && users.usr_id) {
      dispatch(onDeleteUsers(users.usr_id));
      setDeleteModal(false);
    }
  };
  const handleUsersClicks = () => {
    setIsEdit(false);
    setUsers("");
    toggle();
  };
  const handleSearch = () => {
    setSearchLoading(true); // Set loading to true when search is initiated// Update filtered data with search results
    setShowSearchResults(true); // Show search results
    setSearchLoading(false);
  };

  const columnDefs = useMemo(() => {
    const baseColumns = [
      {
        headerName: t("usr_email"),
        field: "usr_email",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.usr_email, 30) || "-",
      },

      {
        headerName: t("usr_full_name"),
        field: "usr_full_name",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.usr_full_name, 30) || "-",
      },
      {
        headerName: t("usr_phone_number"),
        field: "usr_phone_number",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.usr_phone_number, 30) || "-",
      },

     
      {
        headerName: t("usr_sector_id"),
        field: "usr_sector_id",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.usr_sector_id, 30) || "-",
      },
      {
        headerName: t("usr_is_active"),
        field: "usr_is_active",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.usr_is_active, 30) || "-",
      },

      {
        headerName: t("view_detail"),
        sortable: true,
        filter: false,

        cellRenderer: (params) => (
          <Button
            type="button"
            color="primary"
            className="btn-sm"
            onClick={() => {
              const userdata = params.data;
              toggleViewModal(userdata);
              setTransaction(userdata);
            }}
          >
            {t("view_detail")}
          </Button>
        ),
      },
    ];

    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
      baseColumns.push({
        headerName: t("Action"),
        sortable: true,
        filter: false,
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            {params.data.is_editable && (
              <Link
                to="#"
                className="text-success"
                
                onClick={() => {
                 
                  handleUsersClick(params.data);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
            )}

            {/* add view project  */}
            {params.data.is_editable ? (
              <Link
                to="#"
                className="text-secondary ms-2"
                onClick={() => handleClick(params.data)}
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            ) : (
              ""
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [handleUsersClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

  //  img upload
  const handleImageChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      validation.setFieldValue("projectImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // When selection changes, update selectedRows
  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  // Filter by marked rows
  const filterMarked = () => {
    if (gridRef.current) {
      gridRef.current.api.setRowData(selectedRows);
    }
  };
  // Clear the filter and show all rows again
  const clearFilter = () => {
    gridRef.current.api.setRowData(showSearchResults ? results : data);
  };
  return (
    <React.Fragment>
      <UsersModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUsers}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title={t("users")} breadcrumbItem={t("users")} />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <div
              className="ag-theme-alpine"
              style={{ height: "100%", width: "100%" }}
            >
              {/* Row for search input and buttons */}
              <Row className="mb-3">
                <Col sm="12" md="6">
                  {/* Search Input for  Filter */}
                  <Input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setQuickFilterText(e.target.value)}
                    className="mb-2"
                  />
                </Col>
                <Col sm="12" md="6" className="text-md-end">
                  <Button
                    color="primary"
                    className="me-2"
                    onClick={filterMarked}
                  >
                    Filter Marked
                  </Button>
                  <Button
                    color="secondary"
                    className="me-2"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                  <Button color="success" onClick={handleUsersClicks}>
                    Add New
                  </Button>
                </Col>
              </Row>

              {/* AG Grid */}
              <div style={{ height: "400px" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={showSearchResults ? results : data}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                  paginationPageSize={10}
                  quickFilterText={quickFilterText}
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? t("edit") + " " + t("users")
                : t("add") + " " + t("users")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateUsers(validation.values, modalCallback);
                  } else {
                    onAddUsers(validation.values, modalCallback);
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_email")}</Label>
                    <Input
                      name="usr_email"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_email || ""}
                      invalid={
                        validation.touched.usr_email &&
                          validation.errors.usr_email
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_email &&
                      validation.errors.usr_email ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_email}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_password")}</Label>
                    <Input
                      name="usr_password"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_password || ""}
                      invalid={
                        validation.touched.usr_password &&
                          validation.errors.usr_password
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_password &&
                      validation.errors.usr_password ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_password}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_full_name")}</Label>
                    <Input
                      name="usr_full_name"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_full_name || ""}
                      invalid={
                        validation.touched.usr_full_name &&
                          validation.errors.usr_full_name
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_full_name &&
                      validation.errors.usr_full_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_full_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_phone_number")}</Label>
                    <Input
                      name="usr_phone_number"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_phone_number || ""}
                      invalid={
                        validation.touched.usr_phone_number &&
                          validation.errors.usr_phone_number
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_phone_number &&
                      validation.errors.usr_phone_number ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_phone_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_role_id")}</Label>
                    <Input
                      name="usr_role_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_role_id || ""}
                      invalid={
                        validation.touched.usr_role_id &&
                          validation.errors.usr_role_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_role_id &&
                      validation.errors.usr_role_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_role_id}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_sector_id")}</Label>
                    <Input
                      name="usr_sector_id"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_sector_id || ""}
                      invalid={
                        validation.touched.usr_sector_id &&
                          validation.errors.usr_sector_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_sector_id &&
                      validation.errors.usr_sector_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_sector_id}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_department_id")}</Label>
                    <Input
                      name="usr_department_id"
                      type="select"
                      className="form-select"
                     
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={selectedDepartment || ""}
                    >
                      {/* departmentOptions */}
                      {/* {datadepartment.map((option) => (
                        <option key={option.dep_id} value={Number(option.dep_id)}>
                          {t(`${option.dep_name_en}`)}
                        </option>
                      ))} */}
                      <option value="" disabled={!isEdit}>
                        {isEdit
                          ? datadepartment.find(
                              (option) => option.dep_id === validation.values.usr_department_id
                            )
                            ? datadepartment.find(
                                (option) => option.dep_id === validation.values.usr_department_id
                              ).dep_name_en
                            : t("Select Department")
                          : t("Select Department")}
                      </option>
                      {datadepartment.map((option) => (
                        <option key={option.dep_id} value={Number(option.dep_id)}>
                          {t(option.dep_name_en)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.usr_department_id &&
                      validation.errors.usr_department_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_department_id}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_description")}</Label>
                    <Input
                      name="usr_description"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_description || ""}
                      invalid={
                        validation.touched.usr_description &&
                          validation.errors.usr_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_description &&
                      validation.errors.usr_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_status")}</Label>
                    <Input
                      name="usr_status"
                      type="select"
                      className="form-select"
                      // onChange={(e) => {
                      //   validation.setFieldValue(
                      //     "usr_status",
                      //     Number(e.target.value)
                      //   );
                      // }}
                      onChange={validation.handleChange}
                      
                      onBlur={validation.handleBlur}
                      value={selectedState} //selectedState

                      invalid={
                        validation.touched.usr_status &&
                          validation.errors.usr_status
                          ? true
                          : false
                      }
                      
                    >
                    <option value="" disabled={!isEdit}>
                      {isEdit ? (validation.values.usr_status === 1 ? t("Active") : t("Inactive")) : "Select status"}
                    </option>
                    <option value={1}>{t("Active")}</option>
                    <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.usr_status &&
                      validation.errors.usr_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.usr_status}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-4 mb-3">
                    <CascadingDropdowns
                      validation={validation}
                      dropdown1name="usr_region_id"
                      dropdown2name="usr_woreda_id"
                      dropdown3name="usr_kebele_id"
                      isEdit={isEdit} // Set to true if in edit mode, otherwise false
                    />
                  </Col>
                  <Col className="col-md-8 mb-3" style={{ backgroundColor: "#f8f9fa", color: "#333", borderRadius: "8px", padding: "20px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <div className="mb-3">
                      <Label className="form-label" style={{ fontWeight: "bold", fontSize: "16px" }}>Upload User Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label
                              htmlFor="project-image-input"
                              className="mb-0"
                              id="projectImageInput"
                            >
                              <div className="avatar-xs">
                                <div className="avatar-title bg-primary border rounded-circle text-white cursor-pointer shadow-sm font-size-16">
                                  <i className="bx bxs-image-add"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="projectImageInput"
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="project-image-input"
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="avatar-xl" style={{ marginTop: "10px" }}>
                            <div className="avatar-title bg-light rounded-circle" style={{ overflow: "hidden", width: "120px", height: "120px", border: "2px solid #ddd" }}>
                              <img
                                src={selectedImage || "https://via.placeholder.com/120"}
                                id="projectlogo-img"
                                alt="User Image"
                                className="img-fluid rounded-circle"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          </div>
                        </div>
                        {validation.touched.usr_picture && validation.errors.usr_picture ? (
                          <FormFeedback type="invalid" className="d-block mt-2">
                            {validation.errors.usr_picture}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
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
      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={userMetaData.usr_name || "UserRoles"}
          id={userMetaData.usr_id}
          navItems={[]}
          components={[UserRoles]}
        />
      )}
    </React.Fragment>
  );
};
UsersModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default UsersModel;
