import { sendEmail } from "@/actions/send-email";
import prisma from "@/lib/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    openAPI(),
    admin({ impersonationSessionDuration: 60 * 60 * 24 * 7 }), // 7 days
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackUrl=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;

      // send email with fetch, calling the send route
      // const url = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/send`;
      // const data = {
      //   from: "ronalmogatwork@gmail.com",
      //   to: user.email,
      //   verificationUrl,
      // };

      // await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       console.error("Error:", response);
      //     }
      //     return response.json();
      //   })
      //   .then((responseData) => {
      //     console.log("Success:", responseData);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });

      // send email with action
      const result = await sendEmail({
        from: process.env.FROM_EMAIL!,
        to: user.email,
        verificationUrl,
      });
      console.log("result:", JSON.stringify(result));
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
