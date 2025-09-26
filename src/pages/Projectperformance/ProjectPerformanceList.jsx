import React, { useEffect, lazy, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectPerformances } from "../../queries/projectperformance_query";
import TreeForLists from "../../components/Common/TreeForLists2";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchBudgetMonths } from "../../queries/budgetmonth_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import { Button } from "reactstrap";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { FaChartLine } from "react-icons/fa";

import {
	createMultiSelectOptions,
	createSelectOptions,
} from "../../utils/commonMethods";
import { projectPerformanceExportColumns } from "../../utils/exportColumnsForLists";
const AgGridContainer = lazy(
	() => import("../../components/Common/AgGridContainer")
);
const SinglePerformanceAnalysisModal = lazy(
	() => import("./Analysis/SinglePerformanceAnalysisModal")
);
const TotalPerformanceAnalysisModal = lazy(
	() => import("./Analysis/TotalPerformanceAnalysisModal")
);

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProjectPerformanceList = (props) => {
	document.title = "Project Performance List";
	const { passedId, isActive } = props;
	const param = { prp_project_id: passedId };
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const [modal, setModal] = useState(false);
	const [modal1, setModal1] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [projectPerformance, setProjectPerformance] = useState(null);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [include, setInclude] = useState(0);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { data, error, isError, refetch } = useState({});
	const toggleViewModal = () => setModal1(!modal1);
	const { data: budgetYearData } = useFetchBudgetYears();
	const { data: budgetMonthData } = useFetchBudgetMonths();
	const { data: projectStatusData } = useFetchProjectStatuss();

	const [singleAnalysisModal, setSingleAnalysisModal] = useState(false);
	const [totalAnalysisModal, setTotalAnalysisModal] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);

	const [selectedRowData, setSelectedRowData] = useState(null);
	const [chartType, setChartType] = useState("bar"); // Track chart type globally

	// Handle row selection
	const handleViewDetails = (rowData) => {
		setSelectedRowData(rowData);
	};

	const handleSelectedData = (rowData) => {
		setSelectedRequest(rowData);
	};

	const toggleSingleAnalysisModal = () =>
		setSingleAnalysisModal(!singleAnalysisModal);
	const toggleTotalAnalysisModal = () =>
		setTotalAnalysisModal(!totalAnalysisModal);

	const {
		prs_status_name_en: projectStatusOptionsEn,

		prs_status_name_or: projectStatusOptionsOr,
		prs_status_name_am: projectStatusOptionsAm,
	} = createMultiSelectOptions(projectStatusData?.data || [], "prs_id", [
		"prs_status_name_en",
		"prs_status_name_or",
		"prs_status_name_am",
	]);

	const budgetYearOptions = createSelectOptions(
		budgetYearData?.data || [],
		"bdy_id",
		"bdy_name"
	);

	const projectStatusMap = useMemo(() => {
		return (
			projectStatusData?.data?.reduce((acc, project_status) => {
				acc[project_status.prs_id] =
					lang === "en"
						? project_status.prs_status_name_en
						: lang === "am"
							? project_status.prs_status_name_am
							: project_status.prs_status_name_or;
				return acc;
			}, {}) || {}
		);
	}, [projectStatusData, lang]);

	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};
	useEffect(() => {
		setProjectParams({
			...(prjLocationRegionId && {
				prj_location_region_id: prjLocationRegionId,
			}),
			...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
			...(prjLocationWoredaId && {
				prj_location_woreda_id: prjLocationWoredaId,
			}),
			...(include === 1 && { include }),
		});
	}, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);
	const handleNodeSelect = (node) => {
		if (node.level === "region") {
			setPrjLocationRegionId(node.id);
			setPrjLocationZoneId(null); // Clear dependent states
			setPrjLocationWoredaId(null);
		} else if (node.level === "zone") {
			setPrjLocationZoneId(node.id);
			setPrjLocationWoredaId(null); // Clear dependent state
		} else if (node.level === "woreda") {
			setPrjLocationWoredaId(node.id);
		}
		if (showSearchResult) {
			setShowSearchResult(false);
		}
	};

	const columnDefs = useMemo(() => {
		const quarterDefinitions = [
			[11, 12, 1], // Q1
			[2, 3, 4], // Q2
			[5, 6, 7], // Q3
			[8, 9, 10], // Q4
		];

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
				headerName: t("prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("prj_code"),
				field: "prj_code",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 30) || "-";
				},
			},
			{
				headerName: t("prp_project_status_id"),
				field: "prp_project_status_id",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return projectStatusMap[params.data.prp_project_status_id] || "";
				},
			},
			{
				headerName: t("prp_record_date_gc"),
				field: "prp_record_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				cellRenderer: (params) => {
					return truncateText(params.data.prp_record_date_gc, 30) || "-";
				},
			},
		];

		// Create quarter column groups
		const quarterColumnGroups = quarterDefinitions.map(
			(quarterMonths, quarterIndex) => {
				const quarterNumber = quarterIndex + 1;

				return {
					headerName: `${t("q")}${quarterNumber}`,
					marryChildren: true,
					children: [
						{
							headerName: t("planned"),
							marryChildren: true,
							children: [
								{
									headerName: t("physical"),
									field: `quarter_${quarterNumber}_physical_planned`,
									sortable: true,
									filter: true,
									cellRenderer: (params) => {
										const sum = quarterMonths.reduce((total, month) => {
											const value =
												params.data[`prp_pyhsical_planned_month_${month}`] || 0;
											return total + Number(value);
										}, 0);
										return sum ? truncateText(sum.toLocaleString(), 15) : "-";
									},
								},
								{
									headerName: t("financial"),
									field: `quarter_${quarterNumber}_financial_planned`,
									sortable: true,
									filter: true,
									cellRenderer: (params) => {
										const sum = quarterMonths.reduce((total, month) => {
											const value =
												params.data[`prp_finan_planned_month_${month}`] || 0;
											return total + Number(value);
										}, 0);
										return sum ? truncateText(sum.toLocaleString(), 15) : "-";
									},
								},
							],
						},
						{
							headerName: t("actual"),
							marryChildren: true,
							children: [
								{
									headerName: t("physical"),
									field: `quarter_${quarterNumber}_physical_actual`,
									sortable: true,
									filter: true,
									cellRenderer: (params) => {
										const sum = quarterMonths.reduce((total, month) => {
											const value =
												params.data[`prp_pyhsical_actual_month_${month}`] || 0;
											return total + Number(value);
										}, 0);
										return sum ? truncateText(sum.toLocaleString(), 15) : "-";
									},
								},
								{
									headerName: t("financial"),
									field: `quarter_${quarterNumber}_financial_actual`,
									sortable: true,
									filter: true,
									cellRenderer: (params) => {
										const sum = quarterMonths.reduce((total, month) => {
											const value =
												params.data[`prp_finan_actual_month_${month}`] || 0;
											return total + Number(value);
										}, 0);
										return sum ? truncateText(sum.toLocaleString(), 15) : "-";
									},
								},
							],
						},
					],
				};
			}
		);

		const remainingColumns = [
			{
				headerName: t("prp_budget_baseline"),
				field: "prp_budget_baseline",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return params.data.prp_budget_baseline
						? truncateText(
								Number(params.data.prp_budget_baseline).toLocaleString(),
								15
							)
						: "-";
				},
			},
			{
				headerName: t("prp_physical_baseline"),
				field: "prp_physical_baseline",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return params.data.prp_physical_baseline
						? truncateText(
								Number(params.data.prp_physical_baseline).toLocaleString(),
								15
							)
						: "-";
				},
			},
			{
				headerName: t("prp_total_budget_used"),
				field: "prp_total_budget_used",
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
				headerName: t("prp_physical_performance"),
				field: "prp_physical_performance",
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return truncateText(params.data.prp_physical_performance, 30) || "-";
				},
			},
			{
				headerName: t("analysis"),
				field: "actions",
				cellRenderer: (params) => {
					const data = params.data;
					return (
						<div className="d-flex gap-1">
							<Button
								id={`view-${data.prp_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleSingleAnalysisModal();
									setSelectedRequest(data);
								}}
							>
								<FaChartLine />
							</Button>
						</div>
					);
				},
				width: 120,
				sortable: false,
				filter: false,
			},
		];

		return [...baseColumnDefs, ...quarterColumnGroups, ...remainingColumns];
	}, [projectStatusMap, t]);

	// Automatically clear selection when data changes
	useEffect(() => {
		setSelectedRowData(null);
	}, [data]);

	if (isError) {
		return <FetchErrorHandler error={error} refetch={refetch} />;
	}
	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs
						title={t("project")}
						breadcrumbItem={t("project_performance_list")}
					/>

					<div className="w-100 d-flex gap-2">
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
							setInclude={setInclude}
							setIsCollapsed={setIsCollapsed}
							isCollapsed={isCollapsed}
						/>
						{/* Main Content */}
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								searchHook={useSearchProjectPerformances}
								textSearchKeys={["prj_name", "prj_code"]}
								dropdownSearchKeys={[
									{
										key: "prp_project_status_id",
										options:
											lang === "en"
												? projectStatusOptionsEn
												: lang === "am"
													? projectStatusOptionsAm
													: projectStatusOptionsOr,
									},
									{
										key: "budget_year",
										options: budgetYearOptions,
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
								<TableWrapper
									// data={showSearchResult ? searchResults : data}
									columnDefs={columnDefs}
									showSearchResult={showSearchResult}
									selectedRequest={selectedRequest}
									singleAnalysisModal={singleAnalysisModal}
									totalAnalysisModal={totalAnalysisModal}
									toggleSingleAnalysisModal={toggleSingleAnalysisModal}
									toggleTotalAnalysisModal={toggleTotalAnalysisModal}
									// handleSelectedData={handleSelectedData}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProjectPerformanceList;

const TableWrapper = ({
	data,
	isLoading,
	columnDefs,
	showSearchResult,
	selectedRequest,
	singleAnalysisModal,
	totalAnalysisModal,
	toggleSingleAnalysisModal,
	toggleTotalAnalysisModal,
}) => {
	let transformedData = [];
	if (data) {
		transformedData = Array.isArray(data.data) ? data.data : [];
	}
	const { t, i18n } = useTranslation();
	const lang = i18n.language;
	const { data: projectStatusData } = useFetchProjectStatuss();
	const projectStatusMap = useMemo(() => {
		return (
			projectStatusData?.data?.reduce((acc, project_status) => {
				acc[project_status.prs_id] =
					lang === "en"
						? project_status.prs_status_name_en
						: lang === "am"
							? project_status.prs_status_name_am
							: project_status.prs_status_name_or;
				return acc;
			}, {}) || {}
		);
	}, [projectStatusData, lang]);
	return (
		<>
			<SinglePerformanceAnalysisModal
				isOpen={singleAnalysisModal}
				toggle={toggleSingleAnalysisModal}
				selectedRequest={selectedRequest}
				data={transformedData}
			/>

			<TotalPerformanceAnalysisModal
				isOpen={totalAnalysisModal}
				toggle={toggleTotalAnalysisModal}
				data={transformedData}
			/>
			<div className="d-flex flex-column" style={{ gap: "20px" }}>
				<AgGridContainer
					rowData={showSearchResult ? transformedData : []}
					columnDefs={columnDefs}
					isLoading={isLoading}
					isPagination={true}
					rowHeight={35}
					paginationPageSize={10}
					isGlobalFilter={true}
					isExcelExport={true}
					isPdfExport={true}
					isPrint={true}
					tableName="Project Performance"
					exportColumns={[
						...projectPerformanceExportColumns,
						{
							key: "prp_project_status_id",
							label: t("prp_project_status_id"),
							format: (val) => {
								return projectStatusMap[val] || "-";
							},
						},
					]}
					buttonChildren={<FaChartLine />}
					onButtonClick={toggleTotalAnalysisModal}
					disabled={!showSearchResult || isLoading}
				/>
			</div>
		</>
	);
};
