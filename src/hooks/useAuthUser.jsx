import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuthUser = () => {
  const [userId, setUserId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentType, setDepartmentType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.Auth.userData);

  useEffect(() => {
    if (user) {
      setUserId(user?.usr_id || null);

      if (user?.usr_officer_id > 0) {
        setDepartmentId(user.usr_officer_id);
        setDepartmentType("officer");
      } else if (user?.usr_team_id > 0) {
        setDepartmentId(user.usr_team_id);
        setDepartmentType("team");
      } else if (user?.usr_directorate_id > 0) {
        setDepartmentId(user.usr_directorate_id);
        setDepartmentType("directorate");
      } else if (user?.usr_department_id > 0) {
        setDepartmentId(user.usr_department_id);
        setDepartmentType("department");
      } else {
        setDepartmentId(null);
        setDepartmentType(null);
      }
    }
    setIsLoading(false);
  }, [user]);

  return { user, userId, departmentId, departmentType, isLoading };
};
