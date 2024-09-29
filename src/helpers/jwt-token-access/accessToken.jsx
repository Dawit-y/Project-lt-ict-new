// Retrieve authUser from localStorage
const authUser = JSON.parse(localStorage.getItem("authUser"));

let accessToken = null;

// Check if authUser and authorization data exists
if (authUser && authUser.authorization) {
  const token = authUser.authorization.token;
  const tokenType = authUser.authorization.type;

  // Construct the accessToken string
  accessToken = `${tokenType} ${token}`;
}

export default accessToken;
