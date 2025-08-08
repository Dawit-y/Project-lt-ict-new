import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEmpty, update } from "lodash";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProcurementInformations,
	useSearchProcurementInformations,
	useAddProcurementInformation,
	useDeleteProcurementInformation,
	useUpdateProcurementInformation,
} from "../../queries/procurementinformation_query";
import DynamicDetailsModal from "../../components/Common/DynamicDetailsModal";
import { useFetchProcurementStages } from "../../queries/procurementstage_query";
import { useFetchProcurementMethods } from "../../queries/procurementmethod_query";
import DatePicker from "../../components/Common/DatePicker";
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
} from "reactstrap";
import { toast } from "react-toastify";
import ProcurementParticipant from "../Procurementparticipant/index";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
	alphanumericValidation,
	amountValidation,
	numberValidation,
} from "../../utils/Validation/validation";
import { procurementExportColumns } from "../../utils/exportColumnsForDetails";
import FormattedAmountField from "../../components/Common/FormattedAmountField";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProcurementInformationModel = (props) => {
	//meta title
	document.title = "Procurement Information";
	const { t } = useTranslation();
	const { passedId, isActive, startDate } = props;
	const param = { pri_project_id: passedId, request_type: "single" };
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [procurementInformationMetaData, setProcurementInformationMetaData] =
		useState([]);
	const [showCanvas, setShowCanvas] = useState(false);
	const [procurementInformation, setProcurementInformation] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchProcurementInformations(param, isActive);

	const { data: procurementStageData } = useFetchProcurementStages();
	const { data: procurementMethodData } = useFetchProcurementMethods();

	const procurementStageMap = useMemo(() => {
		return (
			procurementStageData?.data?.reduce((acc, procurement_stage) => {
				acc[procurement_stage.pst_id] = procurement_stage.pst_name_or;
				return acc;
			}, {}) || {}
		);
	}, [procurementStageData]);

	const procurementMethodMap = useMemo(() => {
		return (
			procurementMethodData?.data?.reduce((acc, procurement_method) => {
				acc[procurement_method.prm_id] = procurement_method.prm_name_or;
				return acc;
			}, {}) || {}
		);
	}, [procurementMethodData]);

	const addProcurementInformation = useAddProcurementInformation();
	const updateProcurementInformation = useUpdateProcurementInformation();
	const deleteProcurementInformation = useDeleteProcurementInformation();
	//START CRUD
	const handleAddProcurementInformation = async (data) => {
		try {
			await addProcurementInformation.mutateAsync(data);
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
	const handleUpdateProcurementInformation = async (data) => {
		try {
			await updateProcurementInformation.mutateAsync(data);
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
	const handleDeleteProcurementInformation = async () => {
		if (procurementInformation && procurementInformation.pri_id) {
			try {
				const id = procurementInformation.pri_id;
				await deleteProcurementInformation.mutateAsync(id);
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
			pri_total_procurement_amount:
				(procurementInformation &&
					procurementInformation.pri_total_procurement_amount) ||
				"",
			pri_bid_announced_date:
				(procurementInformation &&
					procurementInformation.pri_bid_announced_date) ||
				"",
			pri_bid_invitation_date:
				(procurementInformation &&
					procurementInformation.pri_bid_invitation_date) ||
				"",
			pri_bid_opening_date:
				(procurementInformation &&
					procurementInformation.pri_bid_opening_date) ||
				"",
			pri_bid_closing_date:
				(procurementInformation &&
					procurementInformation.pri_bid_closing_date) ||
				"",
			pri_bid_evaluation_date:
				(procurementInformation &&
					procurementInformation.pri_bid_evaluation_date) ||
				"",
			pri_bid_award_date:
				(procurementInformation && procurementInformation.pri_bid_award_date) ||
				"",
			pri_project_id:
				(procurementInformation && procurementInformation.pri_project_id) || "",
			pri_procurement_stage_id:
				(procurementInformation &&
					procurementInformation.pri_procurement_stage_id) ||
				"",
			pri_procurement_method_id:
				(procurementInformation &&
					procurementInformation.pri_procurement_method_id) ||
				"",
			pri_description:
				(procurementInformation && procurementInformation.pri_description) ||
				"",
			pri_status:
				(procurementInformation && procurementInformation.pri_status) || "",

			is_deletable:
				(procurementInformation && procurementInformation.is_deletable) || 1,
			is_editable:
				(procurementInformation && procurementInformation.is_editable) || 1,
		},
		validationSchema: Yup.object({
			pri_total_procurement_amount: amountValidation(100, 1000000000000, true),
			pri_bid_announced_date: Yup.string().required(
				t("pri_bid_announced_date")
			),
			pri_bid_invitation_date: Yup.string().required(
				t("pri_bid_invitation_date")
			),
			pri_bid_opening_date: Yup.string().required(t("pri_bid_opening_date")),
			pri_bid_closing_date: Yup.string().required(t("pri_bid_closing_date")),
			pri_bid_evaluation_date: Yup.string().required(
				t("pri_bid_evaluation_date")
			),
			pri_bid_award_date: Yup.string().required(t("pri_bid_award_date")),
			pri_procurement_stage_id: Yup.string().required(
				t("pri_procurement_stage_id")
			),
			pri_procurement_method_id: Yup.string().required(
				t("pri_procurement_method_id")
			),
			pri_description: alphanumericValidation(3, 425, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProcurementInformation = {
					pri_id: procurementInformation ? procurementInformation.pri_id : 0,
					pri_total_procurement_amount: values.pri_total_procurement_amount,
					pri_bid_announced_date: values.pri_bid_announced_date,
					pri_bid_invitation_date: values.pri_bid_invitation_date,
					pri_bid_opening_date: values.pri_bid_opening_date,
					pri_bid_closing_date: values.pri_bid_closing_date,
					pri_bid_evaluation_date: values.pri_bid_evaluation_date,
					pri_bid_award_date: values.pri_bid_award_date,
					pri_project_id: values.pri_project_id,
					pri_procurement_stage_id: values.pri_procurement_stage_id,
					pri_procurement_method_id: values.pri_procurement_method_id,
					pri_description: values.pri_description,
					pri_status: values.pri_status,

					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
				};
				// update ProcurementInformation
				handleUpdateProcurementInformation(updateProcurementInformation);
			} else {
				const newProcurementInformation = {
					pri_total_procurement_amount: values.pri_total_procurement_amount,
					pri_bid_announced_date: values.pri_bid_announced_date,
					pri_bid_invitation_date: values.pri_bid_invitation_date,
					pri_bid_opening_date: values.pri_bid_opening_date,
					pri_bid_closing_date: values.pri_bid_closing_date,
					pri_bid_evaluation_date: values.pri_bid_evaluation_date,
					pri_bid_award_date: values.pri_bid_award_date,
					pri_project_id: passedId,
					pri_procurement_stage_id: values.pri_procurement_stage_id,
					pri_procurement_method_id: values.pri_procurement_method_id,
					pri_description: values.pri_description,
					pri_status: values.pri_status,
				};
				// save new ProcurementInformation
				handleAddProcurementInformation(newProcurementInformation);
			}
		},
	});
	const [transaction, setTransaction] = useState({});
	const toggleViewModal = () => setModal1(!modal1);

	const handleClick = (data) => {
		setShowCanvas(!showCanvas);
		setProcurementInformationMetaData(data);
	};
	// Fetch ProcurementInformation on component mount
	useEffect(() => {
		setProcurementInformation(data);
	}, [data]);
	useEffect(() => {
		if (!isEmpty(data) && !!isEdit) {
			setProcurementInformation(data);
			setIsEdit(false);
		}
	}, [data]);
	const toggle = () => {
		if (modal) {
			setModal(false);
			setProcurementInformation(null);
		} else {
			setModal(true);
		}
	};
	const handleProcurementInformationClick = (arg) => {
		const procurementInformation = arg;
		// console.log("handleProcurementInformationClick", procurementInformation);
		setProcurementInformation({
			pri_id: procurementInformation.pri_id,
			pri_total_procurement_amount:
				procurementInformation.pri_total_procurement_amount,
			pri_bid_announced_date: procurementInformation.pri_bid_announced_date,
			pri_bid_invitation_date: procurementInformation.pri_bid_invitation_date,
			pri_bid_opening_date: procurementInformation.pri_bid_opening_date,
			pri_bid_closing_date: procurementInformation.pri_bid_closing_date,
			pri_bid_evaluation_date: procurementInformation.pri_bid_evaluation_date,
			pri_bid_award_date: procurementInformation.pri_bid_award_date,
			pri_project_id: procurementInformation.pri_project_id,
			pri_procurement_stage_id: procurementInformation.pri_procurement_stage_id,
			pri_procurement_method_id:
				procurementInformation.pri_procurement_method_id,
			pri_description: procurementInformation.pri_description,
			pri_status: procurementInformation.pri_status,
			is_deletable: procurementInformation.is_deletable,
			is_editable: procurementInformation.is_editable,
		});
		setIsEdit(true);
		toggle();
	};
	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (procurementInformation) => {
		setProcurementInformation(procurementInformation);
		setDeleteModal(true);
	};
	const handleProcurementInformationClicks = () => {
		setIsEdit(false);
		setProcurementInformation("");
		toggle();
	};

	//START UNCHANGED
	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: "",
				accessorKey: "pri_total_procurement_amount",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => parseFloat(getValue()).toLocaleString(undefined, {
					minimumFractionDigits: 0,
					maximumFractionDigits: 2,	
				}) || "-",
			},
			{
				header: "",
				accessorKey: "pri_bid_announced_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(
								cellProps.row.original.pri_bid_announced_date,
								30
							) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_bid_invitation_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(
								cellProps.row.original.pri_bid_invitation_date,
								30
							) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_bid_opening_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.pri_bid_opening_date, 30) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_bid_closing_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.pri_bid_closing_date, 30) ||
								"-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_bid_evaluation_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(
								cellProps.row.original.pri_bid_evaluation_date,
								30
							) || "-"}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_bid_award_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{truncateText(cellProps.row.original.pri_bid_award_date, 30) ||
								"-"}
						</span>
					);
				},
			},

			{
				header: "",
				accessorKey: "pri_procurement_stage_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{procurementStageMap[
								cellProps.row.original.pri_procurement_stage_id
							] || ""}
						</span>
					);
				},
			},
			{
				header: "",
				accessorKey: "pri_procurement_method_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<span>
							{procurementMethodMap[
								cellProps.row.original.pri_procurement_method_id
							] || ""}
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
								<Button
									size="sm"
									color="none"
									className="text-success"
									onClick={() => {
										const data = cellProps.row.original;
										handleProcurementInformationClick(data);
									}}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
								</Button>
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

							<Button
								to="#"
								color="none"
								className="text-secondary"
								onClick={() => handleClick(cellProps.row.original)}
							>
								<i className="mdi mdi-cog font-size-18" id="viewtooltip" />
								<UncontrolledTooltip placement="top" target="viewtooltip">
									Detail
								</UncontrolledTooltip>
							</Button>
						</div>
					);
				},
			});
		}
		return baseColumns;
	}, [handleProcurementInformationClick, toggleViewModal, onClickDelete]);

	if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<React.Fragment>
			<DynamicDetailsModal
				isOpen={modal1}
				toggle={toggleViewModal} // Function to close the modal
				data={transaction} // Pass transaction as data to the modal
				title={t("procurement_information")}
				description={transaction.pri_description}
				pri_total_procurement_amount={transaction.pri_total_procurement_amount}
				fields={[
					{
						label: t("pri_procurement_stage_id"),
						key: "pri_procurement_stage_id",
						value: procurementStageMap[transaction.pri_procurement_stage_id],
					},
					{
						label: t("pri_procurement_method_id"),
						key: "pri_procurement_method_id",
						value: procurementMethodMap[transaction.pri_procurement_method_id],
					},
				]}
				footerText={t("close")}
			/>

			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProcurementInformation}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProcurementInformation.isPending}
			/>
			<div className="">
				{isLoading || isSearchLoading ? (
					<Spinners />
				) : (
					<TableContainer
						columns={columns}
						data={showSearchResult ? searchResults?.data : data?.data || []}
						isGlobalFilter={true}
						isAddButton={data?.previledge?.is_role_can_add == 1}
						isCustomPageSize={true}
						handleUserClick={handleProcurementInformationClicks}
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
						exportColumns={procurementExportColumns}
					/>
				)}
				<Modal isOpen={modal} toggle={toggle} className="modal-xl">
					<ModalHeader toggle={toggle} tag="h4">
						{!!isEdit
							? t("edit") + " " + t("procurement_information")
							: t("add") + " " + t("procurement_information")}
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
								<FormattedAmountField
									fieldId="pri_total_procurement_amount"
									label={t("pri_total_procurement_amount")}
									validation={validation}
									className={"col-md-6 mb-3"}
									isRequired={true}
									allowDecimal={true}
								/>
								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_announced_date"}
										validation={validation}
										minDate={startDate}
									/>
								</Col>

								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_invitation_date"}
										validation={validation}
										minDate={validation.values.pri_bid_announced_date}
									/>
								</Col>

								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_opening_date"}
										validation={validation}
										minDate={validation.values.pri_bid_invitation_date}
									/>
								</Col>

								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_closing_date"}
										validation={validation}
										minDate={validation.values.pri_bid_opening_date}
									/>
								</Col>

								<Col className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_evaluation_date"}
										validation={validation}
										minDate={validation.values.pri_bid_closing_date}
									/>
								</Col>

								<Col md={6} className="col-md-6 mb-3">
									<DatePicker
										isRequired={true}
										componentId={"pri_bid_award_date"}
										validation={validation}
										minDate={validation.values.pri_bid_evaluation_date}
									/>
								</Col>

								<Col className="col-md-6 mb-3" style={{ display: "none" }}>
									<Label>{t("pri_project_id")}</Label>
									<Input
										name="pri_project_id"
										type="text"
										placeholder={t("pri_project_id")}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.pri_project_id || ""}
										invalid={
											validation.touched.pri_project_id &&
											validation.errors.pri_project_id
												? true
												: false
										}
										maxLength={20}
									/>
									{validation.touched.pri_project_id &&
									validation.errors.pri_project_id ? (
										<FormFeedback type="invalid">
											{validation.errors.pri_project_id}
										</FormFeedback>
									) : null}
								</Col>

								<Col className="col-md-6 mb-3">
									<Label>
										{t("pri_procurement_stage_id")}
										<span className="text-danger">*</span>
									</Label>
									<Input
										name="pri_procurement_stage_id"
										type="select"
										className="form-select"
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.pri_procurement_stage_id || ""}
										invalid={
											validation.touched.pri_procurement_stage_id &&
											validation.errors.pri_procurement_stage_id
												? true
												: false
										}
									>
										<option value="">{t("select_one")}</option>
										{procurementStageData?.data?.map((data) => (
											<option key={data.pst_id} value={data.pst_id}>
												{data.pst_name_or}
											</option>
										))}
									</Input>
									{validation.touched.pri_procurement_stage_id &&
									validation.errors.pri_procurement_stage_id ? (
										<FormFeedback type="invalid">
											{validation.errors.pri_procurement_stage_id}
										</FormFeedback>
									) : null}
								</Col>

								<Col className="col-md-6 mb-3">
									<Label>
										{t("pri_procurement_method_id")}
										<span className="text-danger">*</span>
									</Label>
									<Input
										name="pri_procurement_method_id"
										type="select"
										className="form-select"
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.pri_procurement_method_id || ""}
										invalid={
											validation.touched.pri_procurement_method_id &&
											validation.errors.pri_procurement_method_id
												? true
												: false
										}
									>
										<option value="">{t("select_one")}</option>
										{procurementMethodData?.data?.map((data) => (
											<option key={data.prm_id} value={data.prm_id}>
												{data.prm_name_or}
											</option>
										))}
									</Input>
									{validation.touched.pri_procurement_method_id &&
									validation.errors.pri_procurement_method_id ? (
										<FormFeedback type="invalid">
											{validation.errors.pri_procurement_method_id}
										</FormFeedback>
									) : null}
								</Col>

								<Col className="col-md-6 mb-3">
									<Label>{t("pri_description")}</Label>
									<Input
										name="pri_description"
										type="textarea"
										placeholder={t("pri_description")}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.pri_description || ""}
										invalid={
											validation.touched.pri_description &&
											validation.errors.pri_description
												? true
												: false
										}
										maxLength={425}
									/>
									{validation.touched.pri_description &&
									validation.errors.pri_description ? (
										<FormFeedback type="invalid">
											{validation.errors.pri_description}
										</FormFeedback>
									) : null}
								</Col>
								<Col className="col-md-6 mb-3" style={{ display: "none" }}>
									<Label>{t("pri_status")}</Label>
									<Input
										name="pri_status"
										type="text"
										placeholder={t("pri_status")}
										onChange={validation.handleChange}
										onBlur={validation.handleBlur}
										value={validation.values.pri_status || ""}
										invalid={
											validation.touched.pri_status &&
											validation.errors.pri_status
												? true
												: false
										}
										maxLength={20}
									/>
									{validation.touched.pri_status &&
									validation.errors.pri_status ? (
										<FormFeedback type="invalid">
											{validation.errors.pri_status}
										</FormFeedback>
									) : null}
								</Col>
							</Row>
							<Row>
								<Col>
									<div className="text-end">
										{addProcurementInformation.isPending ||
										updateProcurementInformation.isPending ? (
											<Button
												color="success"
												type="submit"
												className="save-user"
												disabled={
													addProcurementInformation.isPending ||
													updateProcurementInformation.isPending ||
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
													addProcurementInformation.isPending ||
													updateProcurementInformation.isPending ||
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
			{showCanvas && (
				<RightOffCanvas
					handleClick={handleClick}
					showCanvas={showCanvas}
					canvasWidth={84}
					name={""}
					id={procurementInformationMetaData.pri_id}
					components={{
						[t("procurement_participant")]: ProcurementParticipant,
					}}
				/>
			)}
		</React.Fragment>
	);
};
ProcurementInformationModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProcurementInformationModel;
