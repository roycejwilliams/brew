import { Resend } from "resend";
import twilio from "twilio";
import "dotenv/config";

interface EmailProp {
  status?: "accepted" | "rejected";
  email: string;
  otp_code?: string;
  resent?: boolean;
  login?: boolean;
  invite_type?: "received" | "accepted" | "rejected";
  invite_target?: "circle" | "moment";
  transfer_ticket?: boolean;
  moment_recap?: { moments_name: string; recap: string };
  photo_uploaded?: { moments_name: string; uploader_username: string };
  check_in?: { moments_name: string; attendee_username: string };
  moment_reminder?: {
    moments_name: string;
    location_name: string;
    time: string;
  };
  circle_invite_reminder?: { circle_name: string };
  moment_invite_reminder?: { moments_name: string; time: string };
}

interface MessageProp {
  status?: "accepted" | "rejected";
  phone_number: string;
  otp_code?: string;
  resent?: boolean;
  login?: boolean;
  invite_type?: "received" | "accepted" | "rejected";
  invite_target?: "circle" | "moment";
  transfer_ticket?: boolean;
  moment_recap?: { moments_name: string };
  photo_uploaded?: { moments_name: string; uploader_username: string };
  check_in?: { moments_name: string; attendee_username: string };
  moment_reminder?: {
    moments_name: string;
    location_name: string;
    time: string;
  };
  circle_invite_reminder?: { circle_name: string };
  moment_invite_reminder?: { moments_name: string; time: string };
}

const BASE_STYLE = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;`;
const BRAND = `<p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>`;
const FOOTER = `<p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>`;
const OTP_BOX = (code: string) =>
  `<div style="border: 1px solid #222; border-radius: 4px; padding: 28px; text-align: center; letter-spacing: 12px; font-size: 28px; font-weight: 700; color: #fff;">${code}</div>`;

const emailTemplate = (body: string) =>
  `<div style="${BASE_STYLE}">${BRAND}${body}${FOOTER}</div>`;

const h1 = (text: string) =>
  `<h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">${text}</h1>`;

const p = (text: string) =>
  `<p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 24px 0;">${text}</p>`;

export const sendSMS = async ({
  phone_number,
  otp_code,
  status,
  resent,
  invite_type,
  invite_target,
  login,
  transfer_ticket,
  moment_recap,
  photo_uploaded,
  check_in,
  moment_reminder,
  circle_invite_reminder,
  moment_invite_reminder,
}: MessageProp) => {
  console.log("Twilio SID:", process.env.TWILIO_TEST_SID?.slice(0, 6));

  const client = twilio(
    process.env.TWILIO_TEST_SID,
    process.env.TWILIO_TEST_AUTH_TOKEN,
  );
  try {
    if (status === "accepted") {
      await client.messages.create({
        body: `You're in. You were chosen to join BR3W. Use the code below to get started.\n${otp_code}`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    } else if (status === "rejected") {
      await client.messages.create({
        body: `Your BR3W application wasn't accepted. You're welcome to update and resubmit.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (resent) {
      await client.messages.create({
        body: `Here's your new BR3W verification code.\n${otp_code}`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (login) {
      await client.messages.create({
        body: `Your BR3W login code is below. It expires in 5 minutes.\n${otp_code}`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (invite_type === "received" && invite_target === "circle") {
      await client.messages.create({
        body: `You've been invited to join a circle on BR3W. Open the app to accept or decline.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    } else if (invite_type === "received" && invite_target === "moment") {
      await client.messages.create({
        body: `You've been invited to a moment on BR3W. Open the app to see the details.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    } else if (invite_type === "accepted") {
      await client.messages.create({
        body: `Your invite was accepted. They're in.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    } else if (invite_type === "rejected") {
      await client.messages.create({
        body: `Your invite was declined.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (transfer_ticket) {
      await client.messages.create({
        body: `A BR3W ticket was transferred to you. Open the app to view the moment details and your entry code.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (moment_recap) {
      await client.messages.create({
        body: `${moment_recap.moments_name} is over. Your recap is ready — open BR3W to relive the night.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (photo_uploaded) {
      await client.messages.create({
        body: `${photo_uploaded.uploader_username} added a photo to ${photo_uploaded.moments_name}. Open BR3W to see the recap.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (check_in) {
      await client.messages.create({
        body: `${check_in.attendee_username} just checked in to ${check_in.moments_name}.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (moment_reminder) {
      await client.messages.create({
        body: `Reminder: ${moment_reminder.moments_name} starts at ${moment_reminder.time}. ${moment_reminder.location_name}. Don't miss it.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (circle_invite_reminder) {
      await client.messages.create({
        body: `You still have a pending circle invite on BR3W — ${circle_invite_reminder.circle_name}. Open the app to respond.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }

    if (moment_invite_reminder) {
      await client.messages.create({
        body: `You still haven't responded to your invite for ${moment_invite_reminder.moments_name} — it starts at ${moment_invite_reminder.time}. Open BR3W to respond.`,
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    }
  } catch (error) {
    console.error("Cannot process SMS at this time", error);
  }
};

export const sendEmail = async ({
  email,
  otp_code,
  status,
  resent,
  invite_type,
  invite_target,
  login,
  transfer_ticket,
  moment_recap,
  photo_uploaded,
  check_in,
  moment_reminder,
  circle_invite_reminder,
  moment_invite_reminder,
}: EmailProp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    if (!email) return;

    if (status === "accepted") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Welcome to br3w.`,
        html: emailTemplate(
          h1("You were chosen.") +
            p(
              "Your access code is waiting. Use it to step in — it expires in 5 minutes.",
            ) +
            OTP_BOX(otp_code!) +
            `<p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">Do not share this code.</p>`,
        ),
      });
    }

    if (status === "rejected") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your br3w application.`,
        html: emailTemplate(
          h1("Not this time.") +
            p(
              "Your application wasn't accepted. You're welcome to update and resubmit for another review.",
            ),
        ),
      });
    }

    if (resent) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your new BR3W verification code.`,
        html: emailTemplate(
          h1("New code. Same you.") +
            p(
              "You requested a new verification code. Use it below to get into BR3W.",
            ) +
            OTP_BOX(otp_code!) +
            `<p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">This code expires in 5 minutes.</p>`,
        ),
      });
    }

    if (login) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your BR3W login code.`,
        html: emailTemplate(
          h1("Welcome back.") +
            p("Use the code below to sign in. It expires in 5 minutes.") +
            OTP_BOX(otp_code!) +
            `<p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">Do not share this code.</p>`,
        ),
      });
    }

    if (invite_type === "received" && invite_target === "circle") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `You've been invited.`,
        html: emailTemplate(
          h1("You're wanted in a circle.") +
            p(
              "Someone added you to their circle on BR3W. Open the app to accept or decline.",
            ),
        ),
      });
    } else if (invite_type === "received" && invite_target === "moment") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `You've been invited to a moment.`,
        html: emailTemplate(
          h1("Something's happening.") +
            p(
              "You've been invited to a moment on BR3W. Open the app to see the details and respond.",
            ),
        ),
      });
    } else if (invite_type === "accepted") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your invite was accepted.`,
        html: emailTemplate(
          h1("They're in.") +
            p(
              "Your invite was accepted. Your circle just got a little more intentional.",
            ),
        ),
      });
    } else if (invite_type === "rejected") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your invite was declined.`,
        html: emailTemplate(
          h1("Not this time.") +
            p(
              "Your invite was declined. Circles are built on intention — not everyone is a fit.",
            ),
        ),
      });
    }

    if (transfer_ticket) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `Your ticket has been transferred.`,
        html: emailTemplate(
          h1("You're in.") +
            p(
              "A ticket was transferred to you. Open BR3W to view the moment details and your entry code.",
            ),
        ),
      });
    }

    if (moment_recap) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `${moment_recap.moments_name} — the recap is ready.`,
        html: emailTemplate(
          h1("Rewind the night.") +
            p(moment_recap.recap) +
            p("Open BR3W to see the full recap, photos, and attendees."),
        ),
      });
    }

    if (photo_uploaded) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `New photo added to ${photo_uploaded.moments_name}.`,
        html: emailTemplate(
          h1("The story grows.") +
            p(
              `${photo_uploaded.uploader_username} added a photo to ${photo_uploaded.moments_name}. Open BR3W to see the recap.`,
            ),
        ),
      });
    }

    if (check_in) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `${check_in.attendee_username} checked in.`,
        html: emailTemplate(
          h1("They made it.") +
            p(
              `${check_in.attendee_username} just checked in to ${check_in.moments_name}. The night is taking shape.`,
            ),
        ),
      });
    }

    if (moment_reminder) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `${moment_reminder.moments_name} is coming up.`,
        html: emailTemplate(
          h1("Don't miss it.") +
            p(
              `${moment_reminder.moments_name} starts at ${moment_reminder.time}.`,
            ) +
            p(
              `${moment_reminder.location_name}. Open BR3W for details and directions.`,
            ),
        ),
      });
    }

    if (circle_invite_reminder) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `You have a pending circle invite.`,
        html: emailTemplate(
          h1("Still waiting on you.") +
            p(
              `You have a pending invite to join ${circle_invite_reminder.circle_name} on BR3W. Open the app to accept or decline.`,
            ),
        ),
      });
    }

    if (moment_invite_reminder) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: email,
        subject: `You haven't responded to your invite.`,
        html: emailTemplate(
          h1("They're waiting on you.") +
            p(
              `You still haven't responded to your invite for ${moment_invite_reminder.moments_name} — it starts at ${moment_invite_reminder.time}.`,
            ) +
            p("Open BR3W to accept or decline before the moment fills up."),
        ),
      });
    }
  } catch (error) {
    console.error("Cannot process email at this time", error);
  }
};
