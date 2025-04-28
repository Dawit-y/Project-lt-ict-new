import { useQuery } from "@tanstack/react-query";
import { post } from "../helpers/api_Lists";

const buildGroupedSideData = (data) => {
  const groupedData = data.reduce((acc, curr) => {
    const { parent_menu, link_name, link_url, link_icon } = curr;
    if (!acc[parent_menu]) {
      acc[parent_menu] = {
        title: parent_menu,
        icon: link_icon,
        submenu: [],
      };
    }
    acc[parent_menu].submenu.push({
      name: link_name.replace(/-/g, " "),
      path: `/${link_url}`,
    });
    return acc;
  }, {});

  return Object.values(groupedData);
};

export const useFetchSideData = (userId) => {
  return useQuery({
    queryKey: ["sideData", userId],
    queryFn: async () => {
      const { data } = await post(`menus`);
      return data;
    },
    select: (data) => buildGroupedSideData(data),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 62,
    meta: { persist: true },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
