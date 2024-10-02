export const setCache = (key, data, duration = 3600 * 1000) => {
  const cacheData = {
    timestamp: Date.now(),
    data,
    duration,
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const getCache = (key) => {
  const cachedItem = localStorage.getItem(key);

  if (cachedItem) {
    const { timestamp, data, duration } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < duration) {
      return data;
    }
    localStorage.removeItem(key);
  }
  return null;
};

export const clearCache = (key) => {
  localStorage.removeItem(key);
};
