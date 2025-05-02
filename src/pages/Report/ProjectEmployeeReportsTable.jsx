import React from 'react';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const ProjectEmployeeReportsTable = ({ data, isGlobalFilter, SearchPlaceholder, t }) => {
  // Prepare grouped data
  const flatData = React.useMemo(() => {
    let projectSN = 1;
    const groups = {};
    const result = [];
    
    data.forEach(item => {
      const projectName = item['Project Name(Code)'];
      if (!groups[projectName]) {
        groups[projectName] = {
          projectName,
          zone: item.Zone,
          woreda: item.Woreda, // Added Woreda
          sector: item.Sector,
          employees: [],
          employeeCount: 0,
          projectSN: projectSN++
        };
      }
      groups[projectName].employees.push(item);
      groups[projectName].employeeCount++;
    });

    // Create flattened array
    Object.values(groups).forEach(project => {
      // Add project header row
      result.push({
        isProjectRow: true,
        sn: project.projectSN,
        projectName: project.projectName,
        zone: project.zone,
        woreda: project.woreda, // Added Woreda
        sector: project.sector,
        employeeCount: project.employeeCount,
        rowSpan: project.employeeCount,
        firstEmployee: project.employees[0]
      });
      
      // Add remaining employee rows
      project.employees.slice(1).forEach(employee => {
        result.push({
          ...employee,
          isProjectRow: false,
          projectName: project.projectName,
          zone: project.zone,
          woreda: project.woreda, // Added Woreda
          sector: project.sector
        });
      });
    });

    return result;
  }, [data]);

  const totalEmployees = data.length;
  const totalProjects = new Set(data.map(item => item['Project Name(Code)'])).size;

  const columns = React.useMemo(
    () => [
      {
        Header: 'SN',
        accessor: 'sn',
        width: 70,
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="fw-bold">{value}</span>
        ) : null,
      },
      {
        Header: 'Project Name',
        accessor: 'projectName',
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="fw-bold">{value}</span>
        ) : null,
      },
      {
        Header: 'Zone',
        accessor: 'zone',
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="fw-bold">{value || 'N/A'}</span>
        ) : null,
      },
      {
        Header: 'Woreda', // New Woreda column
        accessor: 'woreda',
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="fw-bold">{value || 'N/A'}</span>
        ) : null,
      },
      {
        Header: 'Sector',
        accessor: 'sector',
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="fw-bold">{value || 'N/A'}</span>
        ) : null,
      },
      {
        Header: 'Employee Name',
        accessor: 'Employee Name',
      },
      {
        Header: 'Start Date',
        accessor: 'Start Date',
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
      {
        Header: 'End Date',
        accessor: 'End Date',
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
      },
      {
        Header: 'Employee Count',
        accessor: 'employeeCount',
        width: 120,
        Cell: ({ value, row }) => row.original.isProjectRow ? (
          <span className="badge bg-primary">{value}</span>
        ) : null,
      },
    ],
    []
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
      data: flatData,
      initialState: { 
        pageIndex: 0, 
        pageSize: 10,
        globalFilter: ''
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="table-responsive">
      {/* Search and page size controls */}
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
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </Input>
        </div>
      </div>

      {/* Table */}
      <table {...getTableProps()} className="table table-bordered mb-0">
        <thead className="table-light">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row) => {
              prepareRow(row);
              return (
                <React.Fragment key={row.id}>
                  {row.original.isProjectRow ? (
                    <tr>
                      <td rowSpan={row.original.rowSpan} className="fw-bold">{row.original.sn}</td>
                      <td rowSpan={row.original.rowSpan} className="fw-bold">{row.original.projectName}</td>
                      <td rowSpan={row.original.rowSpan} className="fw-bold">{row.original.zone || 'N/A'}</td>
                      <td rowSpan={row.original.rowSpan} className="fw-bold">{row.original.woreda || 'N/A'}</td>
                      <td rowSpan={row.original.rowSpan} className="fw-bold">{row.original.sector || 'N/A'}</td>
                      <td>{row.original.firstEmployee?.['Employee Name'] || 'N/A'}</td>
                      <td>{row.original.firstEmployee?.['Start Date'] ? 
                          new Date(row.original.firstEmployee['Start Date']).toLocaleDateString() : 'N/A'}</td>
                      <td>{row.original.firstEmployee?.['End Date'] ? 
                          new Date(row.original.firstEmployee['End Date']).toLocaleDateString() : 'N/A'}</td>
                      <td rowSpan={row.original.rowSpan} className="text-center">
                        <span className="badge bg-primary">{row.original.employeeCount}</span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>{row.original['Employee Name']}</td>
                      <td>{row.original['Start Date'] ? 
                          new Date(row.original['Start Date']).toLocaleDateString() : 'N/A'}</td>
                      <td>{row.original['End Date'] ? 
                          new Date(row.original['End Date']).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                {t('no_records_found')}
              </td>
            </tr>
          )}
          
          {/* Total row */}
          <tr className="fw-bold bg-light">
            <td colSpan={5}>Total</td>
            <td>{totalEmployees} Employees</td>
            <td>{totalProjects} Projects</td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {pageIndex * pageSize + 1} to{' '}
          {Math.min((pageIndex + 1) * pageSize, flatData.length)} of {flatData.length} entries
        </div>
        
        <Pagination>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink first onClick={() => gotoPage(0)} />
          </PaginationItem>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink previous onClick={() => previousPage()} />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, pageOptions.length) }, (_, i) => {
            const pageNumber = Math.max(0, Math.min(pageOptions.length - 5, pageIndex - 2)) + i;
            return (
              <PaginationItem active={pageIndex === pageNumber} key={pageNumber}>
                <PaginationLink onClick={() => gotoPage(pageNumber)}>
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}

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

export default ProjectEmployeeReportsTable;