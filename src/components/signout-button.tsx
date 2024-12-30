"use client";

import { authClient } from "@/app/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "./loading-button";

const SignoutButton = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignout = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
      setPending(false);
    }
  };
  return (
    <LoadingButton pending={pending} onClick={handleSignout}>
      Sign Out
    </LoadingButton>
  );
};

export default SignoutButton;
