import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TreeForLists from "../../components/Common/TreeForLists";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectMonitoringEvaluations } from "../../queries/projectmonitoringevaluation_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import AgGridContainer from "../../components/Common/AgGridContainer";
import MonitoringEvaluationAnalysis from "./MonitoringEvaluationAnalysis";
import { useFetchMonitoringEvaluationTypes } from "../../queries/monitoringevaluationtype_query";

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
  const { data, isLoading, error, isError, refetch } = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const { data: meTypes } = useFetchMonitoringEvaluationTypes();

  const handleViewDetails = (rowData) => {
    setSelectedEvaluation(rowData);
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
      headerName: t("mne_physical"),
      field: "mne_physical",
      sortable: true,
      filter: false,
      width: 120,
      valueFormatter: ({ value }) =>
        truncateText(Number(value).toLocaleString(), 30) || "-",
    },
    {
      headerName: t("mne_financial"),
      field: "mne_financial",
      sortable: true,
      filter: false,
      width: 120,
      valueFormatter: ({ value }) =>
        truncateText(Number(value).toLocaleString(), 30) || "-",
    },
    {
      headerName: t("mne_physical_region"),
      field: "mne_physical_region",
      sortable: true,
      filter: false,
      width: 120,
      valueFormatter: ({ value }) =>
        truncateText(Number(value).toLocaleString(), 30) || "-",
    },
    {
      headerName: t("mne_financial_region"),
      field: "mne_financial_region",
      sortable: true,
      filter: false,
      width: 120,
      valueFormatter: ({ value }) =>
        truncateText(Number(value).toLocaleString(), 30) || "-",
    },
    {
      headerName: t("mne_start_date"),
      field: "mne_start_date",
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => truncateText(value, 30) || "-",
    },
    {
      headerName: t("mne_end_date"),
      field: "mne_end_date",
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: ({ value }) => truncateText(value, 30) || "-",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleViewDetails(params.data)}
        >
          <i className="mdi mdi-chart-bar me-1"></i> Analyze
        </button>
      ),
      width: 120,
      sortable: false,
      filter: false,
    },
  ];

  useEffect(() => {
    setSelectedEvaluation(null);
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
            breadcrumbItem={t("Project Monitoring and Evaluation List")}
          />
          <div className="w-100 d-flex gap-2">
            <TreeForLists
              onNodeSelect={handleNodeSelect}
              setIsAddressLoading={setIsAddressLoading}
              setInclude={setInclude}
            />
            <div style={{ flex: "0 0 75%" }}>
              <AdvancedSearch
                searchHook={useSearchProjectMonitoringEvaluations}
                textSearchKeys={[]}
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
                  tableName="Project Monitoring and Evaluation"
                  includeKey={[
                    "prj_name",
                    "prj_code",
                    "mne_physical",
                    "mne_financial",
                    "mne_start_date",
                    "mne_end_date",
                  ]}
                  excludeKey={["is_editable", "is_deletable"]}
                />
              </AdvancedSearch>
              {showSearchResult && (
                <MonitoringEvaluationAnalysis
                  selectedData={selectedEvaluation}
                  allData={
                    showSearchResult ? searchResults?.data : data?.data || []
                  }
                  evaluationTypes={transactionTypes}
                  visitTypes={visitTypes}
                  periodTypes={meTypes?.data || []}
                  onBackToOverview={() => setSelectedEvaluation(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProjectMonitoringEvaluationList;
