import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Spinner } from "reactstrap";
import Spinners from "../../components/Common/Spinner";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns";
import CascadingDepartmentDropdowns from "./CascadingDepartmentDropdowns";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserRoles from "../../pages/Userrole/index";
import UserSectorModel from "../Usersector";
import AgGridContainer from "../../components/Common/AgGridContainer";
import AdvancedSearch from "../../components/Common/AdvancedSearch2";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
	phoneValidation,
	alphanumericValidation,
	dropdownValidation,
} from "../../utils/Validation/validation";
import {
	useFetchUserss,
	useSearchUserss,
	useAddUsers,
	useDeleteUsers,
	useUpdateUsers,
} from "../../queries/users_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useFetchCsoInfos } from "../../queries/csoinfo_query";
import UsersModal from "./UsersModal";
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
	ModalFooter,
	InputGroup,
	InputGroupText,
} from "reactstrap";
import { toast } from "react-toastify";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import { createSelectOptions } from "../../utils/commonMethods";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AccessLog from "../Accesslog/AccessLog";
import {
	createMultiLangKeyValueMap,
	createMultiSelectOptions,
} from "../../utils/commonMethods";
import AsyncSelectField from "../../components/Common/AsyncSelectField";
import { useUserExportColumns } from "../../utils/exportColumnsForLists";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

export const getDepartmentType = (user) => {
	if (!user) return null;
	if (user?.usr_officer_id > 0) return "Expert";
	if (user?.usr_team_id > 0) return "Team Leader";
	if (user?.usr_directorate_id > 0) return "Director";
	if (user?.usr_department_id > 0) return "All Department";
	return null;
};

const UsersModel = () => {
	document.title = "Users";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	// Local state management (following the same pattern as ProjectList)
	const [searchState, setSearchState] = useState({
		searchParams: {
			page: 1,
			per_page: 10,
		},
		additionalParams: {},
		exportSearchParams: {},
	});

	const [paginationState, setPaginationState] = useState({
		currentPage: 1,
		pageSize: 10,
		total: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	});

	const [uiState, setUIState] = useState({
		showSearchResult: false,
	});

	// Extract state for easier access
	const { searchParams, additionalParams, exportSearchParams } = searchState;
	const { currentPage, pageSize, total, totalPages } = paginationState;
	const { showSearchResult } = uiState;

	// Existing local state
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [users, setUsers] = useState(null);
	const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
	const [userMetaData, setUserData] = useState({});
	const [showCanvas, setShowCanvas] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [transaction, setTransaction] = useState({});
	const [deleteModal, setDeleteModal] = useState(false);

	// Refs
	const advancedSearchRef = useRef(null);

	// Data hooks
	const {
		data: sectorInformationData,
		isLoading: isSectorLoading,
		isError: isSectorError,
	} = useFetchSectorInformations();
	const { data: csoData } = useFetchCsoInfos();

	// Create paginationInfo for table component
	const paginationInfo = useMemo(
		() => ({
			current_page: currentPage,
			per_page: pageSize,
			total: total || 0,
			total_pages: totalPages || 0,
			has_next: paginationState.hasNext,
			has_prev: paginationState.hasPrev,
		}),
		[
			currentPage,
			pageSize,
			total,
			totalPages,
			paginationState.hasNext,
			paginationState.hasPrev,
		]
	);

	// Prepare sector options
	const {
		sci_name_en: sectorInformationOptionsEn,
		sci_name_or: sectorInformationOptionsOr,
		sci_name_am: sectorInformationOptionsAm,
	} = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
		"sci_name_en",
		"sci_name_or",
		"sci_name_am",
	]);

	const sectorInformationMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			sectorInformationData?.data || [],
			"sci_id",
			{
				en: "sci_name_en",
				am: "sci_name_am",
				or: "sci_name_or",
			},
			lang
		);
	}, [sectorInformationData, lang]);

	const csoOptions = createSelectOptions(
		csoData?.data || [],
		"cso_id",
		"cso_name"
	);

	// Mutation hooks
	const addUsers = useAddUsers();
	const updateUsers = useUpdateUsers();
	const deleteUsers = useDeleteUsers();

	// Search handler with pagination
	const handleSearchResults = useCallback(
		({ data: searchData, error: searchErr }) => {
			setSearchResults(searchData);
			setSearchError(searchErr);
			setUIState({ showSearchResult: true });

			if (searchData?.pagination) {
				setPaginationState({
					currentPage: searchData.pagination.current_page,
					pageSize: searchData.pagination.per_page,
					total: searchData.pagination.total,
					totalPages: searchData.pagination.total_pages,
					hasNext: searchData.pagination.has_next,
					hasPrev: searchData.pagination.has_prev,
				});
			}
		},
		[]
	);

	// Pagination handlers
	const handlePageChange = useCallback(
		(newPage) => {
			setPaginationState((prev) => ({ ...prev, currentPage: newPage }));
		},
		[uiState.showSearchResult]
	);

	const handlePageSizeChange = useCallback(
		(newSize) => {
			setPaginationState({
				currentPage: 1,
				pageSize: newSize,
				total: 0,
				totalPages: 0,
				hasNext: false,
				hasPrev: false,
			});
		},
		[uiState.showSearchResult]
	);

	// Handle search labels for export
	const handleSearchLabels = useCallback((labels) => {
		setSearchState((prev) => ({ ...prev, exportSearchParams: labels }));
	}, []);

	// Clear search handler
	const handleClear = useCallback(() => {
		setSearchState({
			searchParams: {},
			additionalParams: {},
			exportSearchParams: {},
		});
		setPaginationState({
			currentPage: 1,
			pageSize: 30,
			total: 0,
			totalPages: 0,
			hasNext: false,
			hasPrev: false,
		});
		setUIState({ showSearchResult: false });
		setSearchResults(null);
		setSearchError(null);
	}, []);

	// User type mapping
	const userTypeMap = useMemo(() => {
		return {
			1: t("Governmental"),
			4: t("CSO"),
			2: t("CSO Director"),
			3: t("Citizenship"),
			5: t("Bureau of Finance"),
		};
	}, [t]);

	// AG Grid column definitions
	const columnDefs = useMemo(() => {
		const baseColumns = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
				pinned: "left",
			},
			{
				headerName: t("usr_full_name"),
				field: "usr_full_name",
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 200,
				pinned: "left",
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				headerName: t("usr_email"),
				field: "usr_email",
				sortable: true,
				filter: "agTextColumnFilter",
				minWidth: 200,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				headerName: t("usr_phone_number"),
				field: "usr_phone_number",
				sortable: true,
				filter: "agTextColumnFilter",
				minWidth: 200,
				cellRenderer: (params) => {
					return <span>{truncateText(params.value, 30) || "-"}</span>;
				},
			},
			{
				headerName: t("usr_sector_id"),
				field: "sector_name",
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 3,
				minWidth: 200,
				cellRenderer: (params) => {
					return (
						<span>
							{sectorInformationMap[params.data.usr_sector_id] || "-"}
						</span>
					);
				},
			},
			{
				headerName: t("Department"),
				field: "dep_name",
				sortable: true,
				filter: "agTextColumnFilter",
				minWidth: 200,
				cellRenderer: (params) => {
					const departmentType = getDepartmentType(params.data);
					return <span>{departmentType || "-"}</span>;
				},
			},
			{
				headerName: t("usr_user_type"),
				field: "usr_user_type",
				sortable: true,
				filter: "agTextColumnFilter",
				minWidth: 200,
				cellRenderer: (params) => {
					return <span>{userTypeMap[params.value] || "-"}</span>;
				},
			},
		];

		// Add action column if user has edit permissions
		if (true) {
			// This should be based on actual permissions check
			baseColumns.push({
				headerName: t("Action"),
				sortable: false,
				filter: false,
				minWidth: 180,
				pinned: "right",
				cellRenderer: (params) => {
					if (params.node.footer) {
						return ""; // Suppress buttons for footer
					}

					const userId = params.data.usr_id;
					const viewTooltipId = `viewtooltip-${userId}`;
					const editTooltipId = `edittooltip-${userId}`;
					const settingsTooltipId = `settingstooltip-${userId}`;
					const duplicateTooltipId = `duplicatetooltip-${userId}`;

					return (
						<div className="d-flex gap-2">
							{/* View button */}
							<Button
								size="sm"
								color="none"
								className="text-primary"
								onClick={() => {
									setTransaction(params.data);
									setModal1(true);
								}}
								type="button"
							>
								<i className="mdi mdi-eye font-size-18" id={viewTooltipId} />
								<UncontrolledTooltip placement="top" target={viewTooltipId}>
									{t("view_detail")}
								</UncontrolledTooltip>
							</Button>

							{/* Edit button */}
							{(params.data?.is_editable || params.data?.is_role_editable) && (
								<Button
									size="sm"
									color="none"
									className="text-success"
									onClick={() => handleUsersClick(params.data)}
									type="button"
								>
									<i
										className="mdi mdi-pencil font-size-18"
										id={editTooltipId}
									/>
									<UncontrolledTooltip placement="top" target={editTooltipId}>
										Edit
									</UncontrolledTooltip>
								</Button>
							)}

							{/* Settings button */}
							{(params.data?.is_editable || params.data?.is_role_editable) && (
								<Button
									size="sm"
									color="none"
									className="text-secondary"
									onClick={() => handleClick(params.data)}
									type="button"
								>
									<i
										className="mdi mdi-cog font-size-18"
										id={settingsTooltipId}
									/>
									<UncontrolledTooltip
										placement="top"
										target={settingsTooltipId}
									>
										Setting
									</UncontrolledTooltip>
								</Button>
							)}

							{/* Duplicate button */}
							<Button
								size="sm"
								color="none"
								className="text-primary"
								onClick={() => handleUsersDuplicateClick(params.data)}
								type="button"
							>
								<i
									className="mdi mdi-content-duplicate font-size-18"
									id={duplicateTooltipId}
								/>
								<UncontrolledTooltip
									placement="top"
									target={duplicateTooltipId}
								>
									Duplicate
								</UncontrolledTooltip>
							</Button>
						</div>
					);
				},
			});
		}
		return baseColumns;
	}, [t, sectorInformationMap, userTypeMap]);

	// Modal handlers
	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	const toggleViewModal = useCallback(() => {
		setModal1(!modal1);
	}, [modal1]);

	const toggle = useCallback(() => {
		if (modal) {
			setModal(false);
			setIsDuplicateModalOpen(false);
			setUsers(null);
		} else {
			setModal(true);
		}
	}, [modal]);

	// User action handlers
	const handleUsersClick = useCallback(
		(user) => {
			setUsers({
				usr_id: user.usr_id,
				usr_email: user.usr_email,
				usr_password: user.usr_password,
				usr_full_name: user.usr_full_name,
				usr_phone_number: Number(
					user.usr_phone_number.toString().replace(/^(\+?251)/, "")
				),
				usr_role_id: Number(user.usr_role_id),
				usr_region_id: Number(user.usr_region_id),
				usr_zone_id: Number(user.usr_zone_id),
				usr_woreda_id: Number(user.usr_woreda_id),
				usr_sector_id: Number(user.usr_sector_id),
				usr_is_active: user.usr_is_active,
				usr_picture: user.usr_picture,
				usr_last_logged_in: user.usr_last_logged_in,
				usr_ip: user.usr_ip,
				usr_remember_token: user.usr_remember_token,
				usr_notified: user.usr_notified,
				usr_description: user.usr_description,
				usr_status: user.usr_status,
				usr_department_id: Number(user.usr_department_id),
				is_deletable: user.is_deletable,
				is_editable: user.is_editable,
				usr_directorate_id: Number(user.usr_directorate_id),
				usr_team_id: Number(user.usr_team_id),
				usr_officer_id: Number(user.usr_officer_id),
				usr_user_type: Number(user.usr_user_type),
				usr_owner_id: Number(user.usr_owner_id),
			});
			setIsEdit(true);
			toggle();
		},
		[toggle]
	);

	const handleUsersDuplicateClick = useCallback(
		(user) => {
			setUsers({
				usr_copied_from_id: user.usr_id,
				usr_email: "",
				usr_password: "User@123",
				usr_full_name: user.usr_full_name,
				usr_phone_number: Number(
					user.usr_phone_number.toString().replace(/^(\+?251)/, "")
				),
				usr_role_id: Number(user.usr_role_id),
				usr_region_id: Number(user.usr_region_id),
				usr_zone_id: Number(user.usr_zone_id),
				usr_woreda_id: Number(user.usr_woreda_id),
				usr_sector_id: Number(user.usr_sector_id),
				usr_is_active: user.usr_is_active,
				usr_picture: user.usr_picture,
				usr_last_logged_in: user.usr_last_logged_in,
				usr_ip: user.usr_ip,
				usr_remember_token: user.usr_remember_token,
				usr_notified: user.usr_notified,
				usr_description: user.usr_description,
				usr_status: user.usr_status,
				usr_department_id: Number(user.usr_department_id),
				is_deletable: user.is_deletable,
				is_editable: user.is_editable,
				usr_directorate_id: Number(user.usr_directorate_id),
				usr_team_id: Number(user.usr_team_id),
				usr_officer_id: Number(user.usr_officer_id),
				usr_user_type: Number(user.usr_user_type),
				usr_owner_id: Number(user.usr_owner_id),
			});
			setIsDuplicateModalOpen(true);
			toggle();
		},
		[toggle]
	);

	const handleClick = useCallback(
		(data) => {
			setShowCanvas(!showCanvas);
			setUserData(data);
		},
		[showCanvas]
	);

	const handleUsersClicks = useCallback(() => {
		setIsEdit(false);
		setUsers("");
		toggle();
	}, [toggle]);

	// Delete handler
	const onClickDelete = useCallback((users) => {
		setUsers(users);
		setDeleteModal(true);
	}, []);

	// Mutation handlers
	const handleAddUsers = useCallback(
		async (data) => {
			try {
				await addUsers.mutateAsync(data);
				toast.success(t("add_success"), {
					autoClose: 3000,
				});
				toggle();
				validation.resetForm();
				// Refresh search if showing search results
				if (showSearchResult && advancedSearchRef.current) {
					await advancedSearchRef.current.refreshSearch();
				}
			} catch (error) {
				if (!error.handledByMutationCache) {
					toast.error(t("add_failure"), { autoClose: 3000 });
				}
			}
		},
		[addUsers, t, toggle, showSearchResult]
	);

	const handleUpdateUsers = useCallback(
		async (data) => {
			try {
				await updateUsers.mutateAsync(data);
				toast.success(t("update_success"), {
					autoClose: 3000,
				});
				toggle();
				validation.resetForm();
				// Refresh search if showing search results
				if (showSearchResult && advancedSearchRef.current) {
					await advancedSearchRef.current.refreshSearch();
				}
			} catch (error) {
				if (!error.handledByMutationCache) {
					toast.error(t("update_failure"), { autoClose: 3000 });
				}
			}
		},
		[updateUsers, t, toggle, showSearchResult]
	);

	const handleDeleteUsers = useCallback(async () => {
		if (users && users.usr_id) {
			try {
				const id = users.usr_id;
				await deleteUsers.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 3000,
				});
				// Refresh search if showing search results
				if (showSearchResult && advancedSearchRef.current) {
					await advancedSearchRef.current.refreshSearch();
				}
			} catch (error) {
				toast.error(t("delete_failure"), {
					autoClose: 3000,
				});
			}
			setDeleteModal(false);
		}
	}, [deleteUsers, users, t, showSearchResult]);

	// Form validation
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			usr_copied_from_id: (users && users.usr_id) || "",
			usr_email: (users && users.usr_email) || "",
			usr_password: (users && users.usr_password) || "User@123",
			usr_full_name: (users && users.usr_full_name) || "",
			usr_phone_number: (users && users.usr_phone_number) || "",
			usr_role_id: (users && users.usr_role_id) || "",
			usr_region_id: (users && users.usr_region_id) || "",
			usr_zone_id: (users && users.usr_zone_id) || "",
			usr_woreda_id: (users && users.usr_woreda_id) || "",
			usr_sector_id: (users && users.usr_sector_id) || "",
			usr_is_active: (users && users.usr_is_active) || "",
			usr_picture: (users && users.usr_picture) || "",
			usr_last_logged_in: (users && users.usr_last_logged_in) || "",
			usr_ip: (users && users.usr_ip) || "",
			usr_remember_token: (users && users.usr_remember_token) || "",
			usr_notified: (users && users.usr_notified) || "",
			usr_description: (users && users.usr_description) || "",
			usr_status: (users && users.usr_status) || "",
			usr_department_id: (users && users.usr_department_id) || "",
			is_deletable: (users && users.is_deletable) || 1,
			is_editable: (users && users.is_editable) || 1,
			usr_directorate_id: (users && users.usr_directorate_id) || "",
			usr_team_id: (users && users.usr_team_id) || "",
			usr_officer_id: (users && users.usr_officer_id) || "",
			usr_user_type: (users && users.usr_user_type) || "",
			usr_owner_id: (users && users.usr_owner_id) || "",
		},
		validationSchema: Yup.object({
			usr_email: Yup.string()
				.required(t("usr_email"))
				.email(t("Invalid email format"))
				.test("unique-usr_email", t("Already exists"), (value) => {
					return !searchResults?.data.some(
						(item) => item.usr_email === value && item.usr_id !== users?.usr_id
					);
				}),
			usr_password:
				!isEdit &&
				Yup.string()
					.required(t("usr_password"))
					.min(8, t("Password must be at least 8 characters"))
					.matches(
						/[a-z]/,
						t("Password must contain at least one lowercase letter")
					)
					.matches(
						/[A-Z]/,
						t("Password must contain at least one uppercase letter")
					)
					.matches(/\d/, t("Password must contain at least one number"))
					.matches(
						/[@$!%*?&#]/,
						t("Password must contain at least one special character")
					),
			usr_full_name: alphanumericValidation(3, 50, true),
			usr_phone_number: phoneValidation(true),
			usr_sector_id: dropdownValidation(1, 100, true),
			usr_region_id: Yup.number().required(t("usr_region_id")),
			usr_user_type: Yup.number().required(t("usr_user_type")),
			usr_owner_id: Yup.string().when("usr_user_type", {
				is: 4,
				then: () => {
					return Yup.number().required(t("usr_owner_id"));
				},
				otherwise: (s) => s,
			}),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateUsers = {
					usr_id: users?.usr_id,
					usr_email: values.usr_email,
					usr_full_name: values.usr_full_name,
					usr_phone_number: `+251${values.usr_phone_number}`,
					usr_role_id: values.usr_role_id,
					usr_region_id: Number(values.usr_region_id),
					usr_woreda_id: Number(values.usr_woreda_id),
					usr_zone_id: Number(values.usr_zone_id),
					usr_sector_id: Number(values.usr_sector_id),
					usr_is_active: Number(values.usr_is_active),
					usr_picture: values.usr_picture,
					usr_last_logged_in: values.usr_last_logged_in,
					usr_ip: values.usr_ip,
					usr_remember_token: values.usr_remember_token,
					usr_notified: Number(values.usr_notified),
					usr_description: values.usr_description,
					usr_status: values.usr_status,
					usr_department_id: Number(values.usr_department_id),
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					usr_directorate_id: Number(values.usr_directorate_id),
					usr_team_id: Number(values.usr_team_id),
					usr_officer_id: Number(values.usr_officer_id),
					usr_user_type: Number(values.usr_user_type),
					usr_owner_id: Number(values.usr_owner_id),
				};
				handleUpdateUsers(updateUsers);
			} else if (isDuplicateModalOpen) {
				const duplcateuser = {
					usr_copied_from_id: users?.usr_copied_from_id,
					usr_email: values.usr_email,
					usr_password: values.usr_password,
					usr_full_name: values.usr_full_name,
					usr_phone_number: values.usr_phone_number,
					usr_role_id: values.usr_role_id,
					usr_region_id: Number(values.usr_region_id),
					usr_woreda_id: Number(values.usr_woreda_id),
					usr_zone_id: Number(values.usr_zone_id),
					usr_sector_id: Number(values.usr_sector_id),
					usr_is_active: Number(values.usr_is_active),
					usr_picture: values.usr_picture,
					usr_last_logged_in: values.usr_last_logged_in,
					usr_ip: values.usr_ip,
					usr_remember_token: values.usr_remember_token,
					usr_notified: Number(values.usr_notified),
					usr_description: values.usr_description,
					usr_status: values.usr_status,
					usr_department_id: Number(values.usr_department_id),
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					usr_directorate_id: Number(values.usr_directorate_id),
					usr_team_id: Number(values.usr_team_id),
					usr_officer_id: Number(values.usr_officer_id),
					usr_user_type: Number(values.usr_user_type),
					usr_owner_id: Number(values.usr_owner_id),
				};
				handleAddUsers(duplcateuser);
			} else {
				const newUsers = {
					usr_email: values.usr_email,
					usr_password: values.usr_password,
					usr_full_name: values.usr_full_name,
					usr_phone_number: `+251${values.usr_phone_number}`,
					usr_role_id: Number(values.usr_role_id),
					usr_region_id: Number(values.usr_region_id),
					usr_zone_id: Number(values.usr_zone_id),
					usr_woreda_id: Number(values.usr_woreda_id),
					usr_sector_id: Number(values.usr_sector_id),
					usr_is_active: Number(values.usr_is_active),
					usr_picture: values.usr_picture,
					usr_last_logged_in: values.usr_last_logged_in,
					usr_ip: values.usr_ip,
					usr_remember_token: values.usr_remember_token,
					usr_notified: Number(values.usr_notified),
					usr_description: values.usr_description,
					usr_status: 1,
					usr_department_id: Number(values.usr_department_id),
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					usr_directorate_id: Number(values.usr_directorate_id),
					usr_team_id: Number(values.usr_team_id),
					usr_officer_id: Number(values.usr_officer_id),
					usr_user_type: Number(values.usr_user_type),
					usr_owner_id: Number(values.usr_owner_id),
				};
				handleAddUsers(newUsers);
			}
		},
	});

	// Clear owner_id when user type changes
	useEffect(() => {
		if (
			validation.values.usr_user_type !== 4 &&
			validation.values.usr_owner_id
		) {
			validation.setFieldValue("usr_owner_id", "");
		}
	}, [validation.values.usr_user_type]);

	return (
		<React.Fragment>
			<UsersModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<div className="page-content">
				<div className="container-fluid">
					<Breadcrumbs />
					<AdvancedSearch
						ref={advancedSearchRef}
						searchHook={useSearchUserss}
						textSearchKeys={["usr_email", "usr_phone_number"]}
						dropdownSearchKeys={[
							{
								key: "usr_sector_id",
								options:
									lang === "en"
										? sectorInformationOptionsEn
										: lang === "am"
											? sectorInformationOptionsAm
											: sectorInformationOptionsOr,
							},
						]}
						checkboxSearchKeys={[]}
						Component={CascadingDropdowns}
						component_params={{
							dropdown1name: "usr_region_id",
							dropdown2name: "usr_zone_id",
							dropdown3name: "usr_woreda_id",
						}}
						additionalParams={additionalParams}
						setAdditionalParams={(params) =>
							setSearchState((prev) => ({ ...prev, additionalParams: params }))
						}
						onSearchResult={handleSearchResults}
						onSearchLabels={handleSearchLabels}
						setIsSearchLoading={setIsSearchLoading}
						setSearchResults={setSearchResults}
						setShowSearchResult={(show) =>
							setUIState((prev) => ({ ...prev, showSearchResult: show }))
						}
						searchParams={searchParams}
						getSearchParams={(params) =>
							setSearchState((prev) => ({ ...prev, searchParams: params }))
						}
						setExportSearchParams={(params) =>
							setSearchState((prev) => ({
								...prev,
								exportSearchParams: params,
							}))
						}
						// Pass pagination state
						pagination={paginationState}
						onPaginationChange={setPaginationState}
						onClear={handleClear}
						initialSearchParams={searchParams}
						initialAdditionalParams={additionalParams}
						initialPagination={paginationState}
					>
						<TableWrapper
							columnDefs={columnDefs}
							showSearchResult={showSearchResult}
							exportSearchParams={exportSearchParams}
							paginationInfo={paginationInfo}
							onPageChange={handlePageChange}
							onPageSizeChange={handlePageSizeChange}
							handleUsersClick={handleUsersClicks}
						/>
					</AdvancedSearch>
					<Modal isOpen={modal} toggle={toggle} className="modal-xl">
						<ModalHeader toggle={toggle} tag="h4">
							{isDuplicateModalOpen ? (
								t("Duplicate ") + " " + t("users")
							) : (
								<div>
									{!!isEdit
										? t("edit") + " " + t("users")
										: t("add") + " " + t("users")}
								</div>
							)}
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
									<Col className="col-md-4 mb-3">
										<Label>
											{t("usr_email")} <span className="text-danger">*</span>
										</Label>
										<Input
											name="usr_email"
											type="text"
											placeholder={t("usr_email")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.usr_email || ""}
											invalid={
												validation.touched.usr_email &&
												validation.errors.usr_email
													? true
													: false
											}
											maxLength={30}
										/>
										{validation.touched.usr_email &&
										validation.errors.usr_email ? (
											<FormFeedback type="invalid">
												{validation.errors.usr_email}
											</FormFeedback>
										) : null}
									</Col>
									{!isEdit && (
										<Col className="col-md-4 mb-3">
											<Label>
												{t("usr_password")}{" "}
												<span className="text-danger">*</span>
											</Label>
											<InputGroup>
												<Input
													name="usr_password"
													type={showPassword ? "text" : "password"}
													placeholder={t("usr_password")}
													onChange={validation.handleChange}
													onBlur={validation.handleBlur}
													value={validation.values.usr_password || ""}
													invalid={
														validation.touched.usr_password &&
														validation.errors.usr_password
															? true
															: false
													}
													maxLength={20}
												/>
												<InputGroupText
													onClick={togglePasswordVisibility}
													style={{ cursor: "pointer" }}
												>
													{showPassword ? <FaEyeSlash /> : <FaEye />}
												</InputGroupText>
												{validation.touched.usr_password &&
												validation.errors.usr_password ? (
													<FormFeedback type="invalid">
														{validation.errors.usr_password}
													</FormFeedback>
												) : null}
											</InputGroup>
										</Col>
									)}
									<Col className={`${isEdit ? "col-md-8" : "col-md-4"} mb-3`}>
										<Label>
											{t("usr_full_name")}{" "}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="usr_full_name"
											type="text"
											placeholder={t("usr_full_name")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.usr_full_name || ""}
											invalid={
												validation.touched.usr_full_name &&
												validation.errors.usr_full_name
													? true
													: false
											}
											maxLength={30}
										/>
										{validation.touched.usr_full_name &&
										validation.errors.usr_full_name ? (
											<FormFeedback type="invalid">
												{validation.errors.usr_full_name}
											</FormFeedback>
										) : null}
									</Col>
									<Col className="col-md-4 mb-3">
										<Label>
											Phone Number <span className="text-danger">*</span>
										</Label>
										<InputGroup>
											<InputGroupText>{"+251"}</InputGroupText>
											<Input
												name="usr_phone_number"
												type="text"
												placeholder="Enter phone number"
												onChange={(e) => {
													const inputValue = e.target.value;
													let formattedValue = inputValue.replace(/^0/, "");
													formattedValue = formattedValue.replace(/[^\d]/g, "");
													formattedValue = formattedValue.substring(0, 9);
													validation.setFieldValue(
														"usr_phone_number",
														formattedValue
													);
												}}
												onBlur={validation.handleBlur}
												value={validation.values.usr_phone_number}
												invalid={
													validation.touched.usr_phone_number &&
													!!validation.errors.usr_phone_number
												}
											/>
											{validation.touched.usr_phone_number &&
											validation.errors.usr_phone_number ? (
												<FormFeedback type="invalid">
													{validation.errors.usr_phone_number}
												</FormFeedback>
											) : null}
										</InputGroup>
									</Col>
									<AsyncSelectField
										fieldId="usr_sector_id"
										validation={validation}
										isRequired
										className="col-md-8 mb-3"
										optionMap={sectorInformationMap}
										isLoading={isSectorLoading}
										isError={isSectorError}
									/>
									<Col className="col-md-4 mb-3">
										<Label>
											{t("usr_user_type")}{" "}
											<span className="text-danger">*</span>
										</Label>
										<Input
											name="usr_user_type"
											type="select"
											className="form-select"
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.usr_user_type || ""}
											invalid={
												validation.touched.usr_user_type &&
												validation.errors.usr_user_type
													? true
													: false
											}
										>
											<option value="">{t("select_one")}</option>
											<option value={1}>{t("Governmental")}</option>
											<option value={4}>{t("CSO")}</option>
											<option value={2}>{t("CSO Director")}</option>
											<option value={3}>{t("Citizenship")}</option>
											<option value={5}>{t("Bureau of Finance")}</option>
										</Input>
										{validation.touched.usr_user_type &&
										validation.errors.usr_user_type ? (
											<FormFeedback type="invalid">
												{validation.errors.usr_user_type}
											</FormFeedback>
										) : null}
									</Col>
									{validation.values.usr_user_type == 4 && (
										<Col className="col-md-4 mb-3">
											<Label>
												{t("usr_owner_id")}{" "}
												<span className="text-danger">*</span>
											</Label>
											<Input
												name="usr_owner_id"
												type="select"
												className="form-select"
												onChange={validation.handleChange}
												onBlur={validation.handleBlur}
												value={validation.values.usr_owner_id || ""}
												invalid={
													validation.touched.usr_owner_id &&
													validation.errors.usr_owner_id
														? true
														: false
												}
											>
												<option value="">{t("select_one")}</option>
												{csoOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{t(`${option.label}`)}
													</option>
												))}
											</Input>
											{validation.touched.usr_owner_id &&
											validation.errors.usr_owner_id ? (
												<FormFeedback type="invalid">
													{validation.errors.usr_owner_id}
												</FormFeedback>
											) : null}
										</Col>
									)}
									<Row>
										<Col className="col-md-6 mb-3">
											<CascadingDropdowns
												validation={validation}
												dropdown1name="usr_region_id"
												dropdown2name="usr_zone_id"
												dropdown3name="usr_woreda_id"
												layout="vertical"
												required={true}
												colSizes={{ md: 6, sm: 12, lg: 4 }}
												identifier="select"
											/>
										</Col>
										<Col className="col-md-6 mb-3">
											<CascadingDepartmentDropdowns
												validation={validation}
												dropdown1name="usr_department_id"
												dropdown2name="usr_directorate_id"
												dropdown3name="usr_team_id"
												dropdown4name="usr_officer_id"
												isEdit={isEdit}
												required={false}
											/>
										</Col>
									</Row>
									{/*<ImageUploader validation={validation} />*/}

									<Col className="col-md-12 mb-3">
										<Label>{t("usr_description")}</Label>
										<Input
											name="usr_description"
											type="textarea"
											rows={4}
											placeholder={t("usr_description")}
											onChange={validation.handleChange}
											onBlur={validation.handleBlur}
											value={validation.values.usr_description || ""}
											invalid={
												validation.touched.usr_description &&
												validation.errors.usr_description
													? true
													: false
											}
											maxLength={20}
										/>
										{validation.touched.usr_description &&
										validation.errors.usr_description ? (
											<FormFeedback type="invalid">
												{validation.errors.usr_description}
											</FormFeedback>
										) : null}
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											{addUsers.isPending || updateUsers.isPending ? (
												<Button
													color="success"
													type="submit"
													className="save-user"
													disabled={
														addUsers.isPending ||
														updateUsers.isPending ||
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
														addUsers.isPending ||
														updateUsers.isPending ||
														!validation.dirty
													}
												>
													{isDuplicateModalOpen ? (
														<div>{t("Save Duplicate")}</div>
													) : (
														<div>{t("Save")}</div>
													)}
												</Button>
											)}
										</div>
									</Col>
								</Row>
							</Form>
						</ModalBody>
						{isDuplicateModalOpen ? (
							<ModalFooter>
								<div className="text-center text-warning mb-4">
									{t(
										"This entry contains duplicate information. Please review and modify the form to avoid duplicates. If you still wish to proceed, click Save to add this user as a new entry."
									)}
								</div>
							</ModalFooter>
						) : null}
					</Modal>
				</div>
			</div>
			{showCanvas && (
				<RightOffCanvas
					handleClick={handleClick}
					showCanvas={showCanvas}
					canvasWidth={84}
					name={userMetaData.usr_name || "User Roles"}
					id={userMetaData.usr_id}
					components={{
						"User Roles": UserRoles,
						"User Sector": UserSectorModel,
						"Access Log": AccessLog,
					}}
				/>
			)}
		</React.Fragment>
	);
};

UsersModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default UsersModel;

const TableWrapper = ({
	data,
	isLoading,
	columnDefs,
	showSearchResult,
	exportSearchParams,
	paginationInfo,
	onPageChange,
	onPageSizeChange,
	handleUsersClick
}) => {
	const exportColumns = useUserExportColumns();
	return (
		<>
			<AgGridContainer
				rowData={showSearchResult ? data?.data || [] : []}
				columnDefs={columnDefs}
				isLoading={isLoading}
				isPagination={false}
				isServerSidePagination={true}
				paginationPageSize={10}
				isGlobalFilter={true}
				isAddButton={true}
				onAddClick={handleUsersClick}
				rowHeight={36}
				addButtonText="Add"
				isExcelExport={true}
				isPdfExport={true}
				isPrint={true}
				tableName="Users"
				exportColumns={exportColumns}
				exportSearchParams={exportSearchParams}
				paginationInfo={paginationInfo}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</>
	);
};
