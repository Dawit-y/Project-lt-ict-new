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
import SearchComponent from "../../components/Common/SearchComponent";
//import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  useFetchProjectBudgetPlans,
  useSearchProjectBudgetPlans,
  useAddProjectBudgetPlan,
  useDeleteProjectBudgetPlan,
  useUpdateProjectBudgetPlan,
} from "../../queries/projectbudgetplan_query";
import ProjectBudgetPlanModal from "./ProjectBudgetPlanModal";
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
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectBudgetPlanModel = (props) => {
  //meta title
  document.title = " ProjectBudgetPlan";
  const { passedId, isActive } = props;
  const param = { emp_project_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectBudgetPlan, setProjectBudgetPlan] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchProjectBudgetPlans( param,
    isActive);
  const addProjectBudgetPlan = useAddProjectBudgetPlan();
  const updateProjectBudgetPlan = useUpdateProjectBudgetPlan();
  const deleteProjectBudgetPlan = useDeleteProjectBudgetPlan();
//START CRUD
  const handleAddProjectBudgetPlan = async (data) => {
    try {
      await addProjectBudgetPlan.mutateAsync(data);
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

  const handleUpdateProjectBudgetPlan = async (data) => {
    try {
      await updateProjectBudgetPlan.mutateAsync(data);
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
  const handleDeleteProjectBudgetPlan = async () => {
    if (projectBudgetPlan && projectBudgetPlan.bpl_id) {
      try {
        const id = projectBudgetPlan.bpl_id;
        await deleteProjectBudgetPlan.mutateAsync(id);
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
  //END CRUD
  //START FOREIGN CALLS

  
  // validation
  const validation = useFormik({
    // enableReinitialize: use this flag when initial values need to be changed
    enableReinitialize: true,

    initialValues: {
     bpl_project_id:(projectBudgetPlan && projectBudgetPlan.bpl_project_id) || "", 
bpl_budget_year_id:(projectBudgetPlan && projectBudgetPlan.bpl_budget_year_id) || "", 
bpl_budget_code_id:(projectBudgetPlan && projectBudgetPlan.bpl_budget_code_id) || "", 
bpl_amount:(projectBudgetPlan && projectBudgetPlan.bpl_amount) || "", 
bpl_description:(projectBudgetPlan && projectBudgetPlan.bpl_description) || "", 
bpl_status:(projectBudgetPlan && projectBudgetPlan.bpl_status) || "", 
bpl_created_date:(projectBudgetPlan && projectBudgetPlan.bpl_created_date) || "", 

is_deletable: (projectBudgetPlan && projectBudgetPlan.is_deletable) || 1,
is_editable: (projectBudgetPlan && projectBudgetPlan.is_editable) || 1
    },

    validationSchema: Yup.object({
      bpl_project_id: Yup.string().required(t('bpl_project_id')),
bpl_budget_year_id: Yup.string().required(t('bpl_budget_year_id')),
bpl_budget_code_id: Yup.string().required(t('bpl_budget_code_id')),
bpl_amount: Yup.string().required(t('bpl_amount')),
bpl_description: Yup.string().required(t('bpl_description')),
bpl_status: Yup.string().required(t('bpl_status')),
bpl_created_date: Yup.string().required(t('bpl_created_date')),

    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProjectBudgetPlan = {
          //bpl_id: projectBudgetPlan ? projectBudgetPlan.bpl_id : 0,
          bpl_id:projectBudgetPlan.bpl_id, 
//bpl_project_id:values.bpl_project_id, 
bpl_budget_year_id:values.bpl_budget_year_id, 
bpl_budget_code_id:values.bpl_budget_code_id, 
bpl_amount:values.bpl_amount, 
bpl_description:values.bpl_description, 
bpl_status:values.bpl_status, 
bpl_created_date:values.bpl_created_date, 

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProjectBudgetPlan
        handleUpdateProjectBudgetPlan(updateProjectBudgetPlan);
        validation.resetForm();
      } else {
        const newProjectBudgetPlan = {
          bpl_project_id:passedId, 
bpl_budget_year_id:values.bpl_budget_year_id, 
bpl_budget_code_id:values.bpl_budget_code_id, 
bpl_amount:values.bpl_amount, 
bpl_description:values.bpl_description, 
bpl_status:values.bpl_status, 
bpl_created_date:values.bpl_created_date, 

        };
        // save new ProjectBudgetPlan
        handleAddProjectBudgetPlan(newProjectBudgetPlan);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ProjectBudgetPlan on component mount
  useEffect(() => {
    setProjectBudgetPlan(data);
  }, [data]);
useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectBudgetPlan(data);
      setIsEdit(false);
    }
  }, [data]);
const toggle = () => {
    if (modal) {
      setModal(false);
       setProjectBudgetPlan(null);
    } else {
      setModal(true);
    }
  };

   const handleProjectBudgetPlanClick = (arg) => {
    const projectBudgetPlan = arg;
    // console.log("handleProjectBudgetPlanClick", projectBudgetPlan);
    setProjectBudgetPlan({
      bpl_id:projectBudgetPlan.bpl_id, 
bpl_project_id:projectBudgetPlan.bpl_project_id, 
bpl_budget_year_id:projectBudgetPlan.bpl_budget_year_id, 
bpl_budget_code_id:projectBudgetPlan.bpl_budget_code_id, 
bpl_amount:projectBudgetPlan.bpl_amount, 
bpl_description:projectBudgetPlan.bpl_description, 
bpl_status:projectBudgetPlan.bpl_status, 
bpl_created_date:projectBudgetPlan.bpl_created_date, 

      is_deletable: projectBudgetPlan.is_deletable,
      is_editable: projectBudgetPlan.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectBudgetPlan) => {
    setProjectBudgetPlan(projectBudgetPlan);
    setDeleteModal(true);
  };

  const handleProjectBudgetPlanClicks = () => {
    setIsEdit(false);
    setProjectBudgetPlan("");
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
        accessorKey: 'bpl_budget_year_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_budget_year_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bpl_budget_code_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_budget_code_id, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bpl_amount',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_amount, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bpl_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bpl_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_status, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bpl_created_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bpl_created_date, 30) ||
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
      data?.previledge?.is_role_editable &&
      data?.previledge?.is_role_deletable
    ) {
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
                    handleProjectBudgetPlanClick(data);
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
  }, [handleProjectBudgetPlanClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <ProjectBudgetPlanModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
       onDeleteClick={handleDeleteProjectBudgetPlan}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProjectBudgetPlan.isPending}
      />
      <div className="page-content1">
        <div>
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
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleProjectBudgetPlanClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") +" "+ t("project_budget_plan")}
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
          )}
          <Modal isOpen={modal} toggle={toggle} className="modal-xl">
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? (t("edit") + " "+t("project_budget_plan")) : (t("add") +" "+t("project_budget_plan"))}
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
                      <Label>{t('bpl_project_id')}</Label>
                      <Input
                        name='bpl_project_id'
                        type='text'
                        placeholder={t('bpl_project_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_project_id || ''}
                        invalid={
                          validation.touched.bpl_project_id &&
                          validation.errors.bpl_project_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_project_id &&
                      validation.errors.bpl_project_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_project_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_budget_year_id')}</Label>
                      <Input
                        name='bpl_budget_year_id'
                        type='text'
                        placeholder={t('bpl_budget_year_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_budget_year_id || ''}
                        invalid={
                          validation.touched.bpl_budget_year_id &&
                          validation.errors.bpl_budget_year_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_budget_year_id &&
                      validation.errors.bpl_budget_year_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_budget_year_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_budget_code_id')}</Label>
                      <Input
                        name='bpl_budget_code_id'
                        type='text'
                        placeholder={t('bpl_budget_code_id')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_budget_code_id || ''}
                        invalid={
                          validation.touched.bpl_budget_code_id &&
                          validation.errors.bpl_budget_code_id
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_budget_code_id &&
                      validation.errors.bpl_budget_code_id ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_budget_code_id}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_amount')}</Label>
                      <Input
                        name='bpl_amount'
                        type='text'
                        placeholder={t('bpl_amount')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_amount || ''}
                        invalid={
                          validation.touched.bpl_amount &&
                          validation.errors.bpl_amount
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_amount &&
                      validation.errors.bpl_amount ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_amount}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_description')}</Label>
                      <Input
                        name='bpl_description'
                        type='text'
                        placeholder={t('bpl_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_description || ''}
                        invalid={
                          validation.touched.bpl_description &&
                          validation.errors.bpl_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_description &&
                      validation.errors.bpl_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_status')}</Label>
                      <Input
                        name='bpl_status'
                        type='text'
                        placeholder={t('bpl_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_status || ''}
                        invalid={
                          validation.touched.bpl_status &&
                          validation.errors.bpl_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_status &&
                      validation.errors.bpl_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('bpl_created_date')}</Label>
                      <Input
                        name='bpl_created_date'
                        type='text'
                        placeholder={t('bpl_created_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bpl_created_date || ''}
                        invalid={
                          validation.touched.bpl_created_date &&
                          validation.errors.bpl_created_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bpl_created_date &&
                      validation.errors.bpl_created_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bpl_created_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProjectBudgetPlan.isPending || updateProjectBudgetPlan.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProjectBudgetPlan.isPending ||
                            updateProjectBudgetPlan.isPending ||
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
                            addProjectBudgetPlan.isPending ||
                            updateProjectBudgetPlan.isPending ||
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
ProjectBudgetPlanModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ProjectBudgetPlanModel;