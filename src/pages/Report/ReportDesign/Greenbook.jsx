import React, { Fragment, useEffect, useState, useRef } from "react";
import { Row, Table, Button, Col } from "reactstrap";
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

import { rankItem } from "@tanstack/match-sorter-utils";
import ExportToExcel from "../../../components/Common/ExportToExcel";
// Column Filter

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

// const Greenbook = ({
//   columns,
//   data,
//   tableClass,
//   theadClass,
//   divClassName,
//   isBordered,
//   isPagination,
//   isGlobalFilter,
//   paginationWrapper,
//   SearchPlaceholder,
//   pagination,
//   buttonClass,
//   buttonName,
//   isAddButton,
//   isCustomPageSize,
//   handleUserClick,
//   isJobListGlobalFilter,
// }) => {
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const { t } = useTranslation();
//   const pageIndexRef = useRef(0); // Store the page index
//   const [pageSize, setPageSize] = useState(10);

//   const fuzzyFilter = (row, columnId, value, addMeta) => {
//     const itemRank = rankItem(row.getValue(columnId), value);
//     addMeta({ itemRank });
//     return itemRank.passed;
//   };

//   const table = useReactTable({
//     columns,
//     data,
//     filterFns: { fuzzy: fuzzyFilter },
//     state: {
//       columnFilters,
//       globalFilter,
//       pagination: {
//         pageIndex: pageIndexRef.current,
//         pageSize,
//       },
//     },
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     globalFilterFn: fuzzyFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });
//   const {
//     getHeaderGroups,
//     getRowModel,
//     getCanPreviousPage,
//     getCanNextPage,
//     getPageOptions,
//     setPageIndex,
//     nextPage,
//     previousPage,
//     getState,
//   } = table;

//   useEffect(() => {
//     setPageIndex(pageIndexRef.current); // Apply the saved page index
//   }, [data]); // Reapply the page index after data update
//   const [counts, setCounts] = useState({
//     totalRequested: 0,
//     totalReleased: 0,
//     totalApprovedCount: 0,
//     totalRequestedCount: 0, // Count of rows with requested_amount > 0
//   });
//   useEffect(() => {
//     const calculatedCounts = data.reduce(
//       (acc, data_info) => ({
//         totalRequested: acc.totalRequested + data_info.requested_amount,
//         totalReleased: acc.totalReleased + data_info.released_amount,
//         totalApprovedCount:
//           acc.totalApprovedCount + (data_info.approved === 1 ? 1 : 0),
//         totalRequestedCount:
//           acc.totalRequestedCount + (data_info.requested === 1 ? 1 : 0),
//       }),
//       {
//         totalRequested: 0,
//         totalReleased: 0,
//         totalApprovedCount: 0,
//         totalRequestedCount: 0,
//       }
//     );
//     setCounts(calculatedCounts);
//   }, [data]);

//   const rowsToFill = 7 - getRowModel().rows.length;

//   return (
//     <Fragment>
//       <div className={divClassName ? divClassName : "table-responsive"}>
//         <ExportToExcel tableData={data} tablename="Budget_Request_report" />
//         <Table
//           hover
//           className={`${tableClass} table-sm table-bordered`}
//           bordered={isBordered}
//         >
//           <thead className={theadClass}>
//             <tr key="table_header">
//               <th>S.N</th>
//               <th>I</th>
//               <th>Sector Category</th>
//               <th>Requested</th>
//               <th>Approved</th>
//               <th>{t("bdr_requested_amount")}</th>
//               <th>{t("bdr_released_amount")}</th>
//             </tr>
//           </thead>
//           <tbody style={{ height: "auto" }}>
//             {data.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length + 2} className="text-center py-5">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, key) => (
//                 <>
//                   {(key === 0 || row.psc_id !== data[key - 1].psc_id) && (
//                     <tr className="table-info">
//                       <td></td>
//                       <td>{Number(key) + 1}</td>
//                       <td>{row.sector_category}</td>
//                       <td colSpan="7"></td>
//                     </tr>
//                   )}
//                   <tr key={key}>
//                     <td>{Number(key) + 1}</td>
//                     <td>{row.sci_code}</td>
//                     <td>{row.sector_name}</td>
//                     <td>{row.requested}</td>
//                     <td>{row.approved}</td>
//                     <td>{row.requested_amount}</td>
//                     <td>{row.released_amount}</td>
//                   </tr>
//                 </>
//               ))
//             )}
//             <>
//               <tr>
//                 <td colspan="3"></td>
//                 <td>{counts.totalRequestedCount}</td>
//                 <td>{counts.totalApprovedCount}</td>
//                 <td>{counts.totalRequested}</td>
//                 <td>{counts.totalReleased}</td>
//               </tr>
//             </>
//           </tbody>
//         </Table>
//       </div>
//     </Fragment>
//   );
// };
// export default Greenbook;

const Greenbook = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  pagination,
  buttonClass,
  buttonName,
  isAddButton,
  isCustomPageSize,
  handleUserClick,
  isJobListGlobalFilter,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const groupedData = data.reduce((acc, row) => {
    const category = row.sector_category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(row);
    return acc;
  }, {});

  const overallTotals = {
    requested: 0,
    approved: 0,
    requestedAmount: 0,
    releasedAmount: 0,
  };

  // Calculate totals for each group and overall
  const categoryTotals = Object.entries(groupedData).map(([category, rows]) => {
    const totals = rows.reduce(
      (tot, row) => ({
        requested: tot.requested + 1,
        approved: tot.approved + 1,
        requestedAmount: tot.requestedAmount + row.requested_amount,
        releasedAmount: tot.releasedAmount + row.released_amount,
      }),
      {
        requested: 0,
        approved: 0,
        requestedAmount: 0,
        releasedAmount: 0,
      }
    );

    overallTotals.requested += totals.requested;
    overallTotals.approved += totals.approved;
    overallTotals.requestedAmount += totals.requestedAmount;
    overallTotals.releasedAmount += totals.releasedAmount;

    return { category, rows, totals };
  });

  return (
    <Fragment>
      <div className={divClassName ? divClassName : "table-responsive"}>
        <ExportToExcel tableData={data} tablename="Budget_Request_report" />
        <Table
          hover
          className={`${tableClass} table-sm table-bordered`}
          bordered={isBordered}
        >
          <thead className={theadClass}>
            <tr key="table_header bg-info-subtle">
              <th>S.N</th>
              <th>I</th>
              <th>Sector Category</th>
              <th>Requested</th>
              <th>Approved</th>
              <th>{t("bdr_requested_amount")}</th>
              <th>{t("bdr_released_amount")}</th>
            </tr>
          </thead>
          <tbody>
            {categoryTotals.map(({ category, rows, totals }, index) => (
              <Fragment key={category}>
                <tr className="">
                  <td colSpan="7" className="font-weight-bold bg-light">
                    {category}
                  </td>
                </tr>
                {rows.map((row, key) => (
                  <tr key={key}>
                    <td>{index + key + 1}</td>
                    <td>{row.sci_code}</td>
                    <td>{row.sector_name}</td>
                    <td>{row.requested}</td>
                    <td>{row.approved}</td>
                    <td>{row.requested_amount}</td>
                    <td>{row.released_amount}</td>
                  </tr>
                ))}
                <tr className="font-weight-bold bg-light">
                  <td colSpan="3">Subtotal</td>
                  <td>{totals.requested}</td>
                  <td>{totals.approved}</td>
                  <td>{totals.requestedAmount}</td>
                  <td>{totals.releasedAmount}</td>
                </tr>
              </Fragment>
            ))}
            <tr className="font-weight-bold bg-success text-white">
              <td colSpan="3">Overall Total</td>
              <td>{overallTotals.requested}</td>
              <td>{overallTotals.approved}</td>
              <td>{overallTotals.requestedAmount}</td>
              <td>{overallTotals.releasedAmount}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
};

export default Greenbook;
