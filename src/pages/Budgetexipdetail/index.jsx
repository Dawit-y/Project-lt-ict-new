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
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchBudgetExipDetails,
  useSearchBudgetExipDetails,
  useAddBudgetExipDetail,
  useDeleteBudgetExipDetail,
  useUpdateBudgetExipDetail,
} from "../../queries/budgetexipdetail_query";
import { useFetchExpenditureCodes } from "../../queries/expenditurecode_query";
import { createSelectOptions } from "../../utils/commonMethods";
import BudgetExipDetailModal from "./BudgetExipDetailModal";
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
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const BudgetExipDetailModel = ({ passedId, isActive }) => {
  const param = { budget_expend_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetExipDetail, setBudgetExipDetail] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchBudgetExipDetails(param, isActive);
  const addBudgetExipDetail = useAddBudgetExipDetail();
  const updateBudgetExipDetail = useUpdateBudgetExipDetail();
  const deleteBudgetExipDetail = useDeleteBudgetExipDetail();
  const { data: expenditureCodeData } = useFetchExpenditureCodes();
  const expenditureCodeOptions = createSelectOptions(
    expenditureCodeData?.data || [],
    "pec_id",
    "pec_name"
  );
  const expenditureCodeMap = useMemo(() => {
    return (
      expenditureCodeData?.data?.reduce((acc, expend) => {
        acc[expend.pec_id] = expend.pec_name;
        return acc;
      }, {}) || {}
    );
  }, [expenditureCodeData]);
  //START CRUD
  const handleAddBudgetExipDetail = async (data) => {
    try {
      await addBudgetExipDetail.mutateAsync(data);
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
  const handleUpdateBudgetExipDetail = async (data) => {
    try {
      await updateBudgetExipDetail.mutateAsync(data);
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
  const handleDeleteBudgetExipDetail = async () => {
    if (budgetExipDetail && budgetExipDetail.bed_id) {
      try {
        const id = budgetExipDetail.bed_id;
        await deleteBudgetExipDetail.mutateAsync(id);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      bed_budget_expenditure_id:
        (budgetExipDetail && budgetExipDetail.bed_budget_expenditure_id) || "",
      bed_budget_expenditure_code_id:
        (budgetExipDetail && budgetExipDetail.bed_budget_expenditure_code_id) ||
        "",
      bed_amount: (budgetExipDetail && budgetExipDetail.bed_amount) || "",
      bed_description:
        (budgetExipDetail && budgetExipDetail.bed_description) || "",
      bed_status: (budgetExipDetail && budgetExipDetail.bed_status) || "",

      is_deletable: (budgetExipDetail && budgetExipDetail.is_deletable) || 1,
      is_editable: (budgetExipDetail && budgetExipDetail.is_editable) || 1,
    },
    validationSchema: Yup.object({
      bed_budget_expenditure_code_id: numberValidation(1, 500, true).test(
        "unique-role-id",
        t("Already exists"),
        (value) => {
          return !data?.data.some(
            (item) =>
              item.bed_budget_expenditure_code_id == value &&
              item.bed_id !== budgetExipDetail?.bed_id
          );
        }
      ),
      bed_amount: amountValidation(1000, 1000000000, true),
      bed_description: alphanumericValidation(3, 425, false),
      //bed_status: Yup.string().required(t('bed_status')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetExipDetail = {
          bed_id: budgetExipDetail.bed_id,
          bed_budget_expenditure_code_id: values.bed_budget_expenditure_code_id,
          bed_amount: values.bed_amount,
          bed_description: values.bed_description,
          bed_status: values.bed_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetExipDetail
        handleUpdateBudgetExipDetail(updateBudgetExipDetail);
      } else {
        const newBudgetExipDetail = {
          bed_budget_expenditure_id: passedId,
          bed_budget_expenditure_code_id: values.bed_budget_expenditure_code_id,
          bed_amount: values.bed_amount,
          bed_description: values.bed_description,
          bed_status: values.bed_status,
        };
        // save new BudgetExipDetail
        handleAddBudgetExipDetail(newBudgetExipDetail);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetExipDetail on component mount
  useEffect(() => {
    setBudgetExipDetail(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetExipDetail(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetExipDetail(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetExipDetailClick = (arg) => {
    const budgetExipDetail = arg;
    setBudgetExipDetail({
      bed_id: budgetExipDetail.bed_id,
      bed_budget_expenditure_id: budgetExipDetail.bed_budget_expenditure_id,
      bed_budget_expenditure_code_id:
        budgetExipDetail.bed_budget_expenditure_code_id,
      bed_amount: budgetExipDetail.bed_amount,
      bed_description: budgetExipDetail.bed_description,
      bed_status: budgetExipDetail.bed_status,

      is_deletable: budgetExipDetail.is_deletable,
      is_editable: budgetExipDetail.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetExipDetail) => {
    setBudgetExipDetail(budgetExipDetail);
    setDeleteModal(true);
  };

  const handleBudgetExipDetailClicks = () => {
    setIsEdit(false);
    setBudgetExipDetail("");
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
        accessorKey: "bed_budget_expenditure_code_id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {
                expenditureCodeMap[
                  cellProps.row.original.bed_budget_expenditure_code_id
                ]
              }
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bed_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bed_amount, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bed_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bed_description, 30) || "-"}
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
                    handleBudgetExipDetailClick(data);
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
  }, [handleBudgetExipDetailClick, toggleViewModal, onClickDelete]);

  if (isError) {
    <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <BudgetExipDetailModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetExipDetail}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetExipDetail.isPending}
      />
      <div className="">
        <div className="container-fluid1">
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
                      handleUserClick={handleBudgetExipDetailClicks}
                      isPagination={true}
                      // SearchPlaceholder="26 records..."
                      SearchPlaceholder={t("filter_placeholder")}
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
              {!!isEdit
                ? t("edit") + " " + t("budget_exip_detail")
                : t("add") + " " + t("budget_exip_detail")}
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
                      {t("bed_budget_expenditure_code_id")}{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="bed_budget_expenditure_code_id"
                      id="bed_budget_expenditure_code_id"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.bed_budget_expenditure_code_id || ""
                      }
                      invalid={
                        validation.touched.bed_budget_expenditure_code_id &&
                        validation.errors.bed_budget_expenditure_code_id
                          ? true
                          : false
                      }
                    >
                      <option value={null}>{t("select_one")}</option>
                      {expenditureCodeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`${option.label}`)}
                        </option>
                      ))}
                    </Input>
                    {validation.touched.bed_budget_expenditure_code_id &&
                    validation.errors.bed_budget_expenditure_code_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bed_budget_expenditure_code_id}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col className="col-md-6 mb-3">
                    <Label>{t("bed_amount")}</Label>
                    <Input
                      name="bed_amount"
                      type="text"
                      placeholder={t("bed_amount")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bed_amount || ""}
                      invalid={
                        validation.touched.bed_amount &&
                        validation.errors.bed_amount
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bed_amount &&
                    validation.errors.bed_amount ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bed_amount}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("bed_description")}</Label>
                    <Input
                      name="bed_description"
                      type="textarea"
                      placeholder={t("bed_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.bed_description || ""}
                      invalid={
                        validation.touched.bed_description &&
                        validation.errors.bed_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.bed_description &&
                    validation.errors.bed_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.bed_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addBudgetExipDetail.isPending ||
                      updateBudgetExipDetail.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addBudgetExipDetail.isPending ||
                            updateBudgetExipDetail.isPending ||
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
                            addBudgetExipDetail.isPending ||
                            updateBudgetExipDetail.isPending ||
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
BudgetExipDetailModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetExipDetailModel;
