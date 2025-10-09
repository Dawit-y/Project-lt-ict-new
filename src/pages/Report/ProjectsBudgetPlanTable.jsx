import React from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";

const ProjectsBudgetPlanTable = ({
  data,
  isGlobalFilter,
  SearchPlaceholder,
  t,
}) => {
  // Prepare grouped data by project name
  const groupedData = React.useMemo(() => {
    const groups = {};
    let projectSN = 1;

    data.forEach((item) => {
      const projectName = item["Project Name(Code)"];
      if (!groups[projectName]) {
        groups[projectName] = {
          projectName,
          zone: item.Zone || "N/A",
          woreda: item.Woreda || "N/A",
          sector: item.Sector || "N/A",
          budgetPlans: [],
          totalBudget: 0,
          projectSN: projectSN++,
        };
      }
      const amount = Number(item["Budget Amount"]) || 0;
      groups[projectName].budgetPlans.push({
        year: item["Budget Year"] || "N/A",
        code: item["Budget Code"] || "N/A",
        amount: amount,
      });
      groups[projectName].totalBudget += amount;
    });

    return Object.values(groups);
  }, [data]);

  // Calculate grand total budget
  const grandTotalBudget = React.useMemo(() => {
    return groupedData.reduce((sum, project) => sum + project.totalBudget, 0);
  }, [groupedData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "SN",
        accessor: "projectSN",
        width: 50,
        Cell: ({ value }) => <span className="fw-bold">{value}</span>,
      },
      {
        Header: "Project Name (Code)",
        accessor: "projectName",
        Cell: ({ value }) => <span className="fw-bold">{value}</span>,
      },
      {
        Header: "Zone",
        accessor: "zone",
      },
      {
        Header: "Woreda",
        accessor: "woreda",
      },
      {
        Header: "Sector",
        accessor: "sector",
      },
      {
        Header: "Budget Year",
        id: "budgetYear",
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.budgetPlans.map((plan, i) => (
              <div key={i}>{plan.year}</div>
            ))}
          </div>
        ),
      },
      {
        Header: "Budget Code",
        id: "budgetCode",
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.budgetPlans.map((plan, i) => (
              <div key={i}>{plan.code}</div>
            ))}
          </div>
        ),
      },
      {
        Header: "Budget Amount",
        id: "budgetAmount",
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.budgetPlans.map((plan, i) => (
              <div key={i}>
                {new Intl.NumberFormat("en-US").format(plan.amount)}
              </div>
            ))}
          </div>
        ),
      },
      {
        Header: "Total Budget",
        accessor: "totalBudget",
        Cell: ({ value }) => (
          <span className="fw-bold">
            {new Intl.NumberFormat("en-US").format(value)}
          </span>
        ),
      },
    ],
    [],
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
  } = useTable(
    {
      columns,
      data: groupedData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: "projectName", desc: false }],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { globalFilter, pageIndex, pageSize } = state;

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

      <table {...getTableProps()} className="table table-bordered">
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
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
          {/* Grand Total Row */}
          <tr className="fw-bold bg-light">
            <td colSpan={8}>Sum of Total Budget</td>
            <td>{new Intl.NumberFormat("en-US").format(grandTotalBudget)}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, groupedData.length)} of{" "}
          {groupedData.length} entries
        </div>

        <Pagination>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink first onClick={() => gotoPage(0)} />
          </PaginationItem>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink previous onClick={() => previousPage()} />
          </PaginationItem>

          {pageOptions
            .slice(
              Math.max(0, pageIndex - 2),
              Math.min(pageOptions.length, pageIndex + 3),
            )
            .map((page) => (
              <PaginationItem active={pageIndex === page} key={page}>
                <PaginationLink onClick={() => gotoPage(page)}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

          <PaginationItem disabled={!canNextPage}>
            <PaginationLink next onClick={() => nextPage()} />
          </PaginationItem>
          <PaginationItem disabled={!canNextPage}>
            <PaginationLink last onClick={() => gotoPage(pageCount - 1)} />
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
};

export default ProjectsBudgetPlanTable;
