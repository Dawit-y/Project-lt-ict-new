import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CardTitle, Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
  useFetchBudgetRequestTasks,
  useSearchBudgetRequestTasks,
  useAddBudgetRequestTask,
  useDeleteBudgetRequestTask,
  useUpdateBudgetRequestTask,
} from "../../queries/budgetrequesttask_query";
import BudgetRequestTaskModal from "./BudgetRequestTaskModal";
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
import "react-toastify/dist/ReactToastify.css";
import {
  alphanumericValidation,
  amountValidation,
  formattedAmountValidation
} from "../../utils/Validation/validation";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import InputField from "../../components/Common/InputField"
import FormattedAmountField from "../../components/Common/FormattedAmountField"

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const BudgetRequestTaskModel = ({ passedId, isActive }) => {
  const param = { budget_request_id: passedId };
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [budgetRequestTask, setBudgetRequestTask] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const { data, isLoading, error, isError, refetch } =
    useFetchBudgetRequestTasks(param, isActive);
  const addBudgetRequestTask = useAddBudgetRequestTask();
  const updateBudgetRequestTask = useUpdateBudgetRequestTask();
  const deleteBudgetRequestTask = useDeleteBudgetRequestTask();
  //START CRUD
  const handleAddBudgetRequestTask = async (data) => {
    try {
      await addBudgetRequestTask.mutateAsync(data);
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
  const handleUpdateBudgetRequestTask = async (data) => {
    try {
      await updateBudgetRequestTask.mutateAsync(data);
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
  const handleDeleteBudgetRequestTask = async () => {
    if (budgetRequestTask && budgetRequestTask.brt_id) {
      try {
        const id = budgetRequestTask.brt_id;
        await deleteBudgetRequestTask.mutateAsync(id);
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
      brt_task_name:
        (budgetRequestTask && budgetRequestTask.brt_task_name) || "",
      brt_measurement:
        (budgetRequestTask && budgetRequestTask.brt_measurement) || "",
      brt_budget_request_id:
        (budgetRequestTask && budgetRequestTask.brt_budget_request_id) || "",
      brt_previous_year_physical:
        (budgetRequestTask && budgetRequestTask.brt_previous_year_physical) ||
        "",
      brt_previous_year_financial:
        (budgetRequestTask && budgetRequestTask.brt_previous_year_financial) ||
        "",
      brt_current_year_physical:
        (budgetRequestTask && budgetRequestTask.brt_current_year_physical) ||
        "",
      brt_current_year_financial:
        (budgetRequestTask && budgetRequestTask.brt_current_year_financial) ||
        "",
      brt_next_year_physical:
        (budgetRequestTask && budgetRequestTask.brt_next_year_physical) || "",
      brt_next_year_financial:
        (budgetRequestTask && budgetRequestTask.brt_next_year_financial) || "",
      brt_description:
        (budgetRequestTask && budgetRequestTask.brt_description) || "",
      brt_status: (budgetRequestTask && budgetRequestTask.brt_status) || "",

      is_deletable: (budgetRequestTask && budgetRequestTask.is_deletable) || 1,
      is_editable: (budgetRequestTask && budgetRequestTask.is_editable) || 1,
    },
    validationSchema: Yup.object({
      brt_task_name: alphanumericValidation(2, 200, true),
      brt_measurement: alphanumericValidation(2, 20, true),
      brt_previous_year_physical: formattedAmountValidation(0, 100, true),
      brt_previous_year_financial: formattedAmountValidation(0, 100000000000, true),
      brt_current_year_physical: formattedAmountValidation(0, 100, true),
      brt_current_year_financial: formattedAmountValidation(0, 100000000000, true),
      brt_next_year_physical: formattedAmountValidation(0, 100, true),
      brt_next_year_financial: formattedAmountValidation(0, 100000000000, true),
      brt_description: alphanumericValidation(3, 425, false),
    }),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      if (isEdit) {
        const updateBudgetRequestTask = {
          brt_id: budgetRequestTask.brt_id,
          brt_task_name: values.brt_task_name,
          brt_measurement: values.brt_measurement,
          brt_previous_year_physical: values.brt_previous_year_physical,
          brt_previous_year_financial: values.brt_previous_year_financial,
          brt_current_year_physical: values.brt_current_year_physical,
          brt_current_year_financial: values.brt_current_year_financial,
          brt_next_year_physical: values.brt_next_year_physical,
          brt_next_year_financial: values.brt_next_year_financial,
          brt_description: values.brt_description,
          brt_status: values.brt_status,
          is_deletable: values.is_deletable,
          is_editable: values.is_editable,
        };
        handleUpdateBudgetRequestTask(updateBudgetRequestTask);
      } else {
        const newBudgetRequestTask = {
          brt_task_name: values.brt_task_name,
          brt_measurement: values.brt_measurement,
          brt_budget_request_id: passedId,
          brt_previous_year_physical: values.brt_previous_year_physical,
          brt_previous_year_financial: values.brt_previous_year_financial,
          brt_current_year_physical: values.brt_current_year_physical,
          brt_current_year_financial: values.brt_current_year_financial,
          brt_next_year_physical: values.brt_next_year_physical,
          brt_next_year_financial: values.brt_next_year_financial,
          brt_description: values.brt_description,
          brt_status: values.brt_status,
          is_deletable: 1,
          is_editable: 1,
        };
        handleAddBudgetRequestTask(newBudgetRequestTask);
      }
    },
  });
  const [transaction, setTransaction] = useState({});
  const toggleViewModal = () => setModal1(!modal1);

  useEffect(() => {
    setBudgetRequestTask(data);
  }, [data]);
  useEffect(() => {
    if (!isEmpty(data) && !!isEdit) {
      setBudgetRequestTask(data);
      setIsEdit(false);
    }
  }, [data]);
  const toggle = () => {
    if (modal) {
      setModal(false);
      setBudgetRequestTask(null);
    } else {
      setModal(true);
    }
  };

  const handleBudgetRequestTaskClick = (arg) => {
    const budgetRequestTask = arg;
    setBudgetRequestTask({
      brt_id: budgetRequestTask.brt_id,
      brt_task_name: budgetRequestTask.brt_task_name,
      brt_measurement: budgetRequestTask.brt_measurement,
      brt_budget_request_id: budgetRequestTask.brt_budget_request_id,
      brt_previous_year_physical: budgetRequestTask.brt_previous_year_physical,
      brt_previous_year_financial: budgetRequestTask.brt_previous_year_financial,
      brt_current_year_physical: budgetRequestTask.brt_current_year_physical,
      brt_current_year_financial: budgetRequestTask.brt_current_year_financial,
      brt_next_year_physical: budgetRequestTask.brt_next_year_physical,
      brt_next_year_financial: budgetRequestTask.brt_next_year_financial,
      brt_description: budgetRequestTask.brt_description,
      brt_status: budgetRequestTask.brt_status,
      is_deletable: budgetRequestTask.is_deletable,
      is_editable: budgetRequestTask.is_editable,
    });
    setIsEdit(true);
    toggle();
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const onClickDelete = (budgetRequestTask) => {
    setBudgetRequestTask(budgetRequestTask);
    setDeleteModal(true);
  };

  const handleBudgetRequestTaskClicks = () => {
    setIsEdit(false);
    setBudgetRequestTask("");
    toggle();
  };
  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const columns = useMemo(() => {
    const baseColumns = [
			{
				header: "",
				accessorKey: "brt_task_name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.brt_task_name, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "brt_measurement",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.brt_measurement, 30) || "-"}
						</span>
					);
				},
			},
			{
				header: t("performance_last_year"),
				columns: [
					{
						header: t("physical"),
						accessorKey: "brt_previous_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return <span>{`${cellProps.getValue()}%`}</span>;
						},
					},
					{
						header: t("financial"),
						accessorKey: "brt_previous_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return (
								<span>{parseFloat(cellProps.getValue()).toLocaleString()}</span>
							);
						},
					},
				],
			},
			{
				header: t("performance_this_year"),
				columns: [
					{
						header: t("physical"),
						accessorKey: "brt_current_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return <span>{`${cellProps.getValue()}%`}</span>;
						},
					},
					{
						header: t("financial"),
						accessorKey: "brt_current_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return (
								<span>{parseFloat(cellProps.getValue()).toLocaleString()}</span>
							);
						},
					},
				],
			},
			{
				header: t("plans_coming_year"),
				columns: [
					{
						header: t("physical"),
						accessorKey: "brt_next_year_physical",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return <span>{`${cellProps.getValue()}%`}</span>;
						},
					},
					{
						header: t("financial"),
						accessorKey: "brt_next_year_financial",
						enableColumnFilter: false,
						enableSorting: true,
						cell: (cellProps) => {
							return (
								<span>{parseFloat(cellProps.getValue()).toLocaleString()}</span>
							);
						},
					},
				],
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
                    handleBudgetRequestTaskClick(data);
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
  }, [handleBudgetRequestTaskClick, toggleViewModal, onClickDelete]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
		<React.Fragment>
			<BudgetRequestTaskModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteBudgetRequestTask}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteBudgetRequestTask.isPending}
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
									isLoading={isLoading || isSearchLoading}
									isGlobalFilter={true}
									isAddButton={true}
									isCustomPageSize={true}
									handleUserClick={handleBudgetRequestTaskClicks}
									isPagination={true}
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
						? t("edit") + " " + t("budget_request_task")
						: t("add") + " " + t("budget_request_task")}
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
							<InputField
								type="text"
								validation={validation}
								fieldId={"brt_task_name"}
								isRequired={false}
								className="col-md-6 mb-3"
								maxLength={200}
							/>
							<InputField
								type="text"
								validation={validation}
								fieldId={"brt_measurement"}
								isRequired={false}
								className="col-md-6 mb-3"
								maxLength={200}
							/>
							<Col sm={12} md={4} lg={4}>
								<Card body className="shadow-sm border">
									<CardTitle className="bg-light p-2 mb-2">
										Performance of Last Year
									</CardTitle>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_previous_year_physical"}
										label={
											t("brt_previous_year_physical") + " " + t("in_percent")
										}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_previous_year_financial"}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
								</Card>
							</Col>
							<Col sm={12} md={4} lg={4}>
								<Card body className="shadow-sm border">
									<CardTitle className="bg-light p-2 mb-2">
										Performance Estimates for this Year
									</CardTitle>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_current_year_physical"}
										label={
											t("brt_current_year_physical") + " " + t("in_percent")
										}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_current_year_financial"}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
								</Card>
							</Col>
							<Col sm={12} md={4} lg={4}>
								<Card body className="shadow-sm border">
									<CardTitle className="bg-light p-2 mb-2">
										Plans for the Coming Year
									</CardTitle>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_next_year_physical"}
										label={t("brt_next_year_physical") + " " + t("in_percent")}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
									<FormattedAmountField
										validation={validation}
										fieldId={"brt_next_year_financial"}
										isRequired={true}
										className="col-md-12 mb-3"
										allowDecimal={true}
									/>
								</Card>
							</Col>
							<InputField
								type="textarea"
								validation={validation}
								fieldId={"brt_description"}
								isRequired={false}
								className="col-md-12 mb-3"
								maxLength={400}
							/>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addBudgetRequestTask.isPending ||
									updateBudgetRequestTask.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addBudgetRequestTask.isPending ||
												updateBudgetRequestTask.isPending ||
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
												addBudgetRequestTask.isPending ||
												updateBudgetRequestTask.isPending ||
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
BudgetRequestTaskModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default BudgetRequestTaskModel;
