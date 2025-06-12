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
  useFetchProcurementStages,
  useSearchProcurementStages,
  useAddProcurementStage,
  useDeleteProcurementStage,
  useUpdateProcurementStage,
} from "../../queries/procurementstage_query";
import ProcurementStageModal from "./ProcurementStageModal";
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
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
  onlyAmharicValidation,
} from "../../utils/Validation/validation";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProcurementStageModel = () => {
  //meta title
  document.title = " ProcurementStage";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [procurementStage, setProcurementStage] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useFetchProcurementStages();
  const addProcurementStage = useAddProcurementStage();
  const updateProcurementStage = useUpdateProcurementStage();
  const deleteProcurementStage = useDeleteProcurementStage();
  //START CRUD
  const handleAddProcurementStage = async (data) => {
    try {
      await addProcurementStage.mutateAsync(data);
      toast.success(t("add_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("add_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleUpdateProcurementStage = async (data) => {
    try {
      await updateProcurementStage.mutateAsync(data);
      toast.success(t("update_success"), {
        autoClose: 2000,
      });
      validation.resetForm();
    } catch (error) {
      toast.success(t("update_failure"), {
        autoClose: 2000,
      });
    }
    toggle();
  };
  const handleDeleteProcurementStage = async () => {
    if (procurementStage && procurementStage.pst_id) {
      try {
        const id = procurementStage.pst_id;
        await deleteProcurementStage.mutateAsync(id);
        toast.success(t("delete_success"), {
          autoClose: 2000,
        });
      } catch (error) {
        toast.success(t("delete_failure"), {
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
      pst_name_or: (procurementStage && procurementStage.pst_name_or) || "",
      pst_name_en: (procurementStage && procurementStage.pst_name_en) || "",
      pst_name_am: (procurementStage && procurementStage.pst_name_am) || "",
      pst_description:
        (procurementStage && procurementStage.pst_description) || "",
      pst_status: (procurementStage && procurementStage.pst_status) || false,

      is_deletable: (procurementStage && procurementStage.is_deletable) || 1,
      is_editable: (procurementStage && procurementStage.is_editable) || 1,
    },
    validationSchema: Yup.object({
      pst_name_or: alphanumericValidation(2, 100, true).test(
        "unique-pst_name_or",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.pst_name_or == value &&
              item.pst_id !== procurementStage?.pst_id
          );
        }
      ),
      pst_name_am: onlyAmharicValidation(2, 100, true),
      pst_name_en: alphanumericValidation(2, 100, true),
      pst_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateProcurementStage = {
          pst_id: procurementStage ? procurementStage.pst_id : 0,
          pst_name_or: values.pst_name_or,
          pst_name_en: values.pst_name_en,
          pst_name_am: values.pst_name_am,
          pst_description: values.pst_description,
          pst_status: values.pst_status ? 1 : 0,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update ProcurementStage
        handleUpdateProcurementStage(updateProcurementStage);
      } else {
        const newProcurementStage = {
          pst_name_or: values.pst_name_or,
          pst_name_en: values.pst_name_en,
          pst_name_am: values.pst_name_am,
          pst_description: values.pst_description,
          pst_status: values.pst_status ? 1 : 0,
        };
        // save new ProcurementStage
        handleAddProcurementStage(newProcurementStage);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  // Fetch ProcurementStage on component mount
  useEffect(() => {
    setProcurementStage(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setProcurementStage(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setProcurementStage(null);
    } else {
      setModal(true);
    }
  };
  const handleProcurementStageClick = (arg) => {
    const procurementStage = arg;
    // console.log("handleProcurementStageClick", procurementStage);
    setProcurementStage({
      pst_id: procurementStage.pst_id,
      pst_name_or: procurementStage.pst_name_or,
      pst_name_en: procurementStage.pst_name_en,
      pst_name_am: procurementStage.pst_name_am,
      pst_description: procurementStage.pst_description,
      pst_status: procurementStage.pst_status === 1,

      is_deletable: procurementStage.is_deletable,
      is_editable: procurementStage.is_editable,
    });
    setIsEdit(true);
    toggle();
  };
  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (procurementStage) => {
    setProcurementStage(procurementStage);
    setDeleteModal(true);
  };
  const handleProcurementStageClicks = () => {
    setIsEdit(false);
    setProcurementStage("");
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
        accessorKey: "pst_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pst_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pst_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pst_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pst_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pst_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pst_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pst_description, 30) || "-"}
            </span>
          );
        },
      },

      {
        header: "",
        accessorKey: "pst_status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span
              className={
                cellProps.row.original.pst_status === 1
                  ? "btn btn-sm btn-soft-danger"
                  : ""
              }
            >
              {cellProps.row.original.pst_status === 1 ? t("yes") : t("no")}
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
                  className="text-success"
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleProcurementStageClick(data);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              {cellProps.row.original.is_deletable == 1 && (
                <Link
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
  }, [handleProcurementStageClick, toggleViewModal, onClickDelete]);
  return (
    <React.Fragment>
      <ProcurementStageModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProcurementStage}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteProcurementStage.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("procurement_stage")}
            breadcrumbItem={t("procurement_stage")}
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
                      handleUserClick={handleProcurementStageClicks}
                      isPagination={true}
                      SearchPlaceholder={t("Results") + "..."}
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
              {!!isEdit
                ? t("edit") + " " + t("procurement_stage")
                : t("add") + " " + t("procurement_stage")}
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
                      {t("pst_name_or")} <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pst_name_or"
                      type="text"
                      placeholder={t("pst_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pst_name_or || ""}
                      invalid={
                        validation.touched.pst_name_or &&
                        validation.errors.pst_name_or
                          ? true
                          : false
                      }
                      maxLength={50}
                    />
                    {validation.touched.pst_name_or &&
                    validation.errors.pst_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pst_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pst_name_en")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pst_name_en"
                      type="text"
                      placeholder={t("pst_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pst_name_en || ""}
                      invalid={
                        validation.touched.pst_name_en &&
                        validation.errors.pst_name_en
                          ? true
                          : false
                      }
                      maxLength={50}
                    />
                    {validation.touched.pst_name_en &&
                    validation.errors.pst_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pst_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>
                      {t("pst_name_am")}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="pst_name_am"
                      type="text"
                      placeholder={t("pst_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pst_name_am || ""}
                      invalid={
                        validation.touched.pst_name_am &&
                        validation.errors.pst_name_am
                          ? true
                          : false
                      }
                      maxLength={50}
                    />
                    {validation.touched.pst_name_am &&
                    validation.errors.pst_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pst_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pst_description")}</Label>
                    <Input
                      name="pst_description"
                      type="textarea"
                      placeholder={t("pst_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pst_description || ""}
                      invalid={
                        validation.touched.pst_description &&
                        validation.errors.pst_description
                          ? true
                          : false
                      }
                      maxLength={425}
                    />
                    {validation.touched.pst_description &&
                    validation.errors.pst_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pst_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3 mr-2">
                    <Label className="me-1">{t("is_inactive")}</Label>

                    <Input
                      name="pst_status"
                      type="checkbox"
                      placeholder={t("pst_status")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      checked={validation.values.pst_status}
                      invalid={
                        validation.touched.pst_status &&
                        validation.errors.pst_status
                      }
                    />
                    {validation.touched.pst_status &&
                    validation.errors.pst_status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pst_status}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addProcurementStage.isPending ||
                      updateProcurementStage.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addProcurementStage.isPending ||
                            updateProcurementStage.isPending ||
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
                            addProcurementStage.isPending ||
                            updateProcurementStage.isPending ||
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
ProcurementStageModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default ProcurementStageModel;
