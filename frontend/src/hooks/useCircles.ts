import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useCreateCircle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.post(`/circles/${circle.owner_id}`, circle);
    },
    onSuccess: (data, variables) => {
      const newCircle: CircleProp = data?.data?.data;
      if (newCircle && variables.owner_id) {
        queryClient.setQueryData(["circle-owner", variables.owner_id], (old: { data: { data: CircleProp[] } } | undefined) => {
          if (!old?.data?.data) return old;
          return { ...old, data: { ...old.data, data: [newCircle, ...old.data.data] } };
        });
      }
      queryClient.invalidateQueries({ queryKey: ["circle-owner"] });
      queryClient.invalidateQueries({ queryKey: ["circles-with-members"] });
    },
  });
};

export const useGetAllCirclesOwnedByUser = (id: string) => {
  return useQuery({
    queryKey: ["circle-owner", id],
    queryFn: () => api.get(`/circles/${id}`),
  });
};

export const useGetAllCirclesUserIsMember = (id: string) => {
  return useQuery({
    queryKey: ["circle-member", id],
    queryFn: () => api.get(`/circles/${id}/member`),
  });
};

export const useUpdateCircleByOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.put(`/circles/${circle.owner_id}/${circle.id}`, circle);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["circle-owner", variables.owner_id], (old: { data: { data: CircleProp[] } } | undefined) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((c) => c.id === variables.id ? { ...c, ...variables } : c),
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: ["circle-owner"] });
      queryClient.invalidateQueries({ queryKey: ["circles-with-members"] });
    },
  });
};

export const useDeleteCircleByOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (circle: CircleProp) => {
      return api.delete(`/circles/${circle.owner_id}/${circle.id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["circle-owner", variables.owner_id], (old: { data: { data: CircleProp[] } } | undefined) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((c) => c.id !== variables.id),
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: ["circle-owner"] });
      queryClient.invalidateQueries({ queryKey: ["circles-with-members"] });
    },
  });
};

export const useRemoveMemberBasedOnRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { circle: CircleProp; member: InviteMembersProp }) => {
      return api.delete(
        `/circles/${data.circle.id}/members/${data.member.member_id}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circles-with-members"] });
    },
  });
};

export const useGetCirclesWithMembers = (user_id: string) => {
  return useQuery({
    queryKey: ["circles-with-members", user_id],
    queryFn: () => api.get(`/circles/${user_id}/with-members`),
    enabled: !!user_id,
  });
};

export const useJoinCircle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (circle_id: string) => {
      return api.post(`/circles/${circle_id}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circle-member"] });
      queryClient.invalidateQueries({ queryKey: ["circles-with-members"] });
      queryClient.invalidateQueries({ queryKey: ["invite-circle-view"] });
    },
  });
};
