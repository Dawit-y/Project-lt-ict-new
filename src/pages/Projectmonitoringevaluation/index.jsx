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
  useFetchProjectMonitoringEvaluations,
  useSearchProjectMonitoringEvaluations,
  useAddProjectMonitoringEvaluation,
  useDeleteProjectMonitoringEvaluation,
  useUpdateProjectMonitoringEvaluation,
} from "../../queries/projectmonitoringevaluation_query";
import ProjectMonitoringEvaluationModal from "./ProjectMonitoringEvaluationModal";
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
const ProjectMonitoringEvaluationModel = (props) => {
  //meta title
  document.title = " ProjectMonitoringEvaluation";
  const { passedId, isActive, status, startDate } = props;
  const param = { project_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectMonitoringEvaluation, setProjectMonitoringEvaluation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } = useFetchProjectMonitoringEvaluations();
  const addProjectMonitoringEvaluation = useAddProjectMonitoringEvaluation();
  const updateProjectMonitoringEvaluation = useUpdateProjectMonitoringEvaluation();
  const deleteProjectMonitoringEvaluation = useDeleteProjectMonitoringEvaluation();
//START CRUD
  const handleAddProjectMonitoringEvaluation = async (data) => {
    try {
      await addProjectMonitoringEvaluation.mutateAsync(data);
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
  const handleUpdateProjectMonitoringEvaluation = async (data) => {
    try {
      await updateProjectMonitoringEvaluation.mutateAsync(data);
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
  const handleDeleteProjectMonitoringEvaluation = async () => {
    if (projectMonitoringEvaluation && projectMonitoringEvaluation.mne_id) {
      try {
        const id = projectMonitoringEvaluation.mne_id;
        await deleteProjectMonitoringEvaluation.mutateAsync(id);
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
     mne_transaction_type_id:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_transaction_type_id) || "", 
mne_visit_type:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_visit_type) || "", 
mne_project_id:passedId, 
mne_type_id:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_type_id) || "", 
mne_physical:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_physical) || "", 
mne_financial:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_financial) || "", 
mne_physical_region:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_physical_region) || "", 
mne_financial_region:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_financial_region) || "", 
mne_team_members:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_team_members) || "", 
mne_feedback:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_feedback) || "", 
mne_weakness:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_weakness) || "", 
mne_challenges:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_challenges) || "", 
mne_recommendations:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_recommendations) || "", 
mne_purpose:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_purpose) || "", 
mne_record_date:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_record_date) || "", 
mne_start_date:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_start_date) || "", 
mne_end_date:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_end_date) || "", 
mne_description:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_description) || "", 
mne_status:(projectMonitoringEvaluation && projectMonitoringEvaluation.mne_status) || "", 

     is_deletable: (projectMonitoringEvaluation && projectMonitoringEvaluation.is_deletable) || 1,
     is_editable: (projectMonitoringEvaluation && projectMonitoringEvaluation.is_editable) || 1
   },
   validationSchema: Yup.object({
    mne_transaction_type_id: Yup.string().required(t('mne_transaction_type_id')),
mne_visit_type: Yup.string().required(t('mne_visit_type')),
mne_project_id: Yup.string().required(t('mne_project_id')),
mne_type_id: Yup.string().required(t('mne_type_id')),
mne_physical: Yup.string().required(t('mne_physical')),
mne_financial: Yup.string().required(t('mne_financial')),
mne_physical_region: Yup.string().required(t('mne_physical_region')),
mne_financial_region: Yup.string().required(t('mne_financial_region')),
mne_team_members: Yup.string().required(t('mne_team_members')),
mne_feedback: Yup.string().required(t('mne_feedback')),
mne_weakness: Yup.string().required(t('mne_weakness')),
mne_challenges: Yup.string().required(t('mne_challenges')),
mne_recommendations: Yup.string().required(t('mne_recommendations')),
mne_purpose: Yup.string().required(t('mne_purpose')),
mne_record_date: Yup.string().required(t('mne_record_date')),
mne_start_date: Yup.string().required(t('mne_start_date')),
mne_end_date: Yup.string().required(t('mne_end_date')),
mne_description: Yup.string().required(t('mne_description')),
mne_status: Yup.string().required(t('mne_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateProjectMonitoringEvaluation = {
        mne_id: projectMonitoringEvaluation ? projectMonitoringEvaluation.mne_id : 0,
        mne_id:projectMonitoringEvaluation.mne_id, 
mne_transaction_type_id:values.mne_transaction_type_id, 
mne_visit_type:values.mne_visit_type, 
mne_project_id:values.mne_project_id, 
mne_type_id:values.mne_type_id, 
mne_physical:values.mne_physical, 
mne_financial:values.mne_financial, 
mne_physical_region:values.mne_physical_region, 
mne_financial_region:values.mne_financial_region, 
mne_team_members:values.mne_team_members, 
mne_feedback:values.mne_feedback, 
mne_weakness:values.mne_weakness, 
mne_challenges:values.mne_challenges, 
mne_recommendations:values.mne_recommendations, 
mne_purpose:values.mne_purpose, 
mne_record_date:values.mne_record_date, 
mne_start_date:values.mne_start_date, 
mne_end_date:values.mne_end_date, 
mne_description:values.mne_description, 
mne_status:values.mne_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ProjectMonitoringEvaluation
      handleUpdateProjectMonitoringEvaluation(updateProjectMonitoringEvaluation);
    } else {
      const newProjectMonitoringEvaluation = {
        mne_transaction_type_id:values.mne_transaction_type_id, 
mne_visit_type:values.mne_visit_type, 
mne_project_id:passedId, 
mne_type_id:values.mne_type_id, 
mne_physical:values.mne_physical, 
mne_financial:values.mne_financial, 
mne_physical_region:values.mne_physical_region, 
mne_financial_region:values.mne_financial_region, 
mne_team_members:values.mne_team_members, 
mne_feedback:values.mne_feedback, 
mne_weakness:values.mne_weakness, 
mne_challenges:values.mne_challenges, 
mne_recommendations:values.mne_recommendations, 
mne_purpose:values.mne_purpose, 
mne_record_date:values.mne_record_date, 
mne_start_date:values.mne_start_date, 
mne_end_date:values.mne_end_date, 
mne_description:values.mne_description, 
mne_status:values.mne_status, 

      };
        // save new ProjectMonitoringEvaluation
      handleAddProjectMonitoringEvaluation(newProjectMonitoringEvaluation);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProjectMonitoringEvaluation on component mount
  useEffect(() => {
    setProjectMonitoringEvaluation(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectMonitoringEvaluation(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectMonitoringEvaluation(null);
    } else {
      setModal(true);
    }
  };
  const handleProjectMonitoringEvaluationClick = (arg) => {
    const projectMonitoringEvaluation = arg;
    // console.log("handleProjectMonitoringEvaluationClick", projectMonitoringEvaluation);
    setProjectMonitoringEvaluation({
      mne_id:projectMonitoringEvaluation.mne_id, 
mne_transaction_type_id:projectMonitoringEvaluation.mne_transaction_type_id, 
mne_visit_type:projectMonitoringEvaluation.mne_visit_type, 
mne_project_id:projectMonitoringEvaluation.mne_project_id, 
mne_type_id:projectMonitoringEvaluation.mne_type_id, 
mne_physical:projectMonitoringEvaluation.mne_physical, 
mne_financial:projectMonitoringEvaluation.mne_financial, 
mne_physical_region:projectMonitoringEvaluation.mne_physical_region, 
mne_financial_region:projectMonitoringEvaluation.mne_financial_region, 
mne_team_members:projectMonitoringEvaluation.mne_team_members, 
mne_feedback:projectMonitoringEvaluation.mne_feedback, 
mne_weakness:projectMonitoringEvaluation.mne_weakness, 
mne_challenges:projectMonitoringEvaluation.mne_challenges, 
mne_recommendations:projectMonitoringEvaluation.mne_recommendations, 
mne_purpose:projectMonitoringEvaluation.mne_purpose, 
mne_record_date:projectMonitoringEvaluation.mne_record_date, 
mne_start_date:projectMonitoringEvaluation.mne_start_date, 
mne_end_date:projectMonitoringEvaluation.mne_end_date, 
mne_description:projectMonitoringEvaluation.mne_description, 
mne_status:projectMonitoringEvaluation.mne_status, 

      is_deletable: projectMonitoringEvaluation.is_deletable,
      is_editable: projectMonitoringEvaluation.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectMonitoringEvaluation) => {
    setProjectMonitoringEvaluation(projectMonitoringEvaluation);
    setDeleteModal(true);
  };
  const handleProjectMonitoringEvaluationClicks = () => {
    setIsEdit(false);
    setProjectMonitoringEvaluation("");
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
        accessorKey: 'mne_transaction_type_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_transaction_type_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_visit_type',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_visit_type, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_project_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_project_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_type_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_type_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_physical',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_physical, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_financial',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_financial, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_physical_region',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_physical_region, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_financial_region',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_financial_region, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_team_members',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_team_members, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_feedback',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_feedback, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_weakness',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_weakness, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_challenges',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_challenges, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_recommendations',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_recommendations, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_purpose',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_purpose, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_record_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_record_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_start_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_start_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_end_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_end_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'mne_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.mne_status, 30) ||
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
                handleProjectMonitoringEvaluationClick(data);
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
}, [handleProjectMonitoringEvaluationClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <ProjectMonitoringEvaluationModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteProjectMonitoringEvaluation}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteProjectMonitoringEvaluation.isPending}
    />   
    {isLoading || isSearchLoading ? (
      <Spinners />
      ) : (
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
      handleUserClick={handleProjectMonitoringEvaluationClicks}
      isPagination={true}
                      // SearchPlaceholder="26 records..."
      SearchPlaceholder={26 + " " + t("Results") + "..."}
      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
      buttonName={t("add")}
      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
      theadClass="table-light"
      pagination="pagination"
      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      refetch={refetch}
      isFetching={isFetching}
      />
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
      <ModalHeader toggle={toggle} tag="h4">
      {!!isEdit ? (t("edit") + " "+t("project_monitoring_evaluation")) : (t("add") +" "+t("project_monitoring_evaluation"))}
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
                      <Label>{t('mne_transaction_type_id')}</Label>
                      <Input
                        name='mne_transaction_type_id'
                        type='select'
                        placeholder={t('mne_transaction_type_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_transaction_type_id || ''}
                        invalid={
                          validation.touched.mne_transaction_type_id &&
                          validation.errors.mne_transaction_type_id
                            ? true
                            : false
                        }
                       >
                      <option value="">Select Status</option>
                      <option value="1">{t("monitoring")}</option>
                      <option value="2">{t("evaluation")}</option>
                    </Input>
                      {validation.touched.mne_transaction_type_id &&
                      validation.errors.mne_transaction_type_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_transaction_type_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_visit_type')}</Label>
                      <Input
                        name='mne_visit_type'
                        type='text'
                        placeholder={t('mne_visit_type')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_visit_type || ''}
                        invalid={
                          validation.touched.mne_visit_type &&
                          validation.errors.mne_visit_type
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_visit_type &&
                      validation.errors.mne_visit_type ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_visit_type}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_project_id')}</Label>
                      <Input
                        name='mne_project_id'
                        type='text'
                        placeholder={t('mne_project_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_project_id || ''}
                        invalid={
                          validation.touched.mne_project_id &&
                          validation.errors.mne_project_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_project_id &&
                      validation.errors.mne_project_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_project_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_type_id')}</Label>
                      <Input
                        name='mne_type_id'
                        type='text'
                        placeholder={t('mne_type_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_type_id || ''}
                        invalid={
                          validation.touched.mne_type_id &&
                          validation.errors.mne_type_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_type_id &&
                      validation.errors.mne_type_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_type_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_physical')}</Label>
                      <Input
                        name='mne_physical'
                        type='text'
                        placeholder={t('mne_physical')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_physical || ''}
                        invalid={
                          validation.touched.mne_physical &&
                          validation.errors.mne_physical
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_physical &&
                      validation.errors.mne_physical ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_physical}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_financial')}</Label>
                      <Input
                        name='mne_financial'
                        type='text'
                        placeholder={t('mne_financial')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_financial || ''}
                        invalid={
                          validation.touched.mne_financial &&
                          validation.errors.mne_financial
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_financial &&
                      validation.errors.mne_financial ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_financial}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_physical_region')}</Label>
                      <Input
                        name='mne_physical_region'
                        type='text'
                        placeholder={t('mne_physical_region')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_physical_region || ''}
                        invalid={
                          validation.touched.mne_physical_region &&
                          validation.errors.mne_physical_region
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_physical_region &&
                      validation.errors.mne_physical_region ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_physical_region}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_financial_region')}</Label>
                      <Input
                        name='mne_financial_region'
                        type='text'
                        placeholder={t('mne_financial_region')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_financial_region || ''}
                        invalid={
                          validation.touched.mne_financial_region &&
                          validation.errors.mne_financial_region
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_financial_region &&
                      validation.errors.mne_financial_region ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_financial_region}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_team_members')}</Label>
                      <Input
                        name='mne_team_members'
                        type='text'
                        placeholder={t('mne_team_members')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_team_members || ''}
                        invalid={
                          validation.touched.mne_team_members &&
                          validation.errors.mne_team_members
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_team_members &&
                      validation.errors.mne_team_members ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_team_members}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_feedback')}</Label>
                      <Input
                        name='mne_feedback'
                        type='text'
                        placeholder={t('mne_feedback')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_feedback || ''}
                        invalid={
                          validation.touched.mne_feedback &&
                          validation.errors.mne_feedback
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_feedback &&
                      validation.errors.mne_feedback ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_feedback}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_weakness')}</Label>
                      <Input
                        name='mne_weakness'
                        type='text'
                        placeholder={t('mne_weakness')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_weakness || ''}
                        invalid={
                          validation.touched.mne_weakness &&
                          validation.errors.mne_weakness
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_weakness &&
                      validation.errors.mne_weakness ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_weakness}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_challenges')}</Label>
                      <Input
                        name='mne_challenges'
                        type='text'
                        placeholder={t('mne_challenges')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_challenges || ''}
                        invalid={
                          validation.touched.mne_challenges &&
                          validation.errors.mne_challenges
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_challenges &&
                      validation.errors.mne_challenges ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_challenges}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_recommendations')}</Label>
                      <Input
                        name='mne_recommendations'
                        type='text'
                        placeholder={t('mne_recommendations')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_recommendations || ''}
                        invalid={
                          validation.touched.mne_recommendations &&
                          validation.errors.mne_recommendations
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_recommendations &&
                      validation.errors.mne_recommendations ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_recommendations}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_purpose')}</Label>
                      <Input
                        name='mne_purpose'
                        type='text'
                        placeholder={t('mne_purpose')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_purpose || ''}
                        invalid={
                          validation.touched.mne_purpose &&
                          validation.errors.mne_purpose
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_purpose &&
                      validation.errors.mne_purpose ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_purpose}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_record_date')}</Label>
                      <Input
                        name='mne_record_date'
                        type='text'
                        placeholder={t('mne_record_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_record_date || ''}
                        invalid={
                          validation.touched.mne_record_date &&
                          validation.errors.mne_record_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_record_date &&
                      validation.errors.mne_record_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_record_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_start_date')}</Label>
                      <Input
                        name='mne_start_date'
                        type='text'
                        placeholder={t('mne_start_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_start_date || ''}
                        invalid={
                          validation.touched.mne_start_date &&
                          validation.errors.mne_start_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_start_date &&
                      validation.errors.mne_start_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_start_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_end_date')}</Label>
                      <Input
                        name='mne_end_date'
                        type='text'
                        placeholder={t('mne_end_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_end_date || ''}
                        invalid={
                          validation.touched.mne_end_date &&
                          validation.errors.mne_end_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_end_date &&
                      validation.errors.mne_end_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_end_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_description')}</Label>
                      <Input
                        name='mne_description'
                        type='text'
                        placeholder={t('mne_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_description || ''}
                        invalid={
                          validation.touched.mne_description &&
                          validation.errors.mne_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_description &&
                      validation.errors.mne_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('mne_status')}</Label>
                      <Input
                        name='mne_status'
                        type='text'
                        placeholder={t('mne_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mne_status || ''}
                        invalid={
                          validation.touched.mne_status &&
                          validation.errors.mne_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.mne_status &&
                      validation.errors.mne_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.mne_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addProjectMonitoringEvaluation.isPending || updateProjectMonitoringEvaluation.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addProjectMonitoringEvaluation.isPending ||
          updateProjectMonitoringEvaluation.isPending ||
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
          addProjectMonitoringEvaluation.isPending ||
          updateProjectMonitoringEvaluation.isPending ||
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
        <ToastContainer />
        </React.Fragment>
        );
};
ProjectMonitoringEvaluationModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectMonitoringEvaluationModel;