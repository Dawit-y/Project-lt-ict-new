import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import classnames from "classnames";

import {
	getProjectTypeConfig,
	PROJECT_TYPES,
} from "./ProjectMonitoringConfig.js";

import { useTranslation } from "react-i18next";
import {
	useFetchProjectMonitoringEvaluations,
	useAddProjectMonitoringEvaluation,
	useDeleteProjectMonitoringEvaluation,
	useUpdateProjectMonitoringEvaluation,
} from "../../queries/projectmonitoringevaluation_query";
import { useFetchMonitoringEvaluationTypes } from "../../queries/monitoringevaluationtype_query";

import TableContainer from "../../components/Common/TableContainer";
import DeleteModal from "../../components/Common/DeleteModal";
import ProjectMonitoringEvaluationModal from "./ProjectMonitoringEvaluationModal";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import DatePicker from "../../components/Common/DatePicker";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import Spinners from "../../components/Common/Spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AttachFileModal = lazy(
	() => import("../../components/Common/AttachFileModal")
);
const ConvInfoModal = lazy(
	() => import("../../pages/Conversationinformation/ConvInfoModal")
);

import { PAGE_ID } from "../../constants/constantFile";
import { monitoringExportColumns } from "../../utils/exportColumnsForDetails";
import {
	createMultiLangKeyValueMap,
	toEthiopian,
} from "../../utils/commonMethods";
import { formattedAmountValidation } from "../../utils/Validation/validation";

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
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
	Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

const LazyLoader = ({ children }) => (
	<Suspense fallback={<Spinner color="primary" />}>{children}</Suspense>
);

const useProjectType = () => {
	const location = useLocation();

	return useMemo(() => {
		const path = location.pathname;

		if (path.includes("/citizenship_project_detail/")) {
			return PROJECT_TYPES.CITIZEN;
		} else if (path.includes("/projectdetail_cso/")) {
			return PROJECT_TYPES.CSO;
		} else if (path.includes("/projectdetail/")) {
			return PROJECT_TYPES.GOV;
		}

		return PROJECT_TYPES.GOV;
	}, [location.pathname]);
};

const ProjectMonitoringEvaluationModel = (props) => {
	const { passedId, isActive, status, startDate } = props;
	const { t, i18n } = useTranslation();
	const location = useLocation();

	const projectType = useProjectType();

	const config = useMemo(
		() => getProjectTypeConfig(projectType),
		[projectType]
	);

	document.title = t(`${projectType}_project_monitoring`);

	// State management
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectMonitoringEvaluation, setProjectMonitoringEvaluation] =
		useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [activeTab, setActiveTab] = useState("2");
	const [transaction, setTransaction] = useState({});
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);

	// API params
	const param = useMemo(
		() => ({
			project_id: passedId,
			project_type: projectType,
			request_type: "single",
		}),
		[passedId, projectType]
	);

	// Fetch data
	const { data, isLoading, isFetching, error, isError, refetch } =
		useFetchProjectMonitoringEvaluations(param, isActive);

	const {
		data: meTypes,
		isLoading: meTypesLoading,
		isError: meTypesIsError,
	} = useFetchMonitoringEvaluationTypes();

	// Create monitoring type map
	const meTypeMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			meTypes?.data || [],
			"met_id",
			{
				en: "met_name_en",
				am: "met_name_am",
				or: "met_name_or",
			},
			i18n.language
		);
	}, [meTypes, i18n.language]);

	// Mutation hooks
	const addProjectMonitoringEvaluation = useAddProjectMonitoringEvaluation();
	const updateProjectMonitoringEvaluation =
		useUpdateProjectMonitoringEvaluation();
	const deleteProjectMonitoringEvaluation =
		useDeleteProjectMonitoringEvaluation();

	// Build dynamic validation schema
	const buildValidationSchema = () => {
		const schema = {};

		Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
			if (fieldConfig.visible) {
				let validator = Yup.string();

				// Set required if configured
				if (fieldConfig.required) {
					validator = validator.required(t(fieldConfig.label));
				}

				// Add custom validations based on field type
				switch (fieldConfig.component) {
					case "formatted-amount":
						const maxValue = fieldConfig.maxValue || 10000000000;
						const isPercentage = fieldConfig.suffix === "%";
						const minValue = isPercentage ? 0 : 1;
						validator = formattedAmountValidation(minValue, maxValue, false);
						break;

					case "textarea":
						if (fieldConfig.maxLength) {
							validator = validator.max(
								fieldConfig.maxLength,
								t("max_length_exceeded")
							);
						}
						break;

					default:
						// Default string validation
						break;
				}

				schema[fieldName] = validator;
			}
		});

		return Yup.object(schema);
	};

	// Initial values for formik
	const getInitialValues = () => {
		const initialValues = {};

		Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
			if (fieldConfig.visible) {
				initialValues[fieldName] =
					projectMonitoringEvaluation?.[fieldName] || "";
			}
		});

		// Add project ID
		initialValues.mne_project_id = passedId;
		initialValues.mne_status = 0;
		initialValues.is_deletable = projectMonitoringEvaluation?.is_deletable || 1;
		initialValues.is_editable = projectMonitoringEvaluation?.is_editable || 1;

		return initialValues;
	};

	// Formik validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: getInitialValues(),
		validationSchema: buildValidationSchema(),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			const submissionData = {
				...values,
				mne_project_id: passedId,
				mne_status: 0,
			};

			if (isEdit) {
				submissionData.mne_id = projectMonitoringEvaluation?.mne_id;
				handleUpdateProjectMonitoringEvaluation(submissionData);
			} else {
				handleAddProjectMonitoringEvaluation(submissionData);
			}
		},
	});

	// Handlers
	const handleAddProjectMonitoringEvaluation = async (data) => {
		try {
			await addProjectMonitoringEvaluation.mutateAsync(data);
			toast.success(t("add_success"), { autoClose: 3000 });
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateProjectMonitoringEvaluation = async (data) => {
		try {
			await updateProjectMonitoringEvaluation.mutateAsync(data);
			toast.success(t("update_success"), { autoClose: 3000 });
			toggle();
			validation.resetForm();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleDeleteProjectMonitoringEvaluation = async () => {
		if (projectMonitoringEvaluation?.mne_id) {
			try {
				await deleteProjectMonitoringEvaluation.mutateAsync(
					projectMonitoringEvaluation.mne_id
				);
				toast.success(t("delete_success"), { autoClose: 3000 });
			} catch (error) {
				toast.error(t("delete_failure"), { autoClose: 3000 });
			}
			setDeleteModal(false);
		}
	};

	// Modal toggles
	const toggle = () => {
		setModal(!modal);
		if (modal) {
			setProjectMonitoringEvaluation(null);
			setIsEdit(false);
		}
	};

	const toggleViewModal = () => setModal1(!modal1);
	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);

	const toggleTab = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	// Event handlers
	const handleProjectMonitoringEvaluationClick = (data) => {
		setProjectMonitoringEvaluation(data);
		setIsEdit(true);
		setModal(true);
	};

	const onClickDelete = (data) => {
		setProjectMonitoringEvaluation(data);
		setDeleteModal(true);
	};

	const handleProjectMonitoringEvaluationClicks = () => {
		setIsEdit(false);
		setProjectMonitoringEvaluation(null);
		setModal(true);
	};

	// Render form field based on configuration
	const renderFormField = (fieldName) => {
		const fieldConfig = config.fields[fieldName];
		if (!fieldConfig || !fieldConfig.visible) return null;

		const commonProps = {
			name: fieldName,
			onChange: validation.handleChange,
			onBlur: validation.handleBlur,
			value: validation.values[fieldName] || "",
			invalid:
				validation.touched[fieldName] && validation.errors[fieldName]
					? true
					: false,
			disabled:
				addProjectMonitoringEvaluation.isPending ||
				updateProjectMonitoringEvaluation.isPending,
		};

		switch (fieldConfig.component) {
			case "select":
				return (
					<div
						key={fieldName}
						className={`col-md-${fieldConfig.colSize || 4} mb-3`}
					>
						<Label>
							{t(fieldConfig.label)}
							{fieldConfig.required && (
								<span className="text-danger ms-1">*</span>
							)}
						</Label>
						<Input {...commonProps} type="select">
							<option value="">
								{`${t("Select")} ${t(fieldConfig.label)}`}
							</option>
							{fieldConfig.options?.map((option) => (
								<option key={option.value} value={option.value}>
									{t(option.label)}
								</option>
							))}
						</Input>
						{validation.touched[fieldName] && validation.errors[fieldName] && (
							<FormFeedback type="invalid">
								{validation.errors[fieldName]}
							</FormFeedback>
						)}
					</div>
				);

			case "async-select":
				return (
					<AsyncSelectField
						key={fieldName}
						fieldId={fieldName}
						validation={validation}
						isRequired={fieldConfig.required}
						className={`col-md-${fieldConfig.colSize || 4} mb-3`}
						optionMap={meTypeMap}
						isLoading={meTypesLoading}
						isError={meTypesIsError}
						label={t(fieldConfig.label)}
					/>
				);

			case "formatted-amount":
				return (
					<div
						key={fieldName}
						className={`col-md-${fieldConfig.colSize || 6} mb-3`}
					>
						<FormattedAmountField
							validation={validation}
							fieldId={fieldName}
							isRequired={fieldConfig.required}
							label={t(fieldConfig.label)}
							suffix={fieldConfig.suffix}
						/>
					</div>
				);

			case "date-picker":
				return (
					<div
						key={fieldName}
						className={`col-md-${fieldConfig.colSize || 4} mb-3`}
					>
						<DatePicker
							isRequired={fieldConfig.required}
							validation={validation}
							componentId={fieldName}
							label={t(fieldConfig.label)}
						/>
					</div>
				);

			case "textarea":
				return (
					<div
						key={fieldName}
						className={`col-md-${fieldConfig.colSize || 6} mb-3`}
					>
						<Label>
							{t(fieldConfig.label)}
							{fieldConfig.required && (
								<span className="text-danger ms-1">*</span>
							)}
						</Label>
						<Input
							{...commonProps}
							type="textarea"
							placeholder={t(fieldConfig.label)}
							maxLength={fieldConfig.maxLength}
						/>
						{validation.touched[fieldName] && validation.errors[fieldName] && (
							<FormFeedback type="invalid">
								{validation.errors[fieldName]}
							</FormFeedback>
						)}
					</div>
				);

			case "rich-text":
				return (
					<div key={fieldName} className="col-md-12 mb-3">
						<Label>{t(fieldConfig.label)}</Label>
						<div
							className={
								validation.touched[fieldName] && validation.errors[fieldName]
									? "is-invalid"
									: ""
							}
						>
							<ReactQuill
								theme="snow"
								value={validation.values[fieldName] || ""}
								onChange={(content) =>
									validation.setFieldValue(fieldName, content)
								}
								onBlur={() => validation.setFieldTouched(fieldName, true)}
								placeholder={t(fieldConfig.label)}
							/>
						</div>
						{validation.touched[fieldName] && validation.errors[fieldName] && (
							<FormFeedback className="d-block">
								{validation.errors[fieldName]}
							</FormFeedback>
						)}
					</div>
				);

			case "input":
			default:
				return (
					<div
						key={fieldName}
						className={`col-md-${fieldConfig.colSize || 4} mb-3`}
					>
						<Label>
							{t(fieldConfig.label)}
							{fieldConfig.required && (
								<span className="text-danger ms-1">*</span>
							)}
						</Label>
						<Input
							{...commonProps}
							type={fieldConfig.type || "text"}
							placeholder={t(fieldConfig.placeholder || fieldConfig.label)}
							maxLength={fieldConfig.maxLength}
						/>
						{validation.touched[fieldName] && validation.errors[fieldName] && (
							<FormFeedback type="invalid">
								{validation.errors[fieldName]}
							</FormFeedback>
						)}
					</div>
				);
		}
	};

	// Render section
	const renderSection = (sectionKey, sectionConfig) => {
		if (!sectionConfig.visible) return null;

		switch (sectionKey) {
			case "progressMetrics":
				return renderProgressMetricsSection(sectionConfig);

			default:
				return (
					<div className="card mb-4">
						<div className="card-header bg-light">
							<h5 className="card-title mb-0">{t(sectionConfig.title)}</h5>
						</div>
						<div className="card-body">
							<Row>
								{sectionConfig.fields.map((fieldName) =>
									renderFormField(fieldName)
								)}
							</Row>
						</div>
					</div>
				);
		}
	};

	// Render progress metrics with tabs
	const renderProgressMetricsSection = (sectionConfig) => {
		const { tabs } = sectionConfig;
		const visibleTabs = Object.entries(tabs).filter(
			([_, tabConfig]) => tabConfig.visible
		);

		if (visibleTabs.length === 0) return null;

		// Set default active tab to first visible tab
		if (!activeTab || !tabs[activeTab]?.visible) {
			setActiveTab(visibleTabs[0][0]);
		}

		return (
			<div className="card mb-4">
				<div className="card-header bg-light">
					<h5 className="card-title mb-0">{t(sectionConfig.title)}</h5>
				</div>
				<div className="card-body">
					<Nav
						tabs
						className="nav-tabs-custom justify-content-center gap-2 mb-3"
					>
						{visibleTabs.map(([tabKey, tabConfig]) => (
							<NavItem key={tabKey}>
								<NavLink
									className={`nav-link ${activeTab === tabKey ? "active" : ""}`}
									onClick={() => toggleTab(tabKey)}
								>
									<i className={`${tabConfig.icon} me-1`}></i>
									{t(tabConfig.title)}
								</NavLink>
							</NavItem>
						))}
					</Nav>

					<TabContent activeTab={activeTab}>
						{visibleTabs.map(([tabKey, tabConfig]) => (
							<TabPane key={tabKey} tabId={tabKey}>
								<Row>
									{tabConfig.fields.map((fieldName) =>
										renderFormField(fieldName)
									)}
								</Row>
							</TabPane>
						))}
					</TabContent>
				</div>
			</div>
		);
	};

	// Build table columns based on configuration
	const columns = useMemo(() => {
		const baseColumns = [
			{
				header: t("mne_transaction_type"),
				accessorKey: "mne_transaction_type_id",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => {
					const val = getValue();
					const transactionTypes =
						config.fields.mne_transaction_type_id?.options || [];
					const transactionTypeMap = Object.fromEntries(
						transactionTypes.map(({ value, label }) => [value, label])
					);
					const labelKey = transactionTypeMap[val] ?? "-";
					return <span>{t(labelKey)}</span>;
				},
			},
			{
				header: t("mne_visit_type"),
				accessorKey: "mne_visit_type",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => {
					const visitTypes = config.fields.mne_visit_type?.options || [];
					const visitTypeMap = Object.fromEntries(
						visitTypes.map(({ value, label }) => [value, label])
					);
					const labelKey = visitTypeMap[getValue()] ?? "-";
					return <span>{t(labelKey)}</span>;
				},
			},
		];

		// Add progress metric columns based on configuration
		// Add progress metric columns based on configuration
		if (config.tableColumns.showRegionalLevel) {
			baseColumns.push(
				{
					header: t("mne_physical_region"),
					accessorKey: "mne_physical_region",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return `${value}%`;
					},
				},
				{
					header: t("mne_financial_region"),
					accessorKey: "mne_financial_region",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return parseFloat(value).toLocaleString() ?? "-";
					},
				}
			);
		}

		if (config.tableColumns.showZonalLevel) {
			baseColumns.push(
				{
					header: t("mne_physical_zone"),
					accessorKey: "mne_physical_zone",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return `${value}%`;
					},
				},
				{
					header: t("mne_financial_zone"),
					accessorKey: "mne_financial_zone",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return parseFloat(value).toLocaleString() ?? "-";
					},
				}
			);
		}

		if (config.tableColumns.showWoredaLevel) {
			baseColumns.push(
				{
					header: t("mne_physical"),
					accessorKey: "mne_physical",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return `${value}%`;
					},
				},
				{
					header: t("mne_financial"),
					accessorKey: "mne_financial",
					enableColumnFilter: false,
					enableSorting: true,
					cell: ({ getValue }) => {
						const value = getValue();
						// Check for null, undefined, empty string, or NaN
						if (
							value === null ||
							value === undefined ||
							value === "" ||
							isNaN(parseFloat(value))
						) {
							return "-";
						}
						return parseFloat(value).toLocaleString() ?? "-";
					},
				}
			);
		}

		// Add project-specific columns
		if (projectType === PROJECT_TYPES.CSO) {
			baseColumns.push({
				header: t("cso_partner_name"),
				accessorKey: "cso_partner_name",
				enableColumnFilter: false,
				enableSorting: true,
			});
		} else if (projectType === PROJECT_TYPES.CITIZEN) {
			baseColumns.push({
				header: t("citizen_participation_count"),
				accessorKey: "citizen_participation_count",
				enableColumnFilter: false,
				enableSorting: true,
			});
		}

		// Add common action columns
		baseColumns.push(
			{
				header: t("mne_record_date"),
				accessorKey: "mne_record_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => <span>{toEthiopian(getValue()) || "-"}</span>,
			},
			{
				header: t("mne_start_date"),
				accessorKey: "mne_start_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => <span>{toEthiopian(getValue()) || "-"}</span>,
			},
			{
				header: t("mne_end_date"),
				accessorKey: "mne_end_date",
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ getValue }) => <span>{toEthiopian(getValue()) || "-"}</span>,
			},
			{
				header: t("view_detail"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => (
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
				),
			},
			{
				header: t("attach_files"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => (
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
				),
			},
			{
				header: t("Message"),
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cellProps) => (
					<Button
						outline
						type="button"
						color="primary"
						className="btn-sm"
						onClick={() => {
							toggleConvModal();
							setTransaction(cellProps.row.original);
						}}
					>
						{t("Message")}
					</Button>
				),
			}
		);

		if (
			config.tableColumns.showActionButtons &&
			(data?.previledge?.is_role_editable == 1 ||
				data?.previledge?.is_role_deletable == 1)
		) {
			baseColumns.push({
				header: t("Action"),
				accessorKey: t("Action"),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (cellProps) => (
					<div className="d-flex gap-1">
						{cellProps.row.original.is_editable == 1 && (
							<Button
								color="Link"
								className="text-success"
								onClick={() =>
									handleProjectMonitoringEvaluationClick(cellProps.row.original)
								}
							>
								<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
								<UncontrolledTooltip placement="top" target="edittooltip">
									Edit
								</UncontrolledTooltip>
							</Button>
						)}
						{cellProps.row.original.is_deletable == 9 && (
							<Button
								color="Link"
								className="text-danger"
								onClick={() => onClickDelete(cellProps.row.original)}
							>
								<i className="mdi mdi-delete font-size-18" id="deletetooltip" />
								<UncontrolledTooltip placement="top" target="deletetooltip">
									Delete
								</UncontrolledTooltip>
							</Button>
						)}
					</div>
				),
			});
		}

		return baseColumns;
	}, [config, data, projectType]);

	// Build export columns
	const exportColumns = useMemo(() => {
		const columns = [
			{
				key: "mne_transaction_type_id",
				label: "mne_transaction_type",
				format: (val) => {
					const transactionTypes =
						config.fields.mne_transaction_type_id?.options || [];
					const labelKey = transactionTypes.find(
						(type) => type.value === val
					)?.label;
					return labelKey ? t(labelKey) : "-";
				},
			},
			{
				key: "mne_visit_type",
				label: "mne_visit_type",
				format: (val) => {
					const visitTypes = config.fields.mne_visit_type?.options || [];
					const labelKey = visitTypes.find((type) => type.value === val)?.label;
					return labelKey ? t(labelKey) : "-";
				},
			},
			...monitoringExportColumns.filter((column) => {
				// Filter export columns based on configuration
				if (
					column.key === "mne_financial_region" ||
					column.key === "mne_physical_region"
				) {
					return config.tableColumns.showRegionalLevel;
				}
				if (
					column.key === "mne_financial_zone" ||
					column.key === "mne_physical_zone"
				) {
					return config.tableColumns.showZonalLevel;
				}
				if (column.key === "mne_financial" || column.key === "mne_physical") {
					return config.tableColumns.showWoredaLevel;
				}
				return true;
			}),
		];

		// Add project-specific export columns
		if (projectType === PROJECT_TYPES.CSO) {
			columns.push({
				key: "cso_partner_name",
				label: "cso_partner_name",
			});
		} else if (projectType === PROJECT_TYPES.CITIZEN) {
			columns.push({
				key: "citizen_participation_count",
				label: "citizen_participation_count",
			});
		}

		return columns;
	}, [config, projectType]);

	// Build summary columns
	const summaryColumns = useMemo(() => {
		const columns = [];

		if (config.tableColumns.showFinancialColumns) {
			if (config.tableColumns.showWoredaLevel) {
				columns.push("mne_financial");
			}
			if (config.tableColumns.showZonalLevel) {
				columns.push("mne_financial_zone");
			}
			if (config.tableColumns.showRegionalLevel) {
				columns.push("mne_financial_region");
			}
		}

		return columns;
	}, [config]);

	// Error handling
	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}

	return (
		<React.Fragment>
			{/* Lazy loaded modals */}
			<LazyLoader>
				{fileModal && (
					<AttachFileModal
						isOpen={fileModal}
						toggle={toggleFileModal}
						projectId={passedId}
						ownerTypeId={PAGE_ID.PROJ_MONITORING}
						ownerId={transaction?.mne_id}
					/>
				)}
				{convModal && (
					<ConvInfoModal
						isOpen={convModal}
						toggle={toggleConvModal}
						ownerTypeId={PAGE_ID.PROJ_MONITORING}
						ownerId={transaction?.mne_id ?? null}
					/>
				)}
			</LazyLoader>

			{/* View modal */}
			<ProjectMonitoringEvaluationModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
				projectType={projectType}
			/>

			{/* Delete modal */}
			<DeleteModal
				show={deleteModal}
				onDeleteClick={handleDeleteProjectMonitoringEvaluation}
				onCloseClick={() => setDeleteModal(false)}
				isLoading={deleteProjectMonitoringEvaluation.isPending}
			/>

			{/* Main table */}
			{isLoading ? (
				<Spinners />
			) : (
				<TableContainer
					columns={columns}
					data={data?.data || []}
					isGlobalFilter={true}
					isAddButton={data?.previledge?.is_role_can_add == 1}
					isCustomPageSize={true}
					handleUserClick={handleProjectMonitoringEvaluationClicks}
					isPagination={true}
					SearchPlaceholder={t("search_results", { count: 26 })}
					buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
					buttonName={t("add")}
					tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
					theadClass="table-light"
					pagination="pagination"
					paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
					refetch={refetch}
					isFetching={isFetching}
					exportColumns={exportColumns}
					isSummaryRow={summaryColumns.length > 0}
					summaryColumns={summaryColumns}
				/>
			)}

			{/* Form modal */}
			<Modal isOpen={modal} toggle={toggle} className="modal-xl">
				<ModalHeader toggle={toggle} tag="h4">
					{isEdit ? t("edit") : t("add")}{" "}
					{t(`${projectType}_project_monitoring`)}
				</ModalHeader>
				<ModalBody>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							validation.handleSubmit();
							return false;
						}}
					>
						{/* Render all sections */}
						{Object.entries(config.sections).map(
							([sectionKey, sectionConfig]) =>
								renderSection(sectionKey, sectionConfig)
						)}

						{/* Submit button */}
						<Row>
							<Col>
								<div className="text-end">
									{addProjectMonitoringEvaluation.isPending ||
									updateProjectMonitoringEvaluation.isPending ? (
										<Button
											color="success"
											type="submit"
											className="save-user"
											disabled={
												addProjectMonitoringEvaluation.isPending ||
												updateProjectMonitoringEvaluation.isPending ||
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
												addProjectMonitoringEvaluation.isPending ||
												updateProjectMonitoringEvaluation.isPending ||
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

ProjectMonitoringEvaluationModel.propTypes = {
	passedId: PropTypes.any.isRequired,
	isActive: PropTypes.bool,
	status: PropTypes.string,
	startDate: PropTypes.string,
};

export default ProjectMonitoringEvaluationModel;
