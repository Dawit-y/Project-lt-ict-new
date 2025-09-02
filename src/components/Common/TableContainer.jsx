import React, { Fragment, useEffect, useState, useRef , useMemo} from "react";
import { Row, Table, Button, Col, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	UncontrolledTooltip,
	UncontrolledDropdown,
	DropdownMenu,
	DropdownToggle,
} from "reactstrap";
import { rankItem } from "@tanstack/match-sorter-utils";
import ExportToExcel from "./ExportToExcel";
import PrintTable from "./PrintTable";
import { FaFileExport, FaInfoCircle, FaRedoAlt } from "react-icons/fa";
import ExportToPDF from "./ExportToPdf";

// Column Filter
const Filter = ({ column }) => {
	const columnFilterValue = column.getFilterValue();

	return (
		<>
			<DebouncedInput
				type="text"
				value={columnFilterValue ?? ""}
				onChange={(value) => column.setFilterValue(value)}
				placeholder="Search..."
				className="w-36 border shadow rounded"
				list={column.id + "list"}
			/>
			<div className="h-1" />
		</>
	);
};

// Global Filter
const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [debounce, onChange, value]);

	return (
		<React.Fragment>
			<Col sm={4}>
				<input
					{...props}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</Col>
		</React.Fragment>
	);
};

const MAX_PAGE_NUMBERS = 10;

const TableContainer = ({
	columns,
	data,
	tableClass,
	theadClass,
	divClassName,
	isLoading = false,
	isBordered = true,
	size = "sm",
	isPagination,
	isGlobalFilter,
	paginationWrapper,
	SearchPlaceholder,
	pagination,
	buttonName,
	isAddButton,
	isCustomPageSize,
	handleUserClick,
	isExcelExport = false,
	isPdfExport = false,
	isPrint = true,
	exportColumns = [],
	tableName = "",
	infoIcon = false,
	refetch,
	isFetching,
	resetPageIndexTrigger,
	isSummaryRow = false,
	summaryColumns = [],
	summaryLabel = "Total",
	summaryPosition = "bottom",
	customSummaryFunction,
}) => {
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const { t } = useTranslation();
	const pageIndexRef = useRef(0); // Store the page index
	const [pageSize, setPageSize] = useState(10);
	const fuzzyFilter = (row, columnId, value, addMeta) => {
		const itemRank = rankItem(row.getValue(columnId), value);
		addMeta({ itemRank });
		return itemRank.passed;
	};

	const table = useReactTable({
		columns,
		data,
		filterFns: { fuzzy: fuzzyFilter },
		state: {
			columnFilters,
			globalFilter,
			pagination: {
				pageIndex: pageIndexRef.current,
				pageSize,
			},
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const {
		getHeaderGroups,
		getRowModel,
		getCanPreviousPage,
		getCanNextPage,
		getPageOptions,
		setPageIndex,
		nextPage,
		previousPage,
		getState,
	} = table;

	useEffect(() => {
		setPageIndex(pageIndexRef.current); // Apply the saved page index
	}, [data]); // Reapply the page index after data update

	const rowsToFill = 7 - getRowModel().rows.length;

	const paginationState = getState().pagination;
	const totalPages = getPageOptions().length;
	const currentPage = paginationState.pageIndex;

	// Calculate the start and end of the current range
	const startPage =
		Math.floor(currentPage / MAX_PAGE_NUMBERS) * MAX_PAGE_NUMBERS;
	const endPage = Math.min(startPage + MAX_PAGE_NUMBERS, totalPages);

	// Create the page numbers to display
	const visiblePageNumbers = getPageOptions().slice(startPage, endPage);

	const handlePrevious = () => {
		if (getCanPreviousPage()) {
			pageIndexRef.current = currentPage - 1; // Decrement the page index
			previousPage(); // Call the function to go to the previous page
		}
	};

	const handleNext = () => {
		if (getCanNextPage()) {
			pageIndexRef.current = currentPage + 1; // Increment the page index
			nextPage(); // Call the function to go to the next page
		}
	};

	useEffect(() => {
		if (resetPageIndexTrigger) {
			pageIndexRef.current = 0;
			table.setPageIndex(0);
		}
	}, [resetPageIndexTrigger]);

	const calculateSummary = (data, summaryColumns, customSummaryFunction) => {
		if (customSummaryFunction) {
			return customSummaryFunction(data);
		}

		const summary = {};

		summaryColumns.forEach((column) => {
			summary[column] = data.reduce((total, row) => {
				const value = parseFloat(row[column]) || 0;
				return total + value;
			}, 0);
		});

		return summary;
	};

	const summaryData =
		isSummaryRow && data.length > 0
			? calculateSummary(data, summaryColumns, customSummaryFunction)
			: null;
	
	const flattenedColumns = useMemo(() => {
		const flatten = (cols) => {
			return cols.reduce((acc, column) => {
				if (column.columns) {
					return [...acc, ...flatten(column.columns)];
				} else {
					return [...acc, column];
				}
			}, []);
		};

		return flatten(columns);
	}, [columns]);

	return (
		<Fragment>
			<Row className="mb-2 d-flex align-items-center justify-content-between">
				<>
					{isCustomPageSize && (
						<Col sm={2} className="">
							<select
								className="form-select pageSize my-auto"
								value={table.getState().pagination.pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
									table.setPageSize(Number(e.target.value));
								}}
							>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										{t("Showing")} {pageSize}
									</option>
								))}
							</select>
						</Col>
					)}
					{isGlobalFilter && (
						<DebouncedInput
							value={globalFilter ?? ""}
							onChange={(value) => setGlobalFilter(String(value))}
							className="form-control search-box me-2 my-auto d-inline-block"
							placeholder={SearchPlaceholder}
						/>
					)}
				</>

				<Col sm={6}>
					<div className="text-sm-end d-flex align-items-center justify-content-end gap-2">
						{isAddButton && (
							<Button
								type="button"
								className="btn-soft-success"
								onClick={handleUserClick}
							>
								<i className="mdi mdi-plus me-1"></i> {buttonName}
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
												tableData={data}
												tableName={tableName}
												dropdownItem={true}
												exportColumns={exportColumns}
											/>
										)}
										{isPdfExport && (
											<ExportToPDF
												tableData={data}
												tableName={tableName}
												dropdownItem={true}
												exportColumns={exportColumns}
											/>
										)}
										{isPrint && (
											<PrintTable
												tableData={data}
												tableName={tableName}
												dropdownItem={true}
												exportColumns={exportColumns}
											/>
										)}
									</DropdownMenu>
								</UncontrolledDropdown>
								<UncontrolledTooltip placement="top" target="export_toggle">
									{t("export")}
								</UncontrolledTooltip>
							</>
						)}
						{refetch && (
							<>
								<Button
									id="refresh_btn"
									color="primary"
									onClick={refetch}
									outline
									className="rounded-circle p-0 d-flex align-items-center justify-content-center"
									style={{ width: "30px", height: "30px", fontSize: "14px" }}
								>
									{isFetching ? (
										<Spinner color="light" size="sm" />
									) : (
										<FaRedoAlt />
									)}
								</Button>
								<UncontrolledTooltip placement="top" target="refresh_btn">
									Refresh
								</UncontrolledTooltip>
							</>
						)}
					</div>
				</Col>
			</Row>
			<div className="position-relative">
				{isLoading && (
					<div
						className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75"
						style={{ zIndex: 1000 }}
					>
						<Spinner color="primary" />
					</div>
				)}
				{infoIcon && (
					<div
						style={{
							position: "absolute",
							top: "2px",
							right: "-18px",
							zIndex: 1,
						}}
					>
						<FaInfoCircle size={18} id="info" className="" />
						<UncontrolledTooltip placement="left" target="info">
							Sample Info
						</UncontrolledTooltip>
					</div>
				)}
				<div className={divClassName ? divClassName : "table-responsive"}>
					<div id="printable-table">
						<Table
							hover
							className={`${tableClass} table-striped`}
							size={size}
							bordered={isBordered}
						>
							<thead className={theadClass}>
								{getHeaderGroups().map((headerGroup, idx, arr) => (
									<tr key={headerGroup.id}>
										{idx === getHeaderGroups().length - 1 ? (
											<th rowSpan={1}>{t("S.N")}</th>
										) : (
											<th
												rowSpan={1}
												colSpan={1}
												style={{ visibility: "hidden" }}
											></th>
										)}
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												colSpan={header.colSpan}
												className={`${
													header.column.getCanSort()
														? "cursor-pointer select-none"
														: ""
												}`}
											>
												{header.isPlaceholder ? null : (
													<Fragment>
														<div
															{...{
																className: "d-flex align-items-center",
																onClick:
																	header.column.getToggleSortingHandler(),
															}}
														>
															{flexRender(
																header.column.columnDef.header || t(header.id),
																header.getContext()
															)}
															{/* Add sorting arrows */}
															{header.column.getCanSort() && (
																<span className="ms-1">
																	{header.column.getIsSorted() === "asc" ? (
																		<i className="mdi mdi-arrow-up" />
																	) : header.column.getIsSorted() === "desc" ? (
																		<i className="mdi mdi-arrow-down" />
																	) : (
																		<i className="mdi mdi-unfold-more-horizontal" />
																	)}
																</span>
															)}
														</div>
														{header.column.getCanFilter() ? (
															<div>
																<Filter column={header.column} />
															</div>
														) : null}
													</Fragment>
												)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody style={{ height: "auto" }}>
								{/* Summary row at top */}
								{isSummaryRow && summaryPosition === "top" && summaryData && (
									<tr className="summary-row">
										<td colSpan={1}>
											<strong>{summaryLabel}</strong>
										</td>
										{flattenedColumns.map((column, index) => {
											const columnKey = column.accessorKey || column.id;
											if (summaryColumns.includes(columnKey)) {
												return (
													<td key={`summary-${columnKey}`}>
														<strong>
															{typeof summaryData[columnKey] === "number"
																? summaryData[columnKey].toLocaleString()
																: summaryData[columnKey]}
														</strong>
													</td>
												);
											}
											return <td key={`empty-${index}`}></td>;
										})}
									</tr>
								)}

								{data.length === 0 ? (
									<tr>
										<td
											colSpan={columns.length + 2}
											className="text-center py-5"
										>
											{!isLoading && "No data availaible."}
										</td>
									</tr>
								) : (
									getRowModel().rows.map((row) => (
										<tr key={row.id}>
											<td>{Number(row.id) + 1}</td>
											{row.getVisibleCells().map((cell) => (
												<td key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</td>
											))}
										</tr>
									))
								)}

								{/* Summary row at bottom */}
								{isSummaryRow &&
									summaryPosition === "bottom" &&
									summaryData && (
										<tr className="summary-row bg-light">
											<td colSpan={1}>
												<strong>{summaryLabel}</strong>
											</td>
											{flattenedColumns.map((column, index) => {
												const columnKey = column.accessorKey || column.id;
												if (summaryColumns.includes(columnKey)) {
													return (
														<td key={`summary-${columnKey}`}>
															<strong>
																{typeof summaryData[columnKey] === "number"
																	? summaryData[columnKey].toLocaleString()
																	: summaryData[columnKey]}
															</strong>
														</td>
													);
												}
												return <td key={`empty-${index}`}></td>;
											})}
										</tr>
									)}
							</tbody>
						</Table>
					</div>
				</div>
				{isPagination && data.length > 0 && (
					<Row className="my-2">
						<Col sm={12} md={5}>
							<div className="dataTables_info">
								{paginationState.pageSize > data.length
									? `${t("Showing")} ${data.length} of ${data.length}`
									: `${t("Showing")} ${paginationState.pageSize} of ${
											data.length
										}`}
							</div>
						</Col>
						<Col sm={12} md={7}>
							<div className={paginationWrapper}>
								<ul className={pagination}>
									{/* Previous Button */}
									<li
										className={`paginate_button page-item previous ${
											!getCanPreviousPage() ? "disabled" : ""
										}`}
									>
										<Link className="page-link" onClick={handlePrevious}>
											<i className="mdi mdi-chevron-left"></i>
										</Link>
									</li>

									{/* Render visible page numbers */}
									{visiblePageNumbers.map((item) => (
										<li
											key={item}
											className={`paginate_button page-item ${
												currentPage === item ? "active" : ""
											}`}
										>
											<Link
												className="page-link"
												onClick={() => {
													pageIndexRef.current = item;
													setPageIndex(item);
												}}
											>
												{item + 1}
											</Link>
										</li>
									))}

									{/* Next Button */}
									<li
										className={`paginate_button page-item next ${
											!getCanNextPage() ? "disabled" : ""
										}`}
									>
										<Link className="page-link" onClick={handleNext}>
											<i className="mdi mdi-chevron-right"></i>
										</Link>
									</li>
								</ul>
							</div>
						</Col>
					</Row>
				)}
			</div>
		</Fragment>
	);
};

export default TableContainer;
