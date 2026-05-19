import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useCreateMoment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.post(`/moments/${moment.creator_id}`, {
        moments_name: moment.moments_name,
        location: moment.location,
        location_name: moment.location_name,
        moment_start: moment.moment_start,
        visibility_type: moment.visibility_type,
        description: moment.description,
        cap_attendance: moment.cap_attendance,
        circle_id: moment.circle_id,
        image: moment.image,
        principles: moment.principles,
        expectations: moment.expectations,
        faqs: moment.faqs,
        vibes: moment.vibes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moment-owner"] });
    },
  });
};

export const useGetAllMomentsOwnedByUser = (id: string) => {
  return useQuery({
    queryKey: ["moment-owner", id],
    queryFn: () => api.get(`/moments/${id}`),
  });
};

export const useGetAllMomentsUserIsAttendee = (id: string) => {
  return useQuery({
    queryKey: ["moment-attendee", id],
    queryFn: () => api.get(`/moments/${id}/member`),
  });
};

export const useUpdateMomentsByOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.put(`/moments/${moment.creator_id}/${moment.id}`, {
        moments_name: moment.moments_name,
        location: moment.location,
        location_name: moment.location_name,
        moment_start: moment.moment_start,
        moment_end: moment.moment_end,
        description: moment.description,
        cap_attendance: moment.cap_attendance,
        close_moment: moment.close_moment,
        visibility_type: moment.visibility_type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moment-owner"] });
    },
  });
};

export const useDeleteMomentsByOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moment: MomentProp) => {
      return api.delete(`/moments/${moment.creator_id}/${moment.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moment-owner"] });
    },
  });
};

export const useRemoveAttendeeBasedOnRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      moment: MomentProp;
      attendee: InviteAttendeesProp;
    }) => {
      return api.delete(
        `/moments/${data.moment.id}/attendees/${data.attendee.attendee_id}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["moment-attendees-with-details"],
      });
    },
  });
};

export const useGetMomentById = (moment_id: string) => {
  return useQuery({
    queryKey: ["moment", moment_id],
    queryFn: () => api.get(`/moments/moment/${moment_id}`),
    enabled: !!moment_id,
  });
};

export const useGetMomentAttendees = (moment_id: string) => {
  return useQuery({
    queryKey: ["moment-attendees", moment_id],
    queryFn: () => api.get(`/moments/${moment_id}/attendees`),
    enabled: !!moment_id,
  });
};

export const useTransferTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      attendee_id: string;
      moment_id: string;
      recipient: string;
    }) => {
      return api.put(
        `/attendee/${data.attendee_id}/transfer/${data.moment_id}`,
        { recipient: data.recipient },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["moment-attendees-with-details"],
      });
    },
  });
};

export const useGetMomentAttendeesWithDetails = (momentId: string) => {
  return useQuery({
    queryKey: ["moment-attendees-with-details", momentId],
    queryFn: () => api.get(`/moments/${momentId}/attendees/details`),
    enabled: !!momentId,
  });
};

export const useCheckInAttendee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { moment_id: string; attendee_id: string }) =>
      api.post(`/moments/${data.moment_id}/checkin`, {
        attendee_id: data.attendee_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["moment-attendees-with-details"],
      });
    },
  });
};

//get nearby moments
export const useGetNearbyMoments = (params: {
  lng?: number;
  lat?: number;
  radius?: number;
  filter?: "tonight" | "tomorrow" | "week";
  city?: string;
}) => {
  return useQuery({
    queryKey: ["nearby-moments", params],
    queryFn: () => api.get("/moments/nearby", { params }),
    enabled: !!(params.lng && params.lat) || !!params.city,
  });
};

//recaps the night
// uses anthropic sonnet 4.6
const generateRecap = async (eventCard: MomentProp) => {
  const response = await api.get(`/moments/${eventCard.id}/recap`);
  return response.data.data;
};

export const useGenerateRecap = (eventCard: MomentProp | null) => {
  return useQuery({
    queryKey: ["recap", eventCard?.id],
    queryFn: () => generateRecap(eventCard!),
    enabled: !!eventCard?.id,
    staleTime: Infinity,
    retry: false,
  });
};

// Get photos
export const useGetMomentPhotos = (moment_id: string | undefined) => {
  return useQuery({
    queryKey: ["moment-photos", moment_id],
    queryFn: () => api.get(`/moments/${moment_id}/photos`),
    enabled: !!moment_id,
  });
};

// Add photo
export const useAddMomentPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moment_id,
      image_url,
    }: {
      moment_id: string;
      image_url: string;
    }) => api.post(`/moments/${moment_id}/photos`, { image_url }),
    onSuccess: (_, { moment_id }) => {
      queryClient.invalidateQueries({ queryKey: ["moment-photos", moment_id] });
    },
  });
};

// Delete photo
export const useDeleteMomentPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moment_id,
      photo_id,
    }: {
      moment_id: string;
      photo_id: string;
    }) => api.delete(`/moments/${moment_id}/photos/${photo_id}`),
    onSuccess: (_, { moment_id }) => {
      queryClient.invalidateQueries({ queryKey: ["moment-photos", moment_id] });
    },
  });
};
