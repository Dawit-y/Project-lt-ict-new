import React, { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Row, Col, Input, Button } from "reactstrap";
import ExportToExcel from "./ExportToExcel";
import ExportToPDF from "./ExportToPdf";
import PrintPage from "./PrintPage";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const AgGridContainer = ({
  rowData,
  columnDefs,
  isPagination,
  paginationPageSize,
  isGlobalFilter,
  onAddClick,
  placeholder = "Filter...",
  addButtonText = "Add",
  isAddButton,
  isExcelExport = false,
  isPdfExport = false,
  isPrint = true,
  excludeKey = [],
  tableName = "",
  includeKey = [],
  rowHeight = "",
}) => {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutModeType: layout.layoutModeType,
    })
  );
  const { layoutModeType } = useSelector(selectLayoutProperties);

  return (
    <div
      className={
        layoutModeType === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
      }
      style={{ height: "100%", width: "100%" }}
    >
      <Row className="mb-2 align-items-center">
        {isGlobalFilter && (
          <Col xs="12" md="6">
            <Input
              type="text"
              placeholder={placeholder}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="mb-2 mb-md-0"
            />
          </Col>
        )}
        <Col
          xs="12"
          md="6"
          className="d-flex justify-content-md-end flex-wrap gap-2 mt-2 mt-md-0"
        >
          {isAddButton && (
            <Button color="success" onClick={onAddClick}>
              {addButtonText}
            </Button>
          )}

          {isExcelExport && (
            <ExportToExcel
              tableData={rowData}
              tablename={tableName}
              includeKey={includeKey}
            />
          )}

          {isPdfExport && (
            <ExportToPDF
              tableData={rowData}
              tablename={tableName}
              includeKey={includeKey}
            />
          )}

          {isPrint && (
            <PrintPage
              tableData={rowData || []}
              tablename={tableName}
              excludeKey={excludeKey}
              columnsToIgnore={"2"}
              gridRef={gridRef}
              columnDefs={columnDefs}
            />
          )}
        </Col>
      </Row>
      {/* AG Grid */}
      <div style={{ minHeight: "600px" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={isPagination}
          paginationPageSizeSelector={[10, 20, 30, 40, 50]}
          paginationPageSize={paginationPageSize}
          quickFilterText={quickFilterText}
          rowHeight={rowHeight.length > 0 ? rowHeight : 30}
          animateRows={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default AgGridContainer;
