import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

//Creating Circle by User
export const useCreateCircle = () => {
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.post(`/circles/${circle.owner_id}`, circle);
    },
  });
};

//Getting All Circles owned by user
export const useGetAllCirclesOwnedByUser = (id: string) => {
  return useQuery({
    queryKey: ["circle-owner", id],
    queryFn: () => api.get(`/circles/${id}`),
  });
};

//Getting All Circles owned by user
export const useGetAllCirclesUserIsMember = (id: string) => {
  return useQuery({
    queryKey: ["circle-member", id],
    queryFn: () => api.get(`/circles/${id}/member`),
  });
};

//Update a circle by owner
export const useUpdateCircleByOwner = () => {
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.put(`/circles/${circle.owner_id}/${circle.id}`, circle);
    },
  });
};

//Delete a circle by owner
export const useDeleteCircleByOwner = () => {
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.delete(`/circles/${circle.owner_id}/${circle.id}`);
    },
  });
};

//Remove a member from a circle (owner or self)
export const useRemoveMemberBasedOnRole = () => {
  return useMutation({
    mutationFn: (data: { circle: CircleProp; member: InviteMembersProp }) => {
      return api.delete(
        `/circles/${data.circle.id}/members/${data.member.member_id}`,
      );
    },
  });
};
