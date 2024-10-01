import React, { useEffect, useMemo, useState } from "react";
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
  getContractTerminationReason as onGetContractTerminationReason,
  addContractTerminationReason as onAddContractTerminationReason,
  updateContractTerminationReason as onUpdateContractTerminationReason,
  deleteContractTerminationReason as onDeleteContractTerminationReason,
} from "../../store/contractterminationreason/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import ContractTerminationReasonModal from "./ContractTerminationReasonModal";
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
import { ToastContainer } from "react-toastify";

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
  const [searchLoading, setSearchLoading] = useState(false); // Search-specific loading state
  const [showSearchResults, setShowSearchResults] = useState(false); // To determine if search results should be displayed
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
      ctr_reason_name_or: Yup.string().required(t("ctr_reason_name_or")),
      ctr_reason_name_am: Yup.string().required(t("ctr_reason_name_am")),
      ctr_reason_name_en: Yup.string().required(t("ctr_reason_name_en")),
      ctr_description: Yup.string().required(t("ctr_description")),
      ctr_status: Yup.string().required(t("ctr_status")),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateContractTerminationReason = {
          ctr_id: contractTerminationReason
            ? contractTerminationReason.ctr_id
            : 0,
          // ctr_id:contractTerminationReason.ctr_id,
          ctr_reason_name_or: values.ctr_reason_name_or,
          ctr_reason_name_am: values.ctr_reason_name_am,
          ctr_reason_name_en: values.ctr_reason_name_en,
          ctr_description: values.ctr_description,
          ctr_status: values.ctr_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ContractTerminationReason
        dispatch(
          onUpdateContractTerminationReason(updateContractTerminationReason)
        );
        validation.resetForm();
      } else {
        const newContractTerminationReason = {
          ctr_reason_name_or: values.ctr_reason_name_or,
          ctr_reason_name_am: values.ctr_reason_name_am,
          ctr_reason_name_en: values.ctr_reason_name_en,
          ctr_description: values.ctr_description,
          ctr_status: values.ctr_status,
        };
        // save new ContractTerminationReasons
        dispatch(onAddContractTerminationReason(newContractTerminationReason));
        validation.resetForm();
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const dispatch = useDispatch();
  // Fetch ContractTerminationReason on component mount
  useEffect(() => {
    dispatch(onGetContractTerminationReason());
  }, [dispatch]);

  const contractTerminationReasonProperties = createSelector(
    (state) => state.ContractTerminationReasonR, // this is geting from  reducer
    (ContractTerminationReasonReducer) => ({
      // this is from Project.reducer
      contractTerminationReason:
        ContractTerminationReasonReducer.contractTerminationReason,
      loading: ContractTerminationReasonReducer.loading,
      update_loading: ContractTerminationReasonReducer.update_loading,
    })
  );

  const {
    contractTerminationReason: { data, previledge },
    loading,
    update_loading,
  } = useSelector(contractTerminationReasonProperties);

  useEffect(() => {
    console.log("update_loading in useEffect", update_loading);
    setModal(false);
  }, [update_loading]);

  const selectSearchProperties = createSelector(
    (state) => state.search,
    (search) => ({
      results: search.results,
    })
  );

  const { results } = useSelector(selectSearchProperties);

  const [isLoading, setLoading] = useState(loading);
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

  const handleDeleteContractTerminationReason = () => {
    if (contractTerminationReason && contractTerminationReason.ctr_id) {
      dispatch(
        onDeleteContractTerminationReason(contractTerminationReason.ctr_id)
      );
      setDeleteModal(false);
    }
  };
  const handleContractTerminationReasonClicks = () => {
    setIsEdit(false);
    setContractTerminationReason("");
    toggle();
  };
  const handleSearch = () => {
    setSearchLoading(true); // Set loading to true when search is initiated// Update filtered data with search results
    setShowSearchResults(true); // Show search results
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setShowSearchResults(false);
  };

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
        header: "",
        accessorKey: "ctr_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ctr_description, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "ctr_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.ctr_status, 30) || "-"}
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
    if (previledge?.is_role_editable && previledge?.is_role_deletable) {
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
                    handleContractTerminationReasonClick(data);
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
  }, [handleContractTerminationReasonClick, toggleViewModal, onClickDelete]);

  const project_status = [
    { label: "select Status name", value: "" },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];

  const dropdawntotal = [project_status];

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
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("contract_termination_reason")}
            breadcrumbItem={t("contract_termination_reason")}
          />
          {isLoading || searchLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={showSearchResults ? results : data}
                      isGlobalFilter={true}
                      isAddButton={true}
                      isCustomPageSize={true}
                      handleUserClick={handleContractTerminationReasonClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={26 + " " + t("Results") + "..."}
                      buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                      buttonName={
                        t("add") + " " + t("contract_termination_reason")
                      }
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
              {!!isEdit
                ? t("edit") + " " + t("contract_termination_reason")
                : t("add") + " " + t("contract_termination_reason")}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  const modalCallback = () => setModal(false);
                  if (isEdit) {
                    onUpdateContractTerminationReason(
                      validation.values,
                      modalCallback
                    );
                  } else {
                    onAddContractTerminationReason(
                      validation.values,
                      modalCallback
                    );
                  }
                  return false;
                }}
              >
                <Row>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("ctr_reason_name_or")}</Label>
                    <Input
                      name="ctr_reason_name_or"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_or || ""}
                      invalid={
                        validation.touched.ctr_reason_name_or &&
                        validation.errors.ctr_reason_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.ctr_reason_name_or &&
                    validation.errors.ctr_reason_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_reason_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("ctr_reason_name_am")}</Label>
                    <Input
                      name="ctr_reason_name_am"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_am || ""}
                      invalid={
                        validation.touched.ctr_reason_name_am &&
                        validation.errors.ctr_reason_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.ctr_reason_name_am &&
                    validation.errors.ctr_reason_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_reason_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("ctr_reason_name_en")}</Label>
                    <Input
                      name="ctr_reason_name_en"
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_reason_name_en || ""}
                      invalid={
                        validation.touched.ctr_reason_name_en &&
                        validation.errors.ctr_reason_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
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
                      type="text"
                      placeholder={t("insert_status_name_amharic")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_description || ""}
                      invalid={
                        validation.touched.ctr_description &&
                        validation.errors.ctr_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.ctr_description &&
                    validation.errors.ctr_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("ctr_status")}</Label>
                    <Input
                      name="ctr_status"
                      type="select"
                      className="form-select"
                      onChange={(e) => {
                        validation.setFieldValue(
                          "ctr_status",
                          Number(e.target.value)
                        );
                      }}
                      onBlur={validation.handleBlur}
                      value={validation.values.ctr_status}
                    >
                      <option value={""}>Select status</option>
                      <option value={1}>{t("Active")}</option>
                      <option value={0}>{t("Inactive")}</option>
                    </Input>
                    {validation.touched.ctr_status &&
                    validation.errors.ctr_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ctr_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {update_loading ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
                        >
                          <Spinner size={"sm"} color="#fff" />
                          {t("Save")}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={update_loading || !validation.dirty}
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
ContractTerminationReasonModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default ContractTerminationReasonModel;
