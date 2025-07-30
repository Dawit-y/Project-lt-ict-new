import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
	useSearchProjects,
	useAddProject,
	useUpdateProject,
	useDeleteProject,
} from "../../queries/citizenship_project_query";
import { useSearchProjectCategorys } from "../../queries/projectcategory_query";
import { useFetchSectorInformations } from "../../queries/sectorinformation_query";
import { useTranslation } from "react-i18next";
import {
	Button,
	Col,
	Row,
	Input,
	Badge,
	UncontrolledTooltip,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormFeedback,
	Label,
	Spinner,
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Alert,
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	createSelectOptions,
	createMultiSelectOptions,
	createMultiLangKeyValueMap,
	createKeyValueMap,
} from "../../utils/commonMethods";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists";
import {
	alphanumericValidation,
	amountValidation,
	numberValidation,
	onlyAmharicValidation,
	formattedAmountValidation,
} from "../../utils/Validation/validation";
import CascadingDropdowns from "../../components/Common/CascadingDropdowns2";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { useFetchSectorCategorys } from "../../queries/sectorcategory_query";
import DatePicker from "../../components/Common/DatePicker";
import AgGridContainer from "../../components/Common/AgGridContainer";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FormattedAmountField from "../../components/Common/FormattedAmountField";
import InputField from "../../components/Common/InputField";
import AsyncSelectField from "../../components/Common/AsyncSelectField";

const ProjectModel = () => {
	document.title = "Citizenship Projects List";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [project, setProject] = useState(null);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);

	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [include, setInclude] = useState(0);

	const [activeTab, setActiveTab] = useState("1");
	const [tabErrors, setTabErrors] = useState({
		tab1: false,
		tab2: false,
		tab3: false,
	});

	const [params, setParams] = useState({});
	const [searchParams, setSearchParams] = useState({});

	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const { data, isLoading, error, isError, refetch } = useState(false);
	const param = { owner_type_id: "3" };
	const {
		data: projectCategoryData,
		isLoading: prCategoryLoading,
		isError: prCategoryIsError,
	} = useSearchProjectCategorys(param);
	const {
		pct_name_en: projectCategoryOptionsEn,
		pct_name_or: projectCategoryOptionsOr,
		pct_name_am: projectCategoryOptionsAm,
	} = createMultiSelectOptions(projectCategoryData?.data || [], "pct_id", [
		"pct_name_en",
		"pct_name_or",
		"pct_name_am",
	]);
	const projectCategoryMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectCategoryData?.data || [],
			"pct_id",
			{
				en: "pct_name_en",
				am: "pct_name_am",
				or: "pct_name_or",
			},
			lang,
			(item) => item.pct_owner_type_id === 3
		);
	}, [projectCategoryData, lang]);
	const { data: sectorInformationData } = useFetchSectorInformations();
	const sectorInformationOptions = createSelectOptions(
		sectorInformationData?.data || [],
		"sci_id",
		"sci_name_en"
	);
	const {
		data: projectStatusData,
		isLoading: prsIsLoading,
		isError: prsIsError,
	} = useFetchProjectStatuss();
	const projectStatusMap = useMemo(() => {
		return createMultiLangKeyValueMap(
			projectStatusData?.data || [],
			"prs_id",
			{
				en: "prs_status_name_en",
				am: "prs_status_name_am",
				or: "prs_status_name_or",
			},
			lang
		);
	}, [projectStatusData, lang]);
	const {
		data: sectorCategories,
		isLoading: isSectorCatLoading,
		isError: isSectorCatError,
	} = useFetchSectorCategorys();
	const sectorCategoryMap = useMemo(() => {
		return createKeyValueMap(
			sectorCategories?.data || [],
			"psc_id",
			"psc_name",
			(item) => item.psc_citizenship_active === 1
		);
	}, [sectorCategories]);

	const addProject = useAddProject();
	const updateProject = useUpdateProject();
	const deleteProject = useDeleteProject();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsSearchLoading(true);
				await search();
				setShowSearchResult(true);
			} catch (error) {
				console.error("Error during search:", error);
			} finally {
				setIsSearchLoading(false);
			}
		};
		if (Object.keys(searchParams).length > 0) {
			fetchData();
		}
	}, [searchParams]);

	useEffect(() => {
		setProjectParams({
			...(prjLocationRegionId && {
				prj_location_region_id: prjLocationRegionId,
			}),
			...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
			...(prjLocationWoredaId && {
				prj_location_woreda_id: prjLocationWoredaId,
			}),
			...(include === 1 && { include: include }),
		});
	}, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

	const handleAddProject = async (data) => {
		try {
			await addProject.mutateAsync(data);
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

	const handleUpdateProject = async (data) => {
		try {
			await updateProject.mutateAsync(data);
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
	const handleDeleteProject = async () => {
		if (project && project.prj_id) {
			try {
				const id = project.prj_id;
				await deleteProject.mutateAsync(id);
				toast.success(t("delete_success"), {
					autoClose: 2000,
				});
			} catch (error) {
				toast.error(t("delete_success"), {
					autoClose: 2000,
				});
			}
			setDeleteModal(false);
		}
	};
	const validation = useFormik({
		enableReinitialize: true,
		initialValues: {
			prj_name: (project && project.prj_name) || "",
			prj_name_am: (project && project.prj_name_am) || "",
			prj_name_en: (project && project.prj_name_en) || "",
			prj_code: (project && project.prj_code) || "",
			prj_project_status_id: (project && project.prj_project_status_id) || "",
			prj_cluster_id: (project && project.prj_cluster_id) || "",
			prj_project_category_id:
				(project && project.prj_project_category_id) || "",
			prj_project_budget_source_id:
				(project && project.prj_project_budget_source_id) || "",
			prj_total_estimate_budget:
				(project && project.prj_total_estimate_budget) || "",
			prj_total_actual_budget:
				(project && project.prj_total_actual_budget) || "",
			prj_geo_location: (project && project.prj_geo_location) || "",
			prj_sector_id: (project && project.prj_sector_id) || "",
			prj_location_region_id: isEdit
				? (project && project.prj_location_region_id) || ""
				: prjLocationRegionId,
			prj_location_zone_id: isEdit
				? (project && project.prj_location_zone_id) || ""
				: prjLocationZoneId,
			prj_location_woreda_id: isEdit
				? (project && project.prj_location_woreda_id) || ""
				: prjLocationWoredaId,
			prj_location_description:
				(project && project.prj_location_description) || "",
			prj_owner_region_id:
				(project && project.prj_owner_region_id) || Number(prjLocationRegionId),
			prj_owner_zone_id:
				(project && project.prj_owner_zone_id) || Number(prjLocationZoneId),
			prj_owner_woreda_id:
				(project && project.prj_owner_woreda_id) || Number(prjLocationWoredaId),
			prj_owner_kebele_id: (project && project.prj_owner_kebele_id) || "",
			prj_owner_description: (project && project.prj_owner_description) || "",
			prj_start_date_et: (project && project.prj_start_date_et) || "",
			prj_start_date_gc: (project && project.prj_start_date_gc) || "",
			prj_start_date_plan_et: (project && project.prj_start_date_plan_et) || "",
			prj_start_date_plan_gc: (project && project.prj_start_date_plan_gc) || "",
			prj_end_date_actual_et: (project && project.prj_end_date_actual_et) || "",
			prj_end_date_actual_gc: (project && project.prj_end_date_actual_gc) || "",
			prj_end_date_plan_gc: (project && project.prj_end_date_plan_gc) || "",
			prj_end_date_plan_et: (project && project.prj_end_date_plan_et) || "",
			prj_outcome: (project && project.prj_outcome) || "",
			prj_deleted: (project && project.prj_deleted) || "",
			prj_remark: (project && project.prj_remark) || "",
			prj_created_date: (project && project.prj_created_date) || "",
			prj_owner_id: (project && project.prj_owner_id) || "",
			prj_urban_ben_number: (project && project.prj_urban_ben_number) || "",
			prj_rural_ben_number: (project && project.prj_rural_ben_number) || "",
			// prj_department_id: (project && project.prj_department_id) || "",
			is_deletable: (project && project.is_deletable) || 1,
			is_editable: (project && project.is_editable) || 1,
			prj_male_participant: (project && project.prj_male_participant) || "",
			prj_female_participant: (project && project.prj_female_participant) || "",
			prj_job_opportunity: (project && project.prj_job_opportunity) || "",
		},

		validationSchema: Yup.object({
			prj_name: alphanumericValidation(3, 200, true).test(
				"unique-prj_name",
				t("Already exists"),
				(value) => {
					return !searchResults?.data.some(
						(item) => item.prj_name == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_name_am: onlyAmharicValidation(3, 200, false),
			prj_name_en: alphanumericValidation(3, 200, true).test(
				"unique-prj_name_en",
				t("Already exists"),
				(value) => {
					return !searchResults?.data.some(
						(item) =>
							item.prj_name_en == value && item.prj_id !== project?.prj_id
					);
				}
			),
			prj_code: alphanumericValidation(3, 20, false),
			prj_project_status_id: Yup.number().required(t("prj_project_status_id")),
			prj_cluster_id: Yup.number().required(t("prj_cluster_id")),
			prj_project_category_id: numberValidation(1, 200, true),
			prj_total_estimate_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_total_actual_budget: formattedAmountValidation(
				1000,
				1000000000000,
				true
			),
			prj_location_region_id: Yup.string().required(
				t("prj_location_region_id")
			),
			prj_location_zone_id: Yup.string().required(t("prj_location_zone_id")),
			prj_location_woreda_id: Yup.string().required(
				t("prj_location_woreda_id")
			),
			prj_start_date_plan_gc: Yup.string().required(
				t("prj_start_date_plan_gc")
			),
			prj_start_date_gc: Yup.string().required(t("prj_start_date_gc")),
			prj_end_date_plan_gc: Yup.string().required(t("prj_end_date_plan_gc")),
			//prj_department_id: Yup.string().required(t("prj_department_id")),
			prj_urban_ben_number: numberValidation(10, 10000000, false),
			prj_rural_ben_number: numberValidation(10, 10000000, false),
			prj_location_description: alphanumericValidation(3, 425, false),
			//prj_outcome: alphanumericValidation(3, 425, true),
			prj_remark: alphanumericValidation(3, 425, false),
			prj_male_participant: numberValidation(10, 10000000, false),
			prj_female_participant: numberValidation(10, 10000000, false),
		}),
		validateOnBlur: true,
		validateOnChange: false,
		onSubmit: (values) => {
			if (isEdit) {
				const updateProject = {
					prj_id: project.prj_id,
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
					prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
					prj_geo_location: values.prj_geo_location,
					// prj_sector_id: Number(selectedPage.data.pri_sector_id),
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
					prj_owner_kebele_id: values.prj_owner_kebele_id,
					prj_owner_description: values.prj_owner_description,
					prj_start_date_et: values.prj_start_date_et,
					prj_start_date_gc: values.prj_start_date_gc,
					prj_start_date_plan_et: values.prj_start_date_plan_et,
					prj_start_date_plan_gc: values.prj_start_date_plan_gc,
					prj_end_date_actual_et: values.prj_end_date_actual_et,
					prj_end_date_actual_gc: values.prj_end_date_actual_gc,
					prj_end_date_plan_gc: values.prj_end_date_plan_gc,
					prj_end_date_plan_et: values.prj_end_date_plan_et,
					prj_outcome: values.prj_outcome,
					prj_deleted: values.prj_deleted,
					prj_remark: values.prj_remark,
					prj_created_date: values.prj_created_date,
					prj_owner_id: values.prj_owner_id,
					prj_urban_ben_number: parseInt(values.prj_urban_ben_number),
					prj_rural_ben_number: parseInt(values.prj_rural_ben_number),
					//prj_department_id: Number(values.prj_department_id),
					// prj_program_id: Number(selectedPage.data.pri_id),
					is_deletable: values.is_deletable,
					is_editable: values.is_editable,
					prj_male_participant: parseInt(values.prj_male_participant),
					prj_female_participant: parseInt(values.prj_female_participant),
					prj_job_opportunity: values.prj_job_opportunity,
				};
				// update Project
				handleUpdateProject(updateProject);
			} else {
				const newProject = {
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_cluster_id: values.prj_cluster_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
					prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
					prj_geo_location: values.prj_geo_location,
					// prj_sector_id: Number(selectedPage.data.pri_sector_id),
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_zone_id),
					prj_owner_woreda_id: Number(values.prj_owner_woreda_id),
					prj_owner_kebele_id: values.prj_owner_kebele_id,
					prj_owner_description: values.prj_owner_description,
					prj_start_date_et: values.prj_start_date_et,
					prj_start_date_gc: values.prj_start_date_gc,
					prj_start_date_plan_et: values.prj_start_date_plan_et,
					prj_start_date_plan_gc: values.prj_start_date_plan_gc,
					prj_end_date_actual_et: values.prj_end_date_actual_et,
					prj_end_date_actual_gc: values.prj_end_date_actual_gc,
					prj_end_date_plan_gc: values.prj_end_date_plan_gc,
					prj_end_date_plan_et: values.prj_end_date_plan_et,
					prj_outcome: values.prj_outcome,
					prj_deleted: values.prj_deleted,
					prj_remark: values.prj_remark,
					prj_created_date: values.prj_created_date,
					prj_owner_id: values.prj_owner_id,
					prj_urban_ben_number: parseInt(values.prj_urban_ben_number),
					prj_rural_ben_number: parseInt(values.prj_rural_ben_number),
					prj_male_participant: parseInt(values.prj_male_participant),
					prj_female_participant: parseInt(values.prj_female_participant),
					prj_job_opportunity: values.prj_job_opportunity,

					//prj_department_id: Number(values.prj_department_id),
					// prj_program_id: Number(selectedPage.data.pri_id)
				};
				// save new Project
				handleAddProject(newProject);
			}
		},
	});

	const toggle = () => {
		if (modal) {
			setModal(false);
			setProject(null);
		} else {
			setModal(true);
		}
	};

	const handleNodeSelect = useCallback(
		(node) => {
			if (node.level === "region") {
				setPrjLocationRegionId(node.id);
				setPrjLocationZoneId(null);
				setPrjLocationWoredaId(null);
			} else if (node.level === "zone") {
				setPrjLocationZoneId(node.id);
				setPrjLocationWoredaId(null);
			} else if (node.level === "woreda") {
				setPrjLocationWoredaId(node.id);
			}

			if (showSearchResult) {
				setShowSearchResult(false);
			}
		},
		[
			setPrjLocationRegionId,
			setPrjLocationZoneId,
			setPrjLocationWoredaId,
			showSearchResult,
			setShowSearchResult,
		]
	);
	const handleProjectClick = (arg) => {
		const project = arg;
		setProject({
			prj_id: project.prj_id,
			prj_name: project.prj_name,
			prj_name_am: project.prj_name_am,
			prj_name_en: project.prj_name_en,
			prj_code: project.prj_code,
			prj_project_status_id: project.prj_project_status_id,
			prj_project_category_id: project.prj_project_category_id,
			prj_cluster_id: project.prj_cluster_id,
			prj_project_budget_source_id: project.prj_project_budget_source_id,
			prj_total_estimate_budget: project.prj_total_estimate_budget,
			prj_total_actual_budget: project.prj_total_actual_budget,
			prj_geo_location: project.prj_geo_location,
			prj_sector_id: project.prj_sector_id,
			prj_location_region_id: project.prj_location_region_id,
			prj_location_zone_id: project.prj_location_zone_id,
			prj_location_woreda_id: project.prj_location_woreda_id,
			prj_location_kebele_id: project.prj_location_kebele_id,
			prj_location_description: project.prj_location_description,
			prj_owner_region_id: project.prj_owner_region_id,
			prj_owner_zone_id: project.prj_owner_zone_id,
			prj_owner_woreda_id: project.prj_owner_woreda_id,
			prj_owner_kebele_id: project.prj_owner_kebele_id,
			prj_owner_description: project.prj_owner_description,
			prj_start_date_et: project.prj_start_date_et,
			prj_start_date_gc: project.prj_start_date_gc,
			prj_start_date_plan_et: project.prj_start_date_plan_et,
			prj_start_date_plan_gc: project.prj_start_date_plan_gc,
			prj_end_date_actual_et: project.prj_end_date_actual_et,
			prj_end_date_actual_gc: project.prj_end_date_actual_gc,
			prj_end_date_plan_gc: project.prj_end_date_plan_gc,
			prj_end_date_plan_et: project.prj_end_date_plan_et,
			prj_outcome: project.prj_outcome,
			prj_deleted: project.prj_deleted,
			prj_remark: project.prj_remark,
			prj_created_date: project.prj_created_date,
			prj_owner_id: project.prj_owner_id,
			prj_urban_ben_number: project.prj_urban_ben_number,
			prj_rural_ben_number: project.prj_rural_ben_number,
			//prj_department_id: project.prj_department_id,
			is_deletable: project.is_deletable,
			is_editable: project.is_editable,
			prj_male_participant: project.prj_male_participant,
			prj_female_participant: project.prj_female_participant,
			prj_job_opportunity: project.prj_job_opportunity,
		});
		setIsEdit(true);
		toggle();
	};
	//delete projects
	const [deleteModal, setDeleteModal] = useState(false);
	const onClickDelete = (project) => {
		setProject(project);
		setDeleteModal(true);
	};

	const handleProjectClicks = () => {
		validation.resetForm();
		setIsEdit(false);
		setProject("");
		toggle();
	};

	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};

	const columnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 60,
			},
			{
				field: "prj_name",
				headerName: t("prj_name"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 200,
			},
			{
				field: "prj_code",
				headerName: t("prj_code"),
				sortable: true,
				filter: "agTextColumnFilter",
			},
			{
				field: "zone_name",
				headerName: t("prj_owner_zone_id"),
				sortable: true,
				filter: "agTextColumnFilter",
			},
			{
				headerName: t("prs_status"),
				field: "bdr_request_status",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					const badgeClass = params.data.color_code;
					return (
						<Badge className={`font-size-12 badge-soft-${badgeClass}`}>
							{params.data.status_name}
						</Badge>
					);
				},
			},
			{
				field: "prj_total_estimate_budget",
				headerName: t("prj_total_estimate_budget"),
				valueFormatter: (params) => {
					if (params.node.footer) {
						return params.value
							? `$${params.value.toLocaleString()}` // Show total in footer
							: "";
					}
					return params.value ? `${params.value.toLocaleString()}` : "";
				},
			},
			{
				headerName: t("view_details"),
				sortable: false,
				filter: false,
				width: 150,
				cellRenderer: (params) => {
					if (params.node.footer) {
						return ""; // Suppress button for footer
					}
					const { prj_id } = params.data || {};
					return (
						<Link to={`/citizenship_project_detail/${prj_id}`} target="_blank">
							<Button type="button" className="btn-sm mb-1 default" outline>
								<i className="fa fa-eye"></i>
							</Button>
						</Link>
					);
				},
			},
		];
		if (
			searchResults?.previledge?.is_role_editable == 1 ||
			searchResults?.previledge?.is_role_deletable == 1
		) {
			baseColumnDefs.push({
				headerName: t("Action"),
				filter: false,
				sortable: true,
				width: 100,
				cellRenderer: (params) => {
					return (
						<div className="d-flex gap-3">
							{searchResults?.previledge?.is_role_editable == 1 &&
								params.data?.is_editable == 1 && (
									<Link
										className="text-success"
										onClick={() => {
											const data = params.data;
											handleProjectClick(data);
										}}
									>
										<i
											className="mdi mdi-pencil font-size-18"
											id="edittooltip"
										/>
										<UncontrolledTooltip placement="top" target="edittooltip">
											Edit
										</UncontrolledTooltip>
									</Link>
								)}
						</div>
					);
				},
			});
		}
		return baseColumnDefs;
	}, [onClickDelete, handleProjectClick, t, searchResults]);

	// Add this useEffect to update tab errors only when validation changes
	useEffect(() => {
		setTabErrors({
			tab1: hasRequiredFieldErrors([
				"prj_name",
				"prj_name_am",
				"prj_name_en",
				"prj_project_category_id",
				"prj_cluster_id",
				"prj_location_region_id",
				"prj_location_zone_id",
				"prj_location_woreda_id",
			]),
			tab2: hasRequiredFieldErrors([
				"prj_start_date_plan_gc",
				"prj_end_date_plan_gc",
				"prj_start_date_gc",
				"prj_project_status_id",
				"prj_total_estimate_budget",
				"prj_total_actual_budget",
			]),
			tab3: false,
		});
	}, [validation.errors, validation.touched]);
	// Memoize the hasRequiredFieldErrors function to prevent unnecessary re-renders
	const hasRequiredFieldErrors = useCallback(
		(fields) => {
			return fields.some(
				(field) => validation.touched[field] && validation.errors[field]
			);
		},
		[validation.errors, validation.touched]
	);

	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
					<div className="w-100 d-flex gap-2">
						<div style={{ flex: "0 0 25%", minWidth: "250px" }}>
							<TreeForLists
								onNodeSelect={handleNodeSelect}
								setIsAddressLoading={setIsAddressLoading}
								setInclude={setInclude}
							/>
						</div>
						{/* Main Content */}
						<div style={{ flex: "0 0 75%" }}>
							<AdvancedSearch
								searchHook={useSearchProjects}
								textSearchKeys={["prj_name", "prj_code"]}
								dropdownSearchKeys={[
									{
										key: "prj_project_category_id",
										options:
											lang === "en"
												? projectCategoryOptionsEn
												: lang === "am"
												? projectCategoryOptionsAm
												: projectCategoryOptionsOr,
									},
								]}
								checkboxSearchKeys={[]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
							>
								<AgGridContainer
									rowData={showSearchResult ? searchResults?.data : []}
									columnDefs={columnDefs}
									isLoading={isSearchLoading}
									isAddButton={prjLocationWoredaId}
									onAddClick={handleProjectClicks}
									isPagination={true}
									rowHeight={35}
									paginationPageSize={10}
									isGlobalFilter={true}
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName="Projects"
									includeKey={["prj_name", "prj_code"]}
									excludeKey={["is_editable", "is_deletable"]}
								/>
							</AdvancedSearch>
						</div>

						<Modal isOpen={modal} toggle={toggle} className="modal-xl">
							<ModalHeader toggle={toggle} tag="h4">
								{!!isEdit
									? t("edit") + " " + t("project")
									: t("add") + " " + t("project")}
							</ModalHeader>
							<ModalBody>
								<Form
									onSubmit={(e) => {
										e.preventDefault();
										validation.handleSubmit();
										return false;
									}}
								>
									<div className="mb-3">
										<Nav tabs>
											<NavItem>
												<NavLink
													className={classnames({
														active: activeTab === "1",
														"text-danger": tabErrors.tab1,
													})}
													onClick={() => {
														setActiveTab("1");
													}}
												>
													<i className="bx bx-info-circle me-1"></i>
													{t("basic_info")}
													{tabErrors.tab1 && <span className="ms-1">*</span>}
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													className={classnames({
														active: activeTab === "2",
														"text-danger": tabErrors.tab2,
													})}
													onClick={() => {
														setActiveTab("2");
													}}
												>
													<i className="bx bx-calendar me-1"></i>
													{t("project_details")}
													{tabErrors.tab2 && <span className="ms-1">*</span>}
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													className={classnames({
														active: activeTab === "3",
														"text-danger": tabErrors.tab3,
													})}
													onClick={() => {
														setActiveTab("3");
													}}
												>
													<i className="bx bx-note me-1"></i>
													{t("additional_info")}
												</NavLink>
											</NavItem>
										</Nav>

										<TabContent
											activeTab={activeTab}
											className="p-3 border border-top-0 rounded-bottom"
										>
											<TabPane tabId="1">
												<Col md={12}>
													<CascadingDropdowns
														validation={validation}
														dropdown1name="prj_location_region_id"
														dropdown2name="prj_location_zone_id"
														dropdown3name="prj_location_woreda_id"
														isEdit={isEdit}
														row
													/>
												</Col>
												<Col md={12} className="mb-3">
													<InputField
														type="textarea"
														validation={validation}
														fieldId={"prj_location_description"}
														isRequired={false}
														maxLength={400}
													/>
												</Col>
												<Row>
													<Col md={6} className="mb-3">
														<InputField
															type="text"
															validation={validation}
															fieldId={"prj_name"}
															isRequired={true}
															maxLength={200}
														/>
													</Col>
													<Col md={6}>
														<InputField
															type="text"
															validation={validation}
															fieldId={"prj_code"}
															isRequired={false}
															maxLength={20}
														/>
													</Col>
													<Col md={6} className="mb-3">
														<InputField
															type="text"
															validation={validation}
															fieldId={"prj_name_am"}
															isRequired={true}
															maxLength={200}
														/>
													</Col>
													<Col md={6}>
														<InputField
															type="text"
															validation={validation}
															fieldId={"prj_name_en"}
															isRequired={true}
															maxLength={200}
														/>
													</Col>
													<Col md={6}>
														<AsyncSelectField
															fieldId="prj_project_category_id"
															validation={validation}
															isRequired
															label={t("project_category")}
															optionMap={projectCategoryMap}
															isLoading={prCategoryLoading}
															isError={prCategoryIsError}
														/>
													</Col>
													<Col md={6}>
														<AsyncSelectField
															fieldId="prj_cluster_id"
															validation={validation}
															isRequired
															label={t("cluster")}
															optionMap={sectorCategoryMap}
															isLoading={isSectorCatLoading}
															isError={isSectorCatError}
														/>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="2">
												<Row>
													<Col md={6} className="mb-3">
														<DatePicker
															isRequired={true}
															componentId={"prj_start_date_plan_gc"}
															validation={validation}
														/>
													</Col>
													<Col md={6}>
														<DatePicker
															isRequired={true}
															componentId={"prj_end_date_plan_gc"}
															validation={validation}
															minDate={validation.values.prj_start_date_plan_gc}
														/>
													</Col>
													<Col md={6} className="mb-3">
														<DatePicker
															isRequired={true}
															componentId={"prj_start_date_gc"}
															validation={validation}
														/>
													</Col>
													<Col md={6}>
														<AsyncSelectField
															fieldId="prj_project_status_id"
															validation={validation}
															isRequired
															label={t("project_status")}
															optionMap={projectStatusMap}
															isLoading={prsIsLoading}
															isError={prsIsError}
														/>
													</Col>

													<Col md={6}>
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_total_estimate_budget"}
															isRequired={true}
															allowDecimal={true}
														/>
													</Col>
													<Col md={6}>
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_total_actual_budget"}
															isRequired={true}
															allowDecimal={true}
														/>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="3">
												<Row>
													<Col md={6} className="mb-3">
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_urban_ben_number"}
															isRequired={false}
															allowDecimal={false}
														/>
													</Col>
													<Col md={6}>
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_rural_ben_number"}
															isRequired={false}
															allowDecimal={false}
														/>
													</Col>
													<Col md={6} className="mb-3">
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_male_participant"}
															isRequired={false}
															allowDecimal={false}
														/>
													</Col>
													<Col md={6}>
														<FormattedAmountField
															validation={validation}
															fieldId={"prj_female_participant"}
															isRequired={false}
															allowDecimal={false}
														/>
													</Col>
													<Col md={6} className="mb-3">
														<InputField
															type="textarea"
															validation={validation}
															fieldId={"prj_job_opportunity"}
															isRequired={false}
															maxLength={400}
															rows={3}
														/>
													</Col>
													<Col md={6}>
														<InputField
															type="textarea"
															validation={validation}
															fieldId={"prj_outcome"}
															isRequired={false}
															maxLength={400}
															rows={3}
														/>
													</Col>
													<Col md={12}>
														<InputField
															type="textarea"
															validation={validation}
															fieldId={"prj_remark"}
															isRequired={false}
															maxLength={400}
															rows={3}
														/>
													</Col>
												</Row>
											</TabPane>
										</TabContent>
									</div>

									<Row className="mt-3">
										<Col className="text-end">
											<Button color="light" className="me-2" onClick={toggle}>
												{t("cancel")}
											</Button>
											<Button
												color="success"
												type="submit"
												disabled={
													addProject.isPending ||
													updateProject.isPending ||
													!validation.dirty
												}
											>
												{(addProject.isPending || updateProject.isPending) && (
													<Spinner size="sm" color="light" className="me-2" />
												)}
												{t("save")}
											</Button>
										</Col>
									</Row>
								</Form>
							</ModalBody>
						</Modal>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
ProjectModel.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};
export default ProjectModel;
