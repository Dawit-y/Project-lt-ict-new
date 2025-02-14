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
  useFetchPaymentCategorys,
  useSearchPaymentCategorys,
  useAddPaymentCategory,
  useDeletePaymentCategory,
  useUpdatePaymentCategory,
} from "../../queries/paymentcategory_query";
import PaymentCategoryModal from "./PaymentCategoryModal";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";
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
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const PaymentCategoryModel = () => {
  //meta title
  document.title = " PaymentCategory";
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [paymentCategory, setPaymentCategory] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchPaymentCategorys();
  const addPaymentCategory = useAddPaymentCategory();
  const updatePaymentCategory = useUpdatePaymentCategory();
  const deletePaymentCategory = useDeletePaymentCategory();
  //START CRUD
  const handleAddPaymentCategory = async (data) => {
    try {
      await addPaymentCategory.mutateAsync(data);
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
  const handleUpdatePaymentCategory = async (data) => {
    try {
      await updatePaymentCategory.mutateAsync(data);
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
  const handleDeletePaymentCategory = async () => {
    if (paymentCategory && paymentCategory.pyc_id) {
      try {
        const id = paymentCategory.pyc_id;
        await deletePaymentCategory.mutateAsync(id);
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
      pyc_name_or: (paymentCategory && paymentCategory.pyc_name_or) || "",
      pyc_name_am: (paymentCategory && paymentCategory.pyc_name_am) || "",
      pyc_name_en: (paymentCategory && paymentCategory.pyc_name_en) || "",
      pyc_description:
        (paymentCategory && paymentCategory.pyc_description) || "",
      //pyc_status: (paymentCategory && paymentCategory.pyc_status) || "",
       pyc_status:
        (paymentCategory && paymentCategory.pyc_status) || false,

      is_deletable: (paymentCategory && paymentCategory.is_deletable) || 1,
      is_editable: (paymentCategory && paymentCategory.is_editable) || 1,
    },
    validationSchema: Yup.object({
      pyc_name_or: alphanumericValidation(3, 20, true),
      pyc_name_am: Yup.string().required(t("pyc_name_am")),
      pyc_name_en: alphanumericValidation(3, 20, true),
      pyc_description: alphanumericValidation(3, 425, false),
      //pyc_status: Yup.string().required(t('pyc_status')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updatePaymentCategory = {
          pyc_id: paymentCategory?.pyc_id,
          pyc_name_or: values.pyc_name_or,
          pyc_name_am: values.pyc_name_am,
          pyc_name_en: values.pyc_name_en,
          pyc_description: values.pyc_description,
          pyc_status: values.pyc_status ? 1 : 0,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update PaymentCategory
        handleUpdatePaymentCategory(updatePaymentCategory);
      } else {
        const newPaymentCategory = {
          pyc_name_or: values.pyc_name_or,
          pyc_name_am: values.pyc_name_am,
          pyc_name_en: values.pyc_name_en,
          pyc_description: values.pyc_description,
          pyc_status: values.pyc_status ? 1 : 0,
        };
        // save new PaymentCategory
        handleAddPaymentCategory(newPaymentCategory);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch PaymentCategory on component mount
  useEffect(() => {
    setPaymentCategory(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setPaymentCategory(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setPaymentCategory(null);
    } else {
      setModal(true);
    }
  };

  const handlePaymentCategoryClick = (arg) => {
    const paymentCategory = arg;
    // console.log("handlePaymentCategoryClick", paymentCategory);
    setPaymentCategory({
      pyc_id: paymentCategory.pyc_id,
      pyc_name_or: paymentCategory.pyc_name_or,
      pyc_name_am: paymentCategory.pyc_name_am,
      pyc_name_en: paymentCategory.pyc_name_en,
      pyc_description: paymentCategory.pyc_description,
      pyc_status: paymentCategory.pyc_status === 1,
      is_deletable: paymentCategory.is_deletable,
      is_editable: paymentCategory.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (paymentCategory) => {
    setPaymentCategory(paymentCategory);
    setDeleteModal(true);
  };

  const handlePaymentCategoryClicks = () => {
    setIsEdit(false);
    setPaymentCategory("");
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
        accessorKey: "pyc_name_or",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pyc_name_or, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pyc_name_am",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pyc_name_am, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "pyc_name_en",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.pyc_name_en, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: t('is_deleted'),        
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span className={cellProps.row.original.pyc_status === 1 ? "btn btn-sm btn-soft-danger" : ""}>
              {cellProps.row.original.pyc_status == 1
                ? t("yes")
                : t("no")
              }
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
                    handlePaymentCategoryClick(data);
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
  }, [handlePaymentCategoryClick, toggleViewModal, onClickDelete]);

  return (
    <React.Fragment>
      <PaymentCategoryModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePaymentCategory}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deletePaymentCategory.isPending}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={t("payment_category")}
            breadcrumbItem={t("payment_category")}
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
                      handleUserClick={handlePaymentCategoryClicks}
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
                ? t("edit") + " " + t("payment_category")
                : t("add") + " " + t("payment_category")}
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
                    <Label>{t("pyc_name_or")}</Label>
                    <Input
                      name="pyc_name_or"
                      type="text"
                      placeholder={t("pyc_name_or")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pyc_name_or || ""}
                      invalid={
                        validation.touched.pyc_name_or &&
                        validation.errors.pyc_name_or
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pyc_name_or &&
                    validation.errors.pyc_name_or ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pyc_name_or}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pyc_name_am")}</Label>
                    <Input
                      name="pyc_name_am"
                      type="text"
                      placeholder={t("pyc_name_am")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pyc_name_am || ""}
                      invalid={
                        validation.touched.pyc_name_am &&
                        validation.errors.pyc_name_am
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pyc_name_am &&
                    validation.errors.pyc_name_am ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pyc_name_am}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pyc_name_en")}</Label>
                    <Input
                      name="pyc_name_en"
                      type="text"
                      placeholder={t("pyc_name_en")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pyc_name_en || ""}
                      invalid={
                        validation.touched.pyc_name_en &&
                        validation.errors.pyc_name_en
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pyc_name_en &&
                    validation.errors.pyc_name_en ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pyc_name_en}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col className="col-md-6 col-xl-4 mb-3">
                  <div className="form-check mb-4">
                      <Label className="me-1" for="pyc_status">
                        {t("is_deleted")}
                      </Label>
                      <Input
                        id="pyc_status"
                        name="pyc_status"
                        type="checkbox"
                        placeholder={t("is_deleted")}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        checked={validation.values.pyc_status}
                        invalid={
                          validation.touched.pyc_status &&
                          validation.errors.pyc_status
                            ? true
                            : false
                        }
                      />
                      {validation.touched.pyc_status &&
                      validation.errors.pyc_status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.pyc_status}
                        </FormFeedback>
                      ) : null}
                      </div>
                    </Col>
                  <Col className="col-md-6 mb-3">
                    <Label>{t("pyc_description")}</Label>
                    <Input
                      name="pyc_description"
                      type="textarea"
                      placeholder={t("pyc_description")}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.pyc_description || ""}
                      invalid={
                        validation.touched.pyc_description &&
                        validation.errors.pyc_description
                          ? true
                          : false
                      }
                      maxLength={20}
                    />
                    {validation.touched.pyc_description &&
                    validation.errors.pyc_description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pyc_description}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      {addPaymentCategory.isPending ||
                      updatePaymentCategory.isPending ? (
                        <Button
                          color="success"
                          type="submit"
                          className="save-user"
                          disabled={
                            addPaymentCategory.isPending ||
                            updatePaymentCategory.isPending ||
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
                            addPaymentCategory.isPending ||
                            updatePaymentCategory.isPending ||
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
PaymentCategoryModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default PaymentCategoryModel;
