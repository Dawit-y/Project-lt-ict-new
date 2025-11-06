import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Input, Card, CardBody, Spinner } from "reactstrap";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import TableRenderers from "react-pivottable/TableRenderers";
import { aggregators } from "react-pivottable/Utilities";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import TreeForLists from "../../components/Common/TreeForLists2";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useSearchStatisticalReport } from "../../queries/statisticalreport_query";
import "./statistical.css";
import { createSelectOptions } from "../../utils/commonMethods";
import PrintStatisticalReportPage from "../../components/Common/PrintStatisticalReportPage";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const StatisticalReport = () => {
	const { t, i18n } = useTranslation();

	// Simplified endpoints state - removed unused url property
	const endpoints = useMemo(
		() => [
			"project",
			"project_employee",
			"project_budget_plan",
			"project_budget_expenditure",
			"budget_source",
			"project_contractor",
			"project_payment",
			"project_performance",
			"project_stakeholder",
			"project_supplimentary",
			"project_variation",
			"project_handover",
			"budget_request",
		],
		[]
	);

	const [searchResults, setSearchResults] = useState([]);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(true);
	const [selectedEndpoint, setSelectedEndpoint] = useState("");
	const [locationParams, setLocationParams] = useState({});
	const [reportTypeId, setReportTypeId] = useState(null);
	const [locationRegionId, setLocationRegionId] = useState(null);
	const [locationZoneId, setLocationZoneId] = useState(null);
	const [locationWoredaId, setLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [textSearchKeys, setTextSearchKeys] = useState([]);
	const [dateSearchKeys, setDateSearchKeys] = useState([]);
	const [dropdownSearchKeys, setDropdownSearchKeys] = useState([]);
	const [include, setInclude] = useState(0);
	const [pivotState, setPivotState] = useState({});
	const [showPivot, setShowPivot] = useState(false);
	const [loading, setLoading] = useState(false);
	const [localizedRenderersUI, setLocalizedRenderersUI] = useState({});
	const [localizedAggregatorTemplates, setLocalizedAggregatorTemplates] =
		useState({});
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [exportSearchParams, setExportSearchParams] = useState({});

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
	};

	const { data: budgetYearData } = useFetchBudgetYears();
	const budgetYearOptions = createSelectOptions(
		budgetYearData?.data || [],
		"bdy_id",
		"bdy_name"
	);

	// Endpoint configurations
	const endpointConfigs = useMemo(
		() => ({
			project: {
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prj_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 1,
			},
			project_employee: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "emp_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 2,
			},
			project_budget_plan: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "bpl_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 3,
			},
			project_budget_expenditure: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "pbe_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 4,
			},
			budget_source: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "pbs_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 5,
			},
			project_contractor: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "cni_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 6,
			},
			project_payment: {
				dateKeys: ["payment_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prp_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 7,
			},
			project_performance: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prp_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 8,
			},
			project_stakeholder: {
				textKeys: ["prj_name", "prj_code"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "psh_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 9,
			},
			project_supplimentary: {
				textKeys: ["prj_name", "prj_code"],
				dateKeys: ["payment_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prs_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 10,
			},
			project_variation: {
				textKeys: ["prj_name", "prj_code"],
				dateKeys: ["payment_date"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prv_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 11,
			},
			project_handover: {
				textKeys: ["prh_name", ""],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prh_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 12,
			},
			budget_request: {
				textKeys: ["prd_name"],
				locationParams: {
					region: "prj_location_region_id",
					zone: "prj_location_zone_id",
					woreda: "prj_location_woreda_id",
				},
				dropdownSearchKeys: [
					{
						key: "prd_budget_year_id",
						options: budgetYearOptions,
					},
				],
				reportTypeIndex: 13,
			},
		}),
		[budgetYearOptions]
	);

	// Project params derived from location selections and report type
	const projectParams = useMemo(() => {
		const updatedParams = {};

		if (locationRegionId && locationParams.region) {
			updatedParams[locationParams.region] = locationRegionId;
		}
		if (locationZoneId && locationParams.zone) {
			updatedParams[locationParams.zone] = locationZoneId;
		}
		if (locationWoredaId && locationParams.woreda) {
			updatedParams[locationParams.woreda] = locationWoredaId;
		}
		if (reportTypeId) {
			updatedParams.report_type = reportTypeId;
		}
		if (include === 1) {
			updatedParams.include = include;
		}

		return updatedParams;
	}, [
		locationRegionId,
		locationZoneId,
		locationWoredaId,
		reportTypeId,
		locationParams,
		include,
	]);

	// Localization effect
	useEffect(() => {
		const createLocalizedRenderers = () => {
			const localizedRenderers = { ...TableRenderers };

			// Add Plotly renderers
			Object.keys(PlotlyRenderers).forEach((key) => {
				const localizedKey = t(key);
				if (localizedKey) {
					localizedRenderers[localizedKey] = PlotlyRenderers[key];
				}
			});

			return localizedRenderers;
		};

		const createLocalizedAggregators = () => {
			return Object.entries(aggregators).reduce((acc, [key, value]) => {
				const localizedKey = t(key);
				acc[localizedKey] = value;
				return acc;
			}, {});
		};

		setLocalizedRenderersUI(createLocalizedRenderers());
		setLocalizedAggregatorTemplates(createLocalizedAggregators());
		setPivotState({});
	}, [t, i18n.language]);

	// Handle endpoint selection
	const handleEndpointChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedEndpoint(selectedValue);
		setPivotState({});
		setShowPivot(false);
		setSearchResults([]);
		setShowSearchResult(false);

		const config = endpointConfigs[selectedValue];
		if (config) {
			setTextSearchKeys(config.textKeys || []);
			setDateSearchKeys(config.dateKeys || []);
			setDropdownSearchKeys(config.dropdownSearchKeys || []);
			setReportTypeId(config.reportTypeIndex || null);
			setLocationParams(config.locationParams || {});
		} else {
			// Reset to defaults if no config found
			setTextSearchKeys([]);
			setDateSearchKeys([]);
			setDropdownSearchKeys([]);
			setReportTypeId(null);
			setLocationParams({});
		}
	};

	// Handle search results
	const handleSearchResults = ({ data, error }) => {
		setLoading(true);
		setSearchResults(data?.data || []);
		setPivotState({});
		setShowPivot(true);
		setSearchError(error);
		setShowSearchResult(true);
		setLoading(false);
	};

	// Handle tree node selection
	const handleNodeSelect = (node) => {
		if (node.level === "region") {
			setLocationRegionId(node.id);
			setLocationZoneId(null);
			setLocationWoredaId(null);
		} else if (node.level === "zone") {
			setLocationZoneId(node.id);
			setLocationWoredaId(null);
		} else if (node.level === "woreda") {
			setLocationWoredaId(node.id);
		}

		if (showSearchResult) {
			setShowSearchResult(false);
		}
	};

	// Check if search should be enabled
	const isSearchEnabled = !!selectedEndpoint;

	return (
		<div className="page-content">
			<div className="">
				<Breadcrumbs
					title={t("Report")}
					breadcrumbItem={t("Statistical Report")}
				/>
				<div className="w-100 d-flex gap-2">
					<TreeForLists
						onNodeSelect={handleNodeSelect}
						setIsAddressLoading={setIsAddressLoading}
						setInclude={setInclude}
						isCollapsed={isCollapsed}
						setIsCollapsed={setIsCollapsed}
						widthInPercent={15}
					/>
					<div style={{ flex: "1 1 0", overflowX: "auto", minHeight: "100vh" }}>
						<div
							style={{
								flex: isCollapsed ? "1 1 auto" : `0 0 85%`,
								transition: "all 0.3s ease",
							}}
						>
							<Row className="d-flex align-items-center justify-content-center">
								<Col xs="4" sm="4" lg="4">
									<Card className="p-0 m-0 mb-3 shadow-none">
										<CardBody className="p-2">
											<div className="d-flex align-items-center gap-5">
												<Input
													type="select"
													name="endpoint"
													id="api-endpoints"
													value={selectedEndpoint}
													onChange={handleEndpointChange}
												>
													<option value="">{t("select_stat")}</option>
													{endpoints.map((endpoint, index) => (
														<option key={index} value={endpoint}>
															{t(endpoint)}
														</option>
													))}
												</Input>

												<PrintStatisticalReportPage
													tableName={t(selectedEndpoint)}
													exportSearchParams={exportSearchParams}
												/>
											</div>
										</CardBody>
									</Card>
								</Col>

								<Col xs="8" sm="8" lg="8">
									{selectedEndpoint && (
										<AdvancedSearch
											searchHook={useSearchStatisticalReport}
											textSearchKeys={textSearchKeys}
											dateSearchKeys={dateSearchKeys}
											dropdownSearchKeys={dropdownSearchKeys}
											checkboxSearchKeys={[]}
											additionalParams={projectParams}
											setAdditionalParams={() => {}}
											onSearchResult={handleSearchResults}
											onSearchLabels={handleSearchLabels}
											setIsSearchLoading={setIsSearchLoading}
											setSearchResults={setSearchResults}
											setShowSearchResult={setShowSearchResult}
											setExportSearchParams={setExportSearchParams}
											disabled={!isSearchEnabled}
										/>
									)}
								</Col>
							</Row>
							<Col xs="12">
								{loading || isSearchLoading ? (
									<div className="d-flex justify-content-center">
										<Spinner color="primary" />
									</div>
								) : (
									<>
										{showPivot &&
											searchResults.length > 0 &&
											showSearchResult && (
												<Card>
													<CardBody>
														<div className="overflow-x-auto">
															<PivotTableUI
																key={selectedEndpoint || "default"}
																data={searchResults}
																onChange={setPivotState}
																renderers={localizedRenderersUI}
																aggregators={localizedAggregatorTemplates}
																aggregatorName={
																	Object.keys(localizedAggregatorTemplates)[0]
																}
																{...pivotState}
															/>
														</div>
													</CardBody>
												</Card>
											)}
										{!loading &&
											searchResults.length === 0 &&
											showSearchResult && (
												<div className="text-center mt-5">
													<p>{t("statistical_search")}</p>
												</div>
											)}
									</>
								)}
							</Col>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatisticalReport;
