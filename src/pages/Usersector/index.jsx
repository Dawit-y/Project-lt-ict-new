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
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchUserSectors,
  useSearchUserSectors,
  useAddUserSector,
  useDeleteUserSector,
  useUpdateUserSector,
} from "../../queries/usersector_query";
import UserSectorModal from "./UserSectorModal";
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
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const UserSectorModel = () => {
  //meta title
  document.title = " UserSector";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userSector, setUserSector] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchUserSectors();
  const addUserSector = useAddUserSector();
  const updateUserSector = useUpdateUserSector();
  const deleteUserSector = useDeleteUserSector();
//START CRUD
  const handleAddUserSector = async (data) => {
    try {
      await addUserSector.mutateAsync(data);
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
  const handleUpdateUserSector = async (data) => {
    try {
      await updateUserSector.mutateAsync(data);
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
  const handleDeleteUserSector = async () => {
    if (userSector && userSector.usc_id) {
      try {
        const id = userSector.usc_id;
        await deleteUserSector.mutateAsync(id);
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
     usc_sector_id:(userSector && userSector.usc_sector_id) || "", 
usc_user_id:(userSector && userSector.usc_user_id) || "", 
usc_status:(userSector && userSector.usc_status) || "", 

     is_deletable: (userSector && userSector.is_deletable) || 1,
     is_editable: (userSector && userSector.is_editable) || 1
   },
   validationSchema: Yup.object({
    usc_sector_id: Yup.string().required(t('usc_sector_id')),
usc_user_id: Yup.string().required(t('usc_user_id')),
usc_status: Yup.string().required(t('usc_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateUserSector = {
        usc_id: userSector ? userSector.usc_id : 0,
        usc_id:userSector.usc_id, 
usc_sector_id:values.usc_sector_id, 
usc_user_id:values.usc_user_id, 
usc_status:values.usc_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update UserSector
      handleUpdateUserSector(updateUserSector);
    } else {
      const newUserSector = {
        usc_sector_id:values.usc_sector_id, 
usc_user_id:values.usc_user_id, 
usc_status:values.usc_status, 

      };
        // save new UserSector
      handleAddUserSector(newUserSector);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch UserSector on component mount
  useEffect(() => {
    setUserSector(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setUserSector(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setUserSector(null);
    } else {
      setModal(true);
    }
  };
  const handleUserSectorClick = (arg) => {
    const userSector = arg;
    // console.log("handleUserSectorClick", userSector);
    setUserSector({
      usc_id:userSector.usc_id, 
usc_sector_id:userSector.usc_sector_id, 
usc_user_id:userSector.usc_user_id, 
usc_status:userSector.usc_status, 

      is_deletable: userSector.is_deletable,
      is_editable: userSector.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (userSector) => {
    setUserSector(userSector);
    setDeleteModal(true);
  };
  const handleUserSectorClicks = () => {
    setIsEdit(false);
    setUserSector("");
    toggle();
  }
  ;  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: '',
        accessorKey: 'usc_sector_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usc_sector_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'usc_user_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usc_user_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'usc_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.usc_status, 30) ||
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
      data?.previledge?.is_role_editable==1 ||
      data?.previledge?.is_role_deletable==1
      ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
            {cellProps.row.original.is_editable==1 && (
              <Link
              to="#"
              className="text-success"
              onClick={() => {
                const data = cellProps.row.original;                    
                handleUserSectorClick(data);
              }}
              >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
              Edit
              </UncontrolledTooltip>
              </Link>
              )}
            {cellProps.row.original.is_deletable==1 && (
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
}, [handleUserSectorClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <UserSectorModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteUserSector}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteUserSector.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("user_sector")}
    breadcrumbItem={t("user_sector")}
    />
    <AdvancedSearch
    searchHook={useSearchUserSectors}
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
      isAddButton={data?.previledge?.is_role_can_add==1}
      isCustomPageSize={true}
      handleUserClick={handleUserSectorClicks}
      isPagination={true}
                      // SearchPlaceholder="26 records..."
      SearchPlaceholder={26 + " " + t("Results") + "..."}
      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
      buttonName={t("add")}
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
      {!!isEdit ? (t("edit") + " "+t("user_sector")) : (t("add") +" "+t("user_sector"))}
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
      <Col className='col-md-6 mb-3'>
                      <Label>{t('usc_sector_id')}</Label>
                      <Input
                        name='usc_sector_id'
                        type='text'
                        placeholder={t('usc_sector_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usc_sector_id || ''}
                        invalid={
                          validation.touched.usc_sector_id &&
                          validation.errors.usc_sector_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.usc_sector_id &&
                      validation.errors.usc_sector_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.usc_sector_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('usc_user_id')}</Label>
                      <Input
                        name='usc_user_id'
                        type='text'
                        placeholder={t('usc_user_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usc_user_id || ''}
                        invalid={
                          validation.touched.usc_user_id &&
                          validation.errors.usc_user_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.usc_user_id &&
                      validation.errors.usc_user_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.usc_user_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('usc_status')}</Label>
                      <Input
                        name='usc_status'
                        type='text'
                        placeholder={t('usc_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.usc_status || ''}
                        invalid={
                          validation.touched.usc_status &&
                          validation.errors.usc_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.usc_status &&
                      validation.errors.usc_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.usc_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addUserSector.isPending || updateUserSector.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addUserSector.isPending ||
          updateUserSector.isPending ||
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
          addUserSector.isPending ||
          updateUserSector.isPending ||
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
        <ToastContainer />
        </React.Fragment>
        );
};
UserSectorModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default UserSectorModel;