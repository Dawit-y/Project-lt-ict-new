import { post } from "./api_Lists";

const GET_REPORT_REPORT = "report/getreport";
export const getReport = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${GET_REPORT_REPORT}?${queryString}`
    : GET_PROJECT_CONTRACTOR;
  try {
    const response = await post(url);
    return response;
  } catch (error) {
    throw error;
  }
};
