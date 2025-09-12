import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
	useSearchOnlyProjects,
	useUpdateProject,
} from "../../queries/project_query";
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useTranslation } from "react-i18next";
import { Button, Badge, Spinner } from "reactstrap";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists2";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { useFetchAddressStructures } from "../../queries/address_structure_query";
import { getUserSectorList } from "../../queries/usersector_query";
import { projectExportColumns } from "../../utils/exportColumnsForLists";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useSearchParamConverter } from "../../hooks/useSearchParamConverter";
import ProjectFormModal from "./ProjectFormModal";
import { toast } from "react-toastify";

const ProjectList = () => {
	document.title = "Projects List";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	// State variables
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [include, setInclude] = useState(0);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [params, setParams] = useState({});
	const [searchParams, setSearchParams] = useState({});
	const [exportSearchParams, setExportSearchParams] = useState({});

	// Modal state variables
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedNode, setSelectedNode] = useState(null);

	const advancedSearchRef = useRef(null);
	const { userId } = useAuthUser();
	const { regions, zones, woredas } = useFetchAddressStructures(userId);

	// Mutation hook for updating project
	const updateProject = useUpdateProject();

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

	// sector information
	const { data: sectorInformationData } = getUserSectorList();
	const {
		sci_name_en: sectorInformationOptionsEn,
		sci_name_or: sectorInformationOptionsOr,
		sci_name_am: sectorInformationOptionsAm,
	} = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
		"sci_name_en",
		"sci_name_or",
		"sci_name_am",
	]);

	// project category options
	const { data: projectCategoryData } = useFetchProjectCategorys();
	const filteredCategoryData = useMemo(() => {
		return projectCategoryData?.data?.filter(
			(category) => category.pct_owner_type_id === 1
		);
	}, [projectCategoryData?.data]);

	const {
		pct_name_en: projectCategoryOptionsEn,
		pct_name_or: projectCategoryOptionsOr,
		pct_name_am: projectCategoryOptionsAm,
	} = createMultiSelectOptions(filteredCategoryData || [], "pct_id", [
		"pct_name_en",
		"pct_name_or",
		"pct_name_am",
	]);

	// project status options
	const { data: projectStatusData } = useFetchProjectStatuss();
	const {
		prs_status_name_en: projectStatusOptionsEn,
		prs_status_name_or: projectStatusOptionsOr,
		prs_status_name_am: projectStatusOptionsAm,
	} = createMultiSelectOptions(
		projectStatusData?.data?.filter((type) => type.prs_id >= 1) || [],
		"prs_id",
		["prs_status_name_en", "prs_status_name_or", "prs_status_name_am"]
	);

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

	const handleSearch = useCallback(({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	}, []);

	// Function to get search parameters from AdvancedSearch
	const getSearchParams = useCallback(() => {
		if (advancedSearchRef.current) {
			return advancedSearchRef.current.getSearchValues
				? advancedSearchRef.current.getSearchValues()
				: {};
		}
		return {};
	}, []);

	// Update export search params whenever search is performed
	useEffect(() => {
		if (showSearchResult) {
			const searchValues = getSearchParams();
			setExportSearchParams({
				...searchValues,
				...projectParams,
			});
		}
	}, [showSearchResult, getSearchParams, projectParams]);

	// Memoize the converter config to prevent unnecessary recreations
	const converterConfig = useMemo(
		() => ({
			lang,
			dataSources: {
				prj_project_category_id: {
					dataSource: filteredCategoryData || [],
					idKey: "pct_id",
					nameKey:
						lang === "en"
							? "pct_name_en"
							: lang === "am"
								? "pct_name_am"
								: "pct_name_or",
				},
				prj_project_status_id: {
					dataSource:
						projectStatusData?.data?.filter((type) => type.prs_id >= 1) || [],
					idKey: "prs_id",
					nameKey:
						lang === "en"
							? "prs_status_name_en"
							: lang === "am"
								? "prs_status_name_am"
								: "prs_status_name_or",
				},
				prj_sector_id: {
					dataSource: sectorInformationData?.data || [],
					idKey: "sci_id",
					nameKey:
						lang === "en"
							? "sci_name_en"
							: lang === "am"
								? "sci_name_am"
								: "sci_name_or",
				},
				prj_location_region_id: {
					dataSource: regions || [],
					idKey: "id",
					nameKey:
						lang === "en"
							? "add_name_en"
							: lang === "am"
								? "add_name_am"
								: "add_name",
				},
				prj_location_zone_id: {
					dataSource: zones || [],
					idKey: "id",
					nameKey:
						lang === "en"
							? "add_name_en"
							: lang === "am"
								? "add_name_am"
								: "add_name",
				},
				prj_location_woreda_id: {
					dataSource: woredas || [],
					idKey: "id",
					nameKey:
						lang === "en"
							? "add_name_en"
							: lang === "am"
								? "add_name_am"
								: "add_name",
				},
			},
		}),
		[
			lang,
			filteredCategoryData,
			projectStatusData?.data,
			sectorInformationData?.data,
			regions,
			zones,
			woredas,
		]
	);

	const { convertSearchParamsToReadable } =
		useSearchParamConverter(converterConfig);

	// Update export search params with readable names
	useEffect(() => {
		if (showSearchResult) {
			const searchValues = getSearchParams();
			const combinedParams = {
				...searchValues,
				...projectParams,
			};

			const readableParams = convertSearchParamsToReadable(combinedParams);
			setExportSearchParams(readableParams);
		}
	}, [
		showSearchResult,
		getSearchParams,
		projectParams,
		convertSearchParamsToReadable,
	]);

	// Modal handlers
	const toggleEditModal = () => {
		setIsEditModalOpen(!isEditModalOpen);
		if (isEditModalOpen) {
			setSelectedProject(null);
		}
	};

	const handleEditClick = (projectData) => {
		setSelectedProject(projectData);

		// Create a mock selectedNode based on the project data
		const mockNode = {
			data: {
				pri_id: projectData.parent_id || 0,
				woreda_id: projectData.prj_location_woreda_id,
				region_id: projectData.prj_location_region_id,
				zone_id: projectData.prj_location_zone_id,
				sector_id: projectData.prj_sector_id,
				level: "output",
			},
		};
		setSelectedNode(mockNode);

		setIsEditModalOpen(true);
	};

	const handleSubmit = async (values, isEdit, project, selectedNode) => {
		if (isEdit) {
			try {
				const updateProjectData = {
					prj_id: project.prj_id,
					prj_name: values.prj_name,
					prj_name_am: values.prj_name_am,
					prj_name_en: values.prj_name_en,
					prj_code: values.prj_code,
					prj_project_status_id: values.prj_project_status_id,
					prj_project_category_id: values.prj_project_category_id,
					prj_project_budget_source_id: values.prj_project_budget_source_id,
					prj_total_estimate_budget: parseFloat(
						values.prj_total_estimate_budget
					),
					prj_total_actual_budget: parseFloat(values.prj_total_actual_budget),
					prj_geo_location: values.prj_geo_location,
					prj_sector_id: Number(selectedNode?.data?.sector_id),
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(selectedNode.data.region_id),
					prj_owner_zone_id: Number(selectedNode.data.zone_id),
					prj_owner_woreda_id: Number(selectedNode.data.woreda_id),
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
					prj_urban_ben_number: values.prj_urban_ben_number,
					prj_rural_ben_number: values.prj_rural_ben_number,
					prj_program_id: 1,
					parent_id: Number(selectedNode.data.pri_id),
					object_type_id: 5,
					prj_measurement_unit: values.prj_measurement_unit,
					prj_measured_figure: values.prj_measured_figure,
				};

				await updateProject.mutateAsync(updateProjectData);
				toast.success(t("update_success"), {
					autoClose: 3000,
				});
				toggleEditModal();
				if (showSearchResult && advancedSearchRef.current) {
					await advancedSearchRef.current.refreshSearch();
				}
			} catch (error) {
				if (!error.handledByMutationCache) {
					toast.error(t("update_failure"), { autoClose: 3000 });
				}
			}
		}
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
				pinned: "left",
			},
			{
				field: "prj_name",
				headerName: t("prj_name"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 200,
				pinned: "left",
			},
			{
				field: "prj_code",
				headerName: t("prj_code"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 150,
			},
			{
				field: "zone_name",
				headerName: t("prj_owner_zone_id"),
				sortable: true,
				filter: "agTextColumnFilter",
			},
			{
				field: "sector_name",
				headerName: t("prj_sector_id"),
				sortable: true,
				filter: "agTextColumnFilter",
				cellStyle: {
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					overflow: "hidden",
					padding: 0,
				},
				flex: 1,
				minWidth: 200,
			},
			{
				headerName: t("prs_status"),
				field: "status_name",
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
						return params.value ? `$${params.value.toLocaleString()}` : "";
					}
					return params.value ? `${params.value.toLocaleString()}` : "";
				},
			},
			{
				headerName: t("Action"),
				sortable: false,
				filter: false,
				width: 120,
				pinned: "right",
				cellRenderer: (params) => {
					if (params.node.footer) {
						return ""; // Suppress button for footer
					}
					return (
						<div className="d-flex gap-1">
							<Button
								color="None"
								size="sm"
								className="text-success"
								onClick={() => handleEditClick(params.data)}
							>
								<i className="mdi mdi-pencil font-size-18" />
							</Button>
							<Link to={`/projectdetail/${params.data.prj_id}`}>
								<Button type="button" className="btn-sm mb-1 default" outline>
									<i className="fa fa-eye"></i>
								</Button>
							</Link>
						</div>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [t]);

	return (
		<React.Fragment>
			<div className="page-content">
				<div className="w-100">
					<Breadcrumbs />
					<ProjectFormModal
						isOpen={isEditModalOpen}
						toggle={toggleEditModal}
						isEdit={true}
						project={selectedProject}
						selectedNode={selectedNode}
						onSubmit={handleSubmit}
						projectsData={searchResults}
						isLoading={updateProject.isPending}
					/>
					<div className="d-flex gap-2 flex-nowrap">
						{/* Sidebar - Tree */}
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setInclude={setInclude}
							setIsCollapsed={setIsCollapsed}
							isCollapsed={isCollapsed}
						/>
						{/* Main Content */}
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								ref={advancedSearchRef}
								searchHook={useSearchOnlyProjects}
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
									{
										key: "prj_project_status_id",
										options:
											lang === "en"
												? projectStatusOptionsEn
												: lang === "am"
													? projectStatusOptionsAm
													: projectStatusOptionsOr,
									},
									{
										key: "prj_sector_id",
										options:
											lang === "en"
												? sectorInformationOptionsEn
												: lang === "am"
													? sectorInformationOptionsAm
													: sectorInformationOptionsOr,
									},
								]}
								checkboxSearchKeys={[]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								setSearchResults={handleSearch}
								onSearchResult={handleSearch}
								setShowSearchResult={setShowSearchResult}
								setIsSearchLoading={setIsSearchLoading}
								params={params}
								setParams={setParams}
								searchParams={searchParams}
								setSearchParams={setSearchParams}
							>
								<TableWrapper
									columnDefs={columnDefs}
									showSearchResult={showSearchResult}
									exportSearchParams={exportSearchParams}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProjectList;

const TableWrapper = ({
	data,
	isLoading,
	columnDefs,
	showSearchResult,
	exportSearchParams,
}) => {
	return (
		<>
			<AgGridContainer
				rowData={showSearchResult ? data?.data || [] : []}
				columnDefs={columnDefs}
				isLoading={isLoading}
				isPagination={true}
				paginationPageSize={10}
				isGlobalFilter={true}
				isAddButton={false}
				rowHeight={36}
				addButtonText="Add"
				isExcelExport={true}
				isPdfExport={true}
				isPrint={true}
				tableName="Projects"
				exportColumns={projectExportColumns}
				exportSearchParams={exportSearchParams}
			/>
		</>
	);
};
