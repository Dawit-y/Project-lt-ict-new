import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserSector,
  updateUserSector,
  addUserSector,
  deleteUserSector,
  getUserSectorTree
} from "../helpers/usersector_backend_helper";

const USER_SECTOR_QUERY_KEY = ["usersector"];

// Fetch user_sector
export const useFetchUserSectors = (params = {}, isActive) => {
  return useQuery({
    queryKey: [...USER_SECTOR_QUERY_KEY, "fetch", params],
    queryFn: () => getUserSector(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive
  });
};

//search user_sector
export const useSearchUserSectors = (searchParams = {}) => {
  return useQuery({
    queryKey: [...USER_SECTOR_QUERY_KEY, "search", searchParams],
    queryFn: () => getUserSector(searchParams),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: searchParams.length > 0,
  });
};
//search user_sector
export const getUserSectorList = (searchParams = {}) => {
  return useQuery({
		queryKey: [...USER_SECTOR_QUERY_KEY, "search", searchParams],
		queryFn: () => getUserSectorTree(searchParams),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		keepPreviousData: false, // Don't keep any previous results
	});
};
export const getUserSectorListTree = (userId) => {
  return useQuery({
    queryKey: [...USER_SECTOR_QUERY_KEY, "tree", userId],
    queryFn: () => getUserSectorTree(),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    select: (data) => buildTree(data?.data),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Add user_sector
export const useAddUserSector = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserSector,
    onSuccess: (newDataResponse) => {
      queryClient.invalidateQueries({ queryKey: USER_SECTOR_QUERY_KEY })
    },
  });
};
// Update user_sector
export const useUpdateUserSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSector,
    onSuccess: (updatedUserSector) => {
      queryClient.invalidateQueries({ queryKey: USER_SECTOR_QUERY_KEY })
    },
  });
};
// Delete user_sector
export const useDeleteUserSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserSector,
    onSuccess: (deletedData) => {
      queryClient.invalidateQueries({ queryKey: USER_SECTOR_QUERY_KEY })
    },
  });
};


function buildTree(data) {
  const clusterMap = {};

  data.forEach(({ psc_id, psc_name, sci_id, sci_name_or, sci_name_am, sci_name_en }) => {
    if (!clusterMap[psc_id]) {
      clusterMap[psc_id] = {
        psc_id: psc_id,
        psc_name: psc_name,
        children: []
      };
    }

    clusterMap[psc_id].children.push({
      sci_id: sci_id,
      sci_name_or: sci_name_or,
      sci_name_am: sci_name_am,
      sci_name_en: sci_name_en
    });
  });

  return Object.values(clusterMap);
}

