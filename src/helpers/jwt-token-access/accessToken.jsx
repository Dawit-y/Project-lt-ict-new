import { useState, useEffect } from 'react';
export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('authUser'));
    if (storedUser && storedUser.authorization) {
      const { token, type } = storedUser.authorization;
      setAccessToken(`${type} ${token}`);
    }
  }, []);
  return accessToken;
};