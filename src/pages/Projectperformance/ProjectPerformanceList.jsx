import React, { useEffect, lazy, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectPerformances } from "../../queries/projectperformance_query";
import TreeForLists from "../../components/Common/TreeForLists";
import { useFetchProjectStatuss } from "../../queries/projectstatus_query";
import { useFetchBudgetYears } from "../../queries/budgetyear_query";
import { useFetchBudgetMonths } from "../../queries/budgetmonth_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import { Card, CardBody, Button } from "reactstrap";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import {
  createMultiSelectOptions,
  createSelectOptions,
} from "../../utils/commonMethods";
const AgGridContainer = lazy(() =>
  import("../../components/Common/AgGridContainer")
);
import ProjectPerformanceAnalysis from "./ProjectPerformanceAnalysis";

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};
const ProjectPerformanceList = (props) => {
  document.title = "Project Performance List";
  const { passedId, isActive } = props;
  const param = { prp_project_id: passedId };
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectPerformance, setProjectPerformance] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [include, setInclude] = useState(0);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const { data, error, isError, refetch } = useState({});
  const toggleViewModal = () => setModal1(!modal1);
  const { data: budgetYearData } = useFetchBudgetYears();
  const { data: budgetMonthData } = useFetchBudgetMonths();
  const { data: projectStatusData } = useFetchProjectStatuss();

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [chartType, setChartType] = useState("bar"); // Track chart type globally

  // Handle row selection
  const handleViewDetails = (rowData) => {
    setSelectedRowData(rowData);
  };

  const {
    prs_status_name_en: projectStatusOptionsEn,

    prs_status_name_or: projectStatusOptionsOr,
    prs_status_name_am: projectStatusOptionsAm,
  } = createMultiSelectOptions(projectStatusData?.data || [], "prs_id", [
    "prs_status_name_en",
    "prs_status_name_or",
    "prs_status_name_am",
  ]);

  const budgetYearOptions = createSelectOptions(
    budgetYearData?.data || [],
    "bdy_id",
    "bdy_name"
  );
  const budgetMonthOptions = createSelectOptions(
    budgetMonthData?.data || [],
    "bdm_id",
    "bdm_month"
  );

  const projectStatusMap = useMemo(() => {
    return (
      projectStatusData?.data?.reduce((acc, project_status) => {
        acc[project_status.prs_id] =
          lang === "en"
            ? project_status.prs_status_name_en
            : lang === "am"
            ? project_status.prs_status_name_am
            : project_status.prs_status_name_or;
        return acc;
      }, {}) || {}
    );
  }, [projectStatusData, lang]);

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
  //START UNCHANGED
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
        headerName: t("prp_budget_year_id"),
        field: "prp_budget_year_id",
        sortable: true,
        filter: true,
        width: "120px",
        cellRenderer: (params) => {
          return truncateText(params.data.year_name, 30) || "-";
        },
      },
      {
        headerName: t("prp_budget_month_id"),
        field: "prp_budget_month_id",
        sortable: true,
        filter: true,
        width: "120px",
        cellRenderer: (params) => {
          return truncateText(params.data.month_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_name, 30) || "-";
        },
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prj_code, 30) || "-";
        },
      },
      {
        headerName: t("prp_project_status_id"),
        field: "prp_project_status_id",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return projectStatusMap[params.data.prp_project_status_id] || "";
        },
      },
      {
        headerName: t("prp_record_date_gc"),
        field: "prp_record_date_gc",
        sortable: true,
        filter: "agDateColumnFilter", // Enable date filtering
        cellRenderer: (params) => {
          return truncateText(params.data.prp_record_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("prp_budget_planned"),
        field: "prp_budget_planned",
        sortable: true,
        filter: true,
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
        headerName: t("prp_physical_planned"),
        field: "prp_physical_planned",
        sortable: true,
        filter: true,
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
        headerName: t("baseline"), // Main header that spans both children
        headerClass: "txt-center", // Custom class for centering
        children: [
          {
            headerName: t("prp_budget_baseline"),
            field: "prp_budget_baseline",
            sortable: true,
            filter: true,
            valueFormatter: (params) => {
              if (params.value != null) {
                return new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(params.value);
              }
              return "0.00";
            },
          },
          {
            headerName: t("prp_physical_baseline"),
            field: "prp_physical_baseline",
            sortable: true,
            filter: true,
            valueFormatter: (params) => {
              if (params.value != null) {
                return new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(params.value);
              }
              return "0.00";
            },
          },
        ],
      },
      {
        headerName: t("prp_total_budget_used"),
        field: "prp_total_budget_used",
        sortable: true,
        filter: true,
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
        headerName: t("prp_physical_performance"),
        field: "prp_physical_performance",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_physical_performance, 30) || "-";
        },
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleViewDetails(params.data)}
          >
            Analysis
          </button>
        ),
        width: 120,
        sortable: false,
        filter: false,
      },
    ];
    return baseColumnDefs;
  });

  // Automatically clear selection when data changes
  useEffect(() => {
    setSelectedRowData(null);
  }, [data]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("project_performance_list")}
          />

          <div className="w-100 d-flex gap-2">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
            />
            {/* Main Content */}
            <div style={{ flex: "0 0 75%" }}>
              <AdvancedSearch
                searchHook={useSearchProjectPerformances}
                textSearchKeys={["prj_name", "prj_code"]}
                dropdownSearchKeys={[
                  {
                    key: "prp_project_status_id",
                    options:
                      lang === "en"
                        ? projectStatusOptionsEn
                        : lang === "am"
                        ? projectStatusOptionsAm
                        : projectStatusOptionsOr,
                  },
                  {
                    key: "budget_year",
                    options: budgetYearOptions,
                  },
                  {
                    key: "budget_month",
                    options: budgetMonthOptions,
                  },
                ]}
                checkboxSearchKeys={[]}
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
                  rowHeight={35}
                  paginationPageSize={10}
                  isGlobalFilter={true}
                  isExcelExport={true}
                  isPdfExport={true}
                  isPrint={true}
                  tableName="Project Performance"
                  includeKey={[
                    "prj_name",
                    "prp_record_date_gc",
                    "prp_total_budget_used",
                    "prp_physical_performance",
                    "status_name",
                    "year_name",
                    "month_name",
                  ]}
                  excludeKey={["is_editable", "is_deletable"]}
                />
              </AdvancedSearch>
              {/* Performance Analysis Section */}

              {selectedRowData ? (
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title mb-0">
                        <Button
                          color="link"
                          size="sm"
                          onClick={() => setSelectedRowData(null)}
                        >
                          <i className="mdi mdi-arrow-left"></i> Back to
                          Overview
                        </Button>
                      </h4>
                    </div>
                    <ProjectPerformanceAnalysis
                      performanceData={selectedRowData}
                      allData={
                        showSearchResult
                          ? searchResults?.data
                          : data?.data || []
                      }
                      isOverallView={false}
                      chartType={chartType}
                      onChartTypeChange={setChartType}
                    />
                  </CardBody>
                </Card>
              ) : (
                showSearchResult && (
                  <ProjectPerformanceAnalysis
                    allData={
                      showSearchResult ? searchResults?.data : data?.data || []
                    }
                    isOverallView={true}
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProjectPerformanceList;
