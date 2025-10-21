import React, { useEffect, useMemo, useState, lazy } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectHandovers } from "../../queries/projecthandover_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import TreeForLists from "../../components/Common/TreeForLists2";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { projectHandoverExportColumns } from "../../utils/exportColumnsForLists";

const AgGridContainer = lazy(
	() => import("../../components/Common/AgGridContainer")
);
const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectHandoverList = (props) => {
	document.title = "Project Handover List";

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
		if (showSearchResult) {
			setShowSearchResult(false);
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
			},
			{
				headerName: t("prj_name"),
				field: "prj_name",
				flex: 1,
				minWidth: 200,
				width: 150,
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
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 30) || "-";
				},
			},
			{
				headerName: t("prh_handover_date_gc"),
				field: "prh_handover_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				flex: 1,
				minWidth: 200,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.prh_handover_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("prh_description"),
				field: "prh_description",
				flex: 1,
				minWidth: 300,
				width: 300,
				sortable: true,
				filter: true,
				cellRenderer: (params) => {
					return truncateText(params.data.prh_description, 30) || "-";
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
						breadcrumbItem={t("project_handover_list")}
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
								searchHook={useSearchProjectHandovers}
								textSearchKeys={["prj_name", "prj_code"]}
								dateSearchKeys={["handover_date"]}
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
									tableName="Project Handover"
									exportColumns={projectHandoverExportColumns}
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
export default ProjectHandoverList;
