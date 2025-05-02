import React from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const ProjectContractorTable = ({ data, isGlobalFilter, SearchPlaceholder, t }) => {
  // Group data by Project Name (Code)
  const groupedData = React.useMemo(() => {
    const groups = {};
    let sn = 1;
    
    data.forEach(item => {
      const projectName = item['Project Name(Code)'] || 'Unnamed Project';
      if (!groups[projectName]) {
        groups[projectName] = {
          projectName,
          contractors: [],
          projectSN: sn++,
          projectTotal: 0
        };
      }
      const contractPrice = Number(String(item['Contract Price']).replace(/[^0-9.-]+/g, "")) || 0;
      groups[projectName].contractors.push({
        contractorName: item['Contractor Name'] || 'N/A',
        contractorType: item['Contractor Type'] || 'N/A',
        contractPrice: contractPrice,
        contractPriceFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        }).format(contractPrice),
        startDate: item['Contract Start Date'] || 'N/A',
        endDate: item['Contract End Date'] || 'N/A',
        procurementMethod: item['Procrument Method'] || 'N/A',
        invitationDate: item['Invitation Date'] || 'N/A',
        signingDate: item['Invitation Signing Date'] || 'N/A'
      });
      groups[projectName].projectTotal += contractPrice;
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
        Header: t('Contractor Name'),
        id: 'contractorNameCol',
        accessor: row => row.contractors[0]?.contractorName || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>{contractor.contractorName}</div>
            ))}
          </div>
        )
      },
      {
        Header: t('Contractor Type'),
        id: 'contractorTypeCol',
        accessor: row => row.contractors[0]?.contractorType || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>{contractor.contractorType}</div>
            ))}
          </div>
        )
      },
     
      {
        Header: t('Contract Start Date'),
        id: 'startDateCol',
        accessor: row => row.contractors[0]?.startDate || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>
                {contractor.startDate === 'N/A' ? 'N/A' : new Date(contractor.startDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        )
      },
      {
        Header: t('Contract End Date'),
        id: 'endDateCol',
        accessor: row => row.contractors[0]?.endDate || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>
                {contractor.endDate === 'N/A' ? 'N/A' : new Date(contractor.endDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        )
      },
      {
        Header: t('Procurement Method'),
        id: 'procurementMethodCol',
        accessor: row => row.contractors[0]?.procurementMethod || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>{contractor.procurementMethod}</div>
            ))}
          </div>
        )
      },
      {
        Header: t('Invitation Date'),
        id: 'invitationDateCol',
        accessor: row => row.contractors[0]?.invitationDate || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>
                {contractor.invitationDate === 'N/A' ? 'N/A' : new Date(contractor.invitationDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        )
      },
      {
        Header: t('Contract Signing Date'),
        id: 'signingDateCol',
        accessor: row => row.contractors[0]?.signingDate || 'N/A',
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>
                {contractor.signingDate === 'N/A' ? 'N/A' : new Date(contractor.signingDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        )
      },
       {
        Header: t('Contract Price'),
        id: 'contractPriceCol',
        accessor: row => row.contractors[0]?.contractPrice || 0,
        Cell: ({ row }) => (
          <div className="d-flex flex-column">
            {row.original.contractors.map((contractor, i) => (
              <div key={i}>{contractor.contractPriceFormatted}</div>
            ))}
          </div>
        )
      },
      {
        Header: t('Total Price'),
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
                <td colSpan={10}>Sum of Total</td>
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

export default ProjectContractorTable;