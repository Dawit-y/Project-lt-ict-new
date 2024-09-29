import axios from "axios";
import { del, get, post, put } from "./api_Lists";
import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;


// GET Project dashboard components with Authorization header
export const getProjectDashboardComponent = async (endPoint) => {
  try {
    const response = await post(
      `${endPoint}/listgrid`
    );
    return response.data; // Return the response data directly
  } catch (e) {
    console.error("Error fetching dashboard components:", e);
    throw e; // Rethrow error for handling elsewhere
  }
};
// GET pROJECT DASHBOARD
export const getProjectDashboard = async (role) => {
  try {
    const response = await post(`${url.GET_PROJECT_DASHBOARD}`, role);
    return response.data; // Return the response data directly
  } catch (e) {
    console.log("Error fetching dashboard response:", e);
    throw e; // Rethrow the error for handling in the component
  }
};

// PROJECT TREE
export const getProjectTreeStatus=async()=>{
  
  try{
    const response=await post(url.GET_PROJECT_TREE);
    return response;
  }
  catch(error){
    console.log("errer on backend ")
    console.log(error);
  }
}






// get Projects
export const getProjectsStatus = async () => {
  try {
    const response = await post(url.GET_ORDERS);
    return response;
  } catch (error) {
    console.log(error); // Handle any errors
  }
};

// add Projects
export const addnewProjectStatus = async (project) => {
  try {
    const response = await axios.post(
      `${apiUrl}project_status/insertgrid`,
      project,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update grid:", error);
    throw error;
  }
};

// update Projects
export const updateProjectStatus = (project) =>
  post(`${url.UPDATE_ORDER}?prs_id=${project?.prs_id}`, project);

// delete Projects
export const deleteProjectStatus = (project) =>
  // post(`${url.DELETE_ORDER}?prs_id=${order?.prs_id}`);
  post(`${url.DELETE_ORDER}?prs_id=${project}`);


  // ----------------------------project operations








// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
const postFakeRegister = (data) => {
  return axios
    .post(url.POST_FAKE_REGISTER, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postFakeLogin = (data) => post(url.POST_FAKE_LOGIN, data);

// postForgetPwd
const postFakeForgetPwd = (data) => post(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
const postJwtProfile = (data) => post(url.POST_EDIT_JWT_PROFILE, data);

const postFakeProfile = (data) => post(url.POST_EDIT_PROFILE, data);

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postJwtLogin = (data) => post('https://pmsor.awashsol.com/api/login', data);

// postForgetPwd
const postJwtForgetPwd = (data) =>
  post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data) => post(url.SOCIAL_LOGIN, data);

// get Products
export const getProducts = () => get(url.GET_PRODUCTS);

// get Product detail
export const getProductDetail = (id) =>
  get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } });

// get Events
export const getEvents = () => get(url.GET_EVENTS);

// add Events
export const addNewEvent = (event) => post(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = (event) => put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = (event) =>
  del(url.DELETE_EVENT, { headers: { event } });

// get Categories
export const getCategories = () => get(url.GET_CATEGORIES);

//Email Chart
export const getDashboardEmailChart = (chartType) =>
  get(`${url.GET_DASHBOARD_EMAILCHART}/${chartType}`, { param: chartType });

// get chats
export const getChats = () => get(url.GET_CHATS);

// get groups
export const getGroups = () => get(url.GET_GROUPS);

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS);

// get messages
export const getMessages = (roomId) =>
  get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// post messages
export const getselectedmails = (selectedmails) =>
  post(url.GET_SELECTED_MAILS, selectedmails);

//post setfolderonmails
export const setfolderonmails = (selectedmails, folderId, activeTab) =>
  post(url.SET_FOLDER_SELECTED_MAILS, { selectedmails, folderId, activeTab });



// get cart data
export const getCartData = () => get(url.GET_CART_DATA);

// get customers
export const getCustomers = () => get(url.GET_CUSTOMERS);

// add CUSTOMER
export const addNewCustomer = (customer) =>
  post(url.ADD_NEW_CUSTOMER, customer);

// update CUSTOMER
export const updateCustomer = (customer) => put(url.UPDATE_CUSTOMER, customer);

// delete CUSTOMER
export const deleteCustomer = (customer) =>
  del(url.DELETE_CUSTOMER, { headers: { customer } });

// get shops
export const getShops = () => get(url.GET_SHOPS);

// get wallet
export const getWallet = () => get(url.GET_WALLET);

// get crypto order
export const getCryptoOrder = () => get(url.GET_CRYPTO_ORDERS);

// get crypto product
export const getCryptoProduct = () => get(url.GET_CRYPTO_PRODUCTS);

// get invoices
export const getInvoices = () => get(url.GET_INVOICES);

// get invoice details
export const getInvoiceDetail = (id) =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } });

// get jobs
export const getJobList = () => get(url.GET_JOB_LIST);

// get Apply Jobs
export const getApplyJob = () => get(url.GET_APPLY_JOB);



// get tasks
export const getTasks = () => get(url.GET_TASKS);

// add CardData Kanban
export const addCardData = (cardData) => post(url.ADD_CARD_DATA, cardData);

// update jobs
export const updateCardData = (card) => put(url.UPDATE_CARD_DATA, card);

// delete Kanban
export const deleteKanban = (kanban) =>
  del(url.DELETE_KANBAN, { headers: { kanban } });

// get contacts
export const getUsers = () => get(url.GET_USERS);

// add user
export const addNewUser = (user) => post(url.ADD_NEW_USER, user);

// update user
export const updateUser = (user) => put(url.UPDATE_USER, user);

// delete user
export const deleteUser = (user) => del(url.DELETE_USER, { headers: { user } });

// add jobs
export const addNewJobList = (job) => post(url.ADD_NEW_JOB_LIST, job);

// update jobs
export const updateJobList = (job) => put(url.UPDATE_JOB_LIST, job);

// delete jobs
export const deleteJobList = (job) =>
  del(url.DELETE_JOB_LIST, { headers: { job } });

// Delete Apply Jobs
export const deleteApplyJob = (data) =>
  del(url.DELETE_APPLY_JOB, { headers: { data } });

/** PROJECT */

// update user
// export const updateProject = (project) => put(url.UPDATE_PROJECT, project);

// // delete user
// export const deleteProject = (project) =>
//   del(url.DELETE_PROJECT, { headers: { project } });

export const getUserProfile = () => get(url.GET_USER_PROFILE);

// get maillist
export const getMailsLists = (filter) =>
  post(url.GET_MAILS_LIST, { params: filter });

//update mail
export const deleteMail = (mail) => del(url.DELETE_MAIL, { headers: { mail } });
export const trashMail = (mail) => del(url.TRASH_MAIL, { headers: { mail } });
export const staredMail = (mail) => del(url.STARED_MAIL, { headers: { mail } });
export const getMailsListsId = (id) =>
  get(`${url.GET_MAILS_ID}/${id}`, { params: { id } });

// get folderlist
export const selectFolders = () => get(url.SELECT_FOLDER);

// post messages
export const addMessage = (message) => post(url.ADD_MESSAGE, message);
// delete message
export const deleteMessage = (data) =>
  del(url.DELETE_MESSAGE, { headers: { data } });

export const walletBalanceData = (roomId) =>
  get(`${url.GET_WALLET_DATA}/${roomId}`, { params: { roomId } });

export const getStatisticData = (roomId) =>
  get(`${url.GET_STATISTICS_DATA}/${roomId}`, { params: { roomId } });

export const visitorData = (roomId) =>
  get(`${url.GET_VISITOR_DATA}/${roomId}`, { params: { roomId } });

export const topSellingData = (month) =>
  get(`${url.TOP_SELLING_DATA}/${month}`, { params: { month } });

export const getEarningChartsData = (month) =>
  get(`${url.GET_EARNING_DATA}/${month}`, { params: { month } });

const getProductComents = () => get(url.GET_PRODUCT_COMMENTS);

const onLikeComment = (commentId, productId) => {
  return post(`${url.ON_LIKNE_COMMENT}/${productId}/${commentId}`, {
    params: { commentId, productId },
  });
};
const onLikeReply = (commentId, productId, replyId) => {
  return post(`${url.ON_LIKNE_COMMENT}/${productId}/${commentId}/${replyId}`, {
    params: { commentId, productId, replyId },
  });
};

const onAddReply = (commentId, productId, replyText) => {
  return post(`${url.ON_ADD_REPLY}/${productId}/${commentId}`, {
    params: { commentId, productId, replyText },
  });
};

const onAddComment = (productId, commentText) => {
  return post(`${url.ON_ADD_COMMENT}/${productId}`, {
    params: { productId, commentText },
  });
};

export const fetchSearchResults = async (searchTerm, selectedFields) => {
  let queryParams = [];
  if (searchTerm && searchTerm.search_en_value) {
    queryParams.push(
      `search_en_name=${encodeURIComponent(searchTerm.search_en_value)}`
    );
  }
  selectedFields.forEach((field) => {
    const [key] = Object.keys(field);
    const value = field[key];
    if (value !== undefined && value !== "") {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  const queryString = queryParams.join("&");

  const response = await axios.post(
    `${apiUrl}project_status/listgrid?${queryString}`
  );
  return response.data.data;
};

export {


  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
  getProductComents,
  onLikeComment,
  onLikeReply,
  onAddReply,
  onAddComment,
  // this is for project tree
  
};
