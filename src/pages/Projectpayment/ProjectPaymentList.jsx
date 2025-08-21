import React, { useEffect, lazy, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useSearchProjectPayments } from "../../queries/projectpayment_query";
import TreeForLists from "../../components/Common/TreeForLists2";
import { useFetchPaymentCategorys } from "../../queries/paymentcategory_query";
import { useTranslation } from "react-i18next";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import SearchTableContainer from "../../components/Common/SearchTableContainer";
import { Button } from "reactstrap";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";
import { FaChartLine } from "react-icons/fa6";
import {
  createMultiSelectOptions,
  createSelectOptions,
} from "../../utils/commonMethods";
import { projectPaymentExportColumns } from "../../utils/exportColumnsForLists";

const AgGridContainer = lazy(
  () => import("../../components/Common/AgGridContainer"),
);
const SinglePaymentAnalysisModal = lazy(
  () => import("./Analysis/SinglePaymentAnalysisModal"),
);
const TotalPaymentAnalysisModal = lazy(
  () => import("./Analysis/TotalPaymentAnalysisModal"),
);

const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const ProjectPaymentList = () => {
  document.title = "Project Payment List";
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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

  const [singleAnalysisModal, setSingleAnalysisModal] = useState(false);
  const [totalAnalysisModal, setTotalAnalysisModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: paymentCategoryData } = useFetchPaymentCategorys();

  const {
    pyc_name_en: paymentCategoryOptionsEn,
    pyc_name_or: paymentCategoryOptionsOr,
    pyc_name_am: paymentCategoryOptionsAm,
  } = createMultiSelectOptions(paymentCategoryData?.data || [], "pyc_id", [
    "pyc_name_en",
    "pyc_name_or",
    "pyc_name_am",
  ]);

  const paymentCategoryMap = useMemo(() => {
    return (
      paymentCategoryData?.data?.reduce((acc, payment_type) => {
        acc[payment_type.pyc_id] =
          lang === "en"
            ? payment_type.pyc_name_en
            : lang === "am"
              ? payment_type.pyc_name_am
              : payment_type.pyc_name_or;
        return acc;
      }, {}) || {}
    );
  }, [paymentCategoryData, lang]);

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

  const toggleSingleAnalysisModal = () => {
    setSingleAnalysisModal(!singleAnalysisModal);
  };

  const toggleTotalAnalysisModal = () => {
    setTotalAnalysisModal(!totalAnalysisModal);
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
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        flex: 1,
        minWidth: 200,
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
        headerName: t("payment_category"),
        field: "payment_category",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return paymentCategoryMap[params.data.prp_type] || "-";
        },
      },
      {
        headerName: t("prp_payment_date_gc"),
        field: "prp_payment_date_gc",
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_date_gc, 30) || "-";
        },
      },
      {
        headerName: t("prp_payment_amount"),
        field: "prp_payment_amount",
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
        headerName: t("prp_payment_percentage"),
        field: "prp_payment_percentage",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return params.data.prp_payment_percentage
            ? `${params.data.prp_payment_percentage}%`
            : "-";
        },
      },
      {
        headerName: t("analysis"),
        field: "actions",
        cellRenderer: (params) => {
          const data = params.data;
          return (
            <div className="d-flex gap-1">
              <Button
                id={`view-${data.prp_id}`}
                color="light"
                size="sm"
                onClick={() => {
                  toggleSingleAnalysisModal();
                  setSelectedPayment(data);
                }}
              >
                <FaChartLine />
              </Button>
            </div>
          );
        },
        width: 120,
        sortable: false,
        filter: false,
      },
    ];

    return baseColumnDefs;
  }, [paymentCategoryMap, t]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Breadcrumbs
            title={t("project")}
            breadcrumbItem={t("Project Payment List")}
          />
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
                searchHook={useSearchProjectPayments}
                textSearchKeys={["prj_name", "prj_code"]}
                dateSearchKeys={["prp_payment_date_gc"]}
                dropdownSearchKeys={[
                  {
                    key: "prp_type",
                    options:
                      lang === "en"
                        ? paymentCategoryOptionsEn
                        : lang === "am"
                          ? paymentCategoryOptionsAm
                          : paymentCategoryOptionsOr,
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
                <TableWrapper
                  columnDefs={columnDefs}
                  showSearchResult={showSearchResult}
                  selectedPayment={selectedPayment}
                  singleAnalysisModal={singleAnalysisModal}
                  totalAnalysisModal={totalAnalysisModal}
                  toggleSingleAnalysisModal={toggleSingleAnalysisModal}
                  toggleTotalAnalysisModal={toggleTotalAnalysisModal}
                  data={data}
                  isSearchLoading={isSearchLoading}
                  searchResults={searchResults}
                  paymentCategoryMap={paymentCategoryMap}
                />
              </AdvancedSearch>
            </SearchTableContainer>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const TableWrapper = ({
  data,
  isLoading,
  columnDefs,
  showSearchResult,
  selectedPayment,
  singleAnalysisModal,
  totalAnalysisModal,
  toggleSingleAnalysisModal,
  toggleTotalAnalysisModal,
  isSearchLoading,
  searchResults,
  paymentCategoryMap, // Add this prop
}) => {
  const { t } = useTranslation();
  let transformedData = [];
  if (showSearchResult && searchResults) {
    transformedData = Array.isArray(searchResults.data)
      ? searchResults.data.map((item) => ({
          ...item,
          payment_category: paymentCategoryMap[item.prp_type] || "Unknown",
        }))
      : [];
  } else if (data) {
    transformedData = Array.isArray(data.data)
      ? data.data.map((item) => ({
          ...item,
          payment_category: paymentCategoryMap[item.prp_type] || "Unknown",
        }))
      : [];
  }

  return (
    <>
      <SinglePaymentAnalysisModal
        isOpen={singleAnalysisModal}
        toggle={toggleSingleAnalysisModal}
        selectedPayment={selectedPayment}
        data={transformedData}
        paymentCategoryMap={paymentCategoryMap}
      />

      <TotalPaymentAnalysisModal
        isOpen={totalAnalysisModal}
        toggle={toggleTotalAnalysisModal}
        data={transformedData}
        paymentCategoryMap={paymentCategoryMap}
      />
      <div className="d-flex flex-column" style={{ gap: "20px" }}>
        <AgGridContainer
          rowData={transformedData}
          columnDefs={columnDefs}
          isLoading={isLoading || isSearchLoading}
          isPagination={true}
          rowHeight={35}
          paginationPageSize={10}
          isGlobalFilter={true}
          isExcelExport={true}
          isPdfExport={true}
          isPrint={true}
          tableName="Project Payments"
          exportColumns={[
            ...projectPaymentExportColumns,
            {
              key: "prp_type",
              label: "payment_category",
              format: (val) => paymentCategoryMap[val] || "-",
            },
          ]}
          buttonChildren={<FaChartLine />}
          onButtonClick={toggleTotalAnalysisModal}
          disabled={!showSearchResult || isLoading}
        />
      </div>
    </>
  );
};

export default ProjectPaymentList;
