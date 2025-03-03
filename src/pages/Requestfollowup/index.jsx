import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
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
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useFetchDepartments } from "../../queries/department_query";
import { post } from "../../helpers/api_Lists";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import DatePicker from "../../components/Common/DatePicker"

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const fetchDepartmentsByParent = async (parentId) => {
  const response = await post(`department/departmentbyparent?parent_id=${parentId}`);
  return response?.data || [];
};

const RequestFollowupModel = ({ request }) => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [requestFollowup, setRequestFollowup] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data: departmentOptionsData } = useFetchDepartments();

  const departmentMap = useMemo(() => {
    return (
      departmentOptionsData?.data?.reduce((acc, department) => {
        acc[department.dep_id] = department.dep_name_en;
        return acc;
      }, {}) || {}
    );
  }, [departmentOptionsData]);

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const user = storedUser?.user;
  const depId = user?.usr_officer_id > 0
    ? user.usr_officer_id
    : user?.usr_team_id > 0
      ? user.usr_team_id
      : user?.usr_directorate_id > 0
        ? user.usr_directorate_id
        : null;

  const { data: subDepartments = [], isLoading: loadingSub } = useQuery({
    queryKey: ["subDepartments", depId],
    queryFn: () => fetchDepartmentsByParent(depId),
    enabled: !!depId,
  });

  const departmentsMap = useMemo(() => {
    return (
      subDepartments?.reduce((acc, dept) => {
        acc[dept.id] = dept.name;
        return acc;
      }, {}) || {}
    );
  }, [subDepartments]);

  const param = { rqf_request_id: request.bdr_id }; // add depId as a param
  const { data, isLoading, error, isError, refetch } = useSearchRequestFollowups(param);
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
      toast.error(t('add_failure'), {
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
      toast.error(t('update_failure'), {
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
        toast.error(t('delete_failure'), {
          autoClose: 2000,
        });
      }
      setDeleteModal(false);
    }
  };

  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      rqf_request_id: (requestFollowup && requestFollowup.rqf_request_id) || "",
      rqf_forwarding_dep_id: (requestFollowup && requestFollowup.rqf_forwarding_dep_id) || "",
      rqf_forwarded_to_dep_id: (requestFollowup && requestFollowup.rqf_forwarded_to_dep_id) || "",
      rqf_forwarding_date: (requestFollowup && requestFollowup.rqf_forwarding_date) || "",
      rqf_received_date: (requestFollowup && requestFollowup.rqf_received_date) || "",
      rqf_description: (requestFollowup && requestFollowup.rqf_description) || "",
      rqf_status: (requestFollowup && requestFollowup.rqf_status) || "",
      is_deletable: (requestFollowup && requestFollowup.is_deletable) || 1,
      is_editable: (requestFollowup && requestFollowup.is_editable) || 1
    },
    validationSchema: Yup.object({
      //rqf_request_id: Yup.string().required(t('rqf_request_id')),
      //rqf_forwarding_dep_id: Yup.string().required(t('rqf_forwarding_dep_id')),
      rqf_forwarded_to_dep_id: Yup.string().required(t('rqf_forwarded_to_dep_id')),
      rqf_forwarding_date: Yup.string().required(t('rqf_forwarding_date')),
      ///rqf_received_date: Yup.string().required(t('rqf_received_date')),
      rqf_description: Yup.string()
      //rqf_status: Yup.string().required(t('rqf_status')),

    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateRequestFollowup = {
          rqf_id: requestFollowup?.rqf_id,
          rqf_request_id: request?.bdr_id,
          rqf_forwarding_dep_id: depId,
          rqf_forwarded_to_dep_id: Number(values.rqf_forwarded_to_dep_id),
          rqf_forwarding_date: values.rqf_forwarding_date,
          rqf_received_date: values.rqf_received_date,
          rqf_description: values.rqf_description,
          rqf_status: values.rqf_status,
        };
        // update RequestFollowup
        handleUpdateRequestFollowup(updateRequestFollowup);
      } else {
        const newRequestFollowup = {
          rqf_request_id: request?.bdr_id,
          rqf_forwarding_dep_id: depId,
          rqf_forwarded_to_dep_id: Number(values.rqf_forwarded_to_dep_id),
          rqf_forwarding_date: values.rqf_forwarding_date,
          rqf_received_date: values.rqf_received_date,
          rqf_description: values.rqf_description,
          rqf_status: values.rqf_status,

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
    setRequestFollowup({
      rqf_id: requestFollowup.rqf_id,
      rqf_request_id: requestFollowup.rqf_request_id,
      rqf_forwarding_dep_id: requestFollowup.rqf_forwarding_dep_id,
      rqf_forwarded_to_dep_id: requestFollowup.rqf_forwarded_to_dep_id,
      rqf_forwarding_date: requestFollowup.rqf_forwarding_date,
      rqf_received_date: requestFollowup.rqf_received_date,
      rqf_description: requestFollowup.rqf_description,
      rqf_status: requestFollowup.rqf_status,

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
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: '',
        accessorKey: 'rqf_forwarding_dep_id',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {departmentMap[cellProps.row.original.rqf_forwarding_dep_id] || ""}
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
              {departmentMap[cellProps.row.original.rqf_forwarded_to_dep_id] || ""}
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
      // {
      //   header: '',
      //   accessorKey: 'rqf_received_date',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.rqf_received_date, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'rqf_description',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.rqf_description, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   header: '',
      //   accessorKey: 'rqf_status',
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: (cellProps) => {
      //     return (
      //       <span>
      //         {truncateText(cellProps.row.original.rqf_status, 30) ||
      //           '-'}
      //       </span>
      //     );
      //   },
      //},

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
      data?.previledge?.is_role_editable == 1 ||
      data?.previledge?.is_role_deletable == 1
    ) {
      baseColumns.push({
        header: t("Action"),
        accessorKey: t("Action"),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.rqf_forwarding_dep_id == depId && (
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
              {cellProps.row.original.rqf_forwarding_dep_id == depId && (
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
      <div className="">
        <div className="">
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
                      isAddButton={data?.previledge?.is_role_can_add == 1 && !request.forwarded}
                      isCustomPageSize={true}
                      handleUserClick={handleRequestFollowupClicks}
                      isPagination={true}
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
              {!!isEdit ? (t("edit") + " " + t("request_followup")) : (t("add") + " " + t("request_followup"))}
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
                    <Label>{t('rqf_forwarded_to_dep_id')}</Label>
                    <Input
                      name='rqf_forwarded_to_dep_id'
                      type='select'
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
                    >

                      <option value="">{t('select_one')}</option>
                      {subDepartments?.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.rqf_forwarded_to_dep_id &&
                      validation.errors.rqf_forwarded_to_dep_id ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.rqf_forwarded_to_dep_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className='col-md-6 mb-3'>
                    <DatePicker
                      validation={validation}
                      componentId={"rqf_forwarding_date"}
                      isRequired={true}
                    />
                  </Col>

                  {/* <Col className='col-md-6 mb-3'>
                    <DatePicker
                      validation={validation}
                      componentId={"rqf_received_date"}
                      isRequired={true}
                    />
                  </Col> */}
                  <Col className='col-md-12 mb-3'>
                    <Label>{t('rqf_description')}</Label>
                    <Input
                      name='rqf_description'
                      type='textarea'
                      rows={4}
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
                    />
                    {validation.touched.rqf_description &&
                      validation.errors.rqf_description ? (
                      <FormFeedback type='invalid'>
                        {validation.errors.rqf_description}
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
    </React.Fragment>
  );
};
RequestFollowupModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default RequestFollowupModel;