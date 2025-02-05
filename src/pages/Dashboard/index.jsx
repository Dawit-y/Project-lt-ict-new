import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectDashboard } from "../../helpers/Project_Backend";
import { withTranslation } from "react-i18next";
import SupersetDashboard from "../../pages/Dashboard/SupersetDashboard";
import Spinners from "../../components/Common/Spinner";
import FetchErrorHandler from "../../components/Common/FetchErrorHandler";

const Dashboard = () => {
  document.title = "Project Management System";
  const role = "Deputy";

  // Fetch data using TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projectDashboard", role],
    queryFn: () => getProjectDashboard({ role }),
  });

  if (isLoading) return <Spinners />;
  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <div className="page-content">
      <div className="container-fluid1">
        <div className="row">
          {data.map((supersetPath, index) => (
            <div key={index}>
              {supersetPath ? (
                <SupersetDashboard dashboardPath={supersetPath.superset_url} />
              ) : (
                <div>Loading data...</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Dashboard);
