"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { authClient } from "@/app/auth-client";
import SignoutButton from "./signout-button";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <Link href="/" className="text-xl font-bold">
        Better Auth
      </Link>
      {!session ? (
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
      )}
    </nav>
  );
};

export default Navbar;
