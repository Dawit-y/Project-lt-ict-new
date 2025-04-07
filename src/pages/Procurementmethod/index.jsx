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
  useFetchProcurementMethods,
  useSearchProcurementMethods,
  useAddProcurementMethod,
  useDeleteProcurementMethod,
  useUpdateProcurementMethod,
} from "../../queries/procurementmethod_query";
import ProcurementMethodModal from "./ProcurementMethodModal";
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
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  onlyAmharicValidation
} from "../../utils/Validation/validation";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProcurementMethodModel = () => {
  //meta title
  document.title = " ProcurementMethod";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [procurementMethod, setProcurementMethod] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchProcurementMethods();
  const addProcurementMethod = useAddProcurementMethod();
  const updateProcurementMethod = useUpdateProcurementMethod();
  const deleteProcurementMethod = useDeleteProcurementMethod();
//START CRUD
  const handleAddProcurementMethod = async (data) => {
    try {
      await addProcurementMethod.mutateAsync(data);
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
  const handleUpdateProcurementMethod = async (data) => {
    try {
      await updateProcurementMethod.mutateAsync(data);
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
  const handleDeleteProcurementMethod = async () => {
    if (procurementMethod && procurementMethod.prm_id) {
      try {
        const id = procurementMethod.prm_id;
        await deleteProcurementMethod.mutateAsync(id);
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
     prm_name_or:(procurementMethod && procurementMethod.prm_name_or) || "", 
      prm_name_en:(procurementMethod && procurementMethod.prm_name_en) || "", 
      prm_name_am:(procurementMethod && procurementMethod.prm_name_am) || "", 
      prm_description:(procurementMethod && procurementMethod.prm_description) || "", 
      prm_status:(procurementMethod && procurementMethod.prm_status) || "", 

     is_deletable: (procurementMethod && procurementMethod.is_deletable) || 1,
     is_editable: (procurementMethod && procurementMethod.is_editable) || 1
   },
   validationSchema: Yup.object({
     prm_name_or: alphanumericValidation(2, 100, true).test(
        "unique-prm_name_or",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.prm_name_or == value &&
              item.prm_id !== procurementMethod?.prm_id
          );
        }
      ),
      prm_name_am: onlyAmharicValidation(2, 100, true),
      prm_name_en: alphanumericValidation(2, 100, true),
      prm_description: alphanumericValidation(3, 425, false),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateProcurementMethod = {
        prm_id: procurementMethod ? procurementMethod.prm_id : 0,
        prm_name_or:values.prm_name_or, 
        prm_name_en:values.prm_name_en, 
        prm_name_am:values.prm_name_am, 
        prm_description:values.prm_description, 
        prm_status:values.prm_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ProcurementMethod
      handleUpdateProcurementMethod(updateProcurementMethod);
    } else {
      const newProcurementMethod = {
        prm_name_or:values.prm_name_or, 
prm_name_en:values.prm_name_en, 
prm_name_am:values.prm_name_am, 
prm_description:values.prm_description, 
prm_status:values.prm_status, 

      };
        // save new ProcurementMethod
      handleAddProcurementMethod(newProcurementMethod);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProcurementMethod on component mount
  useEffect(() => {
    setProcurementMethod(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProcurementMethod(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProcurementMethod(null);
    } else {
      setModal(true);
    }
  };
  const handleProcurementMethodClick = (arg) => {
    const procurementMethod = arg;
    // console.log("handleProcurementMethodClick", procurementMethod);
    setProcurementMethod({
      prm_id:procurementMethod.prm_id, 
      prm_name_or:procurementMethod.prm_name_or, 
      prm_name_en:procurementMethod.prm_name_en, 
      prm_name_am:procurementMethod.prm_name_am, 
      prm_description:procurementMethod.prm_description, 
      prm_status:procurementMethod.prm_status, 

      is_deletable: procurementMethod.is_deletable,
      is_editable: procurementMethod.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (procurementMethod) => {
    setProcurementMethod(procurementMethod);
    setDeleteModal(true);
  };
  const handleProcurementMethodClicks = () => {
    setIsEdit(false);
    setProcurementMethod("");
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
        accessorKey: 'prm_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prm_name_or, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'prm_name_en',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prm_name_en, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'prm_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prm_name_am, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'prm_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.prm_description, 30) ||
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
                handleProcurementMethodClick(data);
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
}, [handleProcurementMethodClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <ProcurementMethodModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteProcurementMethod}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteProcurementMethod.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("procurement_method")}
    breadcrumbItem={t("procurement_method")}
    />
    <AdvancedSearch
    searchHook={useSearchProcurementMethods}
    textSearchKeys={["prm_name_or", "prm_name_en", "prm_name_am"]}
    dropdownSearchKeys={[
   
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
      handleUserClick={handleProcurementMethodClicks}
      isPagination={true}
      SearchPlaceholder={ t("Results") + "..."}
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
      {!!isEdit ? (t("edit") + " "+t("procurement_method")) : (t("add") +" "+t("procurement_method"))}
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
                      <Label>{t('prm_name_or')}<span className="text-danger">*</span></Label>
                      <Input
                        name='prm_name_or'
                        type='text'
                        placeholder={t('prm_name_or')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.prm_name_or || ''}
                        invalid={
                          validation.touched.prm_name_or &&
                          validation.errors.prm_name_or
                            ? true
                            : false
                        }
                        maxLength={50}
                      />
                      {validation.touched.prm_name_or &&
                      validation.errors.prm_name_or ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.prm_name_or}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('prm_name_en')}<span className="text-danger">*</span></Label>
                      <Input
                        name='prm_name_en'
                        type='text'
                        placeholder={t('prm_name_en')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.prm_name_en || ''}
                        invalid={
                          validation.touched.prm_name_en &&
                          validation.errors.prm_name_en
                            ? true
                            : false
                        }
                        maxLength={50}
                      />
                      {validation.touched.prm_name_en &&
                      validation.errors.prm_name_en ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.prm_name_en}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('prm_name_am')}<span className="text-danger">*</span></Label>
                      <Input
                        name='prm_name_am'
                        type='text'
                        placeholder={t('prm_name_am')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.prm_name_am || ''}
                        invalid={
                          validation.touched.prm_name_am &&
                          validation.errors.prm_name_am
                            ? true
                            : false
                        }
                        maxLength={50}
                      />
                      {validation.touched.prm_name_am &&
                      validation.errors.prm_name_am ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.prm_name_am}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('prm_description')}</Label>
                      <Input
                        name='prm_description'
                        type='textarea'
                        placeholder={t('prm_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.prm_description || ''}
                        invalid={
                          validation.touched.prm_description &&
                          validation.errors.prm_description
                            ? true
                            : false
                        }
                        maxLength={425}
                      />
                      {validation.touched.prm_description &&
                      validation.errors.prm_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.prm_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                <Col className='col-md-6 mb-3'  style={{ display: 'none' }}>
                      <Label>{t('prm_status')}</Label>
                      <Input
                        name='prm_status'
                        type='text'
                        placeholder={t('prm_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.prm_status || ''}
                        invalid={
                          validation.touched.prm_status &&
                          validation.errors.prm_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.prm_status &&
                      validation.errors.prm_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.prm_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addProcurementMethod.isPending || updateProcurementMethod.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addProcurementMethod.isPending ||
          updateProcurementMethod.isPending ||
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
          addProcurementMethod.isPending ||
          updateProcurementMethod.isPending ||
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
ProcurementMethodModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProcurementMethodModel;