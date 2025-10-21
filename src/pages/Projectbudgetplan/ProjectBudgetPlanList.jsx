import React, { useEffect, useMemo, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinners from "../../components/Common/Spinner";

//import components
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectBudgetPlans } from "../../queries/projectbudgetplan_query";
import { useTranslation } from "react-i18next";

import { Col, Row, Input } from "reactstrap";

import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists2";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { projectBudgetPlanExportColumns } from "../../utils/exportColumnsForLists";
import AgGridContainer from "../../components/Common/AgGridContainer";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectBudgetPlanList = () => {
  //meta title
  document.title = " ProjectBudgetPlan";
  const { t } = useTranslation();

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
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 70,
			},
			{
				headerName: t("prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("prj_code"),
				field: "prj_code",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 35) || "-";
				},
			},

			{
				headerName: t("bpl_budget_year"),
				field: "bpl_budget_year",
				sortable: true,
				filter: true,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bpl_budget_year, 35) || "-";
				},
			},
			{
				headerName: t("bpl_budget_code"),
				field: "bpl_budget_code",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bpl_budget_code, 35) || "-";
				},
			},
			{
				headerName: t("bpl_amount"),
				field: "bpl_amount",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bpl_amount, 30) || "-";
				},
			},
			{
				headerName: t("bpl_description"),
				field: "bpl_description",
				sortable: true,
				filter: true,
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bpl_description, 150) || "-";
				},
			},
		];
		return baseColumnDefs;
	});

  return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs
						title={t("project")}
						breadcrumbItem={t("Project Payment List")}
					/>
					<div className="w-100 d-flex gap-2">
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
							setInclude={setInclude}
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
						/>
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								searchHook={useSearchProjectBudgetPlans}
								textSearchKeys={["prj_name", "prj_code"]}
								dropdownSearchKeys={[]}
								checkboxSearchKeys={[]}
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
									tableName="Project Budget Plan"
									exportColumns={projectBudgetPlanExportColumns}
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

export default ProjectBudgetPlanList;
