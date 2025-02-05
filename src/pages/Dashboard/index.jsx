import React, { useEffect, useState } from "react";
import { useAccessToken } from "../../helpers/jwt-token-access/accessToken";
import { getProjectDashboard } from "../../helpers/Project_Backend";
import { withTranslation } from "react-i18next";
import SupersetDashboard from "../../pages/Dashboard/SupersetDashboard";

const Dashboard = () => {
  document.title = "Project Management System";
  
  const accessToken = useAccessToken();
  const role = "Deputy";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to make a POST request
    const fetchData = async () => {
      try {
        setLoading(true);
        // Define the payload to be sent in the POST request
        const payload = { role }; // Sending the role in the request body

        // Await the response from getProjectDashboard
        const response = await getProjectDashboard(payload);
        console.log("Index response1:", response); // Log the actual response

        // Set the data from the response
        setData(response); // Assuming response is already the data you need
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false); // Ensure loading state is updated in both success and error cases
      }
    };

    // Call the fetchData function
    fetchData();
  }, [role]); // Refetch data if the role changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  // Find data for the given role
  //const roleData = data?.find((item) => item.role === role);
  const roleData = data;
  if (!roleData) {
    return <p>Role not found</p>;
  }
  //meta title
  return (
    <div className="page-content">
      <div className="container-fluid1">
        <div className="row">
          {roleData.map((supersetPath, index) => (
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
