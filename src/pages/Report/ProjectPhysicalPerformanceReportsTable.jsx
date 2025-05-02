import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input } from "reactstrap";
import { FaSearch } from "react-icons/fa";

const FinancialProjectsTable = ({
  data = [],
  t = (key) => key,
  tableClass = "",
  theadClass = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return data.filter((project) =>
      (project.sector && project.sector.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_name && project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_code && project.prj_code.toLowerCase().includes(lowerSearchTerm))
    );
  }, [data, searchTerm]);

  // Group by sector, then project code + project name
  const groupedBySector = useMemo(() => {
    const sectors = {};

    filteredData.forEach((item) => {
      const sectorKey = item.sector || "Unknown Sector";
      const projectKey = `${item.prj_code}_${item.prj_name}`;

      if (!sectors[sectorKey]) {
        sectors[sectorKey] = {};
      }

      if (!sectors[sectorKey][projectKey]) {
        sectors[sectorKey][projectKey] = {
          prj_code: item.prj_code,
          prj_name: item.prj_name,
          entries: [],
        };
      }

      sectors[sectorKey][projectKey].entries.push(item);
    });

    return sectors;
  }, [filteredData]);

  // Flatten data rows with serial number
  const allRows = useMemo(() => {
    const rows = [];
    let globalProjectCounter = 1;

    Object.entries(groupedBySector).forEach(([sector, projects]) => {
      rows.push({ type: "sector", sector });

      Object.values(projects).forEach((project) => {
        project.entries.forEach((entry, entryIndex) => {
          rows.push({
            type: "project_entry",
            ...entry,
            isFirstInGroup: entryIndex === 0,
            isLastInGroup: entryIndex === project.entries.length - 1,
            projectCounter: entryIndex === 0 ? globalProjectCounter++ : null,
          });
        });
      });
    });

    return rows;
  }, [groupedBySector]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getRowStyle = (row) => {
    const style = { textAlign: "center" };
    if (row.isFirstInGroup && row.projectCounter !== null) {
      style.borderTop = "2px solid #dee2e6";
    }
    if (row.isLastInGroup && row.projectCounter !== null) {
      style.borderBottom = "2px solid #dee2e6";
    }
    return style;
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Card className="mb-3">
        <CardBody>
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
              style={{ paddingLeft: "35px" }}
            />
            <FaSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                fontSize: "1rem",
              }}
            />
          </div>
        </CardBody>
      </Card>

      <div
        style={{
          overflowX: "auto",
          width: "100%",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        <table
          className={`table table-bordered table-hover ${tableClass}`}
          style={{
            width: "100%",
            fontSize: "0.85rem",
            minWidth: "1000px",
          }}
        >
          <thead
            className={theadClass}
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f9fa",
              zIndex: 1,
            }}
          >
            <tr>
              <th rowSpan="2">{t("S/N")}</th>
              <th rowSpan="2">{t("prj_code")}</th>
              <th rowSpan="2">{t("prj_name")}</th>
              <th rowSpan="2">{t("Unit")}</th>
              <th rowSpan="2">{t("prp_budget_year_id")}</th>
              <th rowSpan="2">{t("prp_physical_baseline")}</th>
              <th rowSpan="2">{t("prp_physical_planned")}</th>
              <th colSpan="4">{t("Q1")}</th>
              <th colSpan="4">{t("Q2")}</th>
              <th colSpan="4">{t("Q3")}</th>
              <th colSpan="4">{t("Q4")}</th>
            </tr>
            <tr>
              <th>{t("Sep")}</th>
              <th>{t("Oct")}</th>
              <th>{t("Nov")}</th>
              <th>{t("Sum")}</th>
              <th>{t("Dec")}</th>
              <th>{t("Jan")}</th>
              <th>{t("Feb")}</th>
              <th>{t("Sum")}</th>
              <th>{t("Mar")}</th>
              <th>{t("Apr")}</th>
              <th>{t("May")}</th>
              <th>{t("Sum")}</th>
              <th>{t("Jun")}</th>
              <th>{t("Jul")}</th>
              <th>{t("Aug")}</th>
              <th>{t("Sum")}</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sector") {
                  return (
                    <tr key={`sector-${row.sector}`}>
                      <td colSpan="24" style={{ backgroundColor: "#e9ecef", fontWeight: "bold" }}>
                        {row.sector}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`${row.prj_code}-${index}`} style={getRowStyle(row)}>
                    <td>{row.projectCounter !== null && row.isFirstInGroup ? row.projectCounter : ""}</td>
                    <td>{row.isFirstInGroup ? row.prj_code || " " : ""}</td>
                    <td>{row.isFirstInGroup ? row.prj_name || " " : ""}</td>
                    <td>{row.unit || " "}</td>
                    <td>{row.budgetyear || " "}</td>
                    <td>{row.prp_physical_baseline || " "}</td>
                    <td>{row.prp_physical_planned || " "}</td>

                    <td>{row.prp_pyhsical_planned_month_1 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_2 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_3 || " "}</td>
                    <td><strong>{row.quarter1total || " "}</strong></td>

                    <td>{row.prp_pyhsical_planned_month_4 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_5 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_6 || " "}</td>
                    <td><strong>{row.quarter2total || " "}</strong></td>

                    <td>{row.prp_pyhsical_planned_month_7 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_8 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_9 || " "}</td>
                    <td><strong>{row.quarter3total || " "}</strong></td>

                    <td>{row.prp_pyhsical_planned_month_10 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_11 || " "}</td>
                    <td>{row.prp_pyhsical_planned_month_12 || " "}</td>
                    <td><strong>{row.quarter4total || " "}</strong></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="24" style={{ textAlign: "center", padding: "2rem" }}>
                  {searchTerm
                    ? t("No projects match your search criteria.")
                    : t("No data available. Please select related Address Structure and click Search button.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {allRows.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            {t("Showing")} {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, allRows.length)} {t("of")} {allRows.length} {t("entries")}
          </div>

          <div className="d-flex align-items-center ms-auto">
            <nav aria-label="Table pagination">
              <ul className="pagination mb-0" style={{ fontSize: "1.1rem" }}>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                      <button className="page-link" onClick={() => paginate(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>

            <div className="ms-3 position-relative" style={{ width: "70px" }}>
              <select
                className="form-control form-control-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  pointerEvents: "none",
                  transform: "translateY(-50%)",
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialProjectsTable;
