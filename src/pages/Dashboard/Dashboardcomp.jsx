import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TableContainer from "../../components/Common/TableContainer";
import Pie from "../../Dashboards/Pie";
import { useTranslation } from "react-i18next";
import { Col, Row, Card, CardBody } from "reactstrap";
import accessToken from "../../helpers/jwt-token-access/accessToken";

const DashboardComponent = ({ dashboardType, objectName, columnList, endPoint }) => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  
  const commonHeight = 200; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}` + endPoint + '/listgrid', 
          {}, // Empty object for the request body (if no payload)
          {
            headers: {
              Authorization: accessToken, // Set accessToken in Authorization header
            },
          }
        );
        
        

        setTableData(response.data.data);
        if (response.data.data.length > 0) {
          setTotalCount(response.data.data[0].total_count);

          const transformedData = response.data.data.map((item) => ({
            name: item[columnList.split(",")[1]],
            value: item[columnList.split(",")[0]],
          }));
          const optionsWithDefault = [...transformedData];
          setDashboardData(optionsWithDefault);
        } else {
          setTotalCount(0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        header: "",
        accessorKey: t(columnList.split(",")[0]),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>{cellProps.row.original[columnList.split(",")[0]]}</span>
        ),
      },
      {
        header: "",
        accessorKey: t(columnList.split(",")[1]),
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <span>{cellProps.row.original[columnList.split(",")[1]]}</span>
        ),
      },
    ];
  }, [columnList, t]);

  // Table View
  if (dashboardType === 'table') {
    return (
      <React.Fragment>
        <Row>
          <Col xs="12">
            <Card>
              <CardBody style={{ height: commonHeight }}>
                <TableContainer
                  columns={columns}
                  data={tableData}
                  isGlobalFilter={false}
                  isAddButton={false}
                  isCustomPageSize={false}
                  isPagination={false}
                  buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                  tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                  theadClass="table-light"
                  pagination="pagination"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
  // Group Count View
  else if (dashboardType === 'group_count') {
    return (
      <React.Fragment>
        <Col xl="12">
          <Row>
            {(tableData || [])?.map((data, key) => (
              <Col md="4" key={"_col_" + key}>
                <Card className="mini-stats-wid">
                  <CardBody style={{ height: commonHeight }}> 
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <p className="text-muted fw-medium">{data.label}</p>
                        <h4 className="mb-0">{data.label}</h4>
                      </div>
                      <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                        <span className="avatar-title rounded-circle bg-primary">
                          <i className={"bx " + data.value + " font-size-24"}></i>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </React.Fragment>
    );
  }
  // Total Count View
  else if (dashboardType === 'total_count') {
    return (
      <React.Fragment>
        <Col xl="12">
          <Card className="mini-stats-wid">
            <CardBody style={{ height: commonHeight }}> 
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p className="text-muted fw-medium">{t(objectName)}</p>
                  <h4 className="mb-0">{totalCount}</h4>
                </div>
                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                  <span className="avatar-title rounded-circle bg-primary">
                    <i className={"bx font-size-24"}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
  // Chart View
  else if (dashboardType === 'chart') {
    return (
      <React.Fragment>
        <Col xs="12">
          <Card className="mini-stats-wid">
            <CardBody style={{ height: commonHeight }}> 
              <Pie chartData={dashboardData} dataColors='["--bs-primary","--bs-warning", "--bs-danger","--bs-info", "--bs-success"]' />
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
};
export default DashboardComponent;
