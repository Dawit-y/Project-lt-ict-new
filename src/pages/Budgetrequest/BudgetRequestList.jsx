import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import RightOffCanvas from "../../components/Common/RightOffCanvas";
import BudgetRequestAmount from "../Budgetrequestamount/index";
import BudgetRequestTask from "../Budgetrequesttask/index";
import BudgetExSource from "../Budgetexsource/index";
import { useTranslation } from "react-i18next";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Input,
  Badge,
} from "reactstrap";
import { FaPaperclip, FaPenSquare, FaEye, FaCog } from "react-icons/fa";
import AgGridContainer from "../../components/Common/AgGridContainer";
import { useSearchBudgetRequests } from "../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import TreeForLists from "../../components/Common/TreeForLists2";
import AttachFileModal from "../../components/Common/AttachFileModal";
import ConvInfoModal from "../../pages/Conversationinformation/ConvInfoModal";
import { PAGE_ID } from "../../constants/constantFile";
import BudgetRequestModal from "./BudgetRequestModal";
import { useFetchRequestCategorys } from "../../queries/requestcategory_query";
import { createMultiLangKeyValueMap } from "../../utils/commonMethods";
import { budgetRequestExportColumns } from "../../utils/exportColumnsForLists";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const BudgetRequestListModel = () => {
  document.title = "Budget Request List";
  const { t, i18n } = useTranslation();
  const [budgetRequestMetaData, setBudgetRequestMetaData] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [convModal, setConvModal] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data, isLoading, error, isError, refetch } = useState(null);
  const { data: budgetYearData } = useFetchBudgetYears();
  const { data: bgCategoryOptionsData } = useFetchRequestCategorys();
  const { data: projectStatusData } = useFetchProjectStatuss();

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);

  const [transaction, setTransaction] = useState({});

  const budgetYearOptions = useMemo(() => {
    return (
      budgetYearData?.data?.map((year) => ({
        label: year.bdy_name,
        value: year.bdy_id,
      })) || []
    );
  }, [budgetYearData]);

  const requestCategoryOptions = useMemo(() => {
    return (
      bgCategoryOptionsData?.data?.map((category) => ({
        label: category.rqc_name_en,
        value: category.rqc_id,
      })) || []
    );
  }, [bgCategoryOptionsData]);

  const bgCategoryMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      bgCategoryOptionsData?.data || [],
      "rqc_id",
      {
        en: "rqc_name_en",
        am: "rqc_name_am",
        or: "rqc_name_or",
      },
      i18n.language
    );
  }, [bgCategoryOptionsData, i18n.language]);

  const projectStatusOptions = useMemo(() => {
    return (
      projectStatusData?.data?.map((type) => ({
        label: type.prs_status_name_or,
        value: type.prs_id,
      })) || []
    );
  }, [projectStatusData]);

  const projectStatusMap = useMemo(() => {
    return createMultiLangKeyValueMap(
      projectStatusData?.data || [],
      "prs_id",
      {
        en: "prs_status_name_en",
        am: "prs_status_name_am",
        or: "prs_status_name_or",
      },
      i18n.language
    );
  }, [projectStatusData, i18n.language]);

  const handleSearchResults = ({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  };

  const handleClick = (data) => {
    setShowCanvas(!showCanvas);
    setBudgetRequestMetaData(data);
  };

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
        width: 70,
      },
      {
        headerName: t("bdr_budget_year_id"),
        field: "bdy_name",
        sortable: true,
        filter: true,
        width: 120,
        cellRenderer: (params) => {
          return truncateText(params.data.bdy_name, 30) || "-";
        },
      },
      {
        headerName: t("bdr_request_category_id"),
        field: "bdr_request_category_id",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params) => {
          if (!params.value || !bgCategoryMap) return "-";
          const cat = bgCategoryMap[params.value];
          return cat || "-";
        },
      },
      {
        headerName: t("bdr_request_type"),
        field: "bdr_request_type",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params) => {
          if (!params.data?.bdr_request_type || !projectStatusMap) return "-";
          return projectStatusMap[params.data.bdr_request_type] || "-";
        },
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        width: 150,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("bdr_requested_amount"),
        field: "bdr_requested_amount",
        sortable: true,
        filter: true,
        width: 200,
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
        headerName: t("bdr_released_amount"),
        field: "bdr_released_amount",
        sortable: true,
        filter: true,
        width: 200,
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
        width: 200,
        filter: "agDateColumnFilter",
        cellRenderer: (params) => {
          return truncateText(params.data.bdr_requested_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("psc_sector_id"),
        field: "sector_name",
        sortable: true,
        flex: 1,
        filter: "agDateColumnFilter",
        minWidth: 300,
        cellRenderer: (params) => {
          return truncateText(params.data.sector_name, 60) || "-";
        },
      },
      {
        headerName: t("bdr_request_status"),
        field: "bdr_request_status",
        sortable: true,
        filter: true,
        // flex: 1,
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
        headerName: t("actions"),
        field: "actions",
        width: 170,
        cellRenderer: (params) => {
          const data = params.data;

          return (
            <div className="d-flex gap-1">
              <Button
                id={`takeAction-${data.bdr_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  toggleViewModal();
                  setTransaction(data);
                }}
              >
                <FaEye />
              </Button>
              <UncontrolledTooltip target={`takeAction-${data.bdr_id}`}>
                {t("view_detail")}
              </UncontrolledTooltip>
              <Button
                id={`view-${data.bdr_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  handleClick(data);
                }}
              >
                <FaCog />
              </Button>
              <UncontrolledTooltip target={`view-${data.bdr_id}`}>
                {t("Add Detail")}
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
  }, [bgCategoryMap, projectStatusMap]);

  return (
		<React.Fragment>
			<BudgetRequestModal
				isOpen={modal1}
				toggle={toggleViewModal}
				transaction={transaction}
			/>
			<AttachFileModal
				isOpen={fileModal}
				toggle={toggleFileModal}
				projectId={transaction?.bdr_project_id}
				ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
				ownerId={transaction?.bdr_id}
			/>
			<ConvInfoModal
				isOpen={convModal}
				toggle={toggleConvModal}
				ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
				ownerId={transaction?.bdr_id}
			/>
			<div className="page-content">
				<div className="">
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
								searchHook={useSearchBudgetRequests}
								dateSearchKeys={["budget_request_date"]}
								textSearchKeys={["prj_name"]}
								dropdownSearchKeys={[
									{
										key: "bdr_budget_year_id",
										options: budgetYearOptions,
									},
									{
										key: "bdr_request_category_id",
										options: requestCategoryOptions,
									},
									{
										key: "bdr_request_type",
										options: projectStatusOptions,
									},
								]}
								additionalParams={projectParams}
								setAdditionalParams={setProjectParams}
								onSearchResult={handleSearchResults}
								setIsSearchLoading={setIsSearchLoading}
								setSearchResults={setSearchResults}
								setShowSearchResult={setShowSearchResult}
							>
								<AgGridContainer
									rowData={
										showSearchResult ? searchResults?.data : data?.data || []
									}
									columnDefs={columnDefs}
									isLoading={isSearchLoading}
									isPagination={true}
									paginationPageSize={20}
									isGlobalFilter={true}
									isAddButton={false}
									addButtonText="Add"
									isExcelExport={true}
									isPdfExport={true}
									isPrint={true}
									tableName="Budget Request"
									exportColumns={[
										...budgetRequestExportColumns,
										{
											key: "bdr_request_type",
											label: t("bdr_request_type"),
											format: (val) => {
												return projectStatusMap[val] || "-";
											},
										},
										{
											key: "bdr_request_category_id",
											label: t("bdr_request_category_id"),
											format: (val) => {
												return bgCategoryMap[val] || "-";
											},
										},
									]}
								/>
							</AdvancedSearch>
						</SearchTableContainer>
					</div>
				</div>
			</div>
			{showCanvas && (
				<RightOffCanvas
					handleClick={handleClick}
					showCanvas={showCanvas}
					canvasWidth={84}
					name={t("budget_request")}
					id={budgetRequestMetaData.bdr_id}
					components={{
						[t("budget_request_amount")]: BudgetRequestAmount,
						[t("budget_request_task")]: BudgetRequestTask,
					}}
				/>
			)}
		</React.Fragment>
	);
};
BudgetRequestListModel.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default BudgetRequestListModel;
