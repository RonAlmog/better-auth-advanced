"use server";
import sgMail from "@sendgrid/mail";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not defined");
  }
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL is not defined");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to.toLowerCase().trim(),
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    const [response] = await sgMail.send(msg);
    if (response.statusCode !== 202) {
      throw new Error(`Failed to send email, ${response.statusCode}`);
    }

    return {
      success: true,
      messageId: response.headers["x-message-id"],
    };
  } catch (error) {
    console.error("Error sending email", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
