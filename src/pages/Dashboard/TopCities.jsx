import React from "react"
import { Card, CardBody, CardTitle, Progress } from "reactstrap"
import { TopCitiesSelling } from "../../common/data"

const TopCities = () => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Top Cities Selling Product</CardTitle>
          <div className="text-center">
            <div className="mb-4">
              <i className="bx bx-map-pin text-primary display-4" />
            </div>
            <h3>1,456</h3>
            <p>San Francisco</p>
          </div>

          <div className="table-responsive mt-4">
            <table className="table align-middle table-nowrap">
              <tbody>
                {
                  (TopCitiesSelling || []).map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: "30%" }}>
                        <p className="mb-0">{item.location}</p>
                      </td>
                      <td style={{ width: "25%" }}>
                        <h5 className="mb-0">{item.value}</h5>
                      </td>
                      <td>
                        <Progress
                          value={item.progress.value}
                          color={item.progress.color}
                          className="bg-transparent progress-sm"
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default TopCities
