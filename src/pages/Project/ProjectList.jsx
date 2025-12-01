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
import { Button, Badge } from "reactstrap";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists3";
import AdvancedSearch from "../../components/Common/AdvancedSearch2";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { getUserSectorList } from "../../queries/usersector_query";
import { projectExportColumns } from "../../utils/exportColumnsForLists";
import ProjectFormModal from "./ProjectFormModal";
import { toast } from "react-toastify";
import { useProjectListState } from "../../hooks/useProjectListsState";

const ProjectList = () => {
	document.title = "Projects List";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const {
		projectListState,
		setTreeState,
		setSearchState,
		setPaginationState,
		setUIState,
		clearTreeSelection: clearTreeSelectionRedux,
		resetProjectListState
	} = useProjectListState();

	// Extract state from Redux
	const {
		prjLocationRegionId,
		prjLocationZoneId,
		prjLocationWoredaId,
		nodeId,
		include,
		isCollapsed,
		searchParams,
		projectParams,
		exportSearchParams,
		pagination: reduxPagination,
		showSearchResult,
	} = projectListState;

	// Local state that doesn't need persistence
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedNode, setSelectedNode] = useState(null);

	const advancedSearchRef = useRef(null);
	const treeRef = useRef(null);
	const updateProject = useUpdateProject();

	// Create paginationInfo from Redux state for table component
	const paginationInfo = useMemo(
		() => ({
			current_page: reduxPagination.currentPage,
			per_page: reduxPagination.pageSize,
			total: reduxPagination.total || 0,
			total_pages: reduxPagination.totalPages || 0,
			has_next: reduxPagination.hasNext,
			has_prev: reduxPagination.hasPrev,
		}),
		[reduxPagination]
	);

	// Update projectParams when tree state changes
	useEffect(() => {
		const newProjectParams = {
			...(prjLocationRegionId && {
				prj_location_region_id: prjLocationRegionId,
			}),
			...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
			...(prjLocationWoredaId && {
				prj_location_woreda_id: prjLocationWoredaId,
			}),
			...(include === 1 && { include: include }),
		};

		setSearchState({ projectParams: newProjectParams });
	}, [
		prjLocationRegionId,
		prjLocationZoneId,
		prjLocationWoredaId,
		include,
		setSearchState,
	]);

	// Update tree selection handler
	const handleNodeSelect = useCallback(
		(node) => {
			const treeState = { nodeId: node.id };

			if (node.level === "region") {
				treeState.prjLocationRegionId = node.id;
				treeState.prjLocationZoneId = null;
				treeState.prjLocationWoredaId = null;
			} else if (node.level === "zone") {
				treeState.prjLocationZoneId = node.id;
				treeState.prjLocationWoredaId = null;
			} else if (node.level === "woreda") {
				treeState.prjLocationWoredaId = node.id;
			}

			setTreeState(treeState);
			setUIState({ showSearchResult: false });
		},
		[setTreeState, setUIState]
	);

	// Update clear tree selection
	const clearTreeSelection = useCallback(() => {
		if (treeRef.current) {
			treeRef.current.clearSelection();
		}
		clearTreeSelectionRedux();
		setSearchState({ projectParams: {} });
	}, [clearTreeSelectionRedux, setSearchState]);

	// Update search handler
	const handleSearch = useCallback(
		({ data, error }) => {
			setSearchResults(data);
			setSearchError(error);
			setUIState({ showSearchResult: true });

			if (data?.pagination) {
				// Update Redux pagination with server data
				setPaginationState({
					currentPage: data.pagination.current_page,
					pageSize: data.pagination.per_page,
					total: data.pagination.total,
					totalPages: data.pagination.total_pages,
				});
			}
		},
		[setUIState, setPaginationState]
	);

	// Update pagination handlers using Redux actions
	const handlePageChange = useCallback(
		(newPage) => {
			setPaginationState({ currentPage: newPage });
		},
		[setPaginationState]
	);

	const handlePageSizeChange = useCallback(
		(newSize) => {
			setPaginationState({
				currentPage: 1,
				pageSize: newSize,
			});
		},
		[setPaginationState]
	);

	const handleSearchLabels = (labels) => {
		setSearchState({ exportSearchParams: labels });
	};

	const handleClear = () => {
		clearTreeSelection(); 
		resetProjectListState(); 
	};

	const toggleEditModal = () => {
		setIsEditModalOpen(!isEditModalOpen);
		if (isEditModalOpen) {
			setSelectedProject(null);
		}
	};

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

	const handleEditClick = (projectData) => {
		setSelectedProject(projectData);
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
					prj_sector_id: Number(values.prj_sector_id),
					prj_location_region_id: Number(values.prj_location_region_id),
					prj_location_zone_id: Number(values.prj_location_zone_id),
					prj_location_woreda_id: Number(values.prj_location_woreda_id),
					prj_location_kebele_id: values.prj_location_kebele_id,
					prj_location_description: values.prj_location_description,
					prj_owner_region_id: Number(values.prj_owner_region_id),
					prj_owner_zone_id: Number(values.prj_owner_region_id),
					prj_owner_woreda_id: Number(values.prj_owner_region_id),
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
					parent_id: Number(values.prj_parent_id),
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
							ref={treeRef}
							onNodeSelect={handleNodeSelect}
							setInclude={(newInclude) => setTreeState({ include: newInclude })}
							setIsCollapsed={(collapsed) =>
								setUIState({ isCollapsed: collapsed })
							}
							isCollapsed={isCollapsed}
							initialSelection={{
								id:
									prjLocationRegionId ||
									prjLocationZoneId ||
									prjLocationWoredaId,
								nodeId: nodeId || null,
								level: prjLocationWoredaId
									? "woreda"
									: prjLocationZoneId
										? "zone"
										: "region",
								add_name_en: "", // You might want to store these in Redux too
								add_name_am: "",
								name: "",
							}}
							initialInclude={include}
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
								setAdditionalParams={(params) =>
									setSearchState({ projectParams: params })
								}
								setSearchResults={setSearchResults}
								onSearchResult={handleSearch}
								onSearchLabels={handleSearchLabels}
								setShowSearchResult={(show) =>
									setUIState({ showSearchResult: show })
								}
								setIsSearchLoading={setIsSearchLoading}
								searchParams={searchParams}
								getSearchParams={(params) =>
									setSearchState({ searchParams: params })
								}
								setExportSearchParams={(params) =>
									setSearchState({ exportSearchParams: params })
								}
								// Pass persisted pagination from Redux
								pagination={reduxPagination}
								onPaginationChange={setPaginationState}
								onClear={handleClear}
								initialSearchParams={searchParams}
								initialAdditionalParams={projectParams}
								initialPagination={reduxPagination}
							>
								<TableWrapper
									columnDefs={columnDefs}
									showSearchResult={showSearchResult}
									exportSearchParams={exportSearchParams}
									paginationInfo={paginationInfo}
									onPageChange={handlePageChange}
									onPageSizeChange={handlePageSizeChange}
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
	paginationInfo,
	onPageChange,
	onPageSizeChange,
}) => {
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
				isAddButton={false}
				rowHeight={36}
				addButtonText="Add"
				isExcelExport={true}
				isPdfExport={true}
				isPrint={true}
				tableName="Projects"
				exportColumns={projectExportColumns}
				exportSearchParams={exportSearchParams}
				paginationInfo={paginationInfo}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</>
	);
};
