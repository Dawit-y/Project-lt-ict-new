import { useState, useEffect } from "react";

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser?.user?.usr_id || null);
    }
    setIsLoading(false);
  }, []);

  return { user, userId, isLoading };
};
