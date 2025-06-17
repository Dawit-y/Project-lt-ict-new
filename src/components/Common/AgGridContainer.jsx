import React, { useRef, useState, memo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Row, Col, Input, Button } from "reactstrap";
import ExportToExcel from "./ExportToExcel";
import ExportToPDF from "./ExportToPdf";
import PrintPage from "./PrintPage";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Spinner, UncontrolledTooltip, UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { FaFileExport } from "react-icons/fa";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

const LoadingOverlay = () => {
  return <Spinner color="primary" />
}

const AgGridContainer = ({
	rowData,
	columnDefs,
	isLoading = false,
	isPagination = true,
	paginationPageSize = 10,
	isGlobalFilter = true,
	onAddClick,
	placeholder = "Filter...",
	addButtonText = "Add",
	isAddButton = false,
	rowHeight = 32,
	rowSelection,
	onSelectionChanged,
	onGridReady,
	isExcelExport = false,
	isPdfExport = false,
	isPrint = true,
	excludeKey = [],
	tableName = "",
	includeKey = [],
	buttonChildren = null,
	onButtonClick = () => {},
	disabled,
}) => {
	const gridRef = useRef(null);
	const [quickFilterText, setQuickFilterText] = useState("");
	const { t } = useTranslation();

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
					{buttonChildren && (
						<Button color="primary" onClick={onButtonClick} disabled={disabled}>
							{buttonChildren}
						</Button>
					)}
					{isAddButton && (
						<Button color="success" onClick={onAddClick}>
							{addButtonText}
						</Button>
					)}

					{(isExcelExport || isPdfExport || isPrint) && (
						<>
							<UncontrolledDropdown>
								<DropdownToggle color="primary" id="export_toggle">
									<FaFileExport size={18} />
								</DropdownToggle>
								<DropdownMenu end className="py-2 mt-1">
									{isExcelExport && (
										<ExportToExcel
											tableData={rowData}
											tablename={tableName}
											excludeKey={excludeKey}
											dropdownItem={true}
											includeKey={includeKey}
										/>
									)}
									{isPdfExport && (
										<ExportToPDF
											tableData={rowData}
											tablename={tableName}
											excludeKey={excludeKey}
											dropdownItem={true}
											includeKey={includeKey}
										/>
									)}
									{isPrint && (
										<PrintPage
											gridRef={gridRef}
											columnDefs={columnDefs}
											tableData={rowData}
											tablename={tableName}
											excludeKey={excludeKey}
											dropdownItem={true}
											includeKey={includeKey}
										/>
									)}
								</DropdownMenu>
							</UncontrolledDropdown>
							<UncontrolledTooltip placement="top" target="export_toggle">
								Export
							</UncontrolledTooltip>
						</>
					)}
				</Col>
			</Row>
			{/* AG Grid */}
			<div style={{ minHeight: "600px" }}>
				<AgGridReact
					ref={gridRef}
					rowData={rowData}
					columnDefs={columnDefs}
					loading={isLoading}
					loadingOverlayComponent={LoadingOverlay}
					overlayNoRowsTemplate={t("no_rows_to_show")}
					pagination={isPagination}
					paginationPageSizeSelector={[10, 20, 30, 40, 50]}
					paginationPageSize={paginationPageSize}
					quickFilterText={quickFilterText}
					rowHeight={rowHeight}
					rowSelection={rowSelection}
					onSelectionChanged={onSelectionChanged}
					animateRows={true}
					domLayout="autoHeight"
					onGridReady={(params) => {
						gridRef.current = params.api;
						if (typeof onGridReady === "function") {
							onGridReady(params.api); // Expose API to parent
						}
					}}
				/>
			</div>
		</div>
	);
};

export default AgGridContainer;
