import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faUserPlus,
  faBell,
  faCoffee,
  faBolt,
  faCalendarCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export type NotificationType =
  | "join"
  | "eventAlert"
  | "coffee"
  | "update"
  | "rsvp"
  | "message";

export const NotificationIcon: Record<NotificationType, IconDefinition> = {
  join: faUserPlus,
  eventAlert: faBell,
  coffee: faCoffee,
  update: faBolt,
  rsvp: faCalendarCheck,
  message: faEnvelope,
};
