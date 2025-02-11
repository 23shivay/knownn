'use client'
import { useEffect, useState } from "react";
import { useToast } from "components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signInSchema } from "../../../schemas/signInSchema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from 'components/ui/input';
import Link from "next/link";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession(); // Using the session status


  useEffect(()=>{ if (session?.user) {
    router.replace("/"); // Redirect to home page if already signed in
  }},[session, router])

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();

  // Check if user is already signed in
  useEffect(() => {
    if (session?.user) {
      router.push("/"); // Redirect to home page if session exists
    }
  }, [session, router]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      router.replace('/sign-in');
      if (result?.error) {
        toast({
          title: "Login Failed",
          description:
            result.error === "CredentialsSignin"
              ? "Incorrect username or password"
              : "You are using a RESTRICTED WIFI SERVICE",
          variant: "destructive",
        });
      } else {
        // This will automatically update the session, triggering the redirect effect.
        // No need for immediate router.push here since `useSession` will handle it.
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <div className="w-full max-w-md p-8 space-y-8 text-black bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
            Knownn
          </h1>
          <p className="mb-4">Sign in to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" className="min-w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Sign up if Not Registered before!{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
