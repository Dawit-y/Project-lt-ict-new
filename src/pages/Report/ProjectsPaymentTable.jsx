import React from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import ExportToExcel from "../../components/Common/ExportToExcel";

const ProjectPaymentTable = ({
  data,
  isGlobalFilter,
  SearchPlaceholder,
  t,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "SN",
        accessor: "sn",
        Cell: ({ row, state }) =>
          row.index + 1 + state.pageIndex * state.pageSize,
        width: 50,
      },
      {
        Header: t("Project Category"),
        accessor: "Project Category",
        sortable: true,
      },
      {
        Header: t("Zone"),
        accessor: "Zone",
        sortable: true,
      },
      {
        Header: t("Sector"),
        accessor: "Sector",
        sortable: true,
      },
      {
        Header: t("Project Name (Code)"),
        accessor: "Project Name(Code)",
        sortable: true,
      },
      {
        Header: t("Payment Type"),
        accessor: "Payment Type",
        sortable: true,
      },
      {
        Header: t("Payment Date"),
        accessor: "Payment Date",
        sortable: true,
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: t("Payment Amount"),
        accessor: "Payment Amount",
        sortable: true,
        Cell: ({ value }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value),
      },
      {
        Header: t("Payment Percentage"),
        accessor: "Payment Percentage",
        sortable: true,
        Cell: ({ value }) => `${value}%`,
      },
    ],
    [t],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: "Payment Date", desc: true }],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {isGlobalFilter && (
          <div className="search-box me-2 d-inline-block">
            <div className="position-relative">
              <Input
                type="text"
                className="form-control"
                placeholder={SearchPlaceholder}
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <i className="bx bx-search-alt search-icon"></i>
            </div>
          </div>
        )}

        <div className="ms-auto d-flex align-items-center">
          <span className="me-2">Show:</span>
          <Input
            type="select"
            className="form-select form-select-sm"
            style={{ width: "70px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Input>
        </div>
      </div>
      <ExportToExcel tableData={data} tablename="Budget_Request_report" />
      <table {...getTableProps()} className="table table-bordered table-hover">
        <thead className="table-light">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                {t("no_records_found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}{" "}
          entries
        </div>

        <Pagination>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink previous onClick={() => previousPage()} />
          </PaginationItem>

          {pageOptions.map((page) => (
            <PaginationItem active={pageIndex === page} key={page}>
              <PaginationLink onClick={() => gotoPage(page)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={!canNextPage}>
            <PaginationLink next onClick={() => nextPage()} />
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
};

export default ProjectPaymentTable;
