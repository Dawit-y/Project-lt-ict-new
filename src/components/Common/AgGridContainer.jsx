import React, { useRef, lazy, Suspense, useState, useCallback, memo, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Row, Col, Input, Button } from "reactstrap";

const LazyExportToExcel = lazy(() => import("./ExportToExcel"));
const LazyExportToPDF = lazy(() => import("./ExportToPdf"));
const LazyPrintTable = lazy(() => import("./PrintTable"));

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
	Spinner,
	UncontrolledTooltip,
	UncontrolledDropdown,
	DropdownMenu,
	DropdownToggle,
	DropdownItem
} from "reactstrap";
import { FaFileExport } from "react-icons/fa";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

const LoadingOverlay = () => {
	return <Spinner color="primary" />;
};

const AgGridContainer = ({
	rowData,
	columnDefs,
	isLoading = false,
	isPagination = true,
	paginationPageSize = 10,
	isServerSidePagination = false,
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
	tableName = "",
	exportColumns = [],
	exportSearchParams = {},
	buttonChildren = null,
	onButtonClick = () => {},
	disabled,
	// Server-side pagination props
	paginationInfo = null,
	onPageChange = () => {},
	onPageSizeChange = () => {},
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

	// Enhanced rowData with server-side serial numbers
	const enhancedRowData = useMemo(() => {
		if (!isServerSidePagination || !paginationInfo || !rowData) {
			return rowData;
		}

		const { current_page = 1, per_page = 10 } = paginationInfo;
		const startNumber = (current_page - 1) * per_page + 1;

		return rowData.map((item, index) => ({
			...item,
			server_sn: startNumber + index,
		}));
	}, [rowData, isServerSidePagination, paginationInfo]);

	// Enhanced columnDefs to handle server-side serial numbers
	const enhancedColumnDefs = useMemo(() => {
		if (!isServerSidePagination) {
			return columnDefs;
		}

		return columnDefs.map((col) => {
			if (
				col.field === "sn" ||
				col.headerName?.toLowerCase().includes("s.n") ||
				col.headerName?.toLowerCase().includes("serial")
			) {
				return {
					...col,
					field: "server_sn",
					valueGetter: undefined, 
				};
			}
			return col;
		});
	}, [columnDefs, isServerSidePagination]);
const [activeExport, setActiveExport] = useState(null);

const EXPORT = {
	EXCEL: "excel",
	PDF: "pdf",
	PRINT: "print",
};
	return (
		<div
			className={
				layoutModeType === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"
			}
			style={{ height: "100%", width: "100%" }}
		>
			{/* Toolbar */}
			<Row className="mb-3 align-items-center">
				{isGlobalFilter && (
					<Col xs="12" md="6">
						<Input
							type="text"
							placeholder={placeholder}
							value={quickFilterText}
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
								<DropdownMenu end>
	{isExcelExport && (
		<DropdownItem onClick={() => setActiveExport(EXPORT.EXCEL)}>
			Export to Excel
		</DropdownItem>
	)}

	{isPdfExport && (
		<DropdownItem onClick={() => setActiveExport(EXPORT.PDF)}>
			Export to PDF
		</DropdownItem>
	)}

	{isPrint && (
		<DropdownItem onClick={() => setActiveExport(EXPORT.PRINT)}>
			Print
		</DropdownItem>
	)}
</DropdownMenu>
							</UncontrolledDropdown>
							<UncontrolledTooltip placement="top" target="export_toggle">
								Export Data
							</UncontrolledTooltip>
						{activeExport && (
	<Suspense fallback={<Spinner size="sm" />}>
		{activeExport === EXPORT.EXCEL && (
			<LazyExportToExcel
				tableData={rowData}
				tableName={tableName}
				exportColumns={exportColumns}
				exportSearchParams={exportSearchParams}
				autoRun
				onDone={() => setActiveExport(null)}
			/>
		)}

		{activeExport === EXPORT.PDF && (
			<LazyExportToPDF
				tableData={rowData}
				tableName={tableName}
				exportColumns={exportColumns}
				exportSearchParams={exportSearchParams}
				autoRun
				onDone={() => setActiveExport(null)}
			/>
		)}

		{activeExport === EXPORT.PRINT && (
			<LazyPrintTable
				tableData={rowData}
				tableName={tableName}
				exportColumns={exportColumns}
				exportSearchParams={exportSearchParams}
				autoRun
				onDone={() => setActiveExport(null)}
			/>
		)}
	</Suspense>
)}


						</>
					)}
				</Col>
			</Row>

			{/* AG Grid */}
			<div style={{ minHeight: "200px" }}>
				<AgGridReact
					ref={gridRef}
					rowData={enhancedRowData}
					columnDefs={enhancedColumnDefs}
					loading={isLoading}
					loadingOverlayComponent={LoadingOverlay}
					overlayNoRowsTemplate={t("no_rows_to_show")}
					pagination={isPagination}
					paginationPageSizeSelector={[10, 30, 50, 100, 200]}
					paginationPageSize={paginationPageSize}
					quickFilterText={quickFilterText}
					rowHeight={rowHeight}
					rowSelection={rowSelection}
					onSelectionChanged={onSelectionChanged}
					animateRows={true}
					domLayout="autoHeight"
					suppressPaginationPanel={isServerSidePagination}
					onGridReady={(params) => {
						gridRef.current = params.api;
						if (typeof onGridReady === "function") {
							onGridReady(params.api);
						}
					}}
				/>
			</div>

			{/* Server-side Pagination */}
			{isServerSidePagination && paginationInfo && (
				<PaginationComponent
					paginationInfo={paginationInfo}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					isLoading={isLoading}
				/>
			)}
		</div>
	);
};

export default memo(AgGridContainer);

const PaginationComponent = ({
	paginationInfo,
	onPageChange,
	onPageSizeChange,
	isLoading = false,
}) => {
	if (!paginationInfo) return null;

	const { current_page, per_page, total, total_pages } = paginationInfo;

	const handlePrevious = () => {
		if (current_page > 1 && !isLoading) {
			onPageChange(current_page - 1);
		}
	};

	const handleNext = () => {
		if (current_page < total_pages && !isLoading) {
			onPageChange(current_page + 1);
		}
	};

	const handlePageSizeChange = (e) => {
		const value = e.target.value;
		const newSize = value === "All" ? Math.min(total, 2000) : parseInt(value, 10);
		onPageSizeChange(newSize);
	};

	// Calculate record range
	const startRecord = total === 0 ? 0 : (current_page - 1) * per_page + 1;
	const endRecord = Math.min(current_page * per_page, total);

	return (
		<div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
			<div className="d-flex align-items-center gap-3">
				<div className="d-flex align-items-center gap-2">
					<span className="text-muted">Show:</span>
					<Input
						type="select"
						value={per_page}
						onChange={handlePageSizeChange}
						style={{ width: "90px" }}
						disabled={isLoading}
						bsSize={"sm"}
					>
						{[10, 20, 30, 50, 100, "All"].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</Input>
				</div>
				<div className="text-muted">
					Showing {startRecord} to {endRecord} of <strong>{total}</strong>{" "}
					entries
				</div>
			</div>

			<div className="d-flex align-items-center gap-2">
				<span className="me-3 text-muted">
					Page {current_page} of {total_pages}
				</span>
				<Button
					color="outline-primary"
					size="sm"
					onClick={handlePrevious}
					disabled={current_page <= 1 || isLoading}
				>
					Previous
				</Button>
				<Button
					color="outline-primary"
					size="sm"
					onClick={handleNext}
					disabled={current_page >= total_pages || isLoading}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
