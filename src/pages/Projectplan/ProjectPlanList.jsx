import React, { useEffect, lazy, useMemo, useState, useRef } from "react";
const AgGridContainer = lazy(
	() => import("../../components/Common/AgGridContainer")
);
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectPlans } from "../../queries/projectplan_query";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import TreeForLists from "../../components/Common/TreeForLists2";
import { ProjectPlanExportColumns } from "../../utils/exportColumnsForLists";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import GanttModal from "./GanttModal";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPlanList = () => {
	document.title = "Project Plan List";

	const { t } = useTranslation();
	const [modal1, setModal1] = useState(false);
	const [projectPlan, setProjectPlan] = useState(null);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [include, setInclude] = useState(0);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [exportSearchParams, setExportSearchParams] = useState({});

	const { data: budgetYearData } = useFetchBudgetYears();
	const budgetYearMap = useMemo(() => {
		return (
			budgetYearData?.data?.reduce((acc, year) => {
				acc[year.bdy_id] = year.bdy_name;
				return acc;
			}, {}) || {}
		);
	}, [budgetYearData]);

	const toggleViewModal = () => setModal1(!modal1);

	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
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
	};

	const columnDefs = useMemo(() => {
		const baseColumns = [
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
				filter: false,
				minWidth: 300,
				flex: 1,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("pld_name"),
				field: "pld_name",
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return truncateText(params.data.pld_name, 30) || "-";
				},
			},
			{
				headerName: t("prj_code"),
				field: "prj_code",
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 30) || "-";
				},
			},
			{
				headerName: t("pld_budget_year_id"),
				field: "pld_budget_year_id",
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return budgetYearMap[params.data.pld_budget_year_id] || "-";
				},
			},
			{
				headerName: t("pld_start_date_gc"),
				field: "pld_start_date_gc",
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return truncateText(params.data.pld_start_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("pld_end_date_gc"),
				field: "pld_end_date_gc",
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return truncateText(params.data.pld_end_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("view_gannt"),
				field: t("view_gannt"),
				sortable: true,
				filter: false,
				cellRenderer: (params) => {
					return (
						<Button
							outline
							type="button"
							color="primary"
							size="sm"
							onClick={() => {
								setProjectPlan(params.data);
								toggleViewModal();
							}}
						>
							{t("view_gannt")}
						</Button>
					);
				},
			},
		];
		return baseColumns;
	}, [t]);

		return (
			<React.Fragment>
				<GanttModal
					isOpen={modal1}
					toggle={toggleViewModal}
					projectPlan={projectPlan}
				/>
				<div className="page-content">
					<div>
						<Breadcrumbs />
						<div className="d-flex gap-2 flex-nowrap">
							<TreeForLists
								onNodeSelect={handleNodeSelect}
								setIsAddressLoading={setIsAddressLoading}
								setInclude={setInclude}
								setIsCollapsed={setIsCollapsed}
								isCollapsed={isCollapsed}
							/>
							<SearchTableContainer isCollapsed={isCollapsed}>
								<AdvancedSearch
									searchHook={useSearchProjectPlans}
									textSearchKeys={["pld_name"]}
									dateSearchKeys={["pld_start_date_gc"]}
									additionalParams={projectParams}
									setAdditionalParams={setProjectParams}
									onSearchResult={handleSearchResults}
									onSearchLabels={handleSearchLabels}
									setIsSearchLoading={setIsSearchLoading}
									setSearchResults={setSearchResults}
									setShowSearchResult={setShowSearchResult}
									setExportSearchParams={setExportSearchParams}
								>
									<AgGridContainer
										rowData={showSearchResult ? searchResults?.data : []}
										columnDefs={columnDefs}
										isLoading={isSearchLoading}
										isPagination={true}
										rowHeight={35}
										paginationPageSize={10}
										isGlobalFilter={true}
										isExcelExport={true}
										isPdfExport={true}
										isPrint={true}
										tableName="Project Plan"
										exportSearchParams={exportSearchParams}
										exportColumns={[
											...ProjectPlanExportColumns,
											{
												key: "pld_budget_year_id",
												label: t("pld_budget_year_id"),
												format: (val) => {
													return budgetYearMap[val] || "-";
												},
											},
										]}
									/>
								</AdvancedSearch>
							</SearchTableContainer>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
};
export default ProjectPlanList;
