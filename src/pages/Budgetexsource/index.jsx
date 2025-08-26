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
  useFetchBudgetExSources,
  useSearchBudgetExSources,
  useAddBudgetExSource,
  useDeleteBudgetExSource,
  useUpdateBudgetExSource,
} from "../../queries/budgetexsource_query";
import BudgetExSourceModal from "./BudgetExSourceModal";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
  alphanumericValidation,
  amountValidation,
  numberValidation,
} from "../../utils/Validation/validation";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const BudgetExSourceModel = ({ passedId, isActive }) => {
  const param = { budget_request_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetExSource, setBudgetExSource] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } = useFetchBudgetExSources(
    param,
    isActive,
  );
  const addBudgetExSource = useAddBudgetExSource();
  const updateBudgetExSource = useUpdateBudgetExSource();
  const deleteBudgetExSource = useDeleteBudgetExSource();
  //START CRUD
  const handleAddBudgetExSource = async (data) => {
		try {
			await addBudgetExSource.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};
	const handleUpdateBudgetExSource = async (data) => {
		try {
			await updateBudgetExSource.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};
  const handleDeleteBudgetExSource = async () => {
    if (budgetExSource && budgetExSource.bes_id) {
      try {
        const id = budgetExSource.bes_id;
        await deleteBudgetExSource.mutateAsync(id);
        toast.success(t("delete_success"), {
					autoClose: 3000,
				});
      } catch (error) {
        toast.success(t("delete_failure"), {
					autoClose: 3000,
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
      bes_budget_request_id:
        (budgetExSource && budgetExSource.bes_budget_request_id) || "",
      bes_organ_code: (budgetExSource && budgetExSource.bes_organ_code) || "",
      bes_org_name: (budgetExSource && budgetExSource.bes_org_name) || "",
      bes_support_amount:
        (budgetExSource && budgetExSource.bes_support_amount) || "",
      bes_credit_amount:
        (budgetExSource && budgetExSource.bes_credit_amount) || "",
      bes_description: (budgetExSource && budgetExSource.bes_description) || "",
      bes_status: (budgetExSource && budgetExSource.bes_status) || "",

      is_deletable: (budgetExSource && budgetExSource.is_deletable) || 1,
      is_editable: (budgetExSource && budgetExSource.is_editable) || 1,
    },
    validationSchema: Yup.object({
      //bes_budget_request_id: Yup.string().required(t('bes_budget_request_id')),
      bes_organ_code: alphanumericValidation(2, 10, true),
      bes_org_name: alphanumericValidation(2, 30, true),
      bes_support_amount: amountValidation(0, 100000000000, false),
      bes_credit_amount: amountValidation(0, 100000000000, false),
      bes_description: alphanumericValidation(3, 425, false),
      //bes_status: Yup.string().required(t('bes_status')),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetExSource = {
          bes_id: budgetExSource.bes_id,
          bes_organ_code: values.bes_organ_code,
          bes_org_name: values.bes_org_name,
          bes_support_amount: values.bes_support_amount,
          bes_credit_amount: values.bes_credit_amount,
          bes_description: values.bes_description,
          bes_status: values.bes_status,

          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        // update BudgetExSource
        handleUpdateBudgetExSource(updateBudgetExSource);
      } else {
        const newBudgetExSource = {
          bes_budget_request_id: passedId,
          bes_organ_code: values.bes_organ_code,
          bes_org_name: values.bes_org_name,
          bes_support_amount: values.bes_support_amount,
          bes_credit_amount: values.bes_credit_amount,
          bes_description: values.bes_description,
          bes_status: values.bes_status,
        };
        // save new BudgetExSource
        handleAddBudgetExSource(newBudgetExSource);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  // Fetch BudgetExSource on component mount
  useEffect(() => {
    setBudgetExSource(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetExSource(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetExSource(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetExSourceClick = (arg) => {
    const budgetExSource = arg;
    // console.log("handleBudgetExSourceClick", budgetExSource);
    setBudgetExSource({
      bes_id: budgetExSource.bes_id,
      bes_budget_request_id: budgetExSource.bes_budget_request_id,
      bes_organ_code: budgetExSource.bes_organ_code,
      bes_org_name: budgetExSource.bes_org_name,
      bes_support_amount: budgetExSource.bes_support_amount,
      bes_credit_amount: budgetExSource.bes_credit_amount,
      bes_description: budgetExSource.bes_description,
      bes_status: budgetExSource.bes_status,

      is_deletable: budgetExSource.is_deletable,
      is_editable: budgetExSource.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  //delete projects
  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetExSource) => {
    setBudgetExSource(budgetExSource);
    setDeleteModal(true);
  };

  const handleBudgetExSourceClicks = () => {
    setIsEdit(false);
    setBudgetExSource("");
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
        accessorKey: "bes_organ_code",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_organ_code, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_org_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_org_name, 30) || "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_support_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_support_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_credit_amount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_credit_amount, 30) ||
                "-"}
            </span>
          );
        },
      },
      {
        header: "",
        accessorKey: "bes_description",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {truncateText(cellProps.row.original.bes_description, 30) || "-"}
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
				enableSorting: false,
				cell: (cellProps) => {
					return (
						<div className="d-flex gap-3">
							{cellProps.row.original.is_editable == 1 && (
								<Link
									to="#"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleBudgetExSourceClick(data);
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
  }, [handleBudgetExSourceClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <BudgetExSourceModal
        isOpen={modal1}
        toggle={toggleViewModal}
        transaction={transaction}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBudgetExSource}
        onCloseClick={() => setDeleteModal(false)}
        isLoading={deleteBudgetExSource.isPending}
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
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  isGlobalFilter={true}
                  isAddButton={data?.previledge?.is_role_can_add == 1}
                  isCustomPageSize={true}
                  handleUserClick={handleBudgetExSourceClicks}
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
            ? t("edit") + " " + t("budget_ex_source")
            : t("add") + " " + t("budget_ex_source")}
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
                <Label>{t("bes_organ_code")}</Label>
                <Input
                  name="bes_organ_code"
                  type="text"
                  placeholder={t("bes_organ_code")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bes_organ_code || ""}
                  invalid={
                    validation.touched.bes_organ_code &&
                    validation.errors.bes_organ_code
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bes_organ_code &&
                validation.errors.bes_organ_code ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bes_organ_code}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bes_org_name")}</Label>
                <Input
                  name="bes_org_name"
                  type="text"
                  placeholder={t("bes_org_name")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bes_org_name || ""}
                  invalid={
                    validation.touched.bes_org_name &&
                    validation.errors.bes_org_name
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bes_org_name &&
                validation.errors.bes_org_name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bes_org_name}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bes_support_amount")}</Label>
                <Input
                  name="bes_support_amount"
                  type="number"
                  placeholder={t("bes_support_amount")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bes_support_amount || ""}
                  invalid={
                    validation.touched.bes_support_amount &&
                    validation.errors.bes_support_amount
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bes_support_amount &&
                validation.errors.bes_support_amount ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bes_support_amount}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bes_credit_amount")}</Label>
                <Input
                  name="bes_credit_amount"
                  type="number"
                  placeholder={t("bes_credit_amount")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bes_credit_amount || ""}
                  invalid={
                    validation.touched.bes_credit_amount &&
                    validation.errors.bes_credit_amount
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bes_credit_amount &&
                validation.errors.bes_credit_amount ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bes_credit_amount}
                  </FormFeedback>
                ) : null}
              </Col>
              <Col className="col-md-6 mb-3">
                <Label>{t("bes_description")}</Label>
                <Input
                  name="bes_description"
                  type="textarea"
                  placeholder={t("bes_description")}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.bes_description || ""}
                  invalid={
                    validation.touched.bes_description &&
                    validation.errors.bes_description
                      ? true
                      : false
                  }
                  maxLength={20}
                />
                {validation.touched.bes_description &&
                validation.errors.bes_description ? (
                  <FormFeedback type="invalid">
                    {validation.errors.bes_description}
                  </FormFeedback>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {addBudgetExSource.isPending ||
                  updateBudgetExSource.isPending ? (
                    <Button
                      color="success"
                      type="submit"
                      className="save-user"
                      disabled={
                        addBudgetExSource.isPending ||
                        updateBudgetExSource.isPending ||
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
                        addBudgetExSource.isPending ||
                        updateBudgetExSource.isPending ||
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
    </React.Fragment>
  );
};
BudgetExSourceModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default BudgetExSourceModel;
