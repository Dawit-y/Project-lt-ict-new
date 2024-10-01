import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import SearchComponent from "../../components/Common/SearchComponent";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getUsers as onGetUsers,
  addUsers as onAddUsers,
  updateUsers as onUpdateUsers,
  deleteUsers as onDeleteUsers
} from "../../store/users/actions";

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
  Card,
  CardBody,
  FormGroup,
  Badge,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import moment from "moment";

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import accessToken from "../../helpers/jwt-token-access/accessToken";
import { error } from "toastr";

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
  //START FOREIGN CALLS
  const [addressStructureOptions, setAddressStructureOptions] = useState([]);
  const [selectedAddressStructure, setSelectedAddressStructure] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchAddressStructure = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}address_structure/listgrid`
        );
        const transformedData = response.data.data.map((item) => ({
          label: item.name,
          value: item.name,
        }));
        const optionsWithDefault = [
          { label: 'select budget year', value: '' },
          ...transformedData,
        ];
        setAddressStructureOptions(optionsWithDefault);
      } catch (error) {
        console.error('Error fetching budget years:', error);
      }
    };
    fetchAddressStructure();
  }, []);
  const handleAddressStructureChange = (e) => {
    setSelectedAddressStructure(e.target.value);
    validation.setFieldValue('usr_zone_id', e.target.value);
  }; 
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}department/listgrid`, {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Correctly set the Authorization header
            },
          }

        );
        const transformedData = response.data.data.map((item) => ({
          label: item.dep_name_or.toString(),
          value: item.dep_name_or.toString(),
        }));
        const optionsWithDefault = [
          { label: 'select budget year', value: '' },
          ...transformedData,
        ];
        setDepartmentOptions(optionsWithDefault);
      } catch (error) {
        console.error('Error fetching budget years:', error);
      }
    };
    fetchDepartment();
  }, []);
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    validation.setFieldValue('usr_department_id', e.target.value);
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

      is_deletable: (users && users.is_deletable) || 1,
      is_editable: (users && users.is_editable) || 1
    },

    validationSchema: Yup.object({
      usr_email: Yup.string().required(t('usr_email')),
      usr_password: Yup.string().required(t('usr_password')),
      usr_full_name: Yup.string().required(t('usr_full_name')),
      usr_phone_number: Yup.string().required(t('usr_phone_number')),
      usr_role_id: Yup.string().required(t('usr_role_id')),
      // usr_region_id: Yup.string().required(t('usr_region_id')),
      // usr_woreda_id: Yup.string().required(t('usr_woreda_id')),
      // usr_kebele_id: Yup.string().required(t('usr_kebele_id')),
      usr_sector_id: Yup.string().required(t('usr_sector_id')),
      usr_is_active: Yup.string().required(t('usr_is_active')),
      usr_picture: Yup.string().required(t('usr_picture')),
      usr_last_logged_in: Yup.string().required(t('usr_last_logged_in')),
      usr_ip: Yup.string().required(t('usr_ip')),
      usr_remember_token: Yup.string().required(t('usr_remember_token')),
      usr_notified: Yup.string().required(t('usr_notified')),
      usr_description: Yup.string().required(t('usr_description')),
      usr_status: Yup.string().required(t('usr_status')),

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

        };
        // save new Userss
        console.log("value added ",newUsers);
        // dispatch(onAddUsers(newUsers));
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
    // console.log("handleUsersClick", users);
    setUsers({
      usr_id: users.usr_id,
      usr_email: users.usr_email,
      usr_password: users.usr_password,
      usr_full_name: users.usr_full_name,
      usr_phone_number: users.usr_phone_number,
      usr_role_id: users.usr_role_id,
      usr_region_id: users.usr_region_id,
      usr_woreda_id: users.usr_woreda_id,
      usr_kebele_id: users.usr_kebele_id,
      usr_sector_id: users.usr_sector_id,
      usr_is_active: users.usr_is_active,
      usr_picture: users.usr_picture,
      usr_last_logged_in: users.usr_last_logged_in,
      usr_ip: users.usr_ip,
      usr_remember_token: users.usr_remember_token,
      usr_notified: users.usr_notified,
      usr_description: users.usr_description,
      usr_status: users.usr_status,

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

  const handleClearSearch = () => {
    setShowSearchResults(false);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: '',
        accessorKey: 'usr_email',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_email, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_password',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_password, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_full_name',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_full_name, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_phone_number',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_phone_number, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_role_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_role_id, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_region_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_region_id, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_woreda_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_woreda_id, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_kebele_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_kebele_id, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_sector_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_sector_id, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_is_active',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_is_active, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_picture',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_picture, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_last_logged_in',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_last_logged_in, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_ip',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_ip, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_remember_token',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_remember_token, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_notified',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_notified, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_description, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'usr_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usr_status, 30) ||
                '-'}
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
                const userdata = cellProps.row.original;
                toggleViewModal(userdata);
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
                    const userdata = cellProps.row.original;
                    handleUsersClick(userdata);
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
                    const userdata = cellProps.row.original;
                    onClickDelete(userdata);
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
  }, [handleUsersClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
          <Breadcrumbs
            title={t("users")}
            breadcrumbItem={t("users")}
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
                      // data={showSearchResults ? results : data}
                      data={showSearchResults && Array.isArray(results) ? results : Array.isArray(data) ? data : []}  // Ensure data is an array
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleUsersClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") + " " + t("users")}
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
              {!!isEdit ? (t("edit") + " " + t("users")) : (t("add") + " " + t("users"))}
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
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_email')}</Label>
                    <Input
                      name='usr_email'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_email || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_email}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_password')}</Label>
                    <Input
                      name='usr_password'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_password || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_password}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_full_name')}</Label>
                    <Input
                      name='usr_full_name'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_full_name || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_full_name}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_phone_number')}</Label>
                    <Input
                      name='usr_phone_number'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_phone_number || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_phone_number}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_role_id')}</Label>
                    <Input
                      name='usr_role_id'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_role_id || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_role_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  {/* <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_region_id')}</Label>
                    <Input
                      name='usr_region_id'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_region_id || ''}
                      invalid={
                        validation.touched.usr_region_id &&
                          validation.errors.usr_region_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_region_id &&
                      validation.errors.usr_region_id ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_region_id}
                      </FormFeedback>
                    ) : null}
                  </Col> */}
                  {/* <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_zone_id')}</Label>
                    <Input
                      name='usr_zone_id'
                      type='select'
                      className='form-select'
                      onChange={handleAddressStructureChange}
                      onBlur={validation.handleBlur}
                      value={selectedAddressStructure}>
                      
                      {addressStructureOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                
                  </Col> */}
                  {/* <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_woreda_id')}</Label>
                    <Input
                      name='usr_woreda_id'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_woreda_id || ''}
                      invalid={
                        validation.touched.usr_woreda_id &&
                          validation.errors.usr_woreda_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_woreda_id &&
                      validation.errors.usr_woreda_id ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_woreda_id}
                      </FormFeedback>
                    ) : null}
                  </Col> */}

                  <CascadingDropdowns
                    validation={validation}
                    dropdown1name="usr_available_at_region"
                    dropdown2name="usr_available_at_zone"
                    dropdown3name="usr_available_at_woreda"
                  />

                  {/* <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_kebele_id')}</Label>
                    <Input
                      name='usr_kebele_id'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_kebele_id || ''}
                      invalid={
                        validation.touched.usr_kebele_id &&
                          validation.errors.usr_kebele_id
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_kebele_id &&
                      validation.errors.usr_kebele_id ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_kebele_id}
                      </FormFeedback>
                    ) : null}
                  </Col> */}
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_sector_id')}</Label>
                    <Input
                      name='usr_sector_id'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_sector_id || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_sector_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_department_id')}</Label>
                    <Input
                      name='usr_department_id'
                      type='select'
                      className='form-select'
                      onChange={handleDepartmentChange}
                      onBlur={validation.handleBlur}
                      value={selectedDepartment}>
                      {departmentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.usr_department_id &&
                      validation.errors.usr_department_id ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_department_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_is_active')}</Label>
                    <Input
                      name='usr_is_active'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_is_active || ''}
                      invalid={
                        validation.touched.usr_is_active &&
                          validation.errors.usr_is_active
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_is_active &&
                      validation.errors.usr_is_active ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_is_active}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_picture')}</Label>
                    <Input
                      name='usr_picture'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_picture || ''}
                      invalid={
                        validation.touched.usr_picture &&
                          validation.errors.usr_picture
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_picture &&
                      validation.errors.usr_picture ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_picture}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_last_logged_in')}</Label>
                    <Input
                      name='usr_last_logged_in'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_last_logged_in || ''}
                      invalid={
                        validation.touched.usr_last_logged_in &&
                          validation.errors.usr_last_logged_in
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_last_logged_in &&
                      validation.errors.usr_last_logged_in ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_last_logged_in}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_ip')}</Label>
                    <Input
                      name='usr_ip'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_ip || ''}
                      invalid={
                        validation.touched.usr_ip &&
                          validation.errors.usr_ip
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_ip &&
                      validation.errors.usr_ip ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_ip}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_remember_token')}</Label>
                    <Input
                      name='usr_remember_token'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_remember_token || ''}
                      invalid={
                        validation.touched.usr_remember_token &&
                          validation.errors.usr_remember_token
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_remember_token &&
                      validation.errors.usr_remember_token ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_remember_token}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_notified')}</Label>
                    <Input
                      name='usr_notified'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_notified || ''}
                      invalid={
                        validation.touched.usr_notified &&
                          validation.errors.usr_notified
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_notified &&
                      validation.errors.usr_notified ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_notified}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_description')}</Label>
                    <Input
                      name='usr_description'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_description || ''}
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
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <Label>{t('usr_status')}</Label>
                    <Input
                      name='usr_status'
                      type='text'
                      placeholder={t('insert_status_name_amharic')}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.usr_status || ''}
                      invalid={
                        validation.touched.usr_status &&
                          validation.errors.usr_status
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.usr_status &&
                      validation.errors.usr_status ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.usr_status}
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
UsersModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default UsersModel;