import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import { createColumnHelper } from "@tanstack/react-table";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CardTitle, Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchBudgetRequestAmounts,
	useSearchBudgetRequestAmounts,
	useAddBudgetRequestAmount,
	useDeleteBudgetRequestAmount,
	useUpdateBudgetRequestAmount,
} from "../../queries/budgetrequestamount_query";
import { useFetchExpenditureCodes } from "../../queries/expenditurecode_query";
import BudgetRequestAmountModal from "./BudgetRequestAmountModal";
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
import {
	alphanumericValidation,
	amountValidation,
	formattedAmountValidation,
} from "../../utils/Validation/validation";
import { createKeyValueMap } from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import InputField from "../../components/Common/InputField";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const BudgetRequestAmountModel = ({ passedId, isActive }) => {
	const param = { budget_request_id: passedId };
	const { t } = useTranslation();
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [budgetRequestAmount, setBudgetRequestAmount] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchBudgetRequestAmounts(param, isActive);

	const addBudgetRequestAmount = useAddBudgetRequestAmount();
	const updateBudgetRequestAmount = useUpdateBudgetRequestAmount();
	const deleteBudgetRequestAmount = useDeleteBudgetRequestAmount();

	const today = new Date();
	const formattedDate =
		today.getFullYear() +
		"/" +
		String(today.getMonth() + 1).padStart(2, "0") +
		"/" +
		String(today.getDate()).padStart(2, "0");

	const {
		data: exCodesData,
		isLoading: exCodesLoading,
		isError: exCodesError,
	} = useFetchExpenditureCodes();

	const expendCodeMap = useMemo(() => {
		return createKeyValueMap(exCodesData?.data || [], "pec_id", "pec_code");
	}, [exCodesData]);

	const handleAddBudgetRequestAmount = async (data) => {
		try {
			await addBudgetRequestAmount.mutateAsync(data);
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
	const handleUpdateBudgetRequestAmount = async (data) => {
		try {
			await updateBudgetRequestAmount.mutateAsync(data);
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
	const handleDeleteBudgetRequestAmount = async () => {
		if (budgetRequestAmount && budgetRequestAmount.bra_id) {
			try {
				const id = budgetRequestAmount.bra_id;
				await deleteBudgetRequestAmount.mutateAsync(id);
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

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			bra_expenditure_code_id:
				(budgetRequestAmount && budgetRequestAmount.bra_expenditure_code_id) ||
				"",
			bra_budget_request_id: passedId,
			bra_current_year_expense:
				(budgetRequestAmount && budgetRequestAmount.bra_current_year_expense) ||
				"",
			bra_requested_amount:
				(budgetRequestAmount && budgetRequestAmount.bra_requested_amount) || "",
			bra_source_government_requested:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_government_requested) ||
				"",
			bra_source_internal_requested:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_internal_requested) ||
				"",
			bra_source_support_requested:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_support_requested) ||
				"",
			bra_source_support_code:
				(budgetRequestAmount && budgetRequestAmount.bra_source_support_code) ||
				"",
			bra_source_credit_requested:
				(budgetRequestAmount &&
					budgetRequestAmount.bra_source_credit_requested) ||
				"",
			bra_source_credit_code:
				(budgetRequestAmount && budgetRequestAmount.bra_source_credit_code) ||
				"",
			bra_description:
				(budgetRequestAmount && budgetRequestAmount.bra_description) || "",
		},
		validationSchema: Yup.object({
			bra_expenditure_code_id: Yup.number().required(
				t("bra_expenditure_code_id")
			),
			bra_current_year_expense: formattedAmountValidation(0, 10000000000, true),
			bra_requested_amount: formattedAmountValidation(0, 10000000000, true),
			bra_source_government_requested: formattedAmountValidation(
				0,
				10000000000,
				true
			),
			bra_source_internal_requested: formattedAmountValidation(
				0,
				10000000000,
				true
			),
			bra_source_support_requested: formattedAmountValidation(
				0,
				10000000000,
				true
			),
			bra_source_support_code: alphanumericValidation(0, 10, true),
			bra_source_credit_requested: formattedAmountValidation(
				0,
				10000000000,
				true
			),
			bra_source_credit_code: alphanumericValidation(0, 10, true),
			bra_description: alphanumericValidation(0, 425, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateBudgetRequestAmount = {
					bra_id: budgetRequestAmount.bra_id,
					bra_expenditure_code_id: values.bra_expenditure_code_id,
					bra_budget_request_id: values.bra_budget_request_id,
					bra_current_year_expense: values.bra_current_year_expense,
					bra_requested_amount: values.bra_requested_amount,
					bra_source_government_requested:
						values.bra_source_government_requested,
					bra_source_internal_requested: values.bra_source_internal_requested,
					bra_source_support_requested: values.bra_source_support_requested,
					bra_source_support_code: values.bra_source_support_code,
					bra_source_credit_requested: values.bra_source_credit_requested,
					bra_source_credit_code: values.bra_source_credit_code,
					bra_source_other_approved: values.bra_source_other_approved,
					bra_approved_date: values.bra_approved_date,
					bra_description: values.bra_description,
					bra_status: values.bra_status,
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update BudgetRequestAmount
				handleUpdateBudgetRequestAmount(updateBudgetRequestAmount);
			} else {
				const newBudgetRequestAmount = {
					bra_expenditure_code_id: values.bra_expenditure_code_id,
					bra_budget_request_id: passedId,
					bra_current_year_expense: values.bra_current_year_expense,
					bra_requested_amount: values.bra_requested_amount,
					bra_approved_amount: values.bra_approved_amount,
					bra_source_government_requested:
						values.bra_source_government_requested,
					bra_source_internal_requested: values.bra_source_internal_requested,
					bra_source_support_requested: values.bra_source_support_requested,
					bra_source_support_code: values.bra_source_support_code,
					bra_source_credit_requested: values.bra_source_credit_requested,
					bra_source_credit_code: values.bra_source_credit_code,
					bra_source_other_approved: values.bra_source_other_approved,
					bra_requested_date: formattedDate,
					bra_approved_date: values.bra_approved_date,
					bra_description: values.bra_description,
					bra_status: values.bra_status,
				};
				// save new BudgetRequestAmount
				handleAddBudgetRequestAmount(newBudgetRequestAmount);
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	useEffect(() => {
		setBudgetRequestAmount(data);
	}, [data]);

	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setBudgetRequestAmount(data);
			setIsEdit(false);
		}
	}, [data]);

	const toggle = () => {
		if (modal) {
			setModal(false);
			setBudgetRequestAmount(null);
		} else {
			setModal(true);
		}
	};

	const handleBudgetRequestAmountClick = (arg) => {
		const budgetRequestAmount = arg;
		setBudgetRequestAmount({
			bra_id: budgetRequestAmount.bra_id,
			bra_expenditure_code_id: budgetRequestAmount.bra_expenditure_code_id,
			bra_budget_request_id: budgetRequestAmount.bra_budget_request_id,
			bra_current_year_expense: budgetRequestAmount.bra_current_year_expense,
			bra_requested_amount: budgetRequestAmount.bra_requested_amount,
			bra_source_government_requested:
				budgetRequestAmount.bra_source_government_requested,
			bra_source_internal_requested:
				budgetRequestAmount.bra_source_internal_requested,
			bra_source_support_requested:
				budgetRequestAmount.bra_source_support_requested,
			bra_source_support_code: budgetRequestAmount.bra_source_support_code,
			bra_source_credit_requested:
				budgetRequestAmount.bra_source_credit_requested,
			bra_source_credit_code: budgetRequestAmount.bra_source_credit_code,
			bra_source_other_requested:
				budgetRequestAmount.bra_source_other_requested,
			bra_description: budgetRequestAmount.bra_description,
		});
		setIsEdit(true);
		toggle();
	};

	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (budgetRequestAmount) => {
		setBudgetRequestAmount(budgetRequestAmount);
		setDeleteModal(true);
	};

	const handleBudgetRequestAmountClicks = () => {
		setIsEdit(false);
		setBudgetRequestAmount("");
		toggle();
	};

	const columnHelper = createColumnHelper();
	const columns = useMemo(() => {
		return [
			columnHelper.accessor("bra_expenditure_code_id", {
				id: "bra_expenditure_code_id",
				header: () => t("expenditure_code"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (info) => (
					<span>
						{expendCodeMap[info.row.original.bra_expenditure_code_id] || "-"}
					</span>
				),
			}),
			columnHelper.accessor("bra_current_year_expense", {
				id: "bra_current_year_expense",
				header: () => t("current_year_expense"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (info) => (
					<span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
				),
			}),
			columnHelper.accessor("bra_requested_amount", {
				id: "bra_requested_amount",
				header: () => t("requested_amount"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (info) => (
					<span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
				),
			}),
			columnHelper.group({
				id: "source_of_finance",
				header: () => t("source_of_finance"),
				columns: [
					columnHelper.accessor("bra_source_government_requested", {
						id: "bra_source_government_requested",
						header: () => t("government"),
						enableColumnFilter: false,
						enableSorting: true,
						cell: (info) => (
							<span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
						),
					}),
					columnHelper.accessor("bra_source_internal_requested", {
						id: "bra_source_internal_requested",
						header: () => t("internal"),
						enableColumnFilter: false,
						enableSorting: true,
						cell: (info) => (
							<span>{parseFloat(info.getValue() || 0).toLocaleString()}</span>
						),
					}),
					columnHelper.group({
						id: "external_assistance",
						header: () => t("external_assistance"),
						columns: [
							columnHelper.accessor("bra_source_support_requested", {
								id: "bra_source_support_requested",
								header: () => t("support_requested"),
								enableColumnFilter: false,
								enableSorting: true,
								cell: (info) => (
									<span>
										{parseFloat(info.getValue() || 0).toLocaleString()}
									</span>
								),
							}),
							columnHelper.accessor("bra_source_support_code", {
								id: "bra_source_support_code",
								header: () => t("support_code"),
								enableColumnFilter: false,
								enableSorting: true,
								cell: (info) => (
									<span>
										{truncateText(
											info.row.original.bra_source_support_code,
											30
										) || "-"}
									</span>
								),
							}),
						],
					}),
					columnHelper.group({
						id: "foreign_debt",
						header: () => t("foreign_debt"),
						columns: [
							columnHelper.accessor("bra_source_credit_requested", {
								id: "bra_source_credit_requested",
								header: () => t("credit_requested"),
								enableColumnFilter: false,
								enableSorting: true,
								cell: (info) => (
									<span>
										{parseFloat(info.getValue() || 0).toLocaleString()}
									</span>
								),
							}),
							columnHelper.accessor("bra_source_credit_code", {
								id: "bra_source_credit_code",
								header: () => t("credit_code"),
								enableColumnFilter: false,
								enableSorting: true,
								cell: (info) => (
									<span>
										{truncateText(
											info.row.original.bra_source_credit_code,
											30
										) || "-"}
									</span>
								),
							}),
						],
					}),
				],
			}),
			columnHelper.display({
				id: "view_detail",
				header: () => t("view_detail"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<Button
						type="button"
						color="primary"
						className="btn-sm"
						onClick={() => {
							const data = info.row.original;
							toggleViewModal(data);
							setTransaction(data);
						}}
					>
						{t("view_detail")}
					</Button>
				),
			}),
			...(data?.previledge?.is_role_editable == 1 ||
			data?.previledge?.is_role_deletable == 1
				? [
						columnHelper.display({
							id: "action",
							header: () => t("Action"),
							enableColumnFilter: false,
							enableSorting: false,
							cell: (info) => {
								const row = info.row.original;
								return (
									<div className="d-flex gap-3">
										{row.is_deletable == 1 && (
											<>
												<Link
													to="#"
													className="text-success"
													onClick={() => handleBudgetRequestAmountClick(row)}
												>
													<i
														className="mdi mdi-pencil font-size-18"
														id="edittooltip"
													/>
													<UncontrolledTooltip
														placement="top"
														target="edittooltip"
													>
														{t("Edit")}
													</UncontrolledTooltip>
												</Link>
												<Link
													to="#"
													className="text-danger"
													onClick={() => onClickDelete(row)}
												>
													<i
														className="mdi mdi-delete font-size-18"
														id="deletetooltip"
													/>
													<UncontrolledTooltip
														placement="top"
														target="deletetooltip"
													>
														{t("Delete")}
													</UncontrolledTooltip>
												</Link>
											</>
										)}
									</div>
								);
							},
						}),
				  ]
				: []),
		];
	}, [
		expendCodeMap,
		t,
		data,
		toggleViewModal,
		setTransaction,
		handleBudgetRequestAmountClick,
		onClickDelete,
	]);

	console.log("columns", columns);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}
	return (
		<React.Fragment>
			<BudgetRequestAmountModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteBudgetRequestAmount}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteBudgetRequestAmount.isPending}
			/>
			<TableContainer
				columns={columns}
				data={showSearchResult ? searchResults?.data : data?.data || []}
				isLoading={isLoading}
				isGlobalFilter={true}
				isAddButton={true}
				//isAddButton={data?.previledge?.is_role_can_add==1}
				isCustomPageSize={true}
				handleUserClick={handleBudgetRequestAmountClicks}
				isPagination={true}
				// SearchPlaceholder="26 records..."
				SearchPlaceholder={t("filter_placeholder")}
				buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
				buttonName={t("add")}
				tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
				theadClass="table-light"
				pagination="pagination"
				paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
				isFetching={isFetching}
				refetch={refetch}
			/>
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{!!isEdit
						? t("edit") + " " + t("budget_request_amount")
						: t("add") + " " + t("budget_request_amount")}
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
							<AsyncSelectField
								fieldId="bra_expenditure_code_id"
								validation={validation}
								isRequired
								className="col-md-4 mb-3"
								optionMap={expendCodeMap}
								isLoading={exCodesLoading}
								isError={exCodesError}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"bra_current_year_expense"}
								isRequired={true}
								className="col-md-4 mb-3"
								allowDecimal={true}
							/>
							<FormattedAmountField
								validation={validation}
								fieldId={"bra_requested_amount"}
								isRequired={true}
								className="col-md-4 mb-3"
								allowDecimal={true}
							/>
							<div className="my-3 p-3">
								<CardTitle className="mb-3 bg-light p-2">
									<h5 className="text-center">
										Budget requested by Financing Source
									</h5>
								</CardTitle>
								<CardBody>
									<Row className="gy-4">
										<Col md={6} lg={4}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_government_requested"}
													isRequired={true}
													className="mb-3"
													allowDecimal={true}
												/>
											</Card>
										</Col>
										<Col md={6} lg={4}>
											<Card body className="shadow-sm border">
												<FormattedAmountField
													validation={validation}
													fieldId={"bra_source_internal_requested"}
													isRequired={true}
													className="mb-3"
													allowDecimal={true}
												/>
											</Card>
										</Col>

										<Col md={6} lg={4}>
											<Card body className="shadow-sm border">
												<Row>
													<FormattedAmountField
														validation={validation}
														fieldId={"bra_source_support_requested"}
														isRequired={true}
														className="col-md-7 mb-3"
														allowDecimal={true}
													/>
													<InputField
														type="text"
														validation={validation}
														fieldId={"bra_source_support_code"}
														isRequired={true}
														className="col-md-5 mb-3"
														maxLength={20}
													/>
												</Row>
											</Card>
										</Col>

										<Col md={6} lg={4}>
											<Card body className="shadow-sm border">
												<Row>
													<FormattedAmountField
														validation={validation}
														fieldId={"bra_source_credit_requested"}
														isRequired={true}
														className="col-md-7 mb-3"
														allowDecimal={true}
													/>
													<InputField
														type="text"
														validation={validation}
														fieldId={"bra_source_credit_code"}
														isRequired={true}
														className="col-md-5 mb-3"
														maxLength={20}
													/>
												</Row>
											</Card>
										</Col>
									</Row>
								</CardBody>
							</div>
							<InputField
								type="textarea"
								validation={validation}
								fieldId={"bra_description"}
								isRequired={false}
								className="col-md-12 mb-3"
								maxLength={420}
							/>
						</Row>
						<Row>
							<Col>
								<div className="text-end">
									{addBudgetRequestAmount.isPending ||
									updateBudgetRequestAmount.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addBudgetRequestAmount.isPending ||
												updateBudgetRequestAmount.isPending ||
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
												addBudgetRequestAmount.isPending ||
												updateBudgetRequestAmount.isPending ||
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
BudgetRequestAmountModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
export default BudgetRequestAmountModel;
