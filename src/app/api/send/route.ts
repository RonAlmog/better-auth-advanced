import { VerifyEmail } from "@/components/email/verify-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { from, to, verificationUrl } = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: "Please verify your email",
      react: await VerifyEmail({ verificationUrl: verificationUrl }),
    });

    if (error) {
      console.log({ error });
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

// export async function GET(req: Request) {
//   return Response.json({ message: "Hello World!" });
// }
