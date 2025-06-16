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
import { useFetchProjectCategorys } from "../../queries/projectcategory_query";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Input, Badge } from "reactstrap";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists2";
import AdvancedSearch from "../../components/Common/AdvancedSearch";

const ProjectModel = () => {
	document.title = "Citizenship Projects List ";
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

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

	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const { data: projectCategoryData } = useFetchProjectCategorys();
	const {
		pct_name_en: projectCategoryOptionsEn,
		pct_name_or: projectCategoryOptionsOr,
		pct_name_am: projectCategoryOptionsAm,
	} = createMultiSelectOptions(projectCategoryData?.data || [], "pct_id", [
		"pct_name_en",
		"pct_name_or",
		"pct_name_am",
	]);

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
				/*floatingFilter: true,*/
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
				width: 100,
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
		return baseColumnDefs;
	}, [searchResults, t]);

	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs title={t("project")} breadcrumbItem={t("project")} />
					<div className="w-100 d-flex gap-2">
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
							setInclude={setInclude}
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
						/>
						{/* Main Content */}
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
								setSearchResults={handleSearch}
								onSearchResult={handleSearch}
								setShowSearchResult={setShowSearchResult}
								setIsSearchLoading={setIsSearchLoading}
								params={params}
								setParams={setParams}
								searchParams={searchParams}
								setSearchParams={setSearchParams}
							>
								<AgGridContainer
									rowData={showSearchResult ? searchResults?.data : []}
									columnDefs={columnDefs}
									isPagination={true}
									paginationPageSize={20}
									isGlobalFilter={true}
									isAddButton={false}
									addButtonText="Add"
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName="Projects"
									includeKey={["prj_name", "prj_code"]}
									excludeKey={["is_editable", "is_deletable"]}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
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
