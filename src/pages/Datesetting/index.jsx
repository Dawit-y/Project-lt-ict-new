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
  useFetchDateSettings,
  useSearchDateSettings,
  useAddDateSetting,
  useDeleteDateSetting,
  useUpdateDateSetting,
} from "../../queries/datesetting_query";
import DateSettingModal from "./DateSettingModal";
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
const DateSettingModel = () => {
  //meta title
  document.title = " DateSetting";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dateSetting, setDateSetting] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchDateSettings();
  const addDateSetting = useAddDateSetting();
  const updateDateSetting = useUpdateDateSetting();
  const deleteDateSetting = useDeleteDateSetting();
//START CRUD
  const handleAddDateSetting = async (data) => {
    try {
      await addDateSetting.mutateAsync(data);
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
  const handleUpdateDateSetting = async (data) => {
    try {
      await updateDateSetting.mutateAsync(data);
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
  const handleDeleteDateSetting = async () => {
    if (dateSetting && dateSetting.dts_id) {
      try {
        const id = dateSetting.dts_id;
        await deleteDateSetting.mutateAsync(id);
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
     dts_parameter_name:(dateSetting && dateSetting.dts_parameter_name) || "", 
dts_parameter_code:(dateSetting && dateSetting.dts_parameter_code) || "", 
dts_start_date:(dateSetting && dateSetting.dts_start_date) || "", 
dts_end_date:(dateSetting && dateSetting.dts_end_date) || "", 
dts_description:(dateSetting && dateSetting.dts_description) || "", 
dts_status:(dateSetting && dateSetting.dts_status) || "", 

     is_deletable: (dateSetting && dateSetting.is_deletable) || 1,
     is_editable: (dateSetting && dateSetting.is_editable) || 1
   },
   validationSchema: Yup.object({
    dts_parameter_name: Yup.string().required(t('dts_parameter_name')),
dts_parameter_code: Yup.string().required(t('dts_parameter_code')),
dts_start_date: Yup.string().required(t('dts_start_date')),
dts_end_date: Yup.string().required(t('dts_end_date')),
dts_description: Yup.string().required(t('dts_description')),
dts_status: Yup.string().required(t('dts_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateDateSetting = {
        dts_id: dateSetting ? dateSetting.dts_id : 0,
        dts_id:dateSetting.dts_id, 
dts_parameter_name:values.dts_parameter_name, 
dts_parameter_code:values.dts_parameter_code, 
dts_start_date:values.dts_start_date, 
dts_end_date:values.dts_end_date, 
dts_description:values.dts_description, 
dts_status:values.dts_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update DateSetting
      handleUpdateDateSetting(updateDateSetting);
    } else {
      const newDateSetting = {
        dts_parameter_name:values.dts_parameter_name, 
dts_parameter_code:values.dts_parameter_code, 
dts_start_date:values.dts_start_date, 
dts_end_date:values.dts_end_date, 
dts_description:values.dts_description, 
dts_status:values.dts_status, 

      };
        // save new DateSetting
      handleAddDateSetting(newDateSetting);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch DateSetting on component mount
  useEffect(() => {
    setDateSetting(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setDateSetting(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setDateSetting(null);
    } else {
      setModal(true);
    }
  };
  const handleDateSettingClick = (arg) => {
    const dateSetting = arg;
    // console.log("handleDateSettingClick", dateSetting);
    setDateSetting({
      dts_id:dateSetting.dts_id, 
dts_parameter_name:dateSetting.dts_parameter_name, 
dts_parameter_code:dateSetting.dts_parameter_code, 
dts_start_date:dateSetting.dts_start_date, 
dts_end_date:dateSetting.dts_end_date, 
dts_description:dateSetting.dts_description, 
dts_status:dateSetting.dts_status, 

      is_deletable: dateSetting.is_deletable,
      is_editable: dateSetting.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (dateSetting) => {
    setDateSetting(dateSetting);
    setDeleteModal(true);
  };
  const handleDateSettingClicks = () => {
    setIsEdit(false);
    setDateSetting("");
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
        accessorKey: 'dts_parameter_name',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_parameter_name, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'dts_parameter_code',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_parameter_code, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'dts_start_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_start_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'dts_end_date',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_end_date, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'dts_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'dts_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.dts_status, 30) ||
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
                handleDateSettingClick(data);
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
}, [handleDateSettingClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <DateSettingModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteDateSetting}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteDateSetting.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("date_setting")}
    breadcrumbItem={t("date_setting")}
    />
    <AdvancedSearch
    searchHook={useSearchDateSettings}
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
      handleUserClick={handleDateSettingClicks}
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
      {!!isEdit ? (t("edit") + " "+t("date_setting")) : (t("add") +" "+t("date_setting"))}
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
                      <Label>{t('dts_parameter_name')}</Label>
                      <Input
                        name='dts_parameter_name'
                        type='text'
                        placeholder={t('dts_parameter_name')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_parameter_name || ''}
                        invalid={
                          validation.touched.dts_parameter_name &&
                          validation.errors.dts_parameter_name
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_parameter_name &&
                      validation.errors.dts_parameter_name ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_parameter_name}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('dts_parameter_code')}</Label>
                      <Input
                        name='dts_parameter_code'
                        type='text'
                        placeholder={t('dts_parameter_code')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_parameter_code || ''}
                        invalid={
                          validation.touched.dts_parameter_code &&
                          validation.errors.dts_parameter_code
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_parameter_code &&
                      validation.errors.dts_parameter_code ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_parameter_code}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('dts_start_date')}</Label>
                      <Input
                        name='dts_start_date'
                        type='text'
                        placeholder={t('dts_start_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_start_date || ''}
                        invalid={
                          validation.touched.dts_start_date &&
                          validation.errors.dts_start_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_start_date &&
                      validation.errors.dts_start_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_start_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('dts_end_date')}</Label>
                      <Input
                        name='dts_end_date'
                        type='text'
                        placeholder={t('dts_end_date')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_end_date || ''}
                        invalid={
                          validation.touched.dts_end_date &&
                          validation.errors.dts_end_date
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_end_date &&
                      validation.errors.dts_end_date ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_end_date}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('dts_description')}</Label>
                      <Input
                        name='dts_description'
                        type='text'
                        placeholder={t('dts_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_description || ''}
                        invalid={
                          validation.touched.dts_description &&
                          validation.errors.dts_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_description &&
                      validation.errors.dts_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('dts_status')}</Label>
                      <Input
                        name='dts_status'
                        type='text'
                        placeholder={t('dts_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.dts_status || ''}
                        invalid={
                          validation.touched.dts_status &&
                          validation.errors.dts_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.dts_status &&
                      validation.errors.dts_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.dts_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addDateSetting.isPending || updateDateSetting.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addDateSetting.isPending ||
          updateDateSetting.isPending ||
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
          addDateSetting.isPending ||
          updateDateSetting.isPending ||
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
DateSettingModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default DateSettingModel;