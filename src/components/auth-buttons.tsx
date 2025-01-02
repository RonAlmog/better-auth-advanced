"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import SignoutButton from "./signout-button";
import { authClient } from "@/app/auth-client";

const AuthButtons = () => {
  const { data: session } = authClient.useSession();
  return !session ? (
    <div className="flex gap-2 justify-center">
      <Link href="/sign-in">
        <Button variant="default">Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="default">Sign Up</Button>
      </Link>
    </div>
  ) : (
    <div className="flex gap-2 justify-center">
      <SignoutButton />
    </div>
  );
};

export default AuthButtons;
