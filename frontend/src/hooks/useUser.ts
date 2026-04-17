import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

//Get user by id
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`),
  });
};

//Update User by id (User)
export const useUpdateUserById = () => {
  return useMutation({
    mutationFn: (data: UserProp) => {
      return api.put(`/users/${data.id}`);
    },
  });
};

//Delete User by id
export const useDeleteUserById = () => {
  return useMutation({
    mutationFn: (data: UserProp) => {
      return api.delete(`/users/${data.id}`);
    },
  });
};

//Verify user OTP when logging in
export const useVerifyUser = () => {
  return useMutation({
    mutationFn: (data: UserProp) => {
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
