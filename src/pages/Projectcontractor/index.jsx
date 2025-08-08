import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import TableContainer from "../../components/Common/TableContainer";
import * as Yup from "yup";
import classnames from "classnames";
import { useFormik } from "formik";
import {
	Spinner,
	Button,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
} from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import DeleteModal from "../../components/Common/DeleteModal";
import {
	useFetchProjectContractors,
	useAddProjectContractor,
	useUpdateProjectContractor,
	useDeleteProjectContractor,
} from "../../queries/projectcontractor_query";
import { useFetchContractorTypes } from "../../queries/contractortype_query";
import { useTranslation } from "react-i18next";
import {
	Col,
	Row,
	UncontrolledTooltip,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
} from "reactstrap";
import { toast } from "react-toastify";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { convertToNumericValue } from "../../utils/commonMethods";
import DynamicDetailsModal from "../../components/Common/DynamicDetailsModal";
import DatePicker from "../../components/Common/DatePicker";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import { projectContractorExportColumns } from "../../utils/exportColumnsForDetails";
import InputField from "../../components/Common/InputField";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import AttachFileModal from "../../components/Common/AttachFileModal";
import { PAGE_ID } from "../../constants/constantFile";

const truncateText = (text, maxLength) =>
	typeof text === "string" && text.length > maxLength
		? `${text.substring(0, maxLength)}…`
		: text || "-";

const hasErrorsInTab = (tab, errors) => {
	const fields = {
		general: [
			"cni_name",
			"cni_tin_num",
			"cni_contractor_type_id",
			"cni_vat_num",
			"cni_total_contract_price",
			"cni_contact_person",
			"cni_phone_number",
			"cni_address",
			"cni_email",
			"cni_website",
		],
		procurement: [
			"cni_procrument_method",
			"cni_financial_start",
			"cni_physical_start",
			"cni_financial_end",
			"cni_physical_end",
		],
		dates: [
			"cni_contract_start_date_gc",
			"cni_contract_end_date_gc",
			"cni_bid_invitation_date",
			"cni_bid_opening_date",
			"cni_bid_evaluation_date",
			"cni_bid_award_date",
			"cni_bid_contract_signing_date",
		],
	};

	return fields[tab].some((field) => errors[field]);
};

const ProjectContractorModel = ({ passedId, isActive, startDate }) => {
	const { t, i18n } = useTranslation();
	const [modalOpen, setModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectContractor, setProjectContractor] = useState(null);
	const [activeTab, setActiveTab] = useState("general");
	const [transaction, setTransaction] = useState({});
	const [fileModalOpen, setFileModalOpen] = useState(false);
	const toggleFileModal = () => setFileModalOpen(!fileModalOpen);

	const param = { cni_project_id: passedId, request_type: "single" };
	const { data, isLoading, isFetching, error, refetch } =
		useFetchProjectContractors(param, isActive);
	const addMutation = useAddProjectContractor();
	const updateMutation = useUpdateProjectContractor();
	const deleteMutation = useDeleteProjectContractor();

	const {
		data: contractorTypeData,
		isLoading: cntTypeLoading,
		isError: cntTypeError,
	} = useFetchContractorTypes();
	const contractorTypeMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			contractorTypeData?.data || [],
			"cnt_id",
			{
				en: "cnt_type_name_en",
				am: "cnt_type_name_am",
				or: "cnt_type_name_or",
			},
			i18n.language
		);
	}, [contractorTypeData, i18n.language]);

	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			cni_name: projectContractor?.cni_name || "",
			cni_tin_num: projectContractor?.cni_tin_num || "",
			cni_contractor_type_id: projectContractor?.cni_contractor_type_id || "",
			cni_vat_num: projectContractor?.cni_vat_num || "",
			cni_total_contract_price:
				projectContractor?.cni_total_contract_price || "",
			cni_contract_start_date_gc:
				projectContractor?.cni_contract_start_date_gc || "",
			cni_contract_end_date_gc:
				projectContractor?.cni_contract_end_date_gc || "",
			cni_contact_person: projectContractor?.cni_contact_person || "",
			cni_phone_number: projectContractor?.cni_phone_number || "",
			cni_address: projectContractor?.cni_address || "",
			cni_email: projectContractor?.cni_email || "",
			cni_website: projectContractor?.cni_website || "",
			cni_procrument_method: projectContractor?.cni_procrument_method || "",
			cni_bid_invitation_date: projectContractor?.cni_bid_invitation_date || "",
			cni_bid_opening_date: projectContractor?.cni_bid_opening_date || "",
			cni_bid_evaluation_date: projectContractor?.cni_bid_evaluation_date || "",
			cni_bid_award_date: projectContractor?.cni_bid_award_date || "",
			cni_bid_contract_signing_date:
				projectContractor?.cni_bid_contract_signing_date || "",
			cni_description: projectContractor?.cni_description || "",
			cni_status: projectContractor?.cni_status || "",
			cni_financial_start: projectContractor?.cni_financial_start || "0",
			cni_physical_start: projectContractor?.cni_physical_start || "0",
			cni_financial_end: projectContractor?.cni_financial_end || "0",
			cni_physical_end: projectContractor?.cni_physical_end || "0",
			cni_project_id: passedId,
			is_deletable: projectContractor?.is_deletable ?? 1,
			is_editable: projectContractor?.is_editable ?? 1,
		},
		validationSchema: Yup.object({
			cni_name: Yup.string().required(t("cni_name")),
			cni_tin_num: Yup.string().required(t("cni_tin_num")),
			cni_vat_num: Yup.string().required(t("cni_vat_num")),
			cni_total_contract_price: Yup.string().required(
				t("cni_total_contract_price")
			),
			cni_contractor_type_id: Yup.string().required(
				t("cni_contractor_type_id")
			),
			cni_contract_start_date_gc: Yup.string().required(
				t("cni_contract_start_date_gc")
			),
			cni_contract_end_date_gc: Yup.string().required(
				t("cni_contract_end_date_gc")
			),
			cni_contact_person: Yup.string().required(t("cni_contact_person")),
			cni_phone_number: Yup.string().required(t("cni_phone_number")),
			cni_procrument_method: Yup.string().required(t("cni_procrument_method")),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: async (values) => {
			const payload = {
				...values,
				cni_id: isEdit ? projectContractor.cni_id : undefined,
				cni_financial_start: convertToNumericValue(values.cni_financial_start),
				cni_physical_start: convertToNumericValue(values.cni_physical_start),
				cni_financial_end: convertToNumericValue(values.cni_financial_end),
				cni_physical_end: convertToNumericValue(values.cni_physical_end),
			};
			try {
				if (isEdit) {
					await updateMutation.mutateAsync(payload);
					toast.success("Data updated successfully", { autoClose: 2000 });
				} else {
					await addMutation.mutateAsync(payload);
					toast.success("Data added successfully", { autoClose: 2000 });
				}
				validation.resetForm();
				setModalOpen(false);
			} catch {
				toast.error(isEdit ? "Failed to update data" : "Failed to add data", {
					autoClose: 2000,
				});
			}
		},
	});

	const openModal = (row, edit) => {
		setIsEdit(edit);
		setProjectContractor(row || null);
		setModalOpen(true);
		setActiveTab("general"); // reset to first tab
	};
	const openDeleteModal = (row) => {
		setProjectContractor(row);
		setDeleteModalOpen(true);
	};
	const handleDelete = async () => {
		if (!projectContractor?.cni_id) return;
		try {
			await deleteMutation.mutateAsync(projectContractor.cni_id);
			toast.success("Data deleted successfully", { autoClose: 2000 });
		} catch {
			toast.error("Failed to delete data", { autoClose: 2000 });
		}
		setDeleteModalOpen(false);
	};

	const columns = useMemo(() => {
		const base = [
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: true,
				accessorKey: "cni_name",
				cell: ({ row }) => truncateText(row.original.cni_name, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_tin_num",
				cell: ({ row }) => truncateText(row.original.cni_tin_num, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_total_contract_price",
				cell: ({ row }) =>
					truncateText(row.original.cni_total_contract_price, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_contract_start_date_gc",
				cell: ({ row }) =>
					truncateText(row.original.cni_contract_start_date_gc, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_contract_end_date_gc",
				cell: ({ row }) =>
					truncateText(row.original.cni_contract_end_date_gc, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_contact_person",
				cell: ({ row }) => truncateText(row.original.cni_contact_person, 30),
			},
			{
				header: "",
				enableColumnFilter: false,
				enableColumnSorting: false,
				accessorKey: "cni_phone_number",
				cell: ({ row }) => truncateText(row.original.cni_phone_number, 30),
			},
			{
				header: t("view_detail"),
				cell: ({ row }) => (
					<Button
						color="primary"
						size="sm"
						onClick={() => {
							setTransaction(row.original);
							setDetailModalOpen(true);
						}}
					>
						{t("view_detail")}
					</Button>
				),
			},
			{
				header: t("attach_files"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => {
					return (
						<Button
							outline
							type="button"
							color="success"
							className="btn-sm"
							onClick={() => {
								toggleFileModal();
								setTransaction(cellProps.row.original);
							}}
						>
							{t("attach_files")}
						</Button>
					);
				},
			},
		];
		if (
			data?.previledge?.is_role_editable === 1 ||
			data?.previledge?.is_role_deletable === 1
		) {
			base.push({
				header: t("Action"),
				cell: ({ row }) => (
					<div className="d-flex gap-1">
						{data?.previledge?.is_role_editable === 1 &&
							row.original.is_editable === 1 && (
								<Button
									color="link"
									className="text-success"
									onClick={() => openModal(row.original, true)}
								>
									<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
									<UncontrolledTooltip target="edittooltip">
										Edit
									</UncontrolledTooltip>
								</Button>
							)}
						{data?.previledge?.is_role_deletable === 1 &&
							row.original.is_deletable === 1 && (
								<Button
									color="link"
									disabled={deleteMutation.isPending}
									className="text-danger"
									onClick={() => openDeleteModal(row.original)}
								>
									<i
										className="mdi mdi-delete font-size-18"
										id="deletetooltip"
									/>
									<UncontrolledTooltip target="deletetooltip">
										Delete
									</UncontrolledTooltip>
								</Button>
							)}
					</div>
				),
			});
		}
		return base;
	}, [data, openModal, openDeleteModal]);

	if (error) return <FetchErrorHandler error={error} refetch={refetch} />;

	return (
		<>
			<DynamicDetailsModal
				isOpen={detailModalOpen}
				toggle={() => setDetailModalOpen(false)}
				data={transaction}
				title={t("project_contractor")}
				description={transaction.cni_description}
				fields={[
					{ label: t("cni_name"), key: "cni_name" },
					{ label: t("cni_tin_num"), key: "cni_tin_num" },
					{ label: t("cni_vat_num"), key: "cni_vat_num" },
					{
						label: t("cni_total_contract_price"),
						key: "cni_total_contract_price",
					},
					{
						label: t("cni_contract_start_date_gc"),
						key: "cni_contract_start_date_gc",
					},
					{
						label: t("cni_contract_end_date_gc"),
						key: "cni_contract_end_date_gc",
					},
					{ label: t("cni_contact_person"), key: "cni_contact_person" },
					{ label: t("cni_phone_number"), key: "cni_phone_number" },
					{ label: t("cni_address"), key: "cni_address" },
					{ label: t("cni_email"), key: "cni_email" },
					{ label: t("cni_website"), key: "cni_website" },
					{ label: t("cni_procrument_method"), key: "cni_procrument_method" },
					{
						label: t("cni_bid_invitation_date"),
						key: "cni_bid_invitation_date",
					},
					{ label: t("cni_bid_opening_date"), key: "cni_bid_opening_date" },
					{
						label: t("cni_bid_evaluation_date"),
						key: "cni_bid_evaluation_date",
					},
					{ label: t("cni_bid_award_date"), key: "cni_bid_award_date" },
					{
						label: t("cni_bid_contract_signing_date"),
						key: "cni_bid_contract_signing_date",
					},
					{ label: t("cni_financial_start"), key: "cni_financial_start" },
					{ label: t("cni_physical_start"), key: "cni_physical_start" },
					{ label: t("cni_financial_end"), key: "cni_financial_end" },
					{ label: t("cni_physical_end"), key: "cni_physical_end" },
				]}
				footerText={t("close")}
			/>

			<DeleteModal
				show={deleteModalOpen}
				onDeleteClick={handleDelete}
				onCloseClick={() => setDeleteModalOpen(false)}
				isLoading={deleteMutation.isPending}
			/>

			<AttachFileModal
				isOpen={fileModalOpen}
				toggle={toggleFileModal}
				ownerTypeId={PAGE_ID.PROJ_CONTRACTOR}
				ownerId={transaction?.cni_id}
			/>

			<div className={passedId ? "" : "page-content"}>
				<div className="">
					{isLoading ? (
						<Spinners top={isActive ? "top-70" : ""} />
					) : (
						<TableContainer
							columns={columns}
							data={data?.data || []}
							isGlobalFilter
							isAddButton={data?.previledge?.is_role_can_add === 1}
							isCustomPageSize
							handleUserClick={() => openModal(null, false)}
							isPagination
							SearchPlaceholder={t("filter_placeholder")}
							buttonClass="btn btn-success waves-effect waves-light mb-2 me-2"
							buttonName={`${t("add")} ${t("project_contractor")}`}
							tableClass="align-middle table-nowrap dt-responsive nowrap w-100"
							theadClass="table-light"
							pagination="pagination"
							paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
							refetch={refetch}
							isFetching={isFetching}
							exportColumns={projectContractorExportColumns}
						/>
					)}

					<Modal
						isOpen={modalOpen}
						toggle={() => setModalOpen(false)}
						size="xl"
					>
						<ModalHeader toggle={() => setModalOpen(false)} tag="h5">
							{isEdit
								? `${t("edit")} ${t("project_contractor")}`
								: `${t("add")} ${t("project_contractor")}`}
						</ModalHeader>

						<ModalBody>
							<Form onSubmit={validation.handleSubmit}>
								<Nav
									tabs
									className="nav-tabs-custom justify-content-center gap-2"
								>
									{["general", "procurement", "dates"].map((tab) => (
										<NavItem key={tab}>
											<NavLink
												className={classnames(
													activeTab === tab
														? "active fw-bold"
														: hasErrorsInTab(tab, validation.errors)
														? "text-danger"
														: ""
												)}
												onClick={() => setActiveTab(tab)}
												style={{ cursor: "pointer" }}
											>
												{t(tab)}
											</NavLink>
										</NavItem>
									))}
								</Nav>

								<TabContent activeTab={activeTab} className="pt-3">
									{/* TAB 1 : GENERAL */}
									<TabPane tabId="general">
										<Row>
											<InputField
												fieldId="cni_name"
												className="col-md-4 mb-3"
												label={t("cni_name")}
												isRequired
												validation={validation}
												maxLength={100}
											/>
											<InputField
												fieldId="cni_tin_num"
												className="col-md-4 mb-3"
												label={t("cni_tin_num")}
												isRequired
												validation={validation}
												maxLength={20}
											/>
											<AsyncSelectField
												fieldId="cni_contractor_type_id"
												validation={validation}
												isRequired
												className="col-md-4 mb-3"
												optionMap={contractorTypeMap}
												isLoading={cntTypeLoading}
												isError={cntTypeError}
											/>
											<InputField
												fieldId="cni_vat_num"
												className="col-md-4 mb-3"
												label={t("cni_vat_num")}
												isRequired
												validation={validation}
												maxLength={20}
											/>
											<FormattedAmountField
												fieldId="cni_total_contract_price"
												className="col-md-4 mb-3"
												label={t("cni_total_contract_price")}
												isRequired
												validation={validation}
											/>
											<InputField
												fieldId="cni_contact_person"
												className="col-md-4 mb-3"
												label={t("cni_contact_person")}
												isRequired
												validation={validation}
												maxLength={20}
											/>
											<InputField
												fieldId="cni_phone_number"
												className="col-md-4 mb-3"
												label={t("cni_phone_number")}
												isRequired
												validation={validation}
												maxLength={20}
											/>
											<InputField
												fieldId="cni_address"
												className="col-md-4 mb-3"
												label={t("cni_address")}
												validation={validation}
												maxLength={425}
											/>
											<InputField
												fieldId="cni_email"
												className="col-md-4 mb-3"
												label={t("cni_email")}
												type="email"
												validation={validation}
												maxLength={50}
											/>
											<InputField
												fieldId="cni_website"
												className="col-md-4 mb-3"
												label={t("cni_website")}
												validation={validation}
												maxLength={50}
											/>
										</Row>
									</TabPane>

									{/* TAB 2 : PROCUREMENT */}
									<TabPane tabId="procurement">
										<Row>
											<InputField
												fieldId="cni_procrument_method"
												className="col-md-4 mb-3"
												label={t("cni_procrument_method")}
												isRequired
												validation={validation}
												maxLength={20}
											/>
											<FormattedAmountField
												validation={validation}
												fieldId="cni_financial_start"
												max={100}
												className="col-md-4 mb-3"
											/>
											<FormattedAmountField
												validation={validation}
												fieldId="cni_physical_start"
												max={100}
												className="col-md-4 mb-3"
											/>
											<FormattedAmountField
												validation={validation}
												fieldId="cni_financial_end"
												max={100}
												className="col-md-4 mb-3"
											/>
											<FormattedAmountField
												validation={validation}
												fieldId="cni_physical_end"
												max={100}
												className="col-md-4 mb-3"
											/>
										</Row>
									</TabPane>

									{/* TAB 3 : DATES */}
									<TabPane tabId="dates">
										<Row>
											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_contract_start_date_gc"
													validation={validation}
													isRequired
													minDate={startDate}
												/>
											</Col>
											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_contract_end_date_gc"
													validation={validation}
													isRequired
													minDate={startDate}
												/>
											</Col>

											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_bid_invitation_date"
													validation={validation}
													minDate={startDate}
												/>
											</Col>

											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_bid_opening_date"
													validation={validation}
													minDate={startDate}
												/>
											</Col>

											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_bid_evaluation_date"
													validation={validation}
													minDate={startDate}
												/>
											</Col>

											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_bid_award_date"
													validation={validation}
													minDate={startDate}
												/>
											</Col>

											<Col className="col-md-4 mb-3">
												<DatePicker
													componentId="cni_bid_contract_signing_date"
													validation={validation}
													minDate={startDate}
												/>
											</Col>
										</Row>
									</TabPane>
								</TabContent>
								<Row>
									<Col xs={12}>
										<InputField
											fieldId="cni_description"
											className="col-md-12 mb-3"
											label={t("cni_description")}
											type="textarea"
											validation={validation}
											maxLength={425}
										/>
									</Col>
								</Row>

								<Row>
									<Col className="text-end mt-3">
										<Button
											color="success"
											type="submit"
											disabled={
												!validation.dirty ||
												addMutation.isPending ||
												updateMutation.isPending
											}
										>
											{addMutation.isPending || updateMutation.isPending ? (
												<>
													<Spinner size="sm" className="me-2" />
													{t("Saving")}
												</>
											) : (
												t("Save")
											)}
										</Button>
									</Col>
								</Row>
							</Form>
						</ModalBody>
					</Modal>
				</div>
			</div>
		</>
	);
};

ProjectContractorModel.propTypes = {
	passedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	isActive: PropTypes.bool,
	startDate: PropTypes.string,
};

export default ProjectContractorModel;
