import { post} from "./api_Lists";
const apiUrl = import.meta.env.VITE_BASE_API_URL;
const GET_STATISTICAL_REPORT = "statistical_report/getstatistics";
export const getStatisticalReport = async (params = {}) => {
  const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en"; // Default to 'en' if not found
  //const queryString = new URLSearchParams(params).toString();
    const queryString = new URLSearchParams({
    ...params,
    locale: currentLanguage, // Include locale in params
  }).toString();
  const url = queryString ? `${GET_STATISTICAL_REPORT}?${queryString}` : GET_PROJECT_CONTRACTOR;
   try {
    const response = await post(url);
    return response;
  } catch (error) {
    console.log("Error in fetching data:", error);
  }
};