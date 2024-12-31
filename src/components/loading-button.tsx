import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

type Props = {
  pending: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

const LoadingButton = ({ pending, children, onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      disabled={pending}
      className="w-full"
      type="submit"
    >
      {pending ? <Loader className="size-5 animate-spin" /> : children}
    </Button>
  );
};

export default LoadingButton;
