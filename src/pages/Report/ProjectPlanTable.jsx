import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Input } from "reactstrap";
import { FaSearch } from "react-icons/fa";
import ExportToExcel from "../../components/Common/ExportToExcel";

const ProjectFinancialPerformanceTable = ({
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
      (project.sectorcategory && project.sectorcategory.toLowerCase().includes(lowerSearchTerm)) ||
      (project.prj_name && project.prj_name.toLowerCase().includes(lowerSearchTerm)) ||
      (project.pct_name_or && project.pct_name_or.toLowerCase().includes(lowerSearchTerm))
    );
  }, [data, searchTerm]);

  const groupedData = useMemo(() => {
    if (!filteredData) return {};
    return filteredData.reduce((acc, project) => {
      const sectorcategory = project.sectorcategory || t("---");
      const projectKey = `${project.prj_name}`;
      const pctKey = `${project.pct_name_or}`;
      
      if (!acc[sectorcategory]) acc[sectorcategory] = {};
      if (!acc[sectorcategory][projectKey]) acc[sectorcategory][projectKey] = {};
      if (!acc[sectorcategory][projectKey][pctKey]) acc[sectorcategory][projectKey][pctKey] = { entries: [] };
      
      acc[sectorcategory][projectKey][pctKey].entries.push(project);
      return acc;
    }, {});
  }, [filteredData, t]);

  const allRows = useMemo(() => {
    const rows = [];
    let projectCounter = 1;
    let pctCounter = 1;

    Object.entries(groupedData || {}).forEach(([sectorcategoryName, projects]) => {
      rows.push({ type: "sectorcategory", sectorcategoryName });

      Object.entries(projects || {}).forEach(([projectKey, pcts]) => {
        const projectEntries = Object.values(pcts).flatMap(pct => pct.entries);
        const projectRowSpan = projectEntries.length;

        const projectCommonValues = {
          prj_name: projectEntries[0]?.prj_name || " ",
          rowSpan: projectRowSpan,
        };

        Object.entries(pcts || {}).forEach(([pctKey, pctData]) => {
          const pctList = Array.isArray(pctData.entries) ? pctData.entries : [pctData];
          const pctRowSpan = pctList.length;

          const pctCommonValues = {
            pct_name_or: pctList[0]?.pct_name_or || " ",
            rowSpan: pctRowSpan,
          };

          pctList.forEach((proj, index) => {
            rows.push({
              type: "project",
              ...proj,
              projectSN: index === 0 ? projectCounter : null,
              pctSN: index === 0 ? pctCounter : null,
              showProjectCells: index === 0,
              showPctCells: index === 0,
              projectCommonValues,
              pctCommonValues,
            });
          });

          pctCounter++;
        });

        projectCounter++;
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

      <div style={{ overflowX: "auto", width: "100%", borderRadius: "4px", marginBottom: "1rem" }}>
        <style>{`
          table, thead, tbody, tr, th, td { border: 0.01px solid gray; }
          .no-project-name { 
            background-color: rgba(255, 193, 7, 0.05);
            border-left: 3px solid #ffc107;
            border-right: 3px solid #ffc107;
          }
          .no-project-name td:first-child {
            border-left: 3px solid #ffc107;
          }
          .no-project-name td:last-child {
            border-right: 3px solid #ffc107;
          }
        `}</style>
        <ExportToExcel tableId="projects-plan_table" filename="ProjectPlanTable" />
        <table 
          id="projects-plan_table" 
          className={`table table-bordered table-hover ${tableClass}`}
          style={{ width: "100%", fontSize: "0.85rem", minWidth: "1000px" }}
        >
          <thead className={theadClass} style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
             <tr>
              <th colSpan="2"></th> 
              <th>Gosa Hojii</th> 
              <th colSpan="4"></th> 
               <th colSpan="18">{t("Plan")}</th>
            </tr>
            <tr>
              <th rowSpan="2">{t("SN")}</th>
              <th rowSpan="2">{t("prj_name")}</th>
              <th rowSpan="2">{t("")}</th>
              <th rowSpan="2">{t("prj_measurement_unit")}</th>
              <th rowSpan="2">{t("KPI")}</th>
              <th rowSpan="2">{t("prp_budget_year_id")}</th>
              <th rowSpan="2">{t("Plan")}</th>
              <th colSpan="4">{t("Q1")}</th>
              <th colSpan="4">{t("Q2")}</th>
              <th colSpan="4">{t("Q3")}</th>
              <th colSpan="4">{t("Q4")}</th>
              <th colSpan="2">{t("kpr_description")}</th>
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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => {
                if (row.type === "sectorcategory") {
                  return (
                    <tr key={`sectorcategory-${row.sectorcategoryName}`} style={{ backgroundColor: "#e8f4f0", fontWeight: "bold", fontSize: "0.9rem" }}>
                      <td colSpan="25">{row.sectorcategoryName}</td>
                    </tr>
                  );
                }

                const hasNoProjectName = !row.prj_name || row.prj_name.trim() === "";
                const hasNoPctName = !row.pct_name_or || row.pct_name_or.trim() === "";

                return (
                  <tr 
                    key={row.id || index} 
                    className={`${hasNoProjectName ? "no-project-name" : ""} ${hasNoPctName ? "no-pct-name" : ""}`} 
                    style={{ textAlign: "center" }}
                  >
                    {row.showProjectCells && (
                      <>
                        <td rowSpan={row.projectCommonValues.rowSpan}>{row.projectSN}</td>
                        <td rowSpan={row.projectCommonValues.rowSpan}>
                          <b>
                            {row.projectCommonValues.prj_name || (
                              <span style={{ color: "#6c757d", fontStyle: "italic" }}>{t("Unnamed Project")}</span>
                            )}
                          </b>
                        </td>
                      </>
                    )}
                    {row.showPctCells && (
                      <td rowSpan={row.pctCommonValues.rowSpan}>
                        <b>
                          {row.pctCommonValues.pct_name_or || (
                            <span style={{ color: "#6c757d", fontStyle: "italic" }}>{t("Unnamed PCT")}</span>
                          )}
                        </b>
                      </td>
                    )}
                    <td>{row.kpi_unit_measurement}</td>
                    <td>{row.kpi_name_or}</td>
                    <td>{row.budgetyear}</td>
                   <td><strong>{Number(row.totalplan)?.toLocaleString() || " "}</strong></td>

                   <td>{Number(row.kpr_planned_month_1)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_2)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_3)?.toLocaleString() || " "}</td>
                  <td><strong>{Number(row.quarter1total)?.toLocaleString() || " "}</strong></td>

                  <td>{Number(row.kpr_planned_month_4)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_5)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_6)?.toLocaleString() || " "}</td>
                  <td><strong>{Number(row.quarter2total)?.toLocaleString() || " "}</strong></td>

                  <td>{Number(row.kpr_planned_month_7)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_8)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_9)?.toLocaleString() || " "}</td>
                  <td><strong>{Number(row.quarter3total)?.toLocaleString() || " "}</strong></td>

                  <td>{Number(row.kpr_planned_month_10)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_11)?.toLocaleString() || " "}</td>
                  <td>{Number(row.kpr_planned_month_12)?.toLocaleString() || " "}</td>
                  <td><strong>{Number(row.quarter4total)?.toLocaleString() || " "}</strong></td>
                  <td>{row.kpr_description}</td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="25" style={{ textAlign: "center", padding: "2rem" }}>
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
                      <button className="page-link" onClick={() => paginate(pageNum)}>{pageNum}</button>
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

export default ProjectFinancialPerformanceTable;