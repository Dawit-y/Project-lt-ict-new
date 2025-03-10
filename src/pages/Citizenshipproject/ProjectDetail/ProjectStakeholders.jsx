import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { map, isEmpty } from "lodash";

const ProjectStakeholders = ({ data }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Stakeholders</CardTitle>

        <div className="table-responsive" style={{ minHeight: "200px" }}>
          {isEmpty(data) && <p>No stakeholders found for this project.</p>}
          <Table className="table align-middle table-nowrap">
            {data.map((item, key) => (
              <tbody key={key}>
                <tr>
                  <td style={{ width: "50px" }}>
                    {item.img ? (
                      <img
                        src={item.img}
                        className="rounded-circle avatar-xs"
                        alt=""
                      />
                    ) : (
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                          {item.profile}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <h5 className="font-size-14 m-0">
                      <Link to="#" className="text-dark">
                        {item.psh_name}
                      </Link>
                    </h5>
                  </td>
                  <td>
                    <div>
                      <Link
                        to="#"
                        className="badge bg-primary-subtle text-primary font-size-11 me-1"
                      >
                        {item.psh_stakeholder_type}
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

ProjectStakeholders.propTypes = {
  files: PropTypes.array,
};

export default ProjectStakeholders;
