import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	lazy,
	Suspense,
	useCallback,
	memo,
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../../hooks/useAuthUser";
import {
	Button,
	Badge,
	Row,
	Col,
	Input,
	Spinner,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "reactstrap";
import Spinners from "../../../components/Common/Spinner";
const Breadcrumbs = lazy(() => import("../../../components/Common/Breadcrumb"));
const AdvancedSearch = lazy(
	() => import("../../../components/Common/AdvancedSearch")
);
const FetchErrorHandler = lazy(
	() => import("../../../components/Common/FetchErrorHandler")
);
const TreeForLists = lazy(
	() => import("../../../components/Common/TreeForLists")
);
const AttachFileModal = lazy(
	() => import("../../../components/Common/AttachFileModal")
);
const ConvInfoModal = lazy(
	() => import("../../Conversationinformation/ConvInfoModal")
);
const BudgetRequestModal = lazy(() => import("../BudgetRequestModal"));
const AgGridContainer = lazy(
	() => import("../../../components/Common/AgGridContainer")
);
import { AgGridReact } from "ag-grid-react";
import { budget_request } from "../../../settings/printablecolumns";
import {
	useSearchBudgetRequestforApproval,
	useBulkUpdateBudgetRequestApproval,
} from "../../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../../queries/budgetyear_query";
import { useSearchRequestCategorys } from "../../../queries/requestcategory_query";
import {
	useSearchRequestFollowups,
	useFetchRequestFollowups,
} from "../../../queries/requestfollowup_query";
import { useFetchRequestStatuss } from "../../../queries/requeststatus_query";
import { PAGE_ID } from "../../../constants/constantFile";
import { useFetchProjectStatuss } from "../../../queries/projectstatus_query";
import { getUserSectorList } from "../../../queries/usersector_query";
import {
	createSelectOptions,
	createMultiSelectOptions,
} from "../../../utils/commonMethods";
import { toast } from "react-toastify";
import RequestDetail from "./RequestDetail";

const truncateText = (text, maxLength) => {
	if (typeof text !== "string") {
		return text;
	}
	return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ApproverBudgetRequestList = () => {
	document.title = "Recommended Requests List";
	const { t, i18n } = useTranslation();
	const [modal1, setModal1] = useState(false);
	const [fileModal, setFileModal] = useState(false);
	const [convModal, setConvModal] = useState(false);

	const [searchResults, setSearchResults] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [searcherror, setSearchError] = useState(null);
	const [showSearchResult, setShowSearchResult] = useState(false);
	const [transaction, setTransaction] = useState({});

	const { data: budgetYearData } = useFetchBudgetYears();
	const param = { gov_active: "1" };
	const { data: bgCategoryOptionsData } = useSearchRequestCategorys(param);
	const { data: projectStatusData } = useFetchProjectStatuss();
	const { data: requestStatus } = useFetchRequestStatuss();
	const { data: sectorInformationData } = getUserSectorList();

	const [projectParams, setProjectParams] = useState({});
	const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
	const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
	const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
	const [isAddressLoading, setIsAddressLoading] = useState(false);
	const [include, setInclude] = useState(0);

	const {
		sci_name_en: sectorInfoOptionsEn,
		sci_name_or: sectorInfoOptionsOr,
		sci_name_am: sectorInfoOptionsAm,
	} = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
		"sci_name_en",
		"sci_name_or",
		"sci_name_am",
	]);

	const filteredData = (requestStatus?.data || []).filter(
		(item) => item.rqs_id !== 1
	);
	const {
		rqs_name_en: requestStatusOptionsEn,
		rqs_name_or: requestStatusOptionsOr,
		rqs_name_am: requestStatusOptionsAm,
	} = createMultiSelectOptions(filteredData, "rqs_id", [
		"rqs_name_en",
		"rqs_name_or",
		"rqs_name_am",
	]);

	const budgetYearMap = useMemo(() => {
		return (
			budgetYearData?.data?.reduce((acc, year) => {
				acc[year.bdy_id] = year.bdy_name;
				return acc;
			}, {}) || {}
		);
	}, [budgetYearData]);

	const budgetYearOptions = useMemo(() => {
		return (
			budgetYearData?.data?.map((year) => ({
				label: year.bdy_name,
				value: year.bdy_id,
			})) || []
		);
	}, [budgetYearData]);

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

	const handleSearch = useCallback(({ data, error }) => {
		setSearchResults(data);
		setSearchError(error);
		setShowSearchResult(true);
	}, []);

	const toggleViewModal = () => setModal1(!modal1);
	const toggleFileModal = () => setFileModal(!fileModal);
	const toggleConvModal = () => setConvModal(!convModal);

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
				// flex: 0.5,
			},
			{
				headerName: t("bdr_budget_year_id"),
				field: "bdy_name",
				sortable: true,
				filter: true,
				//flex: 1,
				width: 150,
				cellRenderer: (params) => {
					return truncateText(params.data.bdy_name, 30) || "-";
				},
			},
			// {
			//   headerName: t("bdr_request_category_id"),
			//   field: "bdr_request_category_id",
			//   sortable: true,
			//   filter: true,
			//   //flex: 1,
			//   cellRenderer: (params) => {
			//     const category = requestCategoryOptions.find(
			//       (option) => option.value === params.data.bdr_request_category_id
			//     );
			//     return category ? truncateText(category.label, 30) : "-";
			//   },
			// },
			// {
			//   headerName: t("bdr_request_type"),
			//   field: "bdr_request_type",
			//   sortable: true,
			//   filter: true,

			//   cellRenderer: (params) => {
			//     const requestType = projectStatusOptions.find(
			//       (option) => option.value === params.data.bdr_request_type
			//     );
			//     return requestType ? truncateText(requestType.label, 30) : "-";
			//   },
			// },
			{
				headerName: t("prj_name"),
				field: "prj_name",
				sortable: true,
				filter: true,
				//flex: 2,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_name, 100) || "-";
				},
			},
			{
				headerName: t("prj_code"),
				field: "prj_code",
				sortable: true,
				filter: true,
				//flex: 1.5,
				cellRenderer: (params) => {
					return truncateText(params.data.prj_code, 30) || "-";
				},
			},
			{
				headerName: t("bdr_requested_amount"),
				field: "bdr_requested_amount",
				sortable: true,
				filter: true,
				//flex: 1.2,
				valueFormatter: (params) => {
					if (params.value != null) {
						return new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(params.value);
					}
					return "0.00"; // Default value if null or undefined
				},
			},
			{
				headerName: t("bdr_requested_date_gc"),
				field: "bdr_requested_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				//flex: 1,
				cellRenderer: (params) => {
					return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("bdr_released_amount"),
				field: "bdr_released_amount",
				sortable: true,
				filter: true,
				//flex: 1.2,
				valueFormatter: (params) => {
					if (params.value != null) {
						return new Intl.NumberFormat("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(params.value);
					}
					return "0.00"; // Default value if null or undefined
				},
			},
			{
				headerName: t("bdr_released_date_gc"),
				field: "bdr_released_date_gc",
				sortable: true,
				filter: "agDateColumnFilter",
				//flex: 1,
				cellRenderer: (params) => {
					return truncateText(params.data.bdr_released_date_gc, 30) || "-";
				},
			},
			{
				headerName: t("Status"),
				field: "status_name",
				sortable: true,
				filter: true,
				//flex: 1,
				width: 130,
				cellRenderer: (params) => {
					const { status_name, color_code } = params.data;
					return <Badge color={color_code}>{status_name}</Badge>;
				},
			},
			{
				headerName: t("view_detail"),
				field: "view_detail",
				//flex: 1,
				width: 120,
				cellRenderer: (params) => {
					return (
						<Button
							type="button"
							color="primary"
							outline
							className="btn-sm my-auto"
							onClick={() => {
								const data = params.data;
								toggleViewModal();
								setTransaction(data);
							}}
						>
							{t("view_detail")}
						</Button>
					);
				},
			},
			// {
			//   headerName: t("forwarded"),
			//   field: "forwarded",
			//   sortable: true,
			//   filter: true,
			//   //flex: 1,
			//   width: 130,
			//   cellRenderer: (params) => {
			//     const isForwarded = params.data.forwarded;
			//     return (
			//       <Badge
			//         className={`font-size-12 badge-soft-${isForwarded ? "danger" : "secondary"
			//           }`}
			//       >
			//         {isForwarded ? t("forwarded") : t("not_forwarded")}
			//       </Badge>
			//     );
			//   },
			// },
			// {
			//   headerName: t("take_action"),
			//   field: "take_action",
			//   //flex: 1,
			//   width: 120,
			//   cellRenderer: (params) => {
			//     return (
			//       <Button
			//         type="button"
			//         color="primary"
			//         className="btn-sm my-auto"
			//         onClick={() => {
			//           const data = params.data;
			//           toggleViewModal();
			//           setTransaction(data);
			//         }}
			//       >
			//         {t("take_action")}
			//       </Button>
			//     );
			//   },
			// },
			// {
			//   headerName: t("attach_files"),
			//   field: "attach_files",
			//   //flex: 1,
			//   width: 80,
			//   cellRenderer: (params) => {
			//     return (
			//       <Button
			//         outline
			//         type="button"
			//         color="success"
			//         className="btn-sm"
			//         onClick={() => {
			//           toggleFileModal();
			//           setTransaction(params.data);
			//         }}
			//       >
			//         {t("attach_files")}
			//       </Button>
			//     );
			//   },
			// },
			// {
			//   headerName: t("Message"),
			//   field: "Message",
			//   //flex: 1,
			//   width: 100,
			//   cellRenderer: (params) => {
			//     return (
			//       <Button
			//         outline
			//         type="button"
			//         color="primary"
			//         className="btn-sm"
			//         onClick={() => {
			//           toggleConvModal();
			//           setTransaction(params.data);
			//         }}
			//       >
			//         {t("Message")}
			//       </Button>
			//     );
			//   },
			// },
		];
		return baseColumnDefs;
	}, []);

	return (
		<Suspense fallback={<Spinners />}>
			<React.Fragment>
				<RequestDetail
					isOpen={modal1}
					toggle={toggleViewModal}
					request={transaction}
				/>
				<div className="page-content">
					<div className="">
						<Breadcrumbs />
						<div className="w-100 d-flex gap-2 flex-nowrap">
							<div style={{ flex: "0 0 25%", minWidth: "250px" }}>
								<TreeForLists
									onNodeSelect={handleNodeSelect}
									setIsAddressLoading={setIsAddressLoading}
									setInclude={setInclude}
								/>
							</div>
							<div style={{ flex: "0 0 75%" }}>
								<AdvancedSearch
									searchHook={useSearchBudgetRequestforApproval}
									// dateSearchKeys={["budget_request_date"]}
									textSearchKeys={["prj_name"]}
									dropdownSearchKeys={[
										{
											key: "bdr_budget_year_id",
											options: budgetYearOptions,
										},
										{
											key: "bdr_request_category_id",
											options:
												i18n.language === "en"
													? requestCategoryOptionsEn
													: i18n.language === "am"
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
												i18n.language === "en"
													? sectorInfoOptionsEn
													: i18n.language === "am"
														? sectorInfoOptionsAm
														: sectorInfoOptionsOr,
										},
										{
											key: "bdr_request_status",
											options:
												i18n.language === "en"
													? requestStatusOptionsEn
													: i18n.language === "am"
														? requestStatusOptionsAm
														: requestStatusOptionsOr,
											defaultValue: 2,
										},
									]}
									additionalParams={projectParams}
									setAdditionalParams={setProjectParams}
									onSearchResult={handleSearch}
									setIsSearchLoading={setIsSearchLoading}
									setSearchResults={setSearchResults}
									setShowSearchResult={setShowSearchResult}
								>
									<MemoizedTableWrapper
										columnDefs={columnDefs}
										showSearchResult={showSearchResult}
									/>
								</AdvancedSearch>
							</div>
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

const LoadingOverlay = () => {
	return <Spinner color="primary" />;
};

const TableWrapper = ({ data, isLoading, columnDefs, showSearchResult }) => {
	const { departmentId } = useAuthUser();
	const { t } = useTranslation();
	const { data: rqfData, isLoading: rqfLoading } = useFetchRequestFollowups();
	const gridRef = useRef();
	const [quickFilterText, setQuickFilterText] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [actionType, setActionType] = useState(null);
	const [selected, setSelected] = useState();

	const selectedRowsRef = useRef({
		selectedRowIds: [],
		selectedCount: 0,
	});

	const onSelectionChanged = () => {
		const selectedRows = gridRef.current.api.getSelectedRows();
		selectedRowsRef.current.selectedRowIds = selectedRows.map(
			(row) => row.bdr_id
		);
		selectedRowsRef.current.selectedCount = selectedRows.length;
	};

	function markForwardedRequests(
		budgetRequests = [],
		forwardedRequests = [],
		departmentId
	) {
		const forwardedSet = new Set(
			forwardedRequests
				.filter((req) => req.rqf_forwarding_dep_id === departmentId)
				.map((req) => req.rqf_request_id)
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
			departmentId
		);
	}

	const rowSelection = useMemo(() => {
		return {
			mode: "multiRow",
		};
	}, []);

	const handleClick = (event) => {
		const { selectedCount } = selectedRowsRef.current;

		if (selectedCount === 0) return;
		setSelected(selectedRowsRef.current.selectedRowIds);
		setActionType(event.target.name); // "approve" or "reject"
		setModalOpen(true);
	};

	const updateBudgetRequest = useBulkUpdateBudgetRequestApproval();
	const handleUpdateBudgetRequest = async (data) => {
		try {
			await updateBudgetRequest.mutateAsync(data);
			toast.success(t("update_success"), {
				autoClose: 3000,
			});
		} catch (error) {
			toast.success(t("update_failure"), {
				autoClose: 3000,
			});
		}
	};

	const confirmAction = async () => {
		const data = {
			request_list: selected,
			request_status: actionType === "approve" ? 3 : 4,
		};
		setModalOpen(false);
		await handleUpdateBudgetRequest(data);
	};

	return (
		<div>
			<Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
				<ModalHeader toggle={() => setModalOpen(false)}>
					<strong>
						{" "}
						Confirm {actionType === "approve" ? "Approval" : "Rejection"}
					</strong>
				</ModalHeader>
				<ModalBody>
					<h5>
						Are you sure you want to <strong>{actionType}</strong>{" "}
						{selectedRowsRef.current.selectedCount} request(s)?
					</h5>
				</ModalBody>
				<ModalFooter>
					<Button
						color={actionType === "approve" ? "success" : "danger"}
						onClick={confirmAction}
						disabled={updateBudgetRequest.isPending}
					>
						Yes, {actionType}
					</Button>
					<Button color="secondary" onClick={() => setModalOpen(false)}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>

			<>
				<div className="ag-theme-alpine">
					{/* Row for search input and buttons */}
					<Row className="mb-1 d-flex align-items-center justify-content-between">
						<Col sm="12" md="6">
							<Input
								type="text"
								placeholder="Search..."
								onChange={(e) => setQuickFilterText(e.target.value)}
								className="mb-2"
							/>
						</Col>
						<Col
							className="mb-2 d-flex align-items-center justify-content-end gap-3"
							md={6}
						>
							<Button
								color="success"
								name="approve"
								onClick={handleClick}
								disabled={updateBudgetRequest.isPending}
							>
								Approve
							</Button>
							<Button
								color="danger"
								name="reject"
								onClick={handleClick}
								disabled={updateBudgetRequest.isPending}
							>
								Reject
							</Button>
						</Col>
					</Row>
					{/* AG Grid */}
					<div>
						<AgGridReact
							ref={gridRef}
							rowData={showSearchResult ? transformedData : []}
							loading={isLoading}
							loadingOverlayComponent={LoadingOverlay}
							columnDefs={columnDefs}
							pagination={true}
							paginationPageSizeSelector={[10, 20, 30, 40, 50]}
							paginationPageSize={30}
							quickFilterText={quickFilterText}
							onSelectionChanged={onSelectionChanged}
							rowHeight={35}
							animateRows={true}
							domLayout="autoHeight"
							rowSelection={rowSelection}
						/>
					</div>
				</div>
			</>
		</div>
	);
};

const MemoizedTableWrapper = memo(TableWrapper);
