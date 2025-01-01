import { sendEmail, sendResetPasswordEmail } from "@/actions/send-email";
import prisma from "@/lib/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { url } from "inspector";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    openAPI(),
    // admin({ impersonationSessionDuration: 60 * 60 * 24 * 7 }), // 7 days
    nextCookies(), // make sure this is the last one
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // send email with action
      const result = await sendResetPasswordEmail({
        from: process.env.FROM_EMAIL!,
        to: user.email,
        url,
      });
      console.log("result:", JSON.stringify(result));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;

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
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
