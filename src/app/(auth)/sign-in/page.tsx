"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/schemas";
import { authClient } from "@/app/auth-client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorContext } from "@better-fetch/fetch";
import LoadingButton from "@/components/loading-button";
import { GithubIcon } from "lucide-react";

const SignIn = () => {
  const [pending, setPending] = useState(false);
  const [pendingGitHub, setPendingGitHub] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
        // callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          setPending(false);
          toast({ title: "Logged in!", variant: "default" });
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          // Handle not verified error
          if (ctx.error.status === 403) {
            toast({
              title: "Email not verified",
              description: "Please verify your email address",
              variant: "destructive",
            });
          } else {
            // handle generic error
            toast({
              title: "Something went wrong",
              description:
                ctx.error.message ?? "We could not find your credentials",
              variant: "destructive",
            });
          }
          setPending(false);
        },
      }
    );
  }

  const handleGitHubSignIn = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onRequest: () => {
          setPendingGitHub(true);
        },
        onSuccess: () => {
          setPendingGitHub(false);
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "We could not sign you in",
            variant: "destructive",
          });
          setPendingGitHub(false);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="***" {...field} />
                  </FormControl>
                  <FormDescription>Enter for your password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton pending={pending}>Submit</LoadingButton>
          </form>
        </Form>
        <div className="mt-4">
          <LoadingButton pending={pendingGitHub} onClick={handleGitHubSignIn}>
            <GithubIcon className=" size-4 mr-2" />
            Sign in with GitHub
          </LoadingButton>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="text-primary hover:underline ml-1" href="/sign-up">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
