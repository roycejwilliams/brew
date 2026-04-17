interface ApplicationProp {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  work_link: string;
  reason: string;
  status?: "pending" | "accepted" | "rejected";
}

interface UserProp {
  id?: string;
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

interface CircleProp {
  id?: string;
  owner_id: string;
  circle_name: string;
  circle_image: string;
  created_at: Date;
  updated_at: Date;
}

interface MomentProp {
  id?: string;
  creator_id: string;
  circle_id: CircleProp;
  image: string;
  moments_name: string;
  created_at: Date;
  update_at: Date;
  moment_starts: Date;
  moment_ends: Date;
  description: string;
  location: Point;
  cap_attendance: number;
  close_moment: boolean;
  visibility_type?: "nearby" | "circle" | "people";
}

interface Point {
  latitude: number;
  longitude: number;
}

interface InviteMembersProp {
  id?: string;
  member_id: string;
  circle_id: string;
  create_at: Date;
  accepted_at: Date;
  invited_by: string;
  status?: "pending" | "accepted" | "rejected";
}

interface InviteAttendeesProp {
  id?: string;
  attendee_id: string;
  moment_id: string;
  created_at: Date;
  accepted_at: Date;
  invited_by: string;
  status?: "pending" | "accepted" | "rejected";
}
