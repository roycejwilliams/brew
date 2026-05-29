import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

//Get user by id
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes — refetches when invalidated
  });
};

//Update User by id (User)
export const useUpdateUserById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      description: string | null;
      username: string;
      location: string;
      instagram: string;
      twitter: string;
      linkedin: string;
      profile_image: string;
    }) => {
      return api.put(`/users/${data.id}`, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        description: data.description,
        username: data.username,
        location: data.location,
        instagram: data.instagram,
        twitter: data.twitter,
        linkedin: data.linkedin,
        profile_image: data.profile_image,
      });
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const previous = queryClient.getQueryData(["user"]);
      queryClient.setQueryData(["user", data.id], (old: unknown) => {
        const prev = old as { data: { data: Partial<UserProp> } };
        return {
          ...prev,
          data: {
            ...prev,
            data: {
              ...prev?.data?.data,
              ...data,
            },
          },
        };
      });
      return { previous };
    },

    onSuccess: (_, data) => {
      queryClient.refetchQueries({ queryKey: ["user", data.id] });
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user"], context.previous);
      }
    },
  });
};

//Delete User by id
export const useDeleteUserById = () => {
  return useMutation({
    mutationFn: (data: { id: string }) => {
      return api.delete(`/users/${data.id}`);
    },
  });
};

//Verify user OTP when logging in
export const useVerifyUser = () => {
  return useMutation({
    mutationFn: (data: { id: string; otp_code: string }) => {
      return api.post(`/auth/verify/${data.id}`, { otp_code: data.otp_code });
    },
  });
};

//resend OTP upon request
export const useResendOtpToUser = () => {
  return useMutation({
    mutationFn: (data: UserProp) => {
      return api.put(`/auth/resend/${data.id}`, data);
    },
  });
};

//Get Active Connection
export const useRetriveActiveConnection = (id: string) => {
  return useQuery({
    queryKey: ["active-connection", id],
    queryFn: () => api.get(`/users/${id}/connections`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
