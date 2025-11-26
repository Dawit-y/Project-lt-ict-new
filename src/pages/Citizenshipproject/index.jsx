import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { useTranslation } from "react-i18next";
import { Button, Badge, UncontrolledTooltip } from "reactstrap";
import {
	createSelectOptions,
	createMultiSelectOptions,
} from "../../utils/commonMethods";
import TreeForLists from "../../components/Common/TreeForLists2";
import AgGridContainer from "../../components/Common/AgGridContainer";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import CitizenshipProjectForm from "./FormModal";
import { useCitizenProjectState } from "../../hooks/useCitizenProjectState";

const ProjectModel = () => {
	document.title = "Citizenship Projects";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	// State management
	const [modal, setModal] = useState(false);
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
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [exportSearchParams, setExportSearchParams] = useState({});
	const [pagination, setPagination] = useState({
		currentPage: 1,
		pageSize: 10,
	});
	const [paginationInfo, setPaginationInfo] = useState({
		current_page: 1,
		per_page: 10,
		total: 0,
		total_pages: 0,
		has_next: false,
		has_prev: false,
	});

	// Data fetching
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

	// Mutations
	const addProject = useAddProject();
	const updateProject = useUpdateProject();
	const deleteProject = useDeleteProject();

	// Effects
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

	// Handlers
	const handleAddProject = async (data) => {
		try {
			await addProject.mutateAsync(data);
			toast.success(t("add_success"), {
				autoClose: 3000,
			});
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("add_failure"), { autoClose: 3000 });
			}
		}
	};

	const handleUpdateProject = async (data) => {
		try {
			await updateProject.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
			toggle();
		} catch (error) {
			if (!error.handledByMutationCache) {
				toast.error(t("update_failure"), { autoClose: 3000 });
			}
		}
	};

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

			setPagination((prev) => ({
				...prev,
				currentPage: 1,
			}));

			if (showSearchResult) {
				setShowSearchResult(false);
			}
		},
		[showSearchResult]
	);

	const handleSearch = useCallback(({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
		if (data?.pagination) {
			setPaginationInfo(data.pagination);
			setPagination((prev) => ({
				...prev,
				currentPage: data.pagination.current_page,
			}));
		}
	}, []);

	const handlePageChange = (newPage) => {
		setPagination((prev) => ({
			...prev,
			currentPage: newPage,
		}));
	};

	const handlePageSizeChange = (newSize) => {
		setPagination({
			currentPage: 1,
			pageSize: newSize,
		});

		setPaginationInfo((prev) => ({
			...prev,
			per_page: newSize,
			current_page: 1,
		}));
	};

	useEffect(() => {
		setPagination((prev) => ({
			...prev,
			currentPage: 1,
		}));
	}, [projectParams]);

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
	};

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
			is_deletable: project.is_deletable,
			is_editable: project.is_editable,
			prj_male_participant: project.prj_male_participant,
			prj_female_participant: project.prj_female_participant,
			prj_job_opportunity: project.prj_job_opportunity,
		});
		setIsEdit(true);
		toggle();
	};

	const handleProjectClicks = () => {
		setIsEdit(false);
		setProject("");
		toggle();
	};

	// Column definitions
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
						return params.value ? `$${params.value.toLocaleString()}` : "";
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
						return "";
					}
					const { prj_id } = params.data || {};
					return (
						<Link to={`/citizenship_project_detail/${prj_id}`}>
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
						<div className="d-flex gap-1">
							{searchResults?.previledge?.is_role_editable == 1 &&
								params.data?.is_editable == 1 && (
									<Button
										color="Link"
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
									</Button>
								)}
						</div>
					);
				},
			});
		}
		return baseColumnDefs;
	}, [handleProjectClick, t, searchResults]);

	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs />
					<div className="w-100 d-flex gap-2">
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setInclude={setInclude}
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
						/>
						<SearchTableContainer isCollapsed={isCollapsed}>
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
								onSearchResult={handleSearch}
								onSearchLabels={handleSearchLabels}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
								setExportSearchParams={setExportSearchParams}
								pagination={pagination}
								onPaginationChange={setPagination}
								setPaginationInfo={setPaginationInfo}
							>
								<AgGridContainer
									rowData={showSearchResult ? searchResults?.data : []}
									columnDefs={columnDefs}
									isLoading={isSearchLoading}
									isAddButton={prjLocationWoredaId}
									onAddClick={handleProjectClicks}
									isPagination={false}
									isServerSidePagination={true}
									rowHeight={35}
									paginationPageSize={10}
									isGlobalFilter={true}
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName="Projects"
									includeKey={["prj_name", "prj_code"]}
									excludeKey={["is_editable", "is_deletable"]}
									exportSearchParams={exportSearchParams}
									paginationInfo={paginationInfo}
									onPageChange={handlePageChange}
									onPageSizeChange={handlePageSizeChange}
								/>
							</AdvancedSearch>
						</SearchTableContainer>

						{/* Form Modal */}
						<CitizenshipProjectForm
							isOpen={modal}
							toggle={toggle}
							project={project}
							isEdit={isEdit}
							onSave={handleAddProject}
							onUpdate={handleUpdateProject}
							searchResults={searchResults}
							projectCategoryData={projectCategoryData}
							prCategoryLoading={prCategoryLoading}
							prCategoryIsError={prCategoryIsError}
							prjLocationRegionId={prjLocationRegionId}
							prjLocationZoneId={prjLocationZoneId}
							prjLocationWoredaId={prjLocationWoredaId}
							lang={lang}
						/>
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
