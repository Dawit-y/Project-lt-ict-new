import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useSearchProjects } from "../../queries/citizenship_project_query";
import { useSearchProjectCategorys } from "../../queries/projectcategory_query";
import { useTranslation } from "react-i18next";
import { Button, Badge } from "reactstrap";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists3";
import AdvancedSearch from "../../components/Common/AdvancedSearch2";
import { citizenshipProjectExportColumns } from "../../utils/exportColumnsForLists";
import { useCitizenProjectListState } from "../../hooks/useCitizenProjectListState";

const CitizenProjectList = () => {
	document.title = "Citizenship Projects List";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	// Redux state management
	const {
		citizenProjectListState,
		setTreeState,
		setSearchState,
		setPaginationState,
		setUIState,
		clearTreeSelection: clearTreeSelectionRedux,
		resetProjectListState,
	} = useCitizenProjectListState();

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
	} = citizenProjectListState;

	// Local state that doesn't need persistence
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);

	const advancedSearchRef = useRef(null);
	const treeRef = useRef(null);

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
				width: 200,
			},
			{
				field: "sector_name",
				headerName: t("prj_sector_id"),
				sortable: true,
				filter: "agTextColumnFilter",
				flex: 1,
				minWidth: 200,
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
				width: 150,
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
				width: 100,
				pinned: "right",
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
		return baseColumnDefs;
	}, [searchResults, t]);

	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs />
					<div className="w-100 d-flex gap-2">
						<TreeForLists
							ref={treeRef}
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
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
								add_name_en: "",
								add_name_am: "",
								name: "",
							}}
							initialInclude={include}
						/>
						{/* Main Content */}
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								ref={advancedSearchRef}
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

CitizenProjectList.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default CitizenProjectList;

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
				tableName="Citizenship Projects"
				exportColumns={citizenshipProjectExportColumns}
				exportSearchParams={exportSearchParams}
				paginationInfo={paginationInfo}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</>
	);
};
