import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row, Spinner, Table } from "reactstrap";
import img1 from "../../../assets/images/companies/img-1.png";
import { useTranslation } from "react-i18next";

const ProjectDetail = ({ data }) => {
  const { t } = useTranslation();
  if (!data) {
    return (
      <Spinner className="position-absolute top-50 start-50" size={"md"} />
    );
  }
  const excludedKeys = [
    "is_editable",
    "is_deletable",
    "prj_create_time",
    "prj_update_time",
    "prj_deleted",
    "prj_end_date_plan_gc",
    "prj_end_date_plan_et",
    "prj_outcome",
    "prj_start_date_plan_et",
    "prj_start_date_plan_gc",
    "prj_end_date_actual_et",
    "prj_owner_description",
    "prj_start_date_et",
    "prj_name",
    "prj_code",
    "color_code",
    "prj_created_by",
    "prj_geo_location",
  ];

  // Filter out unwanted keys
  const filteredDataArray = Object.entries(data).filter(
    ([key]) => !key.endsWith("_id") && !excludedKeys.includes(key),
  );
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          {/* <img src={img1} alt="" className="avatar-sm me-4" />*/}
          <div className="flex-grow-1 overflow-hidden">
            <h3 className={`p-2 alert alert-${data?.color_code}`}>
              {data?.prj_name}
            </h3>
            <span className={`badge text-white bg-${data?.color_code}`}>
              {data?.status_name}
            </span>
          </div>
        </div>
        {/*
        <h5 className="font-size-15 mt-4">{t("prj_outcome")} :</h5>
        <p className="text-muted">{data?.prj_outcome}</p>
        <h5 className="font-size-15 mt-4">{t("prj_remark")} :</h5>
        <p className="text-muted">{data?.prj_remark}</p>*/}
        <div className="text-muted">
          <Table className="table-sm">
            <tbody>
              {filteredDataArray
                ?.reduce((rows, [key, value], index) => {
                  const currentRowIndex = Math.floor(index / 3); // Group by 3 pairs per row
                  if (!rows[currentRowIndex]) rows[currentRowIndex] = []; // Initialize row if it doesn't exist
                  rows[currentRowIndex].push([key, value]);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map(([key, value], colIndex) => (
                      <>
                        <td key={`key-${rowIndex}-${colIndex}`}>{t(key)} :</td>
                        <td key={`value-${rowIndex}-${colIndex}`}>
                          {value?.toString()}
                        </td>
                      </>
                    ))}
                    {/* Ensure empty columns if the last row has fewer than 3 items */}
                    {Array.from({ length: 3 - row.length }).map((_, i) => (
                      <>
                        <td key={`empty-key-${rowIndex}-${i}`}></td>
                        <td key={`empty-value-${rowIndex}-${i}`}></td>
                      </>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};
ProjectDetail.propTypes = {
  project: PropTypes.object,
};
export default ProjectDetail;
