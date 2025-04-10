import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Table } from 'reactstrap'

const TreeTableContainer = ({ data, columns }) => {
  const [expanded, setExpanded] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="table-responsive" style={{ maxHeight: '80vh', overflow: 'auto', minHeight: "400px" }}>
      <Table hover bordered size='sm'>
        <thead 
        className="sticky-top table-light p-3"
        style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1,
          }}
        >
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
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
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={row.depth > 0 ? 'bg-light' : ''} >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    // paddingLeft: `${row.depth * 2}rem`,
                    whiteSpace: "normal",
                    wordBreak: "break-word"
                  }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TreeTableContainer

function Filter({
  column,
  table,
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return  (
    <input
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        className="form-control form-control-sm"
    />
  )
}
