import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "../helpers/api_Lists";

// Helper functions
const fetchNotifications = async () => {
  try {
    const response = await post("notification");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const markNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await post(
      `updatenotification?notification_ids=${notificationIds}`,
    );
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Custom Hook to Fetch Notifications
export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Custom Hook to Mark Notifications as Read
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: (_, notificationIds) => {
      queryClient.setQueryData(["notifications"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((notification) =>
          notificationIds.includes(notification.id)
            ? { ...notification, read: true }
            : notification,
        );
      });
    },
    onError: (error) => {
      console.error("Error marking notifications as read:", error);
    },
  });
};
