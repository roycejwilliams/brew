import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface ApplicationProp {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  work_link: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

interface UserProp {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  description: string;
  username: string;
  profile_image: string;
  otp_code: string;
  otp_expiry: Date;
  created_at: Date;
  application_id: ApplicationProp;
  otp_attempts: number;
  locked: boolean;
  role: string;
}

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
