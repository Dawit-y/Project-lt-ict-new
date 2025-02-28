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
  useFetchRequestFollowups,
  useSearchRequestFollowups,
  useAddRequestFollowup,
  useDeleteRequestFollowup,
  useUpdateRequestFollowup,
} from "../../queries/requestfollowup_query";
import RequestFollowupModal from "./RequestFollowupModal";
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
const RequestFollowupModel = () => {
  //meta title
  document.title = " RequestFollowup";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestFollowup, setRequestFollowup] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchRequestFollowups();
  const addRequestFollowup = useAddRequestFollowup();
  const updateRequestFollowup = useUpdateRequestFollowup();
  const deleteRequestFollowup = useDeleteRequestFollowup();
//START CRUD
  const handleAddRequestFollowup = async (data) => {
    try {
      await addRequestFollowup.mutateAsync(data);
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
  const handleUpdateRequestFollowup = async (data) => {
    try {
      await updateRequestFollowup.mutateAsync(data);
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
  const handleDeleteRequestFollowup = async () => {
    if (requestFollowup && requestFollowup.rqf_id) {
      try {
        const id = requestFollowup.rqf_id;
        await deleteRequestFollowup.mutateAsync(id);
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
     rqf_request_id:(requestFollowup && requestFollowup.rqf_request_id) || "", 
rqf_forwarding_dep_id:(requestFollowup && requestFollowup.rqf_forwarding_dep_id) || "", 
rqf_forwarded_to_dep_id:(requestFollowup && requestFollowup.rqf_forwarded_to_dep_id) || "", 
rqf_forwarding_date:(requestFollowup && requestFollowup.rqf_forwarding_date) || "", 
rqf_received_date:(requestFollowup && requestFollowup.rqf_received_date) || "", 
rqf_description:(requestFollowup && requestFollowup.rqf_description) || "", 
rqf_status:(requestFollowup && requestFollowup.rqf_status) || "", 

     is_deletable: (requestFollowup && requestFollowup.is_deletable) || 1,
     is_editable: (requestFollowup && requestFollowup.is_editable) || 1
   },
   validationSchema: Yup.object({
    rqf_request_id: Yup.string().required(t('rqf_request_id')),
rqf_forwarding_dep_id: Yup.string().required(t('rqf_forwarding_dep_id')),
rqf_forwarded_to_dep_id: Yup.string().required(t('rqf_forwarded_to_dep_id')),
rqf_forwarding_date: Yup.string().required(t('rqf_forwarding_date')),
rqf_received_date: Yup.string().required(t('rqf_received_date')),
rqf_description: Yup.string().required(t('rqf_description')),
rqf_status: Yup.string().required(t('rqf_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateRequestFollowup = {
        rqf_id: requestFollowup ? requestFollowup.rqf_id : 0,
        rqf_id:requestFollowup.rqf_id, 
rqf_request_id:values.rqf_request_id, 
rqf_forwarding_dep_id:values.rqf_forwarding_dep_id, 
rqf_forwarded_to_dep_id:values.rqf_forwarded_to_dep_id, 
rqf_forwarding_date:values.rqf_forwarding_date, 
rqf_received_date:values.rqf_received_date, 
rqf_description:values.rqf_description, 
rqf_status:values.rqf_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update RequestFollowup
      handleUpdateRequestFollowup(updateRequestFollowup);
    } else {
      const newRequestFollowup = {
        rqf_request_id:values.rqf_request_id, 
rqf_forwarding_dep_id:values.rqf_forwarding_dep_id, 
rqf_forwarded_to_dep_id:values.rqf_forwarded_to_dep_id, 
rqf_forwarding_date:values.rqf_forwarding_date, 
rqf_received_date:values.rqf_received_date, 
rqf_description:values.rqf_description, 
rqf_status:values.rqf_status, 

      };
        // save new RequestFollowup
      handleAddRequestFollowup(newRequestFollowup);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch RequestFollowup on component mount
  useEffect(() => {
    setRequestFollowup(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setRequestFollowup(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setRequestFollowup(null);
    } else {
      setModal(true);
    }
  };
  const handleRequestFollowupClick = (arg) => {
    const requestFollowup = arg;
    // console.log("handleRequestFollowupClick", requestFollowup);
    setRequestFollowup({
      rqf_id:requestFollowup.rqf_id, 
rqf_request_id:requestFollowup.rqf_request_id, 
rqf_forwarding_dep_id:requestFollowup.rqf_forwarding_dep_id, 
rqf_forwarded_to_dep_id:requestFollowup.rqf_forwarded_to_dep_id, 
rqf_forwarding_date:requestFollowup.rqf_forwarding_date, 
rqf_received_date:requestFollowup.rqf_received_date, 
rqf_description:requestFollowup.rqf_description, 
rqf_status:requestFollowup.rqf_status, 

      is_deletable: requestFollowup.is_deletable,
      is_editable: requestFollowup.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (requestFollowup) => {
    setRequestFollowup(requestFollowup);
    setDeleteModal(true);
  };
  const handleRequestFollowupClicks = () => {
    setIsEdit(false);
    setRequestFollowup("");
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
        accessorKey: 'rqf_request_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_request_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_forwarding_dep_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_forwarding_dep_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_forwarded_to_dep_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_forwarded_to_dep_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_forwarding_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_forwarding_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_received_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_received_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'rqf_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.rqf_status, 30) ||
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
                handleRequestFollowupClick(data);
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
}, [handleRequestFollowupClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <RequestFollowupModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteRequestFollowup}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteRequestFollowup.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("request_followup")}
    breadcrumbItem={t("request_followup")}
    />
    <AdvancedSearch
    searchHook={useSearchRequestFollowups}
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
      handleUserClick={handleRequestFollowupClicks}
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
      {!!isEdit ? (t("edit") + " "+t("request_followup")) : (t("add") +" "+t("request_followup"))}
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
                      <Label>{t('rqf_request_id')}</Label>
                      <Input
                        name='rqf_request_id'
                        type='text'
                        placeholder={t('rqf_request_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_request_id || ''}
                        invalid={
                          validation.touched.rqf_request_id &&
                          validation.errors.rqf_request_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_request_id &&
                      validation.errors.rqf_request_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_request_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_forwarding_dep_id')}</Label>
                      <Input
                        name='rqf_forwarding_dep_id'
                        type='text'
                        placeholder={t('rqf_forwarding_dep_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_forwarding_dep_id || ''}
                        invalid={
                          validation.touched.rqf_forwarding_dep_id &&
                          validation.errors.rqf_forwarding_dep_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_forwarding_dep_id &&
                      validation.errors.rqf_forwarding_dep_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_forwarding_dep_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_forwarded_to_dep_id')}</Label>
                      <Input
                        name='rqf_forwarded_to_dep_id'
                        type='text'
                        placeholder={t('rqf_forwarded_to_dep_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_forwarded_to_dep_id || ''}
                        invalid={
                          validation.touched.rqf_forwarded_to_dep_id &&
                          validation.errors.rqf_forwarded_to_dep_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_forwarded_to_dep_id &&
                      validation.errors.rqf_forwarded_to_dep_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_forwarded_to_dep_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_forwarding_date')}</Label>
                      <Input
                        name='rqf_forwarding_date'
                        type='text'
                        placeholder={t('rqf_forwarding_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_forwarding_date || ''}
                        invalid={
                          validation.touched.rqf_forwarding_date &&
                          validation.errors.rqf_forwarding_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_forwarding_date &&
                      validation.errors.rqf_forwarding_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_forwarding_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_received_date')}</Label>
                      <Input
                        name='rqf_received_date'
                        type='text'
                        placeholder={t('rqf_received_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_received_date || ''}
                        invalid={
                          validation.touched.rqf_received_date &&
                          validation.errors.rqf_received_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_received_date &&
                      validation.errors.rqf_received_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_received_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_description')}</Label>
                      <Input
                        name='rqf_description'
                        type='text'
                        placeholder={t('rqf_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_description || ''}
                        invalid={
                          validation.touched.rqf_description &&
                          validation.errors.rqf_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_description &&
                      validation.errors.rqf_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('rqf_status')}</Label>
                      <Input
                        name='rqf_status'
                        type='text'
                        placeholder={t('rqf_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rqf_status || ''}
                        invalid={
                          validation.touched.rqf_status &&
                          validation.errors.rqf_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.rqf_status &&
                      validation.errors.rqf_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.rqf_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addRequestFollowup.isPending || updateRequestFollowup.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addRequestFollowup.isPending ||
          updateRequestFollowup.isPending ||
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
          addRequestFollowup.isPending ||
          updateRequestFollowup.isPending ||
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
RequestFollowupModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default RequestFollowupModel;