import React from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const ProjectBudgetSourceTable = ({ data, isGlobalFilter, SearchPlaceholder, t }) => {
  // Group data by Project Name (Code)
  const groupedData = React.useMemo(() => {
    const groups = {};
    let sn = 1;
    
    data.forEach(item => {
      const projectName = item['Project Name(Code)'] || 'Unnamed Project';
      if (!groups[projectName]) {
        groups[projectName] = {
          projectName,
          category: item['Project Category'] || 'N/A',
          zone: item['Zone'] || 'N/A',
          sector: item['Sector'] || 'N/A',
          sources: [],
          projectSN: sn++,
          projectTotal: 0
        };
      }
      const amount = Number(String(item['Amount']).replace(/[^0-9.-]+/g, "")) || 0;
      groups[projectName].sources.push({
        source: item['Budget Source'] || 'N/A',
        amount: amount,
        amountFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(amount)
      });
      groups[projectName].projectTotal += amount;
    });

    return Object.values(groups);
  }, [data]);

  // Calculate grand total
  const grandTotal = React.useMemo(() => {
    return groupedData.reduce((sum, project) => sum + project.projectTotal, 0);
  }, [groupedData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'SN',
        id: 'serialNumber',
        accessor: 'projectSN',
        width: 50,
        Cell: ({ value }) => <span className="fw-bold">{value}</span>
      },
      {
        Header: t('Project Name (Code)'),
        id: 'projectNameCol',
        accessor: 'projectName',
        Cell: ({ row }) => {
          const currentProject = row.original.projectName;
          const prevProject = row.index > 0 ? groupedData[row.index - 1]?.projectName : null;
          if (row.index === 0 || currentProject !== prevProject) {
            return <span className="fw-bold">{currentProject}</span>;
          }
          return null;
        }
      },
      {
        Header: t('Project Category'),
        id: 'projectCategoryCol',
        accessor: 'category',
        Cell: ({ row }) => {
          const currentProject = row.original.projectName;
          const prevProject = row.index > 0 ? groupedData[row.index - 1]?.projectName : null;
          if (row.index === 0 || currentProject !== prevProject) {
            return row.original.category;
          }
          return null;
        }
      },
      {
        Header: t('Zone'),
        id: 'zoneCol',
        accessor: 'zone',
        Cell: ({ row }) => {
          const currentProject = row.original.projectName;
          const prevProject = row.index > 0 ? groupedData[row.index - 1]?.projectName : null;
          if (row.index === 0 || currentProject !== prevProject) {
            return row.original.zone;
          }
          return null;
        }
      },
      {
        Header: t('Sector'),
        id: 'sectorCol',
        accessor: 'sector',
        Cell: ({ row }) => {
          const currentProject = row.original.projectName;
          const prevProject = row.index > 0 ? groupedData[row.index - 1]?.projectName : null;
          if (row.index === 0 || currentProject !== prevProject) {
            return row.original.sector;
          }
          return null;
        }
      },
      {
        Header: t('Budget Source'),
        id: 'budgetSourceCol',
        accessor: row => row.sources[0]?.source || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.sources.map((source, i) => (
              <div key={i}>{source.source}</div>
            ))}
          </div>
        )
      },
      {
        Header: t('Amount'),
        id: 'amountCol',
        accessor: row => row.sources[0]?.amount || 0,
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.sources.map((source, i) => (
              <div key={i}>{source.amountFormatted}</div>
            ))}
          </div>
        )
      },
      {
        Header: t('Total Amount'),
        id: 'projectTotalCol',
        accessor: 'projectTotal',
        Cell: ({ row }) => {
          const currentProject = row.original.projectName;
          const prevProject = row.index > 0 ? groupedData[row.index - 1]?.projectName : null;
          if (row.index === 0 || currentProject !== prevProject) {
            return (
              <span className="fw-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                }).format(row.original.projectTotal)}
              </span>
            );
          }
          return null;
        }
      }
    ],
    [t, groupedData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: groupedData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: 'projectNameCol', desc: false }],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Calculate current page total
  const pageTotal = React.useMemo(() => {
    return page.reduce((sum, project) => sum + project.original.projectTotal, 0);
  }, [page]);

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
                value={globalFilter || ''}
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
            style={{ width: '70px' }}
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

      <table {...getTableProps()} className="table table-bordered table-hover">
        <thead className="table-light">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            <>
              {page.map((row, rowIndex) => {
                prepareRow(row);
                const currentProject = row.original.projectName;
                const prevProject = rowIndex > 0 ? page[rowIndex - 1]?.original.projectName : null;
                const isFirstRowForProject = rowIndex === 0 || currentProject !== prevProject;
                
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      if (isFirstRowForProject && 
                          (cell.column.id === 'projectNameCol' || 
                           cell.column.id === 'projectCategoryCol' || 
                           cell.column.id === 'zoneCol' || 
                           cell.column.id === 'sectorCol' || 
                           cell.column.id === 'projectTotalCol')) {
                        const rowCount = groupedData.filter(p => p.projectName === currentProject).length;
                        return (
                          <td {...cell.getCellProps()} rowSpan={rowCount}>
                            {cell.render('Cell')}
                          </td>
                        );
                      }
                      if (!isFirstRowForProject && 
                          (cell.column.id === 'projectNameCol' || 
                           cell.column.id === 'projectCategoryCol' || 
                           cell.column.id === 'zoneCol' || 
                           cell.column.id === 'sectorCol' || 
                           cell.column.id === 'projectTotalCol')) {
                        return null;
                      }
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
             
              {/* Grand Total Row */}
              <tr className="fw-bold bg-light">
                <td colSpan={7}>Sum of Total Amount</td>
                <td>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                  }).format(grandTotal)}
                </td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                {t('no_records_found')}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {pageIndex * pageSize + 1} to{' '}
          {Math.min((pageIndex + 1) * pageSize, groupedData.length)} of {groupedData.length} entries
        </div>
        
        <Pagination>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink first onClick={() => gotoPage(0)} />
          </PaginationItem>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink previous onClick={() => previousPage()} />
          </PaginationItem>
          
          {pageOptions.slice(
            Math.max(0, pageIndex - 2),
            Math.min(pageOptions.length, pageIndex + 3)
          ).map((page) => (
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

export default ProjectBudgetSourceTable;