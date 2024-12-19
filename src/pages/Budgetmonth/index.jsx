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
  useFetchBudgetMonths,
  useSearchBudgetMonths,
  useAddBudgetMonth,
  useDeleteBudgetMonth,
  useUpdateBudgetMonth,
} from "../../queries/budgetmonth_query";
import BudgetMonthModal from "./BudgetMonthModal";
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

const BudgetMonthModel = () => {
  //meta title
  document.title = " BudgetMonth";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetMonth, setBudgetMonth] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, error, isError, refetch } = useFetchBudgetMonths();

  const addBudgetMonth = useAddBudgetMonth();
  const updateBudgetMonth = useUpdateBudgetMonth();
  const deleteBudgetMonth = useDeleteBudgetMonth();
//START CRUD
  const handleAddBudgetMonth = async (data) => {
    try {
      await addBudgetMonth.mutateAsync(data);
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

  const handleUpdateBudgetMonth = async (data) => {
    try {
      await updateBudgetMonth.mutateAsync(data);
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
  const handleDeleteBudgetMonth = async () => {
    if (budgetMonth && budgetMonth.bdm_id) {
      try {
        const id = budgetMonth.bdm_id;
        await deleteBudgetMonth.mutateAsync(id);
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
     bdm_month:(budgetMonth && budgetMonth.bdm_month) || "", 
      bdm_name_or:(budgetMonth && budgetMonth.bdm_name_or) || "", 
      bdm_name_am:(budgetMonth && budgetMonth.bdm_name_am) || "", 
      bdm_name_en:(budgetMonth && budgetMonth.bdm_name_en) || "", 
      bdm_code:(budgetMonth && budgetMonth.bdm_code) || "", 
      bdm_description:(budgetMonth && budgetMonth.bdm_description) || "", 
      bdm_status:(budgetMonth && budgetMonth.bdm_status) || "", 

is_deletable: (budgetMonth && budgetMonth.is_deletable) || 1,
is_editable: (budgetMonth && budgetMonth.is_editable) || 1
    },

    validationSchema: Yup.object({
    bdm_month: Yup.string().required(t('bdm_month')),
    bdm_name_or: Yup.string().required(t('bdm_name_or')),
    bdm_name_am: Yup.string().required(t('bdm_name_am')),
    bdm_name_en: Yup.string().required(t('bdm_name_en')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetMonth = {
          bdm_id: budgetMonth ? budgetMonth.bdm_id : 0,
          bdm_month:values.bdm_month, 
          bdm_name_or:values.bdm_name_or, 
          bdm_name_am:values.bdm_name_am, 
          bdm_name_en:values.bdm_name_en, 
          bdm_code:values.bdm_code, 
          bdm_description:values.bdm_description, 
          bdm_status:values.bdm_status, 

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetMonth
        handleUpdateBudgetMonth(updateBudgetMonth);
        validation.resetForm();
      } else {
        const newBudgetMonth = {
          bdm_month:values.bdm_month, 
          bdm_name_or:values.bdm_name_or, 
          bdm_name_am:values.bdm_name_am, 
          bdm_name_en:values.bdm_name_en, 
          bdm_code:values.bdm_code, 
          bdm_description:values.bdm_description, 
          bdm_status:values.bdm_status, 

        };
        // save new BudgetMonth
        handleAddBudgetMonth(newBudgetMonth);
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetMonth on component mount
  useEffect(() => {
    setBudgetMonth(data);
  }, [data]);
useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetMonth(data);
      setIsEdit(false);
    }
  }, [data]);
const toggle = () => {
    if (modal) {
      setModal(false);
       setBudgetMonth(null);
    } else {
      setModal(true);
    }
  };

   const handleBudgetMonthClick = (arg) => {
    const budgetMonth = arg;
    // console.log("handleBudgetMonthClick", budgetMonth);
    setBudgetMonth({
      bdm_id:budgetMonth.bdm_id, 
      bdm_month:budgetMonth.bdm_month, 
      bdm_name_or:budgetMonth.bdm_name_or, 
      bdm_name_am:budgetMonth.bdm_name_am, 
      bdm_name_en:budgetMonth.bdm_name_en, 
      bdm_code:budgetMonth.bdm_code, 
      bdm_description:budgetMonth.bdm_description, 
      bdm_status:budgetMonth.bdm_status, 

      is_deletable: budgetMonth.is_deletable,
      is_editable: budgetMonth.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetMonth) => {
    setBudgetMonth(budgetMonth);
    setDeleteModal(true);
  };

  const handleBudgetMonthClicks = () => {
    setIsEdit(false);
    setBudgetMonth("");
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
        accessorKey: 'bdm_month',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_month, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'bdm_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_name_or, 30) ||
                '-'}
            </span>
          );
        },
      },
      {
        header: '',
        accessorKey: 'bdm_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_name_am, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bdm_name_en',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_name_en, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bdm_code',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_code, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'bdm_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bdm_description, 30) ||
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
                    handleBudgetMonthClick(data);
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
  }, [handleBudgetMonthClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <BudgetMonthModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
       onDeleteClick={handleDeleteBudgetMonth}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetMonth.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("budget_month")}
            breadcrumbItem={t("budget_month")}
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
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleBudgetMonthClicks}
                      isPagination={true}
                      SearchPlaceholder={ t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={t("add") +" "+ t("budget_month")}
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
              {!!isEdit ? (t("edit") + " "+t("budget_month")) : (t("add") +" "+t("budget_month"))}
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

                  <Label>{t('bdm_month')}<span className="text-danger">*</span></Label>
                      <Input
                        name='bdm_month'
                        type='text'
                        placeholder={t('bdm_month')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_month || ''}
                        invalid={
                          validation.touched.bdm_month &&
                          validation.errors.bdm_month
                            ? true
                            : false
                        }
                        maxLength={100}
                      />
                      {validation.touched.bdm_month &&
                      validation.errors.bdm_month ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_month}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  <Col className='col-md-6 mb-3'>
                      <Label>{t('bdm_name_or')}<span className="text-danger">*</span></Label>
                      <Input
                        name='bdm_name_or'
                        type='text'
                        placeholder={t('bdm_name_or')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_name_or || ''}
                        invalid={
                          validation.touched.bdm_name_or &&
                          validation.errors.bdm_name_or
                            ? true
                            : false
                        }
                        maxLength={100}
                      />
                      {validation.touched.bdm_name_or &&
                      validation.errors.bdm_name_or ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_name_or}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                    <Col className='col-md-6 mb-3'>
                      <Label>{t('bdm_name_am')}<span className="text-danger">*</span></Label>
                      <Input
                        name='bdm_name_am'
                        type='text'
                        placeholder={t('bdm_name_am')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_name_am || ''}
                        invalid={
                          validation.touched.bdm_name_am &&
                          validation.errors.bdm_name_am
                            ? true
                            : false
                        }
                        maxLength={100}
                      />
                      {validation.touched.bdm_name_am &&
                      validation.errors.bdm_name_am ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_name_am}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                      <Col className='col-md-6 mb-3'>
                      <Label>{t('bdm_name_en')}<span className="text-danger">*</span></Label>
                      <Input
                        name='bdm_name_en'
                        type='text'
                        placeholder={t('bdm_name_en')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_name_en || ''}
                        invalid={
                          validation.touched.bdm_name_en &&
                          validation.errors.bdm_name_en
                            ? true
                            : false
                        }
                        maxLength={100}
                      />
                      {validation.touched.bdm_name_en &&
                      validation.errors.bdm_name_en ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_name_en}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                      <Col className='col-md-6 mb-3'>
                      <Label>{t('bdm_code')}</Label>
                      <Input
                        name='bdm_code'
                        type='text'
                        placeholder={t('bdm_code')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_code || ''}
                        invalid={
                          validation.touched.bdm_code &&
                          validation.errors.bdm_code
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bdm_code &&
                      validation.errors.bdm_code ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_code}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                      <Col className='col-md-6 mb-3'>
                      <Label>{t('bdm_description')}</Label>
                      <Input
                        name='bdm_description'
                        type='textarea'
                        placeholder={t('bdm_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.bdm_description || ''}
                        invalid={
                          validation.touched.bdm_description &&
                          validation.errors.bdm_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.bdm_description &&
                      validation.errors.bdm_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.bdm_description}
                        </FormFeedback>
                      ) : null}
                    </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addBudgetMonth.isPending || updateBudgetMonth.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addBudgetMonth.isPending ||
                            updateBudgetMonth.isPending ||
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
                            addBudgetMonth.isPending ||
                            updateBudgetMonth.isPending ||
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
BudgetMonthModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetMonthModel;