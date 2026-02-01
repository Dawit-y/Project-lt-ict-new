import React, {
	useMemo,
	useState,
	useRef,
	lazy,
	Suspense,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { Button, Badge, UncontrolledTooltip } from "reactstrap";
import Spinners from "../../../components/Common/Spinner";
import { FaGavel, FaChartLine, FaPaperclip, FaPenSquare } from "react-icons/fa";
const Breadcrumbs = lazy(() => import("../../../components/Common/Breadcrumb"));
const AdvancedSearch2 = lazy(
	() => import("../../../components/Common/AdvancedSearch2"),
);
const TreeForLists3 = lazy(
	() => import("../../../components/Common/TreeForLists3"),
);
const AttachFileModal = lazy(
	() => import("../../../components/Common/AttachFileModal"),
);
const ConvInfoModal = lazy(
	() => import("../../Conversationinformation/ConvInfoModal"),
);
const SingleAnalysisModal = lazy(
	() => import("../Analysis/SingleAnalysisModal"),
);
const TotalAnalysisModal = lazy(() => import("../Analysis/TotalAnalysisModal"));
const AgGridContainer = lazy(
	() => import("../../../components/Common/AgGridContainer"),
);
import { useSearchBudgetRequestforApproval } from "../../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../../queries/budgetyear_query";
import { useSearchRequestCategorys } from "../../../queries/requestcategory_query";
import { useFetchSectorCategorys } from "../../../queries/sectorcategory_query";
import { useFetchRequestFollowups } from "../../../queries/requestfollowup_query";
import { useFetchRequestStatuss } from "../../../queries/requeststatus_query";
import { PAGE_ID } from "../../../constants/constantFile";
import { useFetchProjectStatuss } from "../../../queries/projectstatus_query";
import { getUserSectorList } from "../../../queries/usersector_query";
import {
	createSelectOptions,
	createMultiSelectOptions,
} from "../../../utils/commonMethods";
import SearchTableContainer from "../../../components/Common/SearchTableContainer";
import { approverBdrExportColumns } from "../../../utils/exportColumnsForLists";
import { useBudgetRequestListState } from "../../../hooks/useBudgetRequestListState";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ApproverBudgetRequestList = () => {
	document.title = "Budget Request List";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const {
		budgetRequestListState,
		setTreeState,
		setSearchState,
		setPaginationState,
		setUIState,
		clearTreeSelection: clearTreeSelectionRedux,
		resetBudgetRequestListState,
	} = useBudgetRequestListState();

	// Extract state from Redux
	const {
		prjLocationRegionId,
		prjLocationZoneId,
		prjLocationWoredaId,
		nodeId,
		include,
		isCollapsed,
		searchParams,
		budgetRequestParams,
		exportSearchParams,
		pagination: reduxPagination,
		showSearchResult,
	} = budgetRequestListState;

	// Local state for non-persistent data
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);
	const [singleAnalysisModal, setSingleAnalysisModal] = useState(false);
	const [totalAnalysisModal, setTotalAnalysisModal] = useState(false);
	const [transaction, setTransaction] = useState({});
	const [selectedRequest, setSelectedRequest] = useState(null);

	const advancedSearchRef = useRef(null);
	const treeRef = useRef(null);

	// Pagination info for table component
	const paginationInfo = useMemo(
		() => ({
			current_page: reduxPagination.currentPage,
			per_page: reduxPagination.pageSize,
			total: reduxPagination.total || 0,
			total_pages: reduxPagination.totalPages || 0,
			has_next: reduxPagination.hasNext,
			has_prev: reduxPagination.hasPrev,
		}),
		[reduxPagination],
	);

	// Tree parameters
	const treeParams = useMemo(
		() => ({
			...(prjLocationRegionId && {
				prj_location_region_id: prjLocationRegionId,
			}),
			...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
			...(prjLocationWoredaId && {
				prj_location_woreda_id: prjLocationWoredaId,
			}),
			...(include === 1 && { include: include }),
		}),
		[prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include],
	);

	// Tree node selection handler
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
		[setTreeState, setUIState],
	);

	// Clear tree selection
	const clearTreeSelection = useCallback(() => {
		if (treeRef.current) {
			treeRef.current.clearSelection();
		}
		clearTreeSelectionRedux();
		setSearchState({ budgetRequestParams: {} });
	}, [clearTreeSelectionRedux, setSearchState]);

	// Search handler
	const handleSearch = useCallback(
		({ data, error }) => {
			setSearchResults(data);
			setSearchError(error);
			setUIState({ showSearchResult: true });
			if (data?.pagination) {
				setPaginationState({
					currentPage: data.pagination.current_page,
					pageSize: data.pagination.per_page,
					total: data.pagination.total,
					totalPages: data.pagination.total_pages,
					hasNext: data.pagination.has_next || false,
					hasPrev: data.pagination.has_prev || false,
				});
			}
		},
		[setUIState, setPaginationState],
	);

	// Pagination handlers
	const handlePageChange = useCallback(
		(newPage) => {
			setPaginationState({ currentPage: newPage });
		},
		[setPaginationState],
	);

	const handlePageSizeChange = useCallback(
		(newSize) => {
			setPaginationState({
				currentPage: 1,
				pageSize: newSize,
			});
		},
		[setPaginationState],
	);

	const handleSearchLabels = (labels) => {
		setSearchState({ exportSearchParams: labels });
	};

	const handleClear = () => {
		clearTreeSelection();
		resetBudgetRequestListState();
	};

	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);
	const toggleSingleAnalysisModal = () => {
		setSingleAnalysisModal(!singleAnalysisModal);
		if (!singleAnalysisModal) {
			setSelectedRequest(null);
		}
	};
	const toggleTotalAnalysisModal = () =>
		setTotalAnalysisModal(!totalAnalysisModal);

	// Data fetching hooks
	const { data: budgetYearData } = useFetchBudgetYears();
	const param = { gov_active: "1" };
	const { data: bgCategoryOptionsData } = useSearchRequestCategorys(param);
	const { data: projectStatusData } = useFetchProjectStatuss();
	const { data: requestStatus } = useFetchRequestStatuss();
	const { data: sectorInformationData } = getUserSectorList();
	const { data: sectorCategoryData } = useFetchSectorCategorys();

	// Options for dropdowns
	const {
		sci_name_en: sectorInfoOptionsEn,
		sci_name_or: sectorInfoOptionsOr,
		sci_name_am: sectorInfoOptionsAm,
	} = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
		"sci_name_en",
		"sci_name_or",
		"sci_name_am",
	]);

	const {
		rqs_name_en: requestStatusOptionsEn,
		rqs_name_or: requestStatusOptionsOr,
		rqs_name_am: requestStatusOptionsAm,
	} = createMultiSelectOptions(requestStatus?.data || [], "rqs_id", [
		"rqs_name_en",
		"rqs_name_or",
		"rqs_name_am",
	]);

	const budgetYearOptions = createSelectOptions(
		budgetYearData?.data || [],
		"bdy_id",
		"bdy_name",
	);

	const sectorCategoryOptions = createSelectOptions(
		sectorCategoryData?.data || [],
		"psc_id",
		"psc_name",
	);

	const {
		rqc_name_en: requestCategoryOptionsEn,
		rqc_name_or: requestCategoryOptionsOr,
		rqc_name_am: requestCategoryOptionsAm,
	} = createMultiSelectOptions(bgCategoryOptionsData?.data || [], "rqc_id", [
		"rqc_name_en",
		"rqc_name_or",
		"rqc_name_am",
	]);

	const projectStatusOptions = useMemo(() => {
		return (
			projectStatusData?.data
				?.filter((type) => type.prs_id === 5 || type.prs_id === 6)
				.map((type) => ({
					label: type.prs_status_name_or,
					value: type.prs_id,
				})) || []
		);
	}, [projectStatusData]);

	const isMutable = ![3, 4].includes(parseInt(transaction?.bdr_request_status));

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
				pinned: "left",
			},
			{
				headerName: t("prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				pinned: "left",
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("bdr_budget_year_id"),
				field: "bdy_name",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bdy_name, 30) || "-";
				},
			},
			{
				headerName: t("prj_code"),
				field: "prj_code",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 30) || "-";
				},
			},
			{
				headerName: t("bdr_requested_amount"),
				field: "bdr_requested_amount",
				sortable: true,
				filter: true,
				valueFormatter: (params) => {
					if (params.value != null) {
						return new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(params.value);
					}
					return "0.00";
				},
			},
			{
				headerName: t("bdr_requested_date_gc"),
				field: "bdr_requested_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				cellRenderer: (params) => {
					return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("bdr_released_amount"),
				field: "bdr_released_amount",
				sortable: true,
				filter: true,
				valueFormatter: (params) => {
					if (params.value != null) {
						return new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(params.value);
					}
					return "0.00";
				},
			},
			{
				headerName: t("bdr_released_date_gc"),
				field: "bdr_released_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				cellRenderer: (params) => {
					return truncateText(params.data.bdr_released_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("forwarded"),
				field: "forwarded",
				sortable: true,
				filter: true,
				width: 130,
				cellRenderer: (params) => {
					const isForwarded = params.data.forwarded;
					return (
						<Badge
							className={`font-size-12 badge-soft-${
								isForwarded ? "danger" : "secondary"
							}`}
						>
							{isForwarded ? t("forwarded") : t("not_forwarded")}
						</Badge>
					);
				},
			},
			{
				headerName: t("status"),
				field: "status_name",
				sortable: true,
				filter: true,
				width: 130,
				cellRenderer: (params) => {
					const { status_name, color_code } = params.data;
					return <Badge color={color_code}>{status_name}</Badge>;
				},
			},
			{
				headerName: t("actions"),
				field: "actions",
				width: 170,
				pinned: "right",
				sortable: false,
				filter: false,
				cellRenderer: (params) => {
					const data = params.data;
					return (
						<div className="d-flex gap-1">
							<Button
								tag={Link}
								to={`/budget_request_approval/${data.bdr_id}`}
								id={`takeAction-${data.bdr_id}`}
								color="light"
								size="sm"
							>
								<FaGavel />
							</Button>
							<UncontrolledTooltip target={`takeAction-${data.bdr_id}`}>
								{t("take_action")}
							</UncontrolledTooltip>
							<Button
								id={`view-${data.bdr_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleSingleAnalysisModal();
									setSelectedRequest(data);
								}}
							>
								<FaChartLine />
							</Button>
							<UncontrolledTooltip target={`view-${data.bdr_id}`}>
								{t("analysis")}
							</UncontrolledTooltip>
							<Button
								id={`attachFiles-${data.bdr_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleFileModal();
									setTransaction(data);
								}}
							>
								<FaPaperclip />
							</Button>
							<UncontrolledTooltip target={`attachFiles-${data.bdr_id}`}>
								{t("attach_files")}
							</UncontrolledTooltip>
							<Button
								id={`notes-${data.bdr_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleConvModal();
									setTransaction(data);
								}}
							>
								<FaPenSquare />
							</Button>
							<UncontrolledTooltip target={`notes-${data.bdr_id}`}>
								{t("Notes")}
							</UncontrolledTooltip>
						</div>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [t, toggleSingleAnalysisModal, toggleFileModal, toggleConvModal]);

	return (
		<Suspense fallback={<Spinners />}>
			<React.Fragment>
				<AttachFileModal
					isOpen={fileModal}
					toggle={toggleFileModal}
					projectId={transaction?.bdr_project_id}
					ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
					ownerId={transaction?.bdr_id}
					canAdd={isMutable}
					canEdit={isMutable}
					canDelete={isMutable}
				/>
				<ConvInfoModal
					isOpen={convModal}
					toggle={toggleConvModal}
					ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
					ownerId={transaction?.bdr_id}
					canAdd={isMutable}
					canEdit={isMutable}
					canDelete={isMutable}
				/>
				<div className="page-content">
					<div className="">
						<Breadcrumbs />
						<div className="w-100 d-flex gap-2 flex-nowrap">
							<TreeForLists3
								ref={treeRef}
								onNodeSelect={handleNodeSelect}
								setInclude={(newInclude) =>
									setTreeState({ include: newInclude })
								}
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
							<SearchTableContainer isCollapsed={isCollapsed}>
								<AdvancedSearch2
									ref={advancedSearchRef}
									searchHook={useSearchBudgetRequestforApproval}
									textSearchKeys={["prj_name"]}
									dropdownSearchKeys={[
										{
											key: "bdr_budget_year_id",
											options: budgetYearOptions,
										},
										{
											key: "bdr_request_category_id",
											options:
												lang === "en"
													? requestCategoryOptionsEn
													: lang === "am"
														? requestCategoryOptionsAm
														: requestCategoryOptionsOr,
										},
										{
											key: "bdr_request_type",
											options: projectStatusOptions,
										},
										{
											key: "prj_sector_id",
											options:
												lang === "en"
													? sectorInfoOptionsEn
													: lang === "am"
														? sectorInfoOptionsAm
														: sectorInfoOptionsOr,
										},
										{
											key: "prj_sector_category_id",
											options: sectorCategoryOptions,
										},
										{
											key: "bdr_request_status",
											options:
												lang === "en"
													? requestStatusOptionsEn
													: lang === "am"
														? requestStatusOptionsAm
														: requestStatusOptionsOr,
										},
									]}
									additionalParams={treeParams}
									setAdditionalParams={(params) =>
										setSearchState({ budgetRequestParams: params })
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
									initialAdditionalParams={budgetRequestParams}
									initialPagination={reduxPagination}
									checkboxSearchKeys={[]}
									dropdownSearchKeys2={[]}
								>
									<TableWrapper
										columnDefs={columnDefs}
										showSearchResult={showSearchResult}
										exportSearchParams={exportSearchParams}
										selectedRequest={selectedRequest}
										singleAnalysisModal={singleAnalysisModal}
										totalAnalysisModal={totalAnalysisModal}
										toggleSingleAnalysisModal={toggleSingleAnalysisModal}
										toggleTotalAnalysisModal={toggleTotalAnalysisModal}
										paginationInfo={paginationInfo}
										onPageChange={handlePageChange}
										onPageSizeChange={handlePageSizeChange}
									/>
								</AdvancedSearch2>
							</SearchTableContainer>
						</div>
					</div>
				</div>
			</React.Fragment>
		</Suspense>
	);
};

ApproverBudgetRequestList.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default ApproverBudgetRequestList;

const TableWrapper = ({
	data,
	isLoading,
	columnDefs,
	showSearchResult,
	exportSearchParams,
	selectedRequest,
	singleAnalysisModal,
	totalAnalysisModal,
	toggleSingleAnalysisModal,
	toggleTotalAnalysisModal,
	paginationInfo,
	onPageChange,
	onPageSizeChange,
}) => {
	const { departmentId } = useAuthUser();
	const { data: rqfData } = useFetchRequestFollowups();
	const { t } = useTranslation();

	function markForwardedRequests(
		budgetRequests = [],
		forwardedRequests = [],
		departmentId,
	) {
		const forwardedSet = new Set(
			forwardedRequests
				.filter((req) => req.rqf_forwarding_dep_id === departmentId)
				.map((req) => req.rqf_request_id),
		);

		return budgetRequests.map((request) => ({
			...request,
			forwarded: forwardedSet.has(request.bdr_id),
		}));
	}

	let transformedData = data?.data || [];
	if (data?.data && rqfData?.data) {
		transformedData = markForwardedRequests(
			data.data,
			rqfData.data,
			departmentId,
		);
	}

	return (
		<>
			<SingleAnalysisModal
				isOpen={singleAnalysisModal}
				toggle={toggleSingleAnalysisModal}
				selectedRequest={selectedRequest}
				data={transformedData}
			/>
			<TotalAnalysisModal
				isOpen={totalAnalysisModal}
				toggle={toggleTotalAnalysisModal}
				data={transformedData}
			/>
			<div className="d-flex flex-column" style={{ gap: "20px" }}>
				<AgGridContainer
					rowData={showSearchResult ? transformedData : []}
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
					tableName="Budget Request"
					exportColumns={[
						...approverBdrExportColumns,
						{
							key: "forwarded",
							label: t("forwarded"),
							format: (val) => (val ? t("forwarded") : t("not_forwarded")),
						},
					]}
					exportSearchParams={exportSearchParams}
					// Server-side pagination props
					paginationInfo={paginationInfo}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					// Total analysis button
					buttonChildren={<FaChartLine />}
					onButtonClick={toggleTotalAnalysisModal}
					disabled={!showSearchResult || isLoading}
				/>
			</div>
		</>
	);
};
