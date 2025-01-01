"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { forgotPasswordSchema } from "@/lib/schemas";
import { authClient } from "@/app/auth-client";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

const ForgotPassword = () => {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setPending(true);

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Check your email for a password reset link",
        variant: "default",
      });
      redirect("/sign-in");
    }
    setPending(false);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Please enter your email to receive a reset password link
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
                  <FormDescription>Enter your email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton pending={pending}>Send Reset Link</LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
