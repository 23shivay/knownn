"use client" 
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import *as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "components/ui/use-toast"
import { redirect, usePathname, useRouter } from "next/navigation"
import { signInSchema } from "../../../schemas/signInSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "../../../types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { Button } from 'components/ui/button';
import { Loader2 } from "lucide-react"



import { signIn, useSession } from 'next-auth/react';


export default function SignInForm() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, update } = useSession(); 
  const router = useRouter();
 
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
  

  const { toast } = useToast();
  


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
  
      const result = await signIn("credentials", {
        redirect: false, 
        identifier: data.identifier,
        password: data.password,
      });
  
      
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else {
        window.location.reload();
        router.replace("/");
       
      }
      
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
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
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6  bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
            Knownn
          </h1>
          <p className="mb-4">Sign in to continue your  anonymous adventure </p>
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
                  "Sign in "
                )}
              </Button>
            </div>
            
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Register here if New?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
} 