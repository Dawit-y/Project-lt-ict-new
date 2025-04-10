import React, {
  useEffect,
  lazy,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TreeForLists from "../../components/Common/TreeForLists";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { createMultiSelectOptions } from "../../utils/commonMethods";
import {
  useFetchProcurementInformations,
  useSearchProcurementInformations,
} from "../../queries/procurementinformation_query";
import { useFetchProcurementStages } from "../../queries/procurementstage_query";
import { useFetchProcurementMethods } from "../../queries/procurementmethod_query";

const AgGridContainer = lazy(() =>
  import("../../components/Common/AgGridContainer")
);

const truncateText = (text, maxLength) =>
  typeof text === "string" && text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || "-";

const ProcurementInformationList = () => {
  document.title = "ProcurementInformation";
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [include, setInclude] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const gridRef = useRef(null);

  const { data, isLoading, error, isError, refetch } =
    useFetchProcurementInformations(projectParams);

  const { data: procurementStageData } = useFetchProcurementStages();
  const { data: procurementMethodData } = useFetchProcurementMethods();

  const {
    pst_name_en: procurementStageOptionsEn,
    pst_name_or: procurementStageOptionsOr,
    pst_name_am: procurementStageOptionsAm,
  } = createMultiSelectOptions(procurementStageData?.data || [], "pst_id", [
    "pst_name_en",
    "pst_name_or",
    "pst_name_am",
  ]);

  const {
    prm_name_en: procurementMethodOptionsEn,
    prm_name_or: procurementMethodOptionsOr,
    prm_name_am: procurementMethodOptionsAm,
  } = createMultiSelectOptions(procurementMethodData?.data || [], "prm_id", [
    "prm_name_en",
    "prm_name_or",
    "prm_name_am",
  ]);

  const procurementStageMap = useMemo(() => {
    return (
      procurementStageData?.data?.reduce((acc, item) => {
        acc[item.pst_id] =
          lang === "en"
            ? item.pst_name_en
            : lang === "am"
            ? item.pst_name_am
            : item.pst_name_or;
        return acc;
      }, {}) || {}
    );
  }, [procurementStageData, lang]);

  const procurementMethodMap = useMemo(() => {
    return (
      procurementMethodData?.data?.reduce((acc, item) => {
        acc[item.prm_id] =
          lang === "en"
            ? item.prm_name_en
            : lang === "am"
            ? item.prm_name_am
            : item.prm_name_or;
        return acc;
      }, {}) || {}
    );
  }, [procurementMethodData, lang]);

  useEffect(() => {
    setProjectParams({
      ...(prjLocationRegionId && { prj_location_region_id: prjLocationRegionId }),
      ...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
      ...(prjLocationWoredaId && { prj_location_woreda_id: prjLocationWoredaId }),
      ...(include === 1 && { include }),
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

  const handleNodeSelect = useCallback((node) => {
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
  }, []);

  const handleSearchResults = useCallback(({ data, error }) => {
    setSearchResults(data);
    setSearchError(error);
    setShowSearchResult(true);
  }, []);

  const columnDefs = useMemo(() => {
    return [
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
        sortable: true,
        filter: true,
        cellRenderer: (params) => truncateText(params.data.prj_name, 30),
      },
      {
        headerName: t("prj_code"),
        field: "prj_code",
        sortable: true,
        filter: true,
        cellRenderer: (params) => truncateText(params.data.prj_code, 30),
      },
      {
        headerName: t("pri_total_procurement_amount"),
        field: "pri_total_procurement_amount",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pri_total_procurement_amount, 30),
      },
      {
        headerName: t("pri_bid_opening_date"),
        field: "pri_bid_opening_date",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pri_bid_opening_date, 30),
      },
      {
        headerName: t("pri_bid_closing_date"),
        field: "pri_bid_closing_date",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pri_bid_closing_date, 30),
      },
      {
        headerName: t("pri_bid_award_date"),
        field: "pri_bid_award_date",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(params.data.pri_bid_award_date, 30),
      },
      {
        headerName: t("pri_procurement_stage_id"),
        field: "pri_procurement_stage_id",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(
            procurementStageMap[params.data.pri_procurement_stage_id],
            30
          ),
      },
      {
        headerName: t("pri_procurement_method_id"),
        field: "pri_procurement_method_id",
        sortable: true,
        filter: true,
        cellRenderer: (params) =>
          truncateText(
            procurementMethodMap[params.data.pri_procurement_method_id],
            30
          ),
      },
    ];
  }, [t, procurementStageMap, procurementMethodMap]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <Breadcrumbs
        title={t("project")}
        breadcrumbItem={t("Project Payment List")}
      />
      <div className="w-100 d-flex gap-2">
        <TreeForLists
          onNodeSelect={handleNodeSelect}
          setIsAddressLoading={() => {}}
          setInclude={setInclude}
        />
        <div className="w-100">
          <AdvancedSearch
            searchHook={useSearchProcurementInformations}
            textSearchKeys={["prj_name", "prj_code"]}
            dropdownSearchKeys={[
              {
                key: "pri_procurement_stage_id",
                options:
                  lang === "en"
                    ? procurementStageOptionsEn
                    : lang === "am"
                    ? procurementStageOptionsAm
                    : procurementStageOptionsOr,
              },
              {
                key: "pri_procurement_method_id",
                options:
                  lang === "en"
                    ? procurementMethodOptionsEn
                    : lang === "am"
                    ? procurementMethodOptionsAm
                    : procurementMethodOptionsOr,
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
              ref={gridRef}
              rowData={
                showSearchResult ? searchResults?.data : data?.data || []
              }
              columnDefs={columnDefs}
              isLoading={isSearchLoading || isLoading}
              isPagination
              rowHeight={35}
              paginationPageSize={10}
              isGlobalFilter
              isExcelExport
              isPdfExport
              isPrint
              tableName="Project Procurement"
              includeKey={[
                "prj_name",
                "prj_code",
                "pri_total_procurement_amount",
                "pri_bid_opening_date",
                "pri_bid_closing_date",
              ]}
              excludeKey={["is_editable", "is_deletable"]}
            />
          </AdvancedSearch>
        </div>
      </div>
    </div>
  );
};

export default ProcurementInformationList;
