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
  useFetchRequestInformations,
  useSearchRequestInformations,
  useAddRequestInformation,
  useDeleteRequestInformation,
  useUpdateRequestInformation,
} from "../../queries/requestinformation_query";
import RequestInformationModal from "./RequestInformationModal";
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
const RequestInformationModel = () => {
  //meta title
  document.title = " RequestInformation";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestInformation, setRequestInformation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchRequestInformations();
  const addRequestInformation = useAddRequestInformation();
  const updateRequestInformation = useUpdateRequestInformation();
  const deleteRequestInformation = useDeleteRequestInformation();
//START CRUD
  const handleAddRequestInformation = async (data) => {
    try {
      await addRequestInformation.mutateAsync(data);
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
  const handleUpdateRequestInformation = async (data) => {
    try {
      await updateRequestInformation.mutateAsync(data);
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
  const handleDeleteRequestInformation = async () => {
    if (requestInformation && requestInformation.rqi_id) {
      try {
        const id = requestInformation.rqi_id;
        await deleteRequestInformation.mutateAsync(id);
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
     rqi_title:(requestInformation && requestInformation.rqi_title) || "", 
rqi_object_id:(requestInformation && requestInformation.rqi_object_id) || "", 
rqi_request_status_id:(requestInformation && requestInformation.rqi_request_status_id) || "", 
rqi_request_category_id:(requestInformation && requestInformation.rqi_request_category_id) || "", 
rqi_request_date_et:(requestInformation && requestInformation.rqi_request_date_et) || "", 
rqi_request_date_gc:(requestInformation && requestInformation.rqi_request_date_gc) || "", 
rqi_description:(requestInformation && requestInformation.rqi_description) || "", 
rqi_status:(requestInformation && requestInformation.rqi_status) || "", 

     is_deletable: (requestInformation && requestInformation.is_deletable) || 1,
     is_editable: (requestInformation && requestInformation.is_editable) || 1
   },
   validationSchema: Yup.object({
    rqi_title: Yup.string().required(t('rqi_title')),
rqi_object_id: Yup.string().required(t('rqi_object_id')),
rqi_request_status_id: Yup.string().required(t('rqi_request_status_id')),
rqi_request_category_id: Yup.string().required(t('rqi_request_category_id')),
rqi_request_date_et: Yup.string().required(t('rqi_request_date_et')),
rqi_request_date_gc: Yup.string().required(t('rqi_request_date_gc')),
rqi_description: Yup.string().required(t('rqi_description')),
rqi_status: Yup.string().required(t('rqi_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateRequestInformation = {
        rqi_id: requestInformation ? requestInformation.rqi_id : 0,
        rqi_id:requestInformation.rqi_id, 
rqi_title:values.rqi_title, 
rqi_object_id:values.rqi_object_id, 
rqi_request_status_id:values.rqi_request_status_id, 
rqi_request_category_id:values.rqi_request_category_id, 
rqi_request_date_et:values.rqi_request_date_et, 
rqi_request_date_gc:values.rqi_request_date_gc, 
rqi_description:values.rqi_description, 
rqi_status:values.rqi_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update RequestInformation
      handleUpdateRequestInformation(updateRequestInformation);
    } else {
      const newRequestInformation = {
        rqi_title:values.rqi_title, 
rqi_object_id:values.rqi_object_id, 
rqi_request_status_id:values.rqi_request_status_id, 
rqi_request_category_id:values.rqi_request_category_id, 
rqi_request_date_et:values.rqi_request_date_et, 
rqi_request_date_gc:values.rqi_request_date_gc, 
rqi_description:values.rqi_description, 
rqi_status:values.rqi_status, 

      };
        // save new RequestInformation
      handleAddRequestInformation(newRequestInformation);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch RequestInformation on component mount
  useEffect(() => {
    setRequestInformation(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setRequestInformation(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setRequestInformation(null);
    } else {
      setModal(true);
    }
  };
  const handleRequestInformationClick = (arg) => {
    const requestInformation = arg;
    // console.log("handleRequestInformationClick", requestInformation);
    setRequestInformation({
      rqi_id:requestInformation.rqi_id, 
rqi_title:requestInformation.rqi_title, 
rqi_object_id:requestInformation.rqi_object_id, 
rqi_request_status_id:requestInformation.rqi_request_status_id, 
rqi_request_category_id:requestInformation.rqi_request_category_id, 
rqi_request_date_et:requestInformation.rqi_request_date_et, 
rqi_request_date_gc:requestInformation.rqi_request_date_gc, 
rqi_description:requestInformation.rqi_description, 
rqi_status:requestInformation.rqi_status, 

      is_deletable: requestInformation.is_deletable,
      is_editable: requestInformation.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (requestInformation) => {
    setRequestInformation(requestInformation);
    setDeleteModal(true);
  };
  const handleRequestInformationClicks = () => {
    setIsEdit(false);
    setRequestInformation("");
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
        accessorKey: 'rqi_title',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_title, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_object_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_object_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_request_status_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_request_status_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_request_category_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_request_category_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_request_date_et',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_request_date_et, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_request_date_gc',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_request_date_gc, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqi_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqi_status, 30) ||
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
                handleRequestInformationClick(data);
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
}, [handleRequestInformationClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <RequestInformationModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteRequestInformation}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteRequestInformation.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("request_information")}
    breadcrumbItem={t("request_information")}
    />
    <AdvancedSearch
    searchHook={useSearchRequestInformations}
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
      handleUserClick={handleRequestInformationClicks}
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
      {!!isEdit ? (t("edit") + " "+t("request_information")) : (t("add") +" "+t("request_information"))}
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
                      <Label>{t('rqi_title')}</Label>
                      <Input
                        name='rqi_title'
                        type='text'
                        placeholder={t('rqi_title')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_title || ''}
                        invalid={
                          validation.touched.rqi_title &&
                          validation.errors.rqi_title
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_title &&
                      validation.errors.rqi_title ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_title}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_object_id')}</Label>
                      <Input
                        name='rqi_object_id'
                        type='text'
                        placeholder={t('rqi_object_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_object_id || ''}
                        invalid={
                          validation.touched.rqi_object_id &&
                          validation.errors.rqi_object_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_object_id &&
                      validation.errors.rqi_object_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_object_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_request_status_id')}</Label>
                      <Input
                        name='rqi_request_status_id'
                        type='text'
                        placeholder={t('rqi_request_status_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_request_status_id || ''}
                        invalid={
                          validation.touched.rqi_request_status_id &&
                          validation.errors.rqi_request_status_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_request_status_id &&
                      validation.errors.rqi_request_status_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_request_status_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_request_category_id')}</Label>
                      <Input
                        name='rqi_request_category_id'
                        type='text'
                        placeholder={t('rqi_request_category_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_request_category_id || ''}
                        invalid={
                          validation.touched.rqi_request_category_id &&
                          validation.errors.rqi_request_category_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_request_category_id &&
                      validation.errors.rqi_request_category_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_request_category_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_request_date_et')}</Label>
                      <Input
                        name='rqi_request_date_et'
                        type='text'
                        placeholder={t('rqi_request_date_et')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_request_date_et || ''}
                        invalid={
                          validation.touched.rqi_request_date_et &&
                          validation.errors.rqi_request_date_et
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_request_date_et &&
                      validation.errors.rqi_request_date_et ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_request_date_et}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_request_date_gc')}</Label>
                      <Input
                        name='rqi_request_date_gc'
                        type='text'
                        placeholder={t('rqi_request_date_gc')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_request_date_gc || ''}
                        invalid={
                          validation.touched.rqi_request_date_gc &&
                          validation.errors.rqi_request_date_gc
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_request_date_gc &&
                      validation.errors.rqi_request_date_gc ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_request_date_gc}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_description')}</Label>
                      <Input
                        name='rqi_description'
                        type='text'
                        placeholder={t('rqi_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_description || ''}
                        invalid={
                          validation.touched.rqi_description &&
                          validation.errors.rqi_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_description &&
                      validation.errors.rqi_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqi_status')}</Label>
                      <Input
                        name='rqi_status'
                        type='text'
                        placeholder={t('rqi_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqi_status || ''}
                        invalid={
                          validation.touched.rqi_status &&
                          validation.errors.rqi_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqi_status &&
                      validation.errors.rqi_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqi_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addRequestInformation.isPending || updateRequestInformation.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addRequestInformation.isPending ||
          updateRequestInformation.isPending ||
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
          addRequestInformation.isPending ||
          updateRequestInformation.isPending ||
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
RequestInformationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default RequestInformationModel;