import { checkProjectStatus } from "../utils/Validation/validation";
import { toast } from "react-toastify";

export const useStatusCheck = (pageId, status) => {
  const performStatusCheck = () => {
    const statusCheck = checkProjectStatus(pageId, parseInt(status));
    if (statusCheck !== true) {
      toast.error(`${statusCheck}`, { autoClose: 3000 });
      return false;
    }
    return true;
  };

  return performStatusCheck;
};