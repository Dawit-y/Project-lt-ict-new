import { useState, useEffect } from "react";

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentType, setDepartmentType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser?.user?.usr_id || null);

      const user = parsedUser?.user;
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
  }, []);

  return { user, userId, departmentId, departmentType, isLoading };
};
