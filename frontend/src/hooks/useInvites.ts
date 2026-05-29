import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useInviteMemberToCircle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      circle: CircleProp;
      invite_member: InviteMembersProp;
    }) => {
      return api.post(
        `/circles/${data.circle.id}/invite/${data.invite_member.member_id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view"] });
    },
  });
};

export const useInviteUserCircleView = (member_id: string) => {
  return useQuery({
    queryKey: ["invite-circle-view", member_id],
    queryFn: () => api.get(`/invites/members/${member_id}`),
    enabled: !!member_id,
    refetchOnMount: "always",
  });
};

export const useOwnerViewCircleInvites = (invite_by: string) => {
  return useQuery({
    queryKey: ["invite-owner-view", invite_by],
    queryFn: () => api.get(`/invites/members/sent/${invite_by}`),
  });
};

export const useInviteMemberDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member_decision: InviteMembersProp) => {
      return api.put(`/invites/members/${member_decision.id}`, member_decision);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite-circle-view"] });
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view"] });
    },
  });
};

export const useInviteAttendeeToMoment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { moment_id: string; recipient: string }) => {
      return api.post(`/moment/${data.moment_id}/invite`, {
        recipient: data.recipient,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view-moment"] });
      queryClient.invalidateQueries({
        queryKey: ["moment-attendees-with-details"],
      });
    },
  });
};

export const useInviteUserMomentView = (attendee_id: string) => {
  return useQuery({
    queryKey: ["invite-moment-view", attendee_id],
    queryFn: () => api.get(`/invites/attendees/${attendee_id}`),
    enabled: !!attendee_id,
    refetchOnMount: "always",
  });
};

export const useOwnerViewMomentInvites = (invite_by: string) => {
  return useQuery({
    queryKey: ["invite-owner-view-moment", invite_by],
    queryFn: () => api.get(`/invites/attendees/sent/${invite_by}`),
  });
};

export const useInviteAttendeeDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attendee_decision: InviteAttendeesProp) => {
      return api.put(
        `/invites/attendees/${attendee_decision.id}`,
        attendee_decision,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invite-moment-view"] });
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view-moment"] });
      // Accepting an invite adds you to moment_attendees — Coming Up should appear immediately
      queryClient.invalidateQueries({ queryKey: ["moment-attendee"] });
    },
  });
};

export const useInviteExternalToCircle = () => {
  return useMutation({
    mutationFn: (data: { circle_id: string; recipient: string }) => {
      return api.post(`/circles/${data.circle_id}/invite-external`, { recipient: data.recipient });
    },
  });
};

export const useCreateReferral = () => {
  return useMutation({
    mutationFn: (data: { recipient: string; reason: string }) => {
      return api.post("/referrals", data);
    },
  });
};
