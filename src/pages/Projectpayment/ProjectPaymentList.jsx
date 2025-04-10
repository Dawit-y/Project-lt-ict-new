import React, { useEffect, lazy, useMemo, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import {
  useSearchProjectPayments,
} from "../../queries/projectpayment_query";
import TreeForLists from "../../components/Common/TreeForLists";
import { useFetchPaymentCategorys } from "../../queries/paymentcategory_query";
import {
  createMultiSelectOptions,
} from "../../utils/commonMethods";
const AgGridContainer = lazy(() =>
  import("../../components/Common/AgGridContainer")
);
const ProjectPaymentList = () => {
  document.title = "Project Payment List";
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [projectPayment, setProjectPayment] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searcherror, setSearchError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [include, setInclude] = useState(0);
  const { data } = useState("");
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
  const paymentCategoryTypeMap = useMemo(() => {
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

  useEffect(() => {
    setProjectPayment(data);
  }, [data]);

  const truncateText = (text, maxLength) => {
    if (typeof text !== "string") {
      return text;
    }
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
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
      },
      {
        headerName: t("prj_name"),
        field: "prj_name",
        flex: 1,
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
        headerName: t("prp_type"),
        field: "payment_category",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return paymentCategoryTypeMap[params.data.prp_type] || "";
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
          return "0.00"; // Default value if null or undefined
        },
      },
      {
        headerName: t("prp_payment_percentage"),
        field: "prp_payment_percentage",
        sortable: true,
        filter: true,
        cellRenderer: (params) => {
          return truncateText(params.data.prp_payment_percentage, 30) || "-";
        },
      },
    ];
    return baseColumnDefs;
  });

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
            />
            {/* Main Content */}
            <div style={{ flex: "0 0 75%" }}>
              <AdvancedSearch
                searchHook={useSearchProjectPayments}
                textSearchKeys={["prj_name", "prj_code"]}
                dateSearchKeys={["payment_date"]}
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
                  tableName="Project Payment"
                  includeKey={[
                    "prj_name",
                    "prp_payment_amount",
                    "prp_payment_percentage",
                    "prp_payment_date_gc",
                  ]}
                  excludeKey={["is_editable", "is_deletable"]}
                />
              </AdvancedSearch>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProjectPaymentList;