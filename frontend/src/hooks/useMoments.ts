import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

//Creating Moment by User
export const useCreateMoment = () => {
  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.post(`/moments/${moment.creator_id}`, moment);
    },
  });
};

//Getting All Circles owned by user
export const useGetAllMomentsOwnedByUser = (id: string) => {
  return useQuery({
    queryKey: ["moment-owner", id],
    queryFn: () => api.get(`/moments/${id}`),
  });
};

//Getting All Circles owned by user
export const useGetAllMomentsUserIsAttendee = (id: string) => {
  return useQuery({
    queryKey: ["moment-attendee", id],
    queryFn: () => api.get(`/moments/${id}/member`),
  });
};

//Update a circle by owner
export const useUpdateMomentsByOwner = () => {
  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.put(`/moments/${moment.creator_id}/${moment.id}`, moment);
    },
  });
};

//Delete a circle by owner
export const useDeleteMomentsByOwner = () => {
  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.delete(`/moments/${moment.creator_id}/${moment.id}`);
    },
  });
};

//Remove a member from a circle (owner or self)
export const useRemoveAttendeeBasedOnRole = () => {
  return useMutation({
    mutationFn: (data: {
      moment: MomentProp;
      attendee: InviteAttendeesProp;
    }) => {
      return api.delete(
        `/moments/${data.moment.id}/attendees/${data.attendee.attendee_id}`,
      );
    },
  });
};
