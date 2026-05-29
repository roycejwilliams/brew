import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export type NearbyFriendNotification = {
  id: string;
  type: "moment_nearby_friend";
  moment_id: string;
  moments_name: string;
  moment_image?: string;
  friend_id: string;
  friend_first_name: string;
  friend_last_name: string;
  friend_username: string;
  friend_profile_image?: string;
  created_at: string;
  read: boolean;
};

// Fetches unread moment_nearby_friend signals for the current user.
// Backend creates these when a knock is approved and the approver's
// network members are found to be nearby on Pulse.
export const useGetNearbyFriendNotifications = (user_id: string) => {
  return useQuery({
    queryKey: ["nearby-friend-notifications", user_id],
    queryFn: () =>
      api.get(`/notifications/${user_id}`, {
        params: { type: "moment_nearby_friend", read: false },
      }),
    enabled: !!user_id,
    refetchOnMount: "always",
  });
};

export const useDismissNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notification_id: string) =>
      api.patch(`/notifications/${notification_id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nearby-friend-notifications"],
      });
    },
  });
};
