import React, { useEffect } from "react";
import { Card, CardBody, Col, Row, Spinner } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { createSelector } from "reselect";
import { selectBudgetRequest } from "../../store/budgetrequest/actions";
import {
  selectProject,
  fetchSingleProjectRequest,
} from "../../store/project/actions";

const BudgetRequestDetail = ({ passedId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectBudgetRequest(passedId));
  }, [dispatch]);
  const budgetRequestProperties = createSelector(
    (state) => state.BudgetRequestR,
    (BudgetRequestReducer) => ({
      selectedBudget: BudgetRequestReducer.selectedBudget,
      loading: BudgetRequestReducer.loading,
    })
  );
  const { selectedBudget } = useSelector(budgetRequestProperties);

  useEffect(() => {
    if (selectedBudget && selectedBudget.bdr_project_id) {
      dispatch(selectProject(selectedBudget.bdr_project_id));
    }
  }, [dispatch, selectedBudget]);

  const projectProperties = createSelector(
    (state) => state.ProjectR,
    (ProjectReducer) => ({
      project: ProjectReducer.project,
      selectedProject: ProjectReducer.selectedProject,
      loading: ProjectReducer.loading,
      update_loading: ProjectReducer.update_loading,
    })
  );

  const {
    project: { data: projectData, previledge },
    selectedProject,
    loading,
    update_loading,
  } = useSelector(projectProperties);

  useEffect(() => {
    if (
      selectedBudget &&
      selectedBudget.bdr_project_id &&
      isEmpty(selectedProject)
    ) {
      dispatch(fetchSingleProjectRequest(selectedBudget.bdr_project_id));
    }
  }, [dispatch, selectedProject, selectedBudget]);

  //   console.log("selectBudgetRequest", selectedBudget);
  //   {
  //     "bdr_request_status": "Rejected",
  //     "bdr_id": 1,
  //     "bdr_budget_year_id": 2,
  //     "bdr_requested_amount": 2000,
  //     "bdr_released_amount": 565656,
  //     "bdr_project_id": 1,
  //     "bdr_requested_date_ec": null,
  //     "bdr_requested_date_gc": "2000/5/7",
  //     "bdr_released_date_ec": null,
  //     "bdr_released_date_gc": "2024/10/11",
  //     "bdr_description": "something",
  //     "bdr_create_time": "2024-10-15 12:59:45",
  //     "bdr_update_time": "2024-10-18 07:48:01",
  //     "bdr_delete_time": null,
  //     "bdr_created_by": 0,
  //     "bdr_status": 0,
  //     "bdr_action_remark": "something remark2",
  //     "is_editable": 1,
  //     "is_deletable": 1
  // }
  return (
    <Row>
      <Col xl={4}>
        <Card>
          <CardBody>
            <h5 className="fw-semibold">For Project</h5>
            <div className="table-responsive" style={{ minHeight: "200px" }}>
              {!isEmpty(selectedProject) ? (
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="col">Name</th>
                      <td scope="col">{selectedProject?.prj_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Status:</th>
                      <td>{selectedProject?.prj_project_status_id}</td>
                    </tr>
                    <tr>
                      <th scope="row">Estimated Budget</th>
                      <td>{selectedProject?.prj_total_estimate_budget}</td>
                    </tr>
                    <tr>
                      <th scope="row">Description</th>
                      <td>{selectedProject?.prj_owner_description}</td>
                    </tr>
                    <tr>
                      <th scope="row">Planned Project Start Date</th>
                      <td>{selectedProject.prj_start_date_plan_gc}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <Spinner size={"md"} color="primary" />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={8}>
        <Card>
          <CardBody>
            <h5 className="fw-semibold mb-3">Description</h5>
            <p className="text-muted">{selectedBudget?.bdr_description}</p>

            <h5 className="fw-semibold mb-3">Requested Budget:</h5>
            <ul className="vstack gap-3 job-vstack">
              <li>
                <strong>Requested Amount</strong>{" "}
                {selectedBudget?.bdr_requested_amount}
              </li>
              <li>
                <strong>Requested Date</strong>{" "}
                {selectedBudget?.bdr_requested_date_gc}
              </li>
            </ul>

            <h5 className="fw-semibold mb-3">Released Budget:</h5>
            <ul className="vstack gap-3 job-vstack">
              {selectedBudget?.bdr_request_status == "Requested" && (
                <li>
                  <strong>Status</strong>{" "}
                  <span className="badge badge-soft-success ms-3">
                    Requested
                  </span>
                </li>
              )}
              {selectedBudget?.bdr_request_status == "Approved" && (
                <>
                  <li>
                    <strong>Status</strong>{" "}
                    <span className="badge badge-soft-success ms-3">
                      Approved
                    </span>
                  </li>
                  <li>
                    <strong>Released Amount</strong>{" "}
                    {selectedBudget?.bdr_released_amount}
                  </li>
                  <li>
                    <strong>Released Date</strong>{" "}
                    {selectedBudget?.bdr_released_date_gc}
                  </li>
                  <li>
                    <strong>Remark</strong> {selectedBudget?.bdr_action_remark}
                  </li>
                </>
              )}
              {selectedBudget?.bdr_request_status == "Rejected" && (
                <>
                  <li>
                    <strong>Status</strong>{" "}
                    <span className="badge badge-soft-danger ms-3">
                      Rejected
                    </span>
                  </li>
                  <li>
                    <strong>Rejection Date</strong>{" "}
                    {selectedBudget?.bdr_released_date_gc}
                  </li>
                  <li>
                    <strong>Remark</strong> {selectedBudget?.bdr_action_remark}
                  </li>
                </>
              )}
            </ul>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BudgetRequestDetail;
