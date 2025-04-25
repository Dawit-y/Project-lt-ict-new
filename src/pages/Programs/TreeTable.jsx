import React, { useState, memo, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Table, Spinner } from 'reactstrap';

const TreeTableContainer = ({ data, columns, setData }) => {
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    defaultColumn: {
      minSize: 100,
      maxSize: 800,
    },
    columns,
    state: {
      expanded,
    },
    columnResizeMode: 'onChange',
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    filterFromLeafRows: true,
  });

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <>
      <div className="table-responsive" style={{ maxHeight: '80vh', overflow: 'auto', minHeight: "400px" }}>
        <Table
          hover bordered size='sm'
          style={{
            ...columnSizeVars,
            width: "100%",
          }}
          striped
        >
          <thead
            className="sticky-top table-light p-3"
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}
                    style={{ width: `calc(var(--header-${header?.id}-size) * 1px)`, position: "relative" }}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() && (
                          <div className="mt-1">
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                          }`,
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <Row
                key={row.id}
                row={row}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TreeTableContainer

const Row = ({ row }) => {

  return (
    <tr>
      {row.getVisibleCells().map(cell => (
        <td
          key={cell.id}
          style={{
            width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
          }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.row.original === nextProps.row.original
  );
};

export const MemoizedRow = memo(Row);

function Filter({
  column,
  table,
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '')}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="form-control form-control-sm"
    />
  )
}
