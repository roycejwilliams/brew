import { Resend } from "resend";
import twilio from "twilio";
import "dotenv/config";

interface EmailProp {
  status?: "accepted" | "rejected";
  email: string;
  otp_code?: string;
  resent?: boolean;
}

interface MessageProp {
  status?: "accepted" | "rejected";
  phone_number: string;
  otp_code?: string;
  resent?: boolean;
}

//send SMS messages
export const sendSMS = async ({
  phone_number,
  otp_code,
  status,
  resent,
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
  } catch (error) {
    console.error("Cannot process email at this time", error);
  }
};
