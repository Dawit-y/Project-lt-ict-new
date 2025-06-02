import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  lazy,
  Suspense,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { Button, Badge, Card, CardBody } from "reactstrap";
import Spinners from "../../../components/Common/Spinner";
const Breadcrumbs = lazy(() => import("../../../components/Common/Breadcrumb"));
const ApproverBudgetRequestListModal = lazy(() =>
  import("./ApproverBudgetRequestModal")
);

const BudgetRequestAnalysis = lazy(() => import("./BudgetRequestAnalysis"));
const AdvancedSearch = lazy(() =>
  import("../../../components/Common/AdvancedSearch")
);
const FetchErrorHandler = lazy(() =>
  import("../../../components/Common/FetchErrorHandler")
);
const TreeForLists = lazy(() =>
  import("../../../components/Common/TreeForLists")
);
const AttachFileModal = lazy(() =>
  import("../../../components/Common/AttachFileModal")
);
const ConvInfoModal = lazy(() =>
  import("../../Conversationinformation/ConvInfoModal")
);
const BudgetRequestModal = lazy(() => import("../BudgetRequestModal"));
const AgGridContainer = lazy(() =>
  import("../../../components/Common/AgGridContainer")
);

import { budget_request } from "../../../settings/printablecolumns";
import { useSearchBudgetRequestforApproval } from "../../../queries/budget_request_query";
import { useFetchBudgetYears } from "../../../queries/budgetyear_query";
import { useSearchRequestCategorys } from "../../../queries/requestcategory_query";
import {
  useSearchRequestFollowups,
  useFetchRequestFollowups,
} from "../../../queries/requestfollowup_query";
import { useFetchRequestStatuss } from "../../../queries/requeststatus_query";
import { PAGE_ID } from "../../../constants/constantFile";
import { useFetchProjectStatuss } from "../../../queries/projectstatus_query";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
import { getUserSectorList } from "../../../queries/usersector_query";
import {
  createSelectOptions,
  createMultiSelectOptions,
} from "../../../utils/commonMethods";

const ApproverBudgetRequestList = () => {
  document.title = "Budget Request List";
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

  const [chartType, setChartType] = useState("bar");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    sci_name_en: sectorInfoOptionsEn,
    sci_name_or: sectorInfoOptionsOr,
    sci_name_am: sectorInfoOptionsAm,
  } = createMultiSelectOptions(sectorInformationData?.data || [], "sci_id", [
    "sci_name_en",
    "sci_name_or",
    "sci_name_am",
  ]);
  const {
    rqs_name_en: requestStatusOptionsEn,
    rqs_name_or: requestStatusOptionsOr,
    rqs_name_am: requestStatusOptionsAm,
  } = createMultiSelectOptions(requestStatus?.data || [], "rqs_id", [
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

  const budgetYearOptions = createSelectOptions(
    budgetYearData?.data || [],
    "bdy_id",
    "bdy_name"
  );
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

  const isMutable = ![3, 4].includes(parseInt(transaction?.bdr_request_status));

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
          return truncateText(params.data.prj_name, 30) || "-";
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
        headerName: t("forwarded"),
        field: "forwarded",
        sortable: true,
        filter: true,
        //flex: 1,
        width: 130,
        cellRenderer: (params) => {
          const isForwarded = params.data.forwarded;
          return (
            <Badge
              className={`font-size-12 badge-soft-${isForwarded ? "danger" : "secondary"
                }`}
            >
              {isForwarded ? t("forwarded") : t("not_forwarded")}
            </Badge>
          );
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
        headerName: t("take_action"),
        field: "take_action",
        //flex: 1,
        width: 120,
        cellRenderer: (params) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm my-auto"
              onClick={() => {
                const data = params.data;
                toggleViewModal();
                setTransaction(data);
              }}
            >
              {t("take_action")}
            </Button>
          );
        },
      },
      {
        headerName: t("View"),
        field: "view",
        width: 120,
        cellRenderer: (params) => (
          <Button
            color="primary"
            size="sm"
            onClick={() => setSelectedRequest(params.data)}
          >
            {t("Analysis")}
          </Button>
        ),
      },
      {
        headerName: t("attach_files"),
        field: "attach_files",
        //flex: 1,
        width: 80,
        cellRenderer: (params) => {
          return (
            <Button
              outline
              type="button"
              color="success"
              className="btn-sm"
              onClick={() => {
                toggleFileModal();
                setTransaction(params.data);
              }}
            >
              {t("attach_files")}
            </Button>
          );
        },
      },
      {
        headerName: t("Message"),
        field: "Message",
        //flex: 1,
        width: 100,
        cellRenderer: (params) => {
          return (
            <Button
              outline
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                toggleConvModal();
                setTransaction(params.data);
              }}
            >
              {t("Message")}
            </Button>
          );
        },
      },
    ];
    return baseColumnDefs;
  }, []);

  return (
    <Suspense fallback={<Spinners />}>
      <React.Fragment>
        <ApproverBudgetRequestListModal
          isOpen={modal1}
          toggle={toggleViewModal}
          transaction={transaction}
          budgetYearMap={budgetYearMap}
        />
        {fileModal &&
          <AttachFileModal
            isOpen={fileModal}
            toggle={toggleFileModal}
            projectId={transaction?.bdr_project_id}
            ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
            ownerId={transaction?.bdr_id}
            canAdd={isMutable}
            canEdit={isMutable}
            canDelete={isMutable}
          />
        }
        {convModal &&
          <ConvInfoModal
            isOpen={convModal}
            toggle={toggleConvModal}
            ownerTypeId={PAGE_ID.PROJ_BUDGET_REQUEST}
            ownerId={transaction?.bdr_id ?? null}
            canAdd={isMutable}
            canEdit={isMutable}
            canDelete={isMutable}
          />
        }
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
                    },
                  ]}
                  additionalParams={projectParams}
                  setAdditionalParams={setProjectParams}
                  onSearchResult={handleSearch}
                  setIsSearchLoading={setIsSearchLoading}
                  setSearchResults={setSearchResults}
                  setShowSearchResult={setShowSearchResult}
                >
                  <TableWrapper
                    columnDefs={columnDefs}
                    showSearchResult={showSearchResult}
                    setSelectedRequest={setSelectedRequest} // Pass the setter function
                    selectedRequest={selectedRequest} // Pass the selected request
                    chartType={chartType}
                    setChartType={setChartType}
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

const TableWrapper = ({
  data,
  isLoading,
  columnDefs,
  showSearchResult,
  setSelectedRequest,
  selectedRequest,
  chartType,
  setChartType,
}) => {
  const { departmentId } = useAuthUser();
  const { data: rqfData } = useFetchRequestFollowups();

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
    transformedData = markForwardedRequests(data.data, rqfData.data, departmentId);
  }

  return (
    <div className="d-flex flex-column" style={{ gap: "20px" }}>
      <AgGridContainer
        rowData={showSearchResult ? transformedData : []}
        columnDefs={columnDefs}
        isLoading={isLoading}
        isPagination={true}
        paginationPageSize={10}
        isGlobalFilter={true}
        isAddButton={false}
        rowHeight={35}
        addButtonText="Add"
        isExcelExport={true}
        isPdfExport={true}
        isPrint={true}
        tableName="budget_request"
        includeKey={[
          "bdy_name",
          "prj_name",
          "prj_code",
          "bdr_request_status",
          "bdr_requested_amount",
          "bdr_released_amount",
          "bdr_requested_date_gc",
          "bdr_released_date_gc",
          "bdr_description",
        ]}
        excludeKey={["is_editable", "is_deletable"]}
      />

      {/* Analysis View */}
      {selectedRequest ? (
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title mb-0">
                Single Analysis
                <Button
                  color="link"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                >
                  <i className="mdi mdi-arrow-left"></i> Back to Overview
                </Button>
              </h4>
            </div>
            <BudgetRequestAnalysis
              budgetRequestData={selectedRequest}
              allData={transformedData}
              isOverallView={false}
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </CardBody>
        </Card>
      ) : (
        showSearchResult &&
        transformedData.length > 0 && (
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">
                Overall Budget Requests Analysis
              </h4>
              <BudgetRequestAnalysis
                allData={transformedData}
                isOverallView={true}
                chartType={chartType}
                onChartTypeChange={setChartType}
              />
            </CardBody>
          </Card>
        )
      )}
    </div>
  );
};
