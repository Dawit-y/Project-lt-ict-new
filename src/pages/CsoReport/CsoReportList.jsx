import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import { Button, UncontrolledTooltip, Badge } from "reactstrap";
import { FaPaperclip, FaPenSquare } from "react-icons/fa";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useSearchCsoReports } from "../../queries/cso_report_query";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists2";
import AttachFileModal from "../../components/Common/AttachFileModal";
import ConvInfoModal from "../../pages/Conversationinformation/ConvInfoModal";
import { PAGE_ID } from "../../constants/constantFile";
import { csoReportExportColumns } from "../../utils/exportColumnsForLists";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

// Report type constants with badge colors
const REPORT_TYPES = {
	1: { name: "Monitoring Report", badgeColor: "primary" },
	2: { name: "Evaluation Report", badgeColor: "success" },
	3: { name: "Progress Report", badgeColor: "info" },
};

const CsoReportList = () => {
	document.title = "CSO Report List";
	const { t, i18n } = useTranslation();
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [include, setInclude] = useState(0);

	const [transaction, setTransaction] = useState({});
	const [exportSearchParams, setExportSearchParams] = useState({});

	// Create report type options for dropdown
	const reportTypeOptions = useMemo(() => {
		return Object.entries(REPORT_TYPES).map(([id, type]) => ({
			label: t(type.name.replace(" ", "_").toLowerCase()),
			value: parseInt(id),
		}));
	}, [t]);

	// Handle search results from AdvancedSearch
	const handleSearchResults = ({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	};

	const handleSearchLabels = (labels) => {
		setExportSearchParams(labels);
	};

	// Toggle modals
	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);

	// Update project params when location filters change
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

	// Handle location tree node selection
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
		if (showSearchResult) {
			setShowSearchResult(false);
		}
	};

	// Define AG Grid columns
	const columnDefs = useMemo(() => {
		const baseColumnDefs = [
			{
				headerName: t("S.N"),
				field: "sn",
				valueGetter: (params) => params.node.rowIndex + 1,
				sortable: false,
				filter: false,
				width: 70,
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
				headerName: t("rpt_name"),
				field: "rpt_name",
				sortable: true,
				filter: true,
				minWidth: 180,
				cellRenderer: (params) => {
					return truncateText(params.data.rpt_name, 50) || "-";
				},
			},
			{
				headerName: t("rpt_type_id"),
				field: "rpt_type_id",
				sortable: true,
				filter: true,
				width: 160,
				cellRenderer: (params) => {
					const typeId = params.value;
					const reportType = REPORT_TYPES[typeId] || {
						name: "-",
						badgeColor: "secondary",
					};
					return (
						<Badge
							className={`font-size-12 badge-soft-${reportType.badgeColor}`}
						>
							{t(reportType.name.replace(" ", "_").toLowerCase())}
						</Badge>
					);
				},
			},
			{
				headerName: t("rpt_report_date"),
				field: "rpt_report_date",
				sortable: true,
				width: 130,
				filter: "agDateColumnFilter",
				cellRenderer: (params) => {
					return params.data.rpt_report_date || "-";
				},
			},
			{
				headerName: t("actions"),
				field: "actions",
				width: 150,
				pinned: "right",
				cellRenderer: (params) => {
					const data = params.data;

					return (
						<div className="d-flex gap-1">
							{/* Attach Files Button */}
							<Button
								id={`attach-${data.rpt_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleFileModal();
									setTransaction(data);
								}}
							>
								<FaPaperclip />
							</Button>
							<UncontrolledTooltip target={`attach-${data.rpt_id}`}>
								{t("attach_files")}
							</UncontrolledTooltip>

							{/* Notes/Conversation Button */}
							<Button
								id={`notes-${data.rpt_id}`}
								color="light"
								size="sm"
								onClick={() => {
									toggleConvModal();
									setTransaction(data);
								}}
							>
								<FaPenSquare />
							</Button>
							<UncontrolledTooltip target={`notes-${data.rpt_id}`}>
								{t("Notes")}
							</UncontrolledTooltip>
						</div>
					);
				},
			},
		];
		return baseColumnDefs;
	}, [t]);

	return (
    <React.Fragment>
			<AttachFileModal
				isOpen={fileModal}
				toggle={toggleFileModal}
				projectId={transaction?.rpt_project_id}
				ownerTypeId={PAGE_ID.CSO_REPORT}
				ownerId={transaction?.rpt_id}
				accept={{
					"application/pdf": [],
					"application/msword": [],
					"application/vnd.openxmlformats-officedocument.wordprocessingml.file":
						[],
					"application/vnd.ms-excel": [],
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						[],
				}}
				title={t("Report Files")}
			/>
			<ConvInfoModal
				isOpen={convModal}
				toggle={toggleConvModal}
				ownerTypeId={PAGE_ID.CSO_REPORT}
				ownerId={transaction?.rpt_id}
			/>

			<div className="page-content">
				<div className="">
					<Breadcrumbs />
					<div className="w-100 d-flex gap-2">
						{/* Location Tree Component */}
						<TreeForLists
							onNodeSelect={handleNodeSelect}
							setIsAddressLoading={setIsAddressLoading}
							setInclude={setInclude}
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
						/>

						{/* Main Search and Table Container */}
						<SearchTableContainer isCollapsed={isCollapsed}>
							<AdvancedSearch
								searchHook={useSearchCsoReports}
								dateSearchKeys={["rpt_report_date"]}
								textSearchKeys={["rpt_name"]}
								dropdownSearchKeys={[
									{
										key: "rpt_type_id",
										options: reportTypeOptions,
									},
								]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								onSearchLabels={handleSearchLabels}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
								setExportSearchParams={setExportSearchParams}
							>
								{/* AG Grid Container */}
								<AgGridContainer
									rowData={showSearchResult ? searchResults?.data : []}
									columnDefs={columnDefs}
									isLoading={isSearchLoading}
									isPagination={true}
									paginationPageSize={30}
									paginationPageSizeOptions={[10, 20, 30, 40, 50]}
									isGlobalFilter={true}
									isAddButton={false}
									addButtonText={t("Add")}
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName={t("CSO Reports")}
									exportSearchParams={exportSearchParams}
									exportColumns={[
										...csoReportExportColumns,
										{
											key: "rpt_type_id",
											label: t("rpt_type_id"),
											format: (val) => {
												const reportType = REPORT_TYPES[val];
												return reportType
													? t(reportType.name.replace(" ", "_").toLowerCase())
													: "-";
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

CsoReportList.propTypes = {
	preGlobalFilteredRows: PropTypes.any,
};

export default CsoReportList;
