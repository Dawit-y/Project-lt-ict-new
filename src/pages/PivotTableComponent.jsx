import React, { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

const PivotTableComponent = ({ data }) => {
  const [pivotState, setPivotState] = useState({
    rows: ["prj_name"], // Initial rows
    cols: ["prj_code"], // Initial columns
    aggregatorName: "Sum",
    vals: ["prj_total_actual_budget"], // Column to aggregate
    rendererName: "Table",
  });

  return (
    <div>
      <PivotTableUI
        data={data}
        onChange={(state) => setPivotState(state)}
        {...pivotState}
      />
    </div>
  );
};

export default PivotTableComponent;
