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
  useFetchProjectKpis,
  useSearchProjectKpis,
  useAddProjectKpi,
  useDeleteProjectKpi,
  useUpdateProjectKpi,
} from "../../queries/projectkpi_query";
import ProjectKpiModal from "./ProjectKpiModal";
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
const ProjectKpiModel = () => {
  //meta title
  document.title = " ProjectKpi";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectKpi, setProjectKpi] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchProjectKpis();
  const addProjectKpi = useAddProjectKpi();
  const updateProjectKpi = useUpdateProjectKpi();
  const deleteProjectKpi = useDeleteProjectKpi();
//START CRUD
  const handleAddProjectKpi = async (data) => {
    try {
      await addProjectKpi.mutateAsync(data);
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
  const handleUpdateProjectKpi = async (data) => {
    try {
      await updateProjectKpi.mutateAsync(data);
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
  const handleDeleteProjectKpi = async () => {
    if (projectKpi && projectKpi.kpi_id) {
      try {
        const id = projectKpi.kpi_id;
        await deleteProjectKpi.mutateAsync(id);
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
     kpi_name_or:(projectKpi && projectKpi.kpi_name_or) || "", 
kpi_name_am:(projectKpi && projectKpi.kpi_name_am) || "", 
kpi_name_en:(projectKpi && projectKpi.kpi_name_en) || "", 
kpi_unit_measurement:(projectKpi && projectKpi.kpi_unit_measurement) || "", 
kpi_description:(projectKpi && projectKpi.kpi_description) || "", 
kpi_status:(projectKpi && projectKpi.kpi_status) || "", 

     is_deletable: (projectKpi && projectKpi.is_deletable) || 1,
     is_editable: (projectKpi && projectKpi.is_editable) || 1
   },
   validationSchema: Yup.object({
    kpi_name_or: Yup.string().required(t('kpi_name_or')),
kpi_name_am: Yup.string().required(t('kpi_name_am')),
kpi_name_en: Yup.string().required(t('kpi_name_en')),
kpi_unit_measurement: Yup.string().required(t('kpi_unit_measurement')),
kpi_description: Yup.string().required(t('kpi_description')),
kpi_status: Yup.string().required(t('kpi_status')),

  }),
   validateOnBlur: true,
   validateOnChange: false,
   onSubmit: (values) => {
    if (isEdit) {
      const updateProjectKpi = {
        kpi_id: projectKpi ? projectKpi.kpi_id : 0,
        kpi_id:projectKpi.kpi_id, 
kpi_name_or:values.kpi_name_or, 
kpi_name_am:values.kpi_name_am, 
kpi_name_en:values.kpi_name_en, 
kpi_unit_measurement:values.kpi_unit_measurement, 
kpi_description:values.kpi_description, 
kpi_status:values.kpi_status, 

        is_deletable: values.is_deletable,
        is_editable: values.is_editable,
      };
        // update ProjectKpi
      handleUpdateProjectKpi(updateProjectKpi);
    } else {
      const newProjectKpi = {
        kpi_name_or:values.kpi_name_or, 
kpi_name_am:values.kpi_name_am, 
kpi_name_en:values.kpi_name_en, 
kpi_unit_measurement:values.kpi_unit_measurement, 
kpi_description:values.kpi_description, 
kpi_status:values.kpi_status, 

      };
        // save new ProjectKpi
      handleAddProjectKpi(newProjectKpi);
    }
  },
});
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProjectKpi on component mount
  useEffect(() => {
    setProjectKpi(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProjectKpi(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProjectKpi(null);
    } else {
      setModal(true);
    }
  };
  const handleProjectKpiClick = (arg) => {
    const projectKpi = arg;
    // console.log("handleProjectKpiClick", projectKpi);
    setProjectKpi({
      kpi_id:projectKpi.kpi_id, 
kpi_name_or:projectKpi.kpi_name_or, 
kpi_name_am:projectKpi.kpi_name_am, 
kpi_name_en:projectKpi.kpi_name_en, 
kpi_unit_measurement:projectKpi.kpi_unit_measurement, 
kpi_description:projectKpi.kpi_description, 
kpi_status:projectKpi.kpi_status, 

      is_deletable: projectKpi.is_deletable,
      is_editable: projectKpi.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (projectKpi) => {
    setProjectKpi(projectKpi);
    setDeleteModal(true);
  };
  const handleProjectKpiClicks = () => {
    setIsEdit(false);
    setProjectKpi("");
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
        accessorKey: 'kpi_name_or',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_name_or, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpi_name_am',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_name_am, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpi_name_en',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_name_en, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpi_unit_measurement',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_unit_measurement, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpi_description',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_description, 30) ||
                '-'}
            </span>
          );
        },
      }, 
{
        header: '',
        accessorKey: 'kpi_status',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.kpi_status, 30) ||
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
                handleProjectKpiClick(data);
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
}, [handleProjectKpiClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
    <ProjectKpiModal
    isOpen={modal1}
    toggle={toggleViewModal}
    transaction={transaction}
    />
    <DeleteModal
    show={deleteModal}
    onDeleteClick={handleDeleteProjectKpi}
    onCloseClick={() => setDeleteModal(false)}
    isLoading={deleteProjectKpi.isPending}
    />
    <div className="page-content">
    <div className="container-fluid">
    <Breadcrumbs
    title={t("project_kpi")}
    breadcrumbItem={t("project_kpi")}
    />
    <AdvancedSearch
    searchHook={useSearchProjectKpis}
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
      handleUserClick={handleProjectKpiClicks}
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
      {!!isEdit ? (t("edit") + " "+t("project_kpi")) : (t("add") +" "+t("project_kpi"))}
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
                      <Label>{t('kpi_name_or')}</Label>
                      <Input
                        name='kpi_name_or'
                        type='text'
                        placeholder={t('kpi_name_or')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_name_or || ''}
                        invalid={
                          validation.touched.kpi_name_or &&
                          validation.errors.kpi_name_or
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_name_or &&
                      validation.errors.kpi_name_or ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_name_or}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('kpi_name_am')}</Label>
                      <Input
                        name='kpi_name_am'
                        type='text'
                        placeholder={t('kpi_name_am')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_name_am || ''}
                        invalid={
                          validation.touched.kpi_name_am &&
                          validation.errors.kpi_name_am
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_name_am &&
                      validation.errors.kpi_name_am ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_name_am}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('kpi_name_en')}</Label>
                      <Input
                        name='kpi_name_en'
                        type='text'
                        placeholder={t('kpi_name_en')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_name_en || ''}
                        invalid={
                          validation.touched.kpi_name_en &&
                          validation.errors.kpi_name_en
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_name_en &&
                      validation.errors.kpi_name_en ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_name_en}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('kpi_unit_measurement')}</Label>
                      <Input
                        name='kpi_unit_measurement'
                        type='text'
                        placeholder={t('kpi_unit_measurement')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_unit_measurement || ''}
                        invalid={
                          validation.touched.kpi_unit_measurement &&
                          validation.errors.kpi_unit_measurement
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_unit_measurement &&
                      validation.errors.kpi_unit_measurement ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_unit_measurement}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('kpi_description')}</Label>
                      <Input
                        name='kpi_description'
                        type='text'
                        placeholder={t('kpi_description')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_description || ''}
                        invalid={
                          validation.touched.kpi_description &&
                          validation.errors.kpi_description
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_description &&
                      validation.errors.kpi_description ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_description}
                        </FormFeedback>
                      ) : null}
                    </Col> 
<Col className='col-md-6 mb-3'>
                      <Label>{t('kpi_status')}</Label>
                      <Input
                        name='kpi_status'
                        type='text'
                        placeholder={t('kpi_status')}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.kpi_status || ''}
                        invalid={
                          validation.touched.kpi_status &&
                          validation.errors.kpi_status
                            ? true
                            : false
                        }
                        maxLength={20}
                      />
                      {validation.touched.kpi_status &&
                      validation.errors.kpi_status ? (
                        <FormFeedback type='invalid'>
                          {validation.errors.kpi_status}
                        </FormFeedback>
                      ) : null}
                    </Col> 
                
      </Row>
      <Row>
      <Col>
      <div className="text-end">
      {addProjectKpi.isPending || updateProjectKpi.isPending ? (
        <Button
        color="success"
        type="submit"
        className="save-user"
        disabled={
          addProjectKpi.isPending ||
          updateProjectKpi.isPending ||
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
          addProjectKpi.isPending ||
          updateProjectKpi.isPending ||
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
ProjectKpiModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProjectKpiModel;