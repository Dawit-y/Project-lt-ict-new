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
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";

import {
  useFetchContractTerminationReasons,
  useSearchContractTerminationReasons,
  useAddContractTerminationReason,
  useDeleteContractTerminationReason,
  useUpdateContractTerminationReason,
} from "../../queries/contractterminationreason_query";
import ContractTerminationReasonModal from "./ContractTerminationReasonModal";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ContractTerminationReasonModel = () => {
  //meta title
  document.title = " ContractTerminationReason";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [contractTerminationReason, setContractTerminationReason] =
    useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchContractTerminationReasons();

  const addContractTerminationReason = useAddContractTerminationReason();
  const updateContractTerminationReason = useUpdateContractTerminationReason();
  const deleteContractTerminationReason = useDeleteContractTerminationReason();
  //START CRUD
  const handleAddContractTerminationReason = async (data) => {
    try {
      await addContractTerminationReason.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };

  const handleUpdateContractTerminationReason = async (data) => {
    try {
      await updateContractTerminationReason.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.error(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteContractTerminationReason = async () => {
    if (contractTerminationReason && contractTerminationReason.ctr_id) {
      try {
        const id = contractTerminationReason.ctr_id;
        await deleteContractTerminationReason.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error(t("delete_failure"), {
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
      ctr_reason_name_or:
        (contractTerminationReason &&
          contractTerminationReason.ctr_reason_name_or) ||
        "",
      ctr_reason_name_am:
        (contractTerminationReason &&
          contractTerminationReason.ctr_reason_name_am) ||
        "",
      ctr_reason_name_en:
        (contractTerminationReason &&
          contractTerminationReason.ctr_reason_name_en) ||
        "",
      ctr_description:
        (contractTerminationReason &&
          contractTerminationReason.ctr_description) ||
        "",
      ctr_status:
        (contractTerminationReason && contractTerminationReason.ctr_status) ||
        "",

      is_deletable:
        (contractTerminationReason && contractTerminationReason.is_deletable) ||
        1,
      is_editable:
        (contractTerminationReason && contractTerminationReason.is_editable) ||
        1,
    },
    validationSchema: Yup.object({
      ctr_reason_name_or: alphanumericValidation(2, 100, true).test(
        "unique-ctr_reason_name_or",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.ctr_reason_name_or == value &&
              item.ctr_id !== contractTerminationReason?.ctr_id
          );
        }
      ),
      ctr_reason_name_am: Yup.string().required(t("ctr_reason_name_am")),
      ctr_reason_name_en: alphanumericValidation(2, 100, true),
      ctr_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateContractTerminationReason = {
          ctr_id: contractTerminationReason?.ctr_id,
          ctr_reason_name_or: values.ctr_reason_name_or,
          ctr_reason_name_am: values.ctr_reason_name_am,
          ctr_reason_name_en: values.ctr_reason_name_en,
          ctr_description: values.ctr_description,
          ctr_status: values.ctr_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ContractTerminationReason
        handleUpdateContractTerminationReason(updateContractTerminationReason);
      } else {
        const newContractTerminationReason = {
          ctr_reason_name_or: values.ctr_reason_name_or,
          ctr_reason_name_am: values.ctr_reason_name_am,
          ctr_reason_name_en: values.ctr_reason_name_en,
          ctr_description: values.ctr_description,
          ctr_status: values.ctr_status,
        };
        // save new ContractTerminationReason
        handleAddContractTerminationReason(newContractTerminationReason);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch ContractTerminationReason on component mount
  useEffect(() => {
    setContractTerminationReason(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setContractTerminationReason(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setContractTerminationReason(null);
    } else {
      setModal(true);
    }
  };

  const handleContractTerminationReasonClick = (arg) => {
    const contractTerminationReason = arg;
    // console.log("handleContractTerminationReasonClick", contractTerminationReason);
    setContractTerminationReason({
      ctr_id: contractTerminationReason.ctr_id,
      ctr_reason_name_or: contractTerminationReason.ctr_reason_name_or,
      ctr_reason_name_am: contractTerminationReason.ctr_reason_name_am,
      ctr_reason_name_en: contractTerminationReason.ctr_reason_name_en,
      ctr_description: contractTerminationReason.ctr_description,
      ctr_status: contractTerminationReason.ctr_status,

      is_deletable: contractTerminationReason.is_deletable,
      is_editable: contractTerminationReason.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (contractTerminationReason) => {
    setContractTerminationReason(contractTerminationReason);
    setDeleteModal(true);
  };

  const handleContractTerminationReasonClicks = () => {
    setIsEdit(false);
    setContractTerminationReason("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };
  //START UNCHANGED
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "",
        accessorKey: "ctr_reason_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ctr_reason_name_or, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "ctr_reason_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ctr_reason_name_am, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "ctr_reason_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ctr_reason_name_en, 30) ||
                "-"}
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
              {cellProps.row.original.is_editable == 1 && (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleContractTerminationReasonClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}

              {cellProps.row.original.is_deletable == 9 && (
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
  }, [handleContractTerminationReasonClick, toggleViewModal, onClickDelete]);
  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <ContractTerminationReasonModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteContractTerminationReason}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteContractTerminationReason.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("contract_termination_reason")}
            breadcrumbItem={t("contract_termination_reason")}
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
                      isAddButton={data?.previledge?.is_role_can_add == 1}
                      isCustomPageSize={true}
                      handleUserClick={handleContractTerminationReasonClicks}
                      isPagination={true}
                      SearchPlaceholder={t("filter_placeholder")}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={
                        t("add") + " " + t("contract_termination_reason")
                      }
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      divClassName="-"
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
              {!!isEdit
                ? t("edit") + " " + t("contract_termination_reason")
                : t("add") + " " + t("contract_termination_reason")}
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
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("ctr_reason_name_or")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="ctr_reason_name_or"
                      type="text"
                      placeholder={t("ctr_reason_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_or || ""}
                      invalid={
                        validation.touched.ctr_reason_name_or &&
                          validation.errors.ctr_reason_name_or
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.ctr_reason_name_or &&
                      validation.errors.ctr_reason_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_reason_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("ctr_reason_name_am")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="ctr_reason_name_am"
                      type="text"
                      placeholder={t("ctr_reason_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_am || ""}
                      invalid={
                        validation.touched.ctr_reason_name_am &&
                          validation.errors.ctr_reason_name_am
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.ctr_reason_name_am &&
                      validation.errors.ctr_reason_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_reason_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("ctr_reason_name_en")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="ctr_reason_name_en"
                      type="text"
                      placeholder={t("ctr_reason_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_en || ""}
                      invalid={
                        validation.touched.ctr_reason_name_en &&
                          validation.errors.ctr_reason_name_en
                          ? true
                          : false
                      }
                      maxLength={100}
                    />
                    {validation.touched.ctr_reason_name_en &&
                      validation.errors.ctr_reason_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_reason_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("ctr_description")}</Label>
                    <Input
                      name="ctr_description"
                      type="textarea"
                      placeholder={t("ctr_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_description || ""}
                      invalid={
                        validation.touched.ctr_description &&
                          validation.errors.ctr_description
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.ctr_description &&
                      validation.errors.ctr_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addContractTerminationReason.isPending ||
                        updateContractTerminationReason.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addContractTerminationReason.isPending ||
                            updateContractTerminationReason.isPending ||
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
                            addContractTerminationReason.isPending ||
                            updateContractTerminationReason.isPending ||
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
ContractTerminationReasonModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ContractTerminationReasonModel;
