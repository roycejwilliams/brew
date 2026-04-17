import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

//INVITE CIRCLE FLOW
// Owner invites a member to a circle
export const useInviteMemberToCircle = () => {
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
  });
};

// User views their circle invites
export const useInviteUserCircleView = (member_id: string) => {
  return useQuery({
    queryKey: ["invite-circle-view", member_id],
    queryFn: () => {
      return api.get(`/invites/members/${member_id}`);
    },
  });
};

//Owner views sent circle invites
export const useOwnerViewCircleInvites = (invite_by: string) => {
  return useQuery({
    queryKey: ["invite-owner-view", invite_by],
    queryFn: () => {
      return api.get(`/invites/members/sent/${invite_by}`);
    },
  });
};

////User Accept or Reject Circle Invite
export const useInviteMemberDecision = () => {
  return useMutation({
    mutationFn: (member_decision: InviteMembersProp) => {
      return api.put(`/invites/members/${member_decision.id}`, member_decision);
    },
  });
};

//INVITE MOMENT FLOW
// Owner invites a member to a moment
export const useInviteAttendeeToMoment = () => {
  return useMutation({
    mutationFn: (data: {
      moment: MomentProp;
      invite_attendee: InviteAttendeesProp;
    }) => {
      return api.post(
        `/moment/${data.moment.id}/invite/${data.invite_attendee.attendee_id}`,
        data,
      );
    },
  });
};

//User views their moment invites
export const useInviteUserMomentView = (attendee_id: string) => {
  return useQuery({
    queryKey: ["invite-moment-view", attendee_id],
    queryFn: () => {
      return api.get(`/invites/attendees/${attendee_id}`);
    },
  });
};

//Owner views sent moment invites
export const useOwnerViewMomentInvites = (invite_by: string) => {
  return useQuery({
    queryKey: ["invite-owner-view-moment", invite_by],
    queryFn: () => {
      return api.get(`/invites/attendees/sent/${invite_by}`);
    },
  });
};

////User Accept or Reject Moment Invite
export const useInviteAttendeeDecision = () => {
  return useMutation({
    mutationFn: (attendee_decision: InviteAttendeesProp) => {
      return api.put(
        `/invites/attendees/${attendee_decision.id}`,
        attendee_decision,
      );
    },
  });
};
