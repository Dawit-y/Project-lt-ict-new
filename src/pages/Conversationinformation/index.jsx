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
  useFetchConversationInformations,
  useSearchConversationInformations,
  useAddConversationInformation,
  useDeleteConversationInformation,
  useUpdateConversationInformation,
} from "../../queries/conversationinformation_query";
import ConversationInformationModal from "./ConversationInformationModal";
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
const ConversationInformationModel = () => {
  //meta title
  document.title = " ConversationInformation";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [conversationInformation, setConversationInformation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchConversationInformations();
  const addConversationInformation = useAddConversationInformation();
  const updateConversationInformation = useUpdateConversationInformation();
  const deleteConversationInformation = useDeleteConversationInformation();
//START CRUD
  const handleAddConversationInformation = async (data) => {
    try {
      await addConversationInformation.mutateAsync(data);
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
  const handleUpdateConversationInformation = async (data) => {
    try {
      await updateConversationInformation.mutateAsync(data);
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
  const handleDeleteConversationInformation = async () => {
    if (conversationInformation && conversationInformation.cvi_id) {
      try {
        const id = conversationInformation.cvi_id;
        await deleteConversationInformation.mutateAsync(id);
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
     cvi_title:(conversationInformation && conversationInformation.cvi_title) || "", 
cvi_object_id:(conversationInformation && conversationInformation.cvi_object_id) || "", 
cvi_object_type_id:(conversationInformation && conversationInformation.cvi_object_type_id) || "", 
cvi_request_date_et:(conversationInformation && conversationInformation.cvi_request_date_et) || "", 
cvi_request_date_gc:(conversationInformation && conversationInformation.cvi_request_date_gc) || "", 
cvi_description:(conversationInformation && conversationInformation.cvi_description) || "", 
cvi_status:(conversationInformation && conversationInformation.cvi_status) || "", 

     is_deletable: (conversationInformation && conversationInformation.is_deletable) || 1,
     is_editable: (conversationInformation && conversationInformation.is_editable) || 1
   },
   validationSchema: Yup.object({
    cvi_title: Yup.string().required(t('cvi_title')),
cvi_object_id: Yup.string().required(t('cvi_object_id')),
cvi_object_type_id: Yup.string().required(t('cvi_object_type_id')),
cvi_request_date_et: Yup.string().required(t('cvi_request_date_et')),
cvi_request_date_gc: Yup.string().required(t('cvi_request_date_gc')),
cvi_description: Yup.string().required(t('cvi_description')),
cvi_status: Yup.string().required(t('cvi_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateConversationInformation = {
        cvi_id: conversationInformation ? conversationInformation.cvi_id : 0,
        cvi_id:conversationInformation.cvi_id, 
cvi_title:values.cvi_title, 
cvi_object_id:values.cvi_object_id, 
cvi_object_type_id:values.cvi_object_type_id, 
cvi_request_date_et:values.cvi_request_date_et, 
cvi_request_date_gc:values.cvi_request_date_gc, 
cvi_description:values.cvi_description, 
cvi_status:values.cvi_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ConversationInformation
      handleUpdateConversationInformation(updateConversationInformation);
    } else {
      const newConversationInformation = {
        cvi_title:values.cvi_title, 
cvi_object_id:values.cvi_object_id, 
cvi_object_type_id:values.cvi_object_type_id, 
cvi_request_date_et:values.cvi_request_date_et, 
cvi_request_date_gc:values.cvi_request_date_gc, 
cvi_description:values.cvi_description, 
cvi_status:values.cvi_status, 

      };
        // save new ConversationInformation
      handleAddConversationInformation(newConversationInformation);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ConversationInformation on component mount
  useEffect(() => {
    setConversationInformation(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setConversationInformation(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setConversationInformation(null);
    } else {
      setModal(true);
    }
  };
  const handleConversationInformationClick = (arg) => {
    const conversationInformation = arg;
    // console.log("handleConversationInformationClick", conversationInformation);
    setConversationInformation({
      cvi_id:conversationInformation.cvi_id, 
cvi_title:conversationInformation.cvi_title, 
cvi_object_id:conversationInformation.cvi_object_id, 
cvi_object_type_id:conversationInformation.cvi_object_type_id, 
cvi_request_date_et:conversationInformation.cvi_request_date_et, 
cvi_request_date_gc:conversationInformation.cvi_request_date_gc, 
cvi_description:conversationInformation.cvi_description, 
cvi_status:conversationInformation.cvi_status, 

      is_deletable: conversationInformation.is_deletable,
      is_editable: conversationInformation.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (conversationInformation) => {
    setConversationInformation(conversationInformation);
    setDeleteModal(true);
  };
  const handleConversationInformationClicks = () => {
    setIsEdit(false);
    setConversationInformation("");
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
        accessorKey: 'cvi_title',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_title, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_object_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_object_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_object_type_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_object_type_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_request_date_et',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_request_date_et, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_request_date_gc',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_request_date_gc, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'cvi_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.cvi_status, 30) ||
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
                handleConversationInformationClick(data);
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
}, [handleConversationInformationClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <ConversationInformationModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteConversationInformation}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteConversationInformation.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("conversation_information")}
    breadcrumbItem={t("conversation_information")}
    />
    <AdvancedSearch
    searchHook={useSearchConversationInformations}
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
      handleUserClick={handleConversationInformationClicks}
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
      {!!isEdit ? (t("edit") + " "+t("conversation_information")) : (t("add") +" "+t("conversation_information"))}
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
                      <Label>{t('cvi_title')}</Label>
                      <Input
                        name='cvi_title'
                        type='text'
                        placeholder={t('cvi_title')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_title || ''}
                        invalid={
                          validation.touched.cvi_title &&
                          validation.errors.cvi_title
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_title &&
                      validation.errors.cvi_title ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_title}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_object_id')}</Label>
                      <Input
                        name='cvi_object_id'
                        type='text'
                        placeholder={t('cvi_object_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_object_id || ''}
                        invalid={
                          validation.touched.cvi_object_id &&
                          validation.errors.cvi_object_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_object_id &&
                      validation.errors.cvi_object_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_object_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_object_type_id')}</Label>
                      <Input
                        name='cvi_object_type_id'
                        type='text'
                        placeholder={t('cvi_object_type_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_object_type_id || ''}
                        invalid={
                          validation.touched.cvi_object_type_id &&
                          validation.errors.cvi_object_type_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_object_type_id &&
                      validation.errors.cvi_object_type_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_object_type_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_request_date_et')}</Label>
                      <Input
                        name='cvi_request_date_et'
                        type='text'
                        placeholder={t('cvi_request_date_et')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_request_date_et || ''}
                        invalid={
                          validation.touched.cvi_request_date_et &&
                          validation.errors.cvi_request_date_et
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_request_date_et &&
                      validation.errors.cvi_request_date_et ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_request_date_et}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_request_date_gc')}</Label>
                      <Input
                        name='cvi_request_date_gc'
                        type='text'
                        placeholder={t('cvi_request_date_gc')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_request_date_gc || ''}
                        invalid={
                          validation.touched.cvi_request_date_gc &&
                          validation.errors.cvi_request_date_gc
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_request_date_gc &&
                      validation.errors.cvi_request_date_gc ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_request_date_gc}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_description')}</Label>
                      <Input
                        name='cvi_description'
                        type='text'
                        placeholder={t('cvi_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_description || ''}
                        invalid={
                          validation.touched.cvi_description &&
                          validation.errors.cvi_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_description &&
                      validation.errors.cvi_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('cvi_status')}</Label>
                      <Input
                        name='cvi_status'
                        type='text'
                        placeholder={t('cvi_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.cvi_status || ''}
                        invalid={
                          validation.touched.cvi_status &&
                          validation.errors.cvi_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.cvi_status &&
                      validation.errors.cvi_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.cvi_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addConversationInformation.isPending || updateConversationInformation.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addConversationInformation.isPending ||
          updateConversationInformation.isPending ||
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
          addConversationInformation.isPending ||
          updateConversationInformation.isPending ||
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
ConversationInformationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ConversationInformationModel;