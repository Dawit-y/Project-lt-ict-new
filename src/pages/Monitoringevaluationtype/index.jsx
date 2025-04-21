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
import {
  useFetchMonitoringEvaluationTypes,
  useSearchMonitoringEvaluationTypes,
  useAddMonitoringEvaluationType,
  useDeleteMonitoringEvaluationType,
  useUpdateMonitoringEvaluationType,
} from "../../queries/monitoringevaluationtype_query";
import MonitoringEvaluationTypeModal from "./MonitoringEvaluationTypeModal";
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
const MonitoringEvaluationTypeModel = () => {
  //meta title
  document.title = " MonitoringEvaluationType";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [monitoringEvaluationType, setMonitoringEvaluationType] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } = useFetchMonitoringEvaluationTypes();
  const addMonitoringEvaluationType = useAddMonitoringEvaluationType();
  const updateMonitoringEvaluationType = useUpdateMonitoringEvaluationType();
  const deleteMonitoringEvaluationType = useDeleteMonitoringEvaluationType();
//START CRUD
  const handleAddMonitoringEvaluationType = async (data) => {
    try {
      await addMonitoringEvaluationType.mutateAsync(data);
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
  const handleUpdateMonitoringEvaluationType = async (data) => {
    try {
      await updateMonitoringEvaluationType.mutateAsync(data);
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
  const handleDeleteMonitoringEvaluationType = async () => {
    if (monitoringEvaluationType && monitoringEvaluationType.met_id) {
      try {
        const id = monitoringEvaluationType.met_id;
        await deleteMonitoringEvaluationType.mutateAsync(id);
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
     met_name_or:(monitoringEvaluationType && monitoringEvaluationType.met_name_or) || "", 
met_name_am:(monitoringEvaluationType && monitoringEvaluationType.met_name_am) || "", 
met_name_en:(monitoringEvaluationType && monitoringEvaluationType.met_name_en) || "", 
met_code:(monitoringEvaluationType && monitoringEvaluationType.met_code) || "", 
met_description:(monitoringEvaluationType && monitoringEvaluationType.met_description) || "", 
met_status:(monitoringEvaluationType && monitoringEvaluationType.met_status) || false, 
met_gov_active:(monitoringEvaluationType && monitoringEvaluationType.met_gov_active) || false, 
met_cso_active:(monitoringEvaluationType && monitoringEvaluationType.met_cso_active) || false, 
met_monitoring_active:(monitoringEvaluationType && monitoringEvaluationType.met_monitoring_active) || false, 
met_evaluation_active:(monitoringEvaluationType && monitoringEvaluationType.met_evaluation_active) || false, 

     is_deletable: (monitoringEvaluationType && monitoringEvaluationType.is_deletable) || 1,
     is_editable: (monitoringEvaluationType && monitoringEvaluationType.is_editable) || 1
   },
   validationSchema: Yup.object({
    met_name_or: Yup.string().required(t('met_name_or')),
met_name_am: Yup.string().required(t('met_name_am')),
met_name_en: Yup.string().required(t('met_name_en')),
met_code: Yup.string().required(t('met_code')),
met_description: Yup.string().required(t('met_description')),
met_status: Yup.string().required(t('met_status')),
met_gov_active: Yup.string().required(t('met_gov_active')),
met_cso_active: Yup.string().required(t('met_cso_active')),
met_monitoring_active: Yup.string().required(t('met_monitoring_active')),
met_evaluation_active: Yup.string().required(t('met_evaluation_active')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateMonitoringEvaluationType = {
        met_id: monitoringEvaluationType ? monitoringEvaluationType.met_id : 0,
        met_id:monitoringEvaluationType.met_id, 
met_name_or:values.met_name_or, 
met_name_am:values.met_name_am, 
met_name_en:values.met_name_en, 
met_code:values.met_code, 
met_description:values.met_description, 
met_status:values.met_status ? 1 : 0, 
met_gov_active:values.met_gov_active ? 1 : 0, 
met_cso_active:values.met_cso_active ? 1 : 0, 
met_monitoring_active:values.met_monitoring_active ? 1 : 0, 
met_evaluation_active:values.met_evaluation_active ? 1 : 0, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update MonitoringEvaluationType
      handleUpdateMonitoringEvaluationType(updateMonitoringEvaluationType);
    } else {
      const newMonitoringEvaluationType = {
        met_name_or:values.met_name_or, 
met_name_am:values.met_name_am, 
met_name_en:values.met_name_en, 
met_code:values.met_code, 
met_description:values.met_description, 
met_status:values.met_status ? 1 : 0, 
met_gov_active:values.met_gov_active ? 1 : 0, 
met_cso_active:values.met_cso_active ? 1 : 0, 
met_monitoring_active:values.met_monitoring_active ? 1 : 0, 
met_evaluation_active:values.met_evaluation_active ? 1 : 0, 

      };
        // save new MonitoringEvaluationType
      handleAddMonitoringEvaluationType(newMonitoringEvaluationType);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch MonitoringEvaluationType on component mount
  useEffect(() => {
    setMonitoringEvaluationType(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setMonitoringEvaluationType(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setMonitoringEvaluationType(null);
    } else {
      setModal(true);
    }
  };
  const handleMonitoringEvaluationTypeClick = (arg) => {
    const monitoringEvaluationType = arg;
    // console.log("handleMonitoringEvaluationTypeClick", monitoringEvaluationType);
    setMonitoringEvaluationType({
      met_id:monitoringEvaluationType.met_id, 
met_name_or:monitoringEvaluationType.met_name_or, 
met_name_am:monitoringEvaluationType.met_name_am, 
met_name_en:monitoringEvaluationType.met_name_en, 
met_code:monitoringEvaluationType.met_code, 
met_description:monitoringEvaluationType.met_description, 
met_status:monitoringEvaluationType.met_status === 1, 
met_gov_active:monitoringEvaluationType.met_gov_active === 1, 
met_cso_active:monitoringEvaluationType.met_cso_active === 1, 
met_monitoring_active:monitoringEvaluationType.met_monitoring_active === 1, 
met_evaluation_active:monitoringEvaluationType.met_evaluation_active === 1, 

      is_deletable: monitoringEvaluationType.is_deletable,
      is_editable: monitoringEvaluationType.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (monitoringEvaluationType) => {
    setMonitoringEvaluationType(monitoringEvaluationType);
    setDeleteModal(true);
  };
  const handleMonitoringEvaluationTypeClicks = () => {
    setIsEdit(false);
    setMonitoringEvaluationType("");
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
        accessorKey: 'met_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_or, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_am, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_name_en',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_name_en, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_code',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.met_code, 30) ||
                '-'}
            </span>
          );
        },
      },
{
        header: '',
        accessorKey: 'met_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.met_status === 1 ? "btn btn-sm btn-soft-danger" : ""}>
            {cellProps.row.original.met_status === 1 ? t("yes") : t("no")}
          </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_gov_active',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.met_gov_active === 1 ? "btn btn-sm btn-soft-success" : ""}>
            {cellProps.row.original.met_gov_active === 1 ? t("yes") : t("no")}
          </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_cso_active',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.met_cso_active === 1 ? "btn btn-sm btn-soft-success" : ""}>
            {cellProps.row.original.met_cso_active === 1 ? t("yes") : t("no")}
          </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_monitoring_active',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.met_monitoring_active === 1 ? "btn btn-sm btn-soft-success" : ""}>
            {cellProps.row.original.met_monitoring_active === 1 ? t("yes") : t("no")}
          </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'met_evaluation_active',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.met_evaluation_active === 1 ? "btn btn-sm btn-soft-success" : ""}>
            {cellProps.row.original.met_evaluation_active === 1 ? t("yes") : t("no")}
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
                handleMonitoringEvaluationTypeClick(data);
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
}, [handleMonitoringEvaluationTypeClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <MonitoringEvaluationTypeModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("monitoring_evaluation_type")}
    breadcrumbItem={t("monitoring_evaluation_type")}
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
      handleUserClick={handleMonitoringEvaluationTypeClicks}
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
      </CardBody>
      </Card>
      </Col>
      </Row>
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
      <ModalHeader toggle={toggle} tag="h4">
      {!!isEdit ? (t("edit") + " "+t("monitoring_evaluation_type")) : (t("add") +" "+t("monitoring_evaluation_type"))}
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
                      <Label>{t('met_name_or')}</Label>
                      <Input
                        name='met_name_or'
                        type='text'
                        placeholder={t('met_name_or')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.met_name_or || ''}
                        invalid={
                          validation.touched.met_name_or &&
                          validation.errors.met_name_or
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.met_name_or &&
                      validation.errors.met_name_or ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.met_name_or}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('met_name_am')}</Label>
                      <Input
                        name='met_name_am'
                        type='text'
                        placeholder={t('met_name_am')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.met_name_am || ''}
                        invalid={
                          validation.touched.met_name_am &&
                          validation.errors.met_name_am
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.met_name_am &&
                      validation.errors.met_name_am ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.met_name_am}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('met_name_en')}</Label>
                      <Input
                        name='met_name_en'
                        type='text'
                        placeholder={t('met_name_en')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.met_name_en || ''}
                        invalid={
                          validation.touched.met_name_en &&
                          validation.errors.met_name_en
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.met_name_en &&
                      validation.errors.met_name_en ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.met_name_en}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('met_code')}</Label>
                      <Input
                        name='met_code'
                        type='text'
                        placeholder={t('met_code')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.met_code || ''}
                        invalid={
                          validation.touched.met_code &&
                          validation.errors.met_code
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.met_code &&
                      validation.errors.met_code ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.met_code}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('met_description')}</Label>
                      <Input
                        name='met_description'
                        type='textarea'
                        placeholder={t('met_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.met_description || ''}
                        invalid={
                          validation.touched.met_description &&
                          validation.errors.met_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.met_description &&
                      validation.errors.met_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.met_description}
                        </FormFeedback>
                      ) : null}
                    </Col>
                    <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="met_status">
                        {t("met_status")}
                      </Label>
                      <Input
                        id="met_status"
                        name="met_status"
                        type="checkbox"
                        placeholder={t("met_status")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.met_status}
                        invalid={validation.touched.met_status && validation.errors.met_status}
                      />
                      {validation.touched.met_status && validation.errors.met_status && (
                        <FormFeedback type="invalid">{validation.errors.met_status}</FormFeedback>
                      )}
                    </div>
                  </Col>
                    <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="met_gov_active">
                        {t("met_gov_active")}
                      </Label>
                      <Input
                        id="met_gov_active"
                        name="met_gov_active"
                        type="checkbox"
                        placeholder={t("met_gov_active")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.met_gov_active}
                        invalid={validation.touched.met_gov_active && validation.errors.met_gov_active}
                      />
                      {validation.touched.met_gov_active && validation.errors.met_gov_active && (
                        <FormFeedback type="invalid">{validation.errors.met_gov_active}</FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="met_cso_active">
                        {t("met_cso_active")}
                      </Label>
                      <Input
                        id="met_cso_active"
                        name="met_cso_active"
                        type="checkbox"
                        placeholder={t("met_cso_active")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.met_cso_active}
                        invalid={validation.touched.met_cso_active && validation.errors.met_cso_active}
                      />
                      {validation.touched.met_cso_active && validation.errors.met_cso_active && (
                        <FormFeedback type="invalid">{validation.errors.met_cso_active}</FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="met_monitoring_active">
                        {t("met_monitoring_active")}
                      </Label>
                      <Input
                        id="met_monitoring_active"
                        name="met_monitoring_active"
                        type="checkbox"
                        placeholder={t("met_monitoring_active")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.met_monitoring_active}
                        invalid={validation.touched.met_monitoring_active && validation.errors.met_monitoring_active}
                      />
                      {validation.touched.met_monitoring_active && validation.errors.met_monitoring_active && (
                        <FormFeedback type="invalid">{validation.errors.met_monitoring_active}</FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <div className="form-check mb-4">
                      <Label className="me-1" for="met_evaluation_active">
                        {t("met_evaluation_active")}
                      </Label>
                      <Input
                        id="met_evaluation_active"
                        name="met_evaluation_active"
                        type="checkbox"
                        placeholder={t("met_evaluation_active")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.met_evaluation_active}
                        invalid={validation.touched.met_evaluation_active && validation.errors.met_evaluation_active}
                      />
                      {validation.touched.met_evaluation_active && validation.errors.met_evaluation_active && (
                        <FormFeedback type="invalid">{validation.errors.met_evaluation_active}</FormFeedback>
                      )}
                    </div>
                  </Col>  
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addMonitoringEvaluationType.isPending || updateMonitoringEvaluationType.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addMonitoringEvaluationType.isPending ||
          updateMonitoringEvaluationType.isPending ||
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
          addMonitoringEvaluationType.isPending ||
          updateMonitoringEvaluationType.isPending ||
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
MonitoringEvaluationTypeModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default MonitoringEvaluationTypeModel;