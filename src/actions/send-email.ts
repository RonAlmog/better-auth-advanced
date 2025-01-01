"use server";
import ResetPassword from "@/components/email/reset-password";
import { VerifyEmail } from "@/components/email/verify-email";
import { Resend } from "resend";

interface SendEmailProps {
  from: string;
  to: string;
  verificationUrl: string;
}

export async function sendEmail({ from, to, verificationUrl }: SendEmailProps) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: "Please verify your email",
      react: await VerifyEmail({ verificationUrl: verificationUrl }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

interface SendResetPasswordProps {
  from: string;
  to: string;
  url: string;
}

export async function sendResetPasswordEmail({
  from,
  to,
  url,
}: SendResetPasswordProps) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: "Here is your password reset link",
      react: await ResetPassword({ url }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
