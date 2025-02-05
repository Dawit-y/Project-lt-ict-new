// import React, { useEffect, useState } from "react";
// import { post } from "../helpers/api_Lists";
// import accessToken from "../helpers/jwt-token-access/accessToken";

// const Index = ({ role }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   console.log(data);
//   useEffect(() => {
//     // Function to make a POST request
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Define the payload to be sent in the POST request
//         const payload = {
//           role: role, // Sending the role in the request bod
//         };
//         // Making the POST request to the API

//         const response = await post(
//           "/dashboard_builder",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json", // Ensure correct content type

//               Authorization: accessToken, // Add accessToken in Authorization header
//             },
//           }
//         );

//         console.log("response", res);

//         // Assuming the response contains the data structure as expected
//         setData(response.data.components);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err);
//         setLoading(false);
//       }
//     };

//     // Call the fetchData function
//     fetchData();
//   }, [role]); // Refetch data if the role changes

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching data</p>;

//   // Filter the data for the provided role
//   //const roleData = data?.data.find((item) => item.role === role);
//   const roleData = data[0];

//   if (!roleData) {
//     return <p>Role not found</p>;
//   }

//   return (
//     <React.Fragment>
//       <div className="container">
//         <div className="role-section my-4">
//           <h3 className="mb-4">{roleData.role} Dashboard</h3>
//           <div className="row">
//             {JSON.parse(roleData.components).map((component, index) => (
//               <div
//                 key={index}
//                 className={`component-wrapper ${component.class_name}`}
//                 style={{
//                   flex: `1 1 ${component.width}`,
//                   maxWidth: component.width,
//                   border: "1px solid #ccc",
//                   margin: "10px",
//                   boxSizing: "border-box",
//                 }}
//               >
//                 <div className="p-3">
//                   <h4>{component.name}</h4>
//                   <p>Grid Area: {component.gridArea}</p>
//                   <p>Width: {component.width}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Index;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { post } from "../helpers/api_Lists";
import accessToken from "../helpers/jwt-token-access/accessToken";
import FetchErrorHandler from "../components/Common/FetchErrorHandler";
import Spinners from "../components/Common/Spinner";

const fetchDashboardData = async (role) => {
  const payload = { role };
  const response = await post("/dashboard_builder", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  });
  return response.data.components;
};

const Index = ({ role }) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboardData", role],
    queryFn: () => fetchDashboardData(role),
  });

  if (isLoading) return <Spinners />;
  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  const roleData = data[0];
  if (!roleData) {
    return <p>Role not found</p>;
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className="role-section my-4">
          <h3 className="mb-4">{roleData.role} Dashboard</h3>
          <div className="row">
            {JSON.parse(roleData.components).map((component, index) => (
              <div
                key={index}
                className={`component-wrapper ${component.class_name}`}
                style={{
                  flex: `1 1 ${component.width}`,
                  maxWidth: component.width,
                  border: "1px solid #ccc",
                  margin: "10px",
                  boxSizing: "border-box",
                }}
              >
                <div className="p-3">
                  <h4>{component.name}</h4>
                  <p>Grid Area: {component.gridArea}</p>
                  <p>Width: {component.width}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Index;
