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

  const groupedData = useMemo(() => {
    if (!filteredData) return {};
    
    return filteredData.reduce((acc, project) => {
      const sector = project.sector || t("Other Sector");
      const projectName = project.prj_name || t("Unnamed Project");

      if (!acc[sector]) acc[sector] = {};
      if (!acc[sector][projectName]) acc[sector][projectName] = { entries: [] };
      acc[sector][projectName].entries.push(project);
      return acc;
    }, {});
  }, [filteredData, t]);

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 1;

    Object.entries(groupedData || {}).forEach(([sectorName, projects]) => {
      rows.push({ type: "sector", sectorName });
      
      Object.entries(projects || {}).forEach(([projectName, projectData]) => {
        // Ensure we're working with an array
        const entries = Array.isArray(projectData.entries) ? projectData.entries : [projectData];
        
        entries.forEach((entry, i) => {
          rows.push({
            type: "project",
            ...entry,
            prj_code: i === 0 ? entry.prj_code : "",
            prj_name: i === 0 ? projectName : "",
            projectSerial: i === 0 ? projectCounter++ : null,
          });
        });
      });
    });
    return rows;
  }, [groupedData]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
              <th rowSpan="2">{t("No")}</th>
              <th rowSpan="2">{t("prj_code")}</th>
              <th rowSpan="2">{t("prj_name")}</th>
              <th rowSpan="2">{t("Unit")}</th>
              <th rowSpan="2">{t("Waligala Hojii")}</th>
              <th colSpan="3">{t("prj_location")}</th>
              <th colSpan="2">{t("prj_implementation_year")}</th>
              <th rowSpan="2">{t("cni_name")}</th>
              <th>{t("prj_ben_number")}</th>
              <th>{t("Area to be Cultivated (ha)")}</th>
              <th>{t("prp_physical_baseline")}</th>
              <th>{t("prp_physical_planned")}</th>
              <th>{t("prj_total_estimate_budget")}</th>
              <th>{t("prp_budget_baseline")}</th>
              <th>{t("bdr_released_amount")}</th>
            </tr>
            <tr>
              <th>{t("prj_location_zone_id")}</th>
              <th>{t("prj_location_woreda_id")}</th>
              <th>{t("prj_location_description")}</th>
              <th>{t("prj_start_year")}</th>
              <th>{t("prj_end_year")}</th>
              <th colSpan="7"></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sector") {
                  return (
                    <tr
                      key={`sector-${row.sectorName}`}
                      style={{
                        backgroundColor: "#e8f4f0",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      <td colSpan="17">{row.sectorName}</td>
                    </tr>
                  );
                }
                
                return (
                  <tr key={row.id || index} style={{ textAlign: "center" }}>
                    <td>{row.projectSerial || ""}</td>
                    <td>{row.prj_code || " "}</td>
                    <td>{row.prj_name || " "}</td>
                    <td>{" %"}</td>
                    <td>{}</td>
                    <td>{row.zone || " "}</td>
                    <td>{row.woreda || " "}</td>
                    <td>{row.prj_location_description || " "}</td>
                    <td>{row.start_year || " "}</td>
                    <td>{row.end_year || " "}</td>
                    <td>{row.cni_name || " "}</td>
                    <td>{row.beneficiery || " "}</td>
                    <td>{}</td>
                    <td>{row.prp_physical_baseline|| " "}</td>
                    <td>{row.prp_physical_planned || " "}</td>
                    <td>{row.prj_total_estimate_budget || " "}</td>
                    <td>{row.prp_budget_baseline || " "}</td>
                    <td>{row.bdr_released_amountspecificyear || " "}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="17" style={{ textAlign: "center", padding: "2rem" }}>
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