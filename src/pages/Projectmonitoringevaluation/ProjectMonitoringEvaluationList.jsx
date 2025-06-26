import React, { useEffect, useState, lazy } from "react";
import TreeForLists from "../../components/Common/TreeForLists2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectMonitoringEvaluations } from "../../queries/projectmonitoringevaluation_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
const AgGridContainer = lazy(() =>
	import("../../components/Common/AgGridContainer")
);
import { FaChartLine } from "react-icons/fa";
import { Button } from "reactstrap";
import { useFetchMonitoringEvaluationTypes } from "../../queries/monitoringevaluationtype_query";
const SingleAnalysisModal = lazy(() =>
	import("./Analysis/SingleAnalysisModal")
);
const TotalAnalysisModal = lazy(() => import("./Analysis/TotalAnalysisModal"));
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { monitoringExportColumns } from "../../utils/exportColumnsForLists";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const transactionTypes = [
	{ value: 1, label: "monitoring" },
	{ value: 2, label: "evaluation" },
];

const visitTypes = [
	{ value: 1, label: "Regular" },
	{ value: 2, label: "Surprise" },
];

const ProjectMonitoringEvaluationList = () => {
	document.title = "Project Monitoring and Evaluation";
	const { t } = useTranslation();

	const [include, setInclude] = useState();
	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [selectedEvaluation, setSelectedEvaluation] = useState(null);
	const [singleAnalysisModal, setSingleAnalysisModal] = useState(false);
	const [totalAnalysisModal, setTotalAnalysisModal] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleSelectedData = (rowData) => {
		setSelectedRequest(rowData);
	};

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
		});
	}, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId]);

	const handleNodeSelect = (node) => {
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
	};

	const toggleSingleAnalysisModal = () =>
		setSingleAnalysisModal(!singleAnalysisModal);
	const toggleTotalAnalysisModal = () =>
		setTotalAnalysisModal(!totalAnalysisModal);

	const columnDefs = [
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
			width: 200,
			sortable: true,
			filter: true,
			cellRenderer: (params) => truncateText(params.data.prj_name, 30) || "-",
		},
		{
			headerName: t("prj_code"),
			field: "prj_code",
			sortable: true,
			filter: true,
			cellRenderer: (params) => truncateText(params.data.prj_code, 30) || "-",
		},
		{
			headerName: t("mne_transaction_type"),
			field: "mne_transaction_type_id",
			filter: false,
			sortable: true,
			cellRenderer: (params) => {
				const labelKey = transactionTypes.find(
					(type) => type.value === params.data.mne_transaction_type_id
				)?.label;
				return <span>{t(labelKey)}</span>;
			},
		},
		{
			headerName: t("mne_visit_type"),
			field: "mne_visit_type",
			filter: false,
			sortable: true,
			cellRenderer: (params) => {
				const labelKey = visitTypes.find(
					(type) => type.value === params.data.mne_visit_type
				)?.label;
				return <span>{t(labelKey)}</span>;
			},
		},

		{
			headerName: t("mne_physical_region"),
			field: "mne_physical_region",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_financial_region"),
			field: "mne_financial_region",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_physical_zone"),
			field: "mne_physical_zone",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_financial_zone"),
			field: "mne_financial_zone",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_physical"),
			field: "mne_physical",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_financial"),
			field: "mne_financial",
			filter: false,
			sortable: true,
			valueFormatter: ({ value }) =>
				truncateText(Number(value).toLocaleString(), 30) || "-",
		},
		{
			headerName: t("mne_record_date"),
			field: "mne_record_date",
			filter: "agDateColumnFilter",
			sortable: true,
			valueFormatter: ({ value }) => truncateText(value, 30) || "-",
		},
		{
			headerName: t("mne_start_date"),
			field: "mne_start_date",
			filter: "agDateColumnFilter",
			sortable: true,
			valueFormatter: ({ value }) => truncateText(value, 30) || "-",
		},
		{
			headerName: t("mne_end_date"),
			field: "mne_end_date",
			filter: "agDateColumnFilter",
			sortable: true,
			valueFormatter: ({ value }) => truncateText(value, 30) || "-",
		},
		{
			headerName: t("actions"),
			field: "actions",
			cellRenderer: (params) => {
				const data = params.data;

				return (
					<Button
						id={`view-${data.mne_id}`}
						color="light"
						size="sm"
						onClick={() => {
							toggleSingleAnalysisModal();
							handleSelectedData(data);
						}}
					>
						<FaChartLine />
					</Button>
				);
			},
			width: 120,
			sortable: false,
			filter: false,
		},
	];

	return (
		<React.Fragment>
			<div className="page-content">
				<div>
					<Breadcrumbs />
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
								searchHook={useSearchProjectMonitoringEvaluations}
								textSearchKeys={["prj_name"]}
								dropdownSearchKeys={[]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
							>
								<TableWrapper
									columnDefs={columnDefs}
									showSearchResult={showSearchResult}
									selectedRequest={selectedRequest}
									singleAnalysisModal={singleAnalysisModal}
									totalAnalysisModal={totalAnalysisModal}
									toggleSingleAnalysisModal={toggleSingleAnalysisModal}
									toggleTotalAnalysisModal={toggleTotalAnalysisModal}
									handleSelectedData={handleSelectedData}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProjectMonitoringEvaluationList;

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
	const { t } = useTranslation();
	const { data: meTypes } = useFetchMonitoringEvaluationTypes();

	return (
		<>
			<SingleAnalysisModal
				isOpen={singleAnalysisModal}
				toggle={toggleSingleAnalysisModal}
				selectedRequest={selectedRequest}
				data={data?.data}
				evaluationTypes={transactionTypes}
				visitTypes={visitTypes}
				periodTypes={meTypes?.data || []}
			/>

			<TotalAnalysisModal
				isOpen={totalAnalysisModal}
				toggle={toggleTotalAnalysisModal}
				data={data?.data}
				evaluationTypes={transactionTypes}
				visitTypes={visitTypes}
				periodTypes={meTypes?.data || []}
			/>
			<div className="d-flex flex-column" style={{ gap: "20px" }}>
				<AgGridContainer
					rowData={showSearchResult ? data?.data : []}
					columnDefs={columnDefs}
					isLoading={isLoading}
					isPagination={true}
					paginationPageSize={10}
					isGlobalFilter={true}
					isAddButton={false}
					rowHeight={36}
					addButtonText="Add"
					isExcelExport={true}
					isPdfExport={true}
					isPrint={true}
					tableName="Project Monitoring and Evaluation"
					exportColumns={[
						...monitoringExportColumns,
						{
							key: "mne_transaction_type_id",
							label: "mne_transaction_type",
							format: (val) => {
								const labelKey = transactionTypes.find(
									(type) => type.value === val
								)?.label;
								return labelKey ? t(labelKey) : "-";
							},
						},
						{
							key: "mne_visit_type",
							label: "mne_visit_type",
							format: (val) => {
								const labelKey = visitTypes.find(
									(type) => type.value === val
								)?.label;
								return labelKey ? t(labelKey) : "-";
							},
						},
					]}
					// todo: refactor this to use a more generic button component
					buttonChildren={<FaChartLine />}
					onButtonClick={toggleTotalAnalysisModal}
					disabled={!showSearchResult || isLoading}
				/>
			</div>
		</>
	);
};
