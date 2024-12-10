import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns1";
import CascadingDropdownsearch from "../../components/Common/CascadingDropdowns2";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
// pages
import UserRoles from "../../pages/Userrole/index";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
  useFetchUserss,
  useSearchUserss,
  useAddUsers,
  useDeleteUsers,
  useUpdateUsers,
} from "../../queries/users_query";

import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchDepartments } from "../../queries/department_query";
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
  ModalFooter,
  Badge,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import { createSelectOptions } from "../../utils/commonMethods";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const statusClasses = {
  1: "success", // Green for completed
  0: "danger", // Yellow for started
};
const statusText = {
  1: "Active", // Green for completed
  0: "Inactive", // Yellow for started
};
const UsersModel = () => {
  //meta title
  document.title = " Users";

  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchUserss();
  const { data: sectorInformationData } = useFetchSectorInformations();
  const sectorInformationOptions = createSelectOptions(
    sectorInformationData?.data || [],
    "sci_id",
    "sci_name_en"
  );
  const { data: departmentData } = useFetchDepartments();
  const departmentOptions = createSelectOptions(
    departmentData?.data || [],
    "dep_id",
    "dep_name_en"
  );

  const addUsers = useAddUsers();
  const updateUsers = useUpdateUsers();
  const deleteUsers = useDeleteUsers();
  const [users, setUsers] = useState(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [selectedState, setselectedState] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [userMetaData, setUserData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  //START CRUD
  const handleAddUsers = async (data) => {
    try {
      await addUsers.mutateAsync(data);
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

  const handleUpdateUsers = async (data) => {
    try {
      await updateUsers.mutateAsync(data);
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
  const handleDeleteUsers = async () => {
    if (users && users.usr_id) {
      try {
        const id = users.usr_id;
        await deleteUsers.mutateAsync(id);
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

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
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
      usr_email: Yup.string()
        .required(t("usr_email"))
        .test("unique-usr_email", t("Already exists"), (value) => {
          return !data?.data.some(
            (item) => item.usr_email == value && item.usr_id !== users?.usr_id
          );
        }),
      //usr_email: Yup.string().required(t("usr_email")),
      usr_password: Yup.string().required(t("usr_password")),
      usr_full_name: Yup.string().required(t("usr_full_name")),
      usr_phone_number: Yup.string().required(t("usr_phone_number")),
      usr_sector_id: Yup.string().required(t("usr_sector_id")),
      usr_department_id: Yup.string().required(t("usr_department_id")),
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
          usr_region_id: Number(values.usr_region_id),
          usr_woreda_id: Number(values.usr_woreda_id),
          usr_zone_id: Number(values.usr_zone_id),
          usr_kebele_id: Number(values.usr_kebele_id),
          usr_sector_id: Number(values.usr_sector_id),
          usr_is_active: Number(values.usr_is_active),
          usr_picture: values.usr_picture,
          usr_last_logged_in: values.usr_last_logged_in,
          usr_ip: values.usr_ip,
          usr_remember_token: values.usr_remember_token,
          usr_notified: Number(values.usr_notified),
          usr_description: values.usr_description,
          usr_status: values.usr_status,
          usr_department_id: Number(values.usr_department_id),

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update Users
        handleUpdateUsers(updateUsers);
        validation.resetForm();
      } else if (isDuplicateModalOpen) {
        const duplcateuser = {
          usr_email: "",
          usr_password: values.usr_password,
          usr_full_name: values.usr_full_name,
          usr_phone_number: values.usr_phone_number,
          usr_role_id: values.usr_role_id,
          usr_region_id: Number(values.usr_region_id),
          usr_zone_id: Number(values.usr_zone_id),
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
          usr_status: values.usr_status,
          usr_department_id: Number(values.usr_department_id),

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        setSelectedDepartment(values.usr_department_id);
        // update Users
        handleAddUsers(duplcateuser);
        validation.resetForm();
      } else {
        const newUsers = {
          usr_email: values.usr_email,
          usr_password: values.usr_password,
          usr_full_name: values.usr_full_name,
          usr_phone_number: values.usr_phone_number,
          usr_role_id: Number(values.usr_role_id),
          usr_region_id: Number(values.usr_region_id),
          usr_zone_id: Number(values.usr_zone_id),
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
          usr_department_id: Number(values.usr_department_id),
        };

        handleAddUsers(newUsers);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();

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
      setIsDuplicateModalOpen(false);
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
      usr_region_id: Number(users.usr_region_id),
      usr_woreda_id: Number(users.usr_woreda_id),
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
    //setSelectedDepartment(users.usr_department_id);
    //setSelectedSector(users.usr_sector_id);
    setIsEdit(true);

    toggle();
  };
  const handleUsersDuplicateClick = (arg) => {
    const users = arg;
    setUsers({
      usr_id: users.usr_id,
      usr_email: "",
      usr_password: users.usr_password,
      usr_full_name: users.usr_full_name,
      usr_phone_number: users.usr_phone_number,
      usr_role_id: Number(users.usr_role_id),
      usr_region_id: Number(users.usr_region_id),
      usr_woreda_id: Number(users.usr_woreda_id),
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

    setIsDuplicateModalOpen(true);

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
  const handleUsersClicks = () => {
    setIsEdit(false);
    setUsers("");
    toggle();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the image preview
        validation.setFieldValue("usr_picture", file); // Assuming usr_picture is the field in validation
      };
      reader.readAsDataURL(file);
    }
  };

  const columnDefs = useMemo(() => {
    const baseColumns = [
      {
        headerName: "Row",
        valueGetter: "node.rowIndex + 1",
        width: "70",
      },
      {
        headerName: t("usr_email"),
        field: "usr_email",
        sortable: true,
        filter: false,
        width: "200",
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
        width: "140",
        cellRenderer: (params) =>
          truncateText(params.data.usr_phone_number, 30) || "-",
      },
      {
        headerName: t("usr_sector_id"),
        width: "200",
        field: "sector_name",
        sortable: true,
        filter: false,
        cellRenderer: (params) =>
          truncateText(params.data.sector_name, 30) || "-",
      },
      {
        headerName: t("usr_is_active"),
        field: "usr_is_active",
        sortable: true,
        filter: false,
        cellRenderer: (params) => {
          // Determine badge class based on status value
          const badgeClass =
            statusClasses[params.data.usr_is_active] || "secondary";
          return (
            <Badge className={`font-size-12 badge-soft-${badgeClass}`}>
              {statusText[params.value]}
            </Badge>
          );
        },
      },
      {
        headerName: t("view_detail"),
        width: "140",
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
    if (
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
      baseColumns.push({
        headerName: t("Action"),
        sortable: true,
        filter: false,
        width: "230",
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
            {/* added duplicat  */}
            {/* Add duplicate project icon */}
            {params.data.is_editable && (
              <Link
                to="#"
                className="text-primary"
                onClick={() => {
                  handleUsersDuplicateClick(params.data);
                }}
              >
                <i
                  className="mdi mdi-content-duplicate font-size-18"
                  id="duplicateTooltip"
                />
                <UncontrolledTooltip placement="top" target="duplicateTooltip">
                  Duplicate
                </UncontrolledTooltip>
              </Link>
            )}
            {/* End of duplicate project icon */}
          </div>
        ),
      });
    }

    return baseColumns;
  }, [
    handleUsersClick,
    toggleViewModal,
    onClickDelete,
    handleUsersDuplicateClick,
  ]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
          <AdvancedSearch
            searchHook={useSearchUserss}
            textSearchKeys={["usr_email"]}
            dropdownSearchKeys={[]}
            checkboxSearchKeys={[]}
            Component={CascadingDropdownsearch}
            component_params={{
              dropdown1name: "usr_region_id",
              dropdown2name: "usr_zone_id",
              dropdown3name: "usr_woreda_id",
            }}
            onSearchResult={handleSearchResults}
            setIsSearchLoading={setIsSearchLoading}
            setSearchResults={setSearchResults}
            setShowSearchResult={setShowSearchResult}
          />
          {isLoading || isSearchLoading ? (
            <Spinners />
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
                  <Button color="success" onClick={handleUsersClicks}>
                    Add New
                  </Button>
                </Col>
              </Row>

              {/* AG Grid */}
              <div style={{ height: "600px" }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSizeSelector={[10, 20, 30, 40, 50]}
                  paginationPageSize={20}
                  quickFilterText={quickFilterText}
                  onSelectionChanged={onSelectionChanged}
                  rowHeight={30} // Set the row height here
                  animateRows={true} // Enables row animations
                  domLayout="autoHeight" // Auto-size the grid to fit content
                  onGridReady={(params) => {
                    params.api.sizeColumnsToFit(); // Size columns to fit the grid width
                  }}
                />
              </div>
            </div>
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {isDuplicateModalOpen ? (
                t("Duplicate ") + " " + t("users")
              ) : (
                <div>
                  {!!isEdit
                    ? t("edit") + " " + t("users")
                    : t("add") + " " + t("users")}
                </div>
              )}
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
                  <Col className="col-md-4 mb-3">
                    <Label>{t("usr_email")}</Label>
                    <Input
                      name="usr_email"
                      type="text"
                      placeholder={t("usr_email")}
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
                      placeholder={t("usr_password")}
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
                      placeholder={t("usr_full_name")}
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
                      type="number"
                      placeholder={t("usr_phone_number")}
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
                    <Label>{t("usr_sector_id")}</Label>
                    <Input
                      name="usr_sector_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_sector_id || ""}
                      invalid={
                        validation.touched.usr_sector_id &&
                        validation.errors.usr_sector_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Sector Information</option>
                      {sectorInformationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
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
                      value={validation.values.usr_department_id || ""}
                      invalid={
                        validation.touched.usr_department_id &&
                        validation.errors.usr_department_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>Select Department</option>
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={Number(option.value)}>
                          {t(option.label)}
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
                      type="textarea"
                      placeholder={t("usr_description")}
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
                    <CascadingDropdowns
                      validation={validation}
                      dropdown1name="usr_region_id"
                      dropdown2name="usr_zone_id"
                      dropdown3name="usr_woreda_id"
                      isEdit={isEdit} // Set to true if in edit mode, otherwise false
                    />
                  </Col>

                  <Col
                    className="col-md-8 mb-3"
                    style={{
                      backgroundColor: "#f8f9fa",
                      color: "#333",
                      borderRadius: "8px",
                      padding: "20px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Upload User Image
                      </Label>
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
                          <div
                            className="avatar-xl"
                            style={{ marginTop: "10px" }}
                          >
                            <div
                              className="avatar-title bg-light rounded-circle"
                              style={{
                                overflow: "hidden",
                                width: "120px",
                                height: "120px",
                                border: "2px solid #ddd",
                              }}
                            >
                              {/* Show selected image or placeholder */}
                              <img
                                src={
                                  `${
                                    import.meta.env.VITE_BASE_API_FILE
                                  }public/uploads/userfiles/${
                                    validation.usr_picture
                                  }` || "https://via.placeholder.com/120"
                                }
                                id="projectlogo-img"
                                alt="User Image"
                                className="img-fluid rounded-circle"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Validation feedback */}
                        {validation.touched.usr_picture &&
                        validation.errors.usr_picture ? (
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
                      {addUsers.isPending || updateUsers.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addUsers.isPending ||
                            updateUsers.isPending ||
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
                            addUsers.isPending ||
                            updateUsers.isPending ||
                            !validation.dirty
                          }
                        >
                          {isDuplicateModalOpen ? (
                            <div>{t("Save Duplicate")}</div>
                          ) : (
                            <div>{t("Save")}</div>
                          )}
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            {isDuplicateModalOpen ? (
              <ModalFooter>
                <div className="text-center text-warning mb-4">
                  {t(
                    "This entry contains duplicate information. Please review and modify the form to avoid duplicates. If you still wish to proceed, click Save to add this user as a new entry."
                  )}
                </div>
              </ModalFooter>
            ) : null}
          </Modal>
        </div>
      </div>

      {showCanvas && (
        <RightOffCanvas
          handleClick={handleClick}
          showCanvas={showCanvas}
          canvasWidth={84}
          name={userMetaData.usr_name || "UserRoles"}
          id={userMetaData.usr_id}
          components={{ "User Roles": UserRoles }}
        />
      )}
    </React.Fragment>
  );
};
UsersModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default UsersModel;
