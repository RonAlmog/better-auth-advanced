import { sendEmail } from "@/actions/email";
import prisma from "@/lib/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  // secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [openAPI()], // api/auth/reference
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackUrl=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click this link to verify your email address: ${verificationUrl}`,
      });
    },
  },
} satisfies BetterAuthOptions);
