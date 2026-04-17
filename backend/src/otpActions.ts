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
}

interface MessageProp {
  status?: "accepted" | "rejected";
  phone_number: string;
  otp_code?: string;
  resent?: boolean;
  login?: boolean;
  invite_type?: "received" | "accepted" | "rejected";
  invite_target?: "circle" | "moment";
}

//send SMS messages
export const sendSMS = async ({
  phone_number,
  otp_code,
  status,
  resent,
  invite_type,
  invite_target,
  login,
}: MessageProp) => {
  const client = twilio(
    process.env.TWILIO_TEST_SID,
    process.env.TWILIO_TEST_AUTH_TOKEN,
  );
  try {
    //status accepted
    if (status === "accepted") {
      await client.messages.create({
        body: `You're in. You were chosen to join BR3W. Use the code below to get started.\n${otp_code}`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    } else if (status === "rejected") {
      await client.messages.create({
        body: `Your BR3W application wasn't accepted. You're welcome to update and resubmit for another review.`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    }

    //resent otp
    if (resent) {
      await client.messages.create({
        body: `Here's your new verification code for BR3W. Use the code below to verify your account.\n${otp_code}`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    }

    if (login) {
      await client.messages.create({
        body: `Your BR3W login code is below. It expires in 5 minutes.\n${otp_code}`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    }

    if (invite_type === "received" && invite_target === "circle") {
      await client.messages.create({
        body: `You've been invited to join a circle on BR3W. Open the app to accept or decline.`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    } else if (invite_type === "received" && invite_target === "moment") {
      await client.messages.create({
        body: `You've been invited to a moment on BR3W. Open the app to see the details.`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    } else if (invite_type === "accepted") {
      await client.messages.create({
        body: `Your invite was accepted. They're in.`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    } else if (invite_type === "rejected") {
      await client.messages.create({
        body: `Your invite was declined.`,
        to: `${phone_number}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
      });
    }
  } catch (error) {
    console.error("Cannot process SMS at this time", error);
  }
};

//send email messages
export const sendEmail = async ({
  email,
  otp_code,
  status,
  resent,
  invite_type,
  invite_target,
  login,
}: EmailProp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    if (!email) return `Invalid ${email}`;
    if (!otp_code && status === "accepted") return `Invalid code`;

    //status accepted

    if (status === "accepted") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `Welcome to br3w.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
            <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
            <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">You were chosen.</h1>
            <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Your access code is waiting. Use it to step in — it expires in 5 minutes.</p>
            <div style="border: 1px solid #222; border-radius: 4px; padding: 28px; text-align: center; letter-spacing: 12px; font-size: 28px; font-weight: 700; color: #fff;">
              ${otp_code}
            </div>
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">Do not share this code.</p>
          </div>`,
      });
    } else if (status === "rejected") {
      await resend.emails.send({
        from: "hello@br3w.app",
        to: `${email}`,
        subject: `Your br3w application.`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
        <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
        <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">Not this time.</h1>
        <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Your application wasn't accepted. You're welcome to update your application and resubmit for another review.</p>
        <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>
      </div>`,
      });
    }

    //resent OTP
    if (resent) {
      await resend.emails.send({
        from: "hello@br3w.app",
        to: `${email}`,
        subject: `Your new BR3W verification code.`,
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
          <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
          <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">New code. Same you.</h1>
          <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">You requested a new verification code. Use it below to get into BR3W.</p>
          <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #fff; margin: 0 0 48px 0;">${otp_code}</p>
          <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">This code expires in 5 minutes.</p>
        </div>`,
      });
    }

    if (login) {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `Your BR3W login code.`,
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
      <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
      <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">Welcome back.</h1>
      <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Use the code below to sign in. It expires in 5 minutes.</p>
      <div style="border: 1px solid #222; border-radius: 4px; padding: 28px; text-align: center; letter-spacing: 12px; font-size: 28px; font-weight: 700; color: #fff;">
        ${otp_code}
      </div>
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">Do not share this code.</p>
    </div>`,
      });
    }

    if (invite_type === "received" && invite_target === "circle") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `You've been invited.`,
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
      <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
      <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">You're wanted in a circle.</h1>
      <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Someone added you to their circle on BR3W. Open the app to accept or decline.</p>
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>
    </div>`,
      });
    } else if (invite_type === "received" && invite_target === "moment") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `You've been invited to a moment.`,
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
      <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
      <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">Something's happening.</h1>
      <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">You've been invited to a moment on BR3W. Open the app to see the details and respond.</p>
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>
    </div>`,
      });
    } else if (invite_type === "accepted") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `Your invite was accepted.`,
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
      <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
      <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">They're in.</h1>
      <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Your invite was accepted. Your circle just got a little more intentional.</p>
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>
    </div>`,
      });
    } else if (invite_type === "rejected") {
      await resend.emails.send({
        from: "BR3W <hello@br3w.app>",
        to: `${email}`,
        subject: `Your invite was declined.`,
        html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 48px 32px; background: #000; color: #fff;">
      <p style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #444; margin: 0 0 48px 0;">br3w</p>
      <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin: 0 0 16px 0;">Not this time.</h1>
      <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 48px 0;">Your invite was declined. Circles are built on intention — not everyone is a fit.</p>
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #333; margin-top: 32px;">br3w is intentional. So is this.</p>
    </div>`,
      });
    }
  } catch (error) {
    console.error("Cannot process email at this time", error);
  }
};
