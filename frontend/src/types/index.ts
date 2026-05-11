interface ApplicationProp {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  work_link: string;
  reason: string;
  status?: "pending" | "accepted" | "rejected";
  created_at?: string;
}

interface Point {
  latitude: number;
  longitude: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  location: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface CircleProp {
  id?: string;
  owner_id: string;
  circle_name: string;
  circle_image: string;
  created_at: Date;
  updated_at: Date;
  members: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_image: string;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MomentProp {
  id?: string;
  creator_id: string;
  circle_id: CircleProp;
  image: string;
  moments_name: string;
  created_at: Date;
  update_at: Date;
  moment_start: string | Date;
  moment_end: string | Date;
  description: string;
  location: Point;
  location_name: string;
  cap_attendance: number;
  close_moment: boolean;
  visibility_type?: "nearby" | "circle" | "people";
  principles: string[];
  expectations: string[];
  vibes: string[];
  faqs: { question: string; answer: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface InviteMembersProp {
  id?: string;
  member_id: string;
  circle_id: string;
  create_at: Date;
  accepted_at: Date;
  invited_by: string;
  status?: "pending" | "accepted" | "rejected";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface InviteAttendeesProp {
  id?: string;
  attendee_id: string;
  moment_id: string;
  created_at: Date;
  accepted_at: Date;
  invited_by: string;
  status?: "pending" | "accepted" | "rejected";
}
