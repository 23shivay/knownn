"use client" 
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import *as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "components/ui/use-toast"
import { redirect, useRouter } from "next/navigation"

import axios, { AxiosError } from 'axios'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { Button } from 'components/ui/button';
import { Loader2 } from "lucide-react"


import { signIn, useSession } from 'next-auth/react';
import { feedbackSchema } from "schemas/feedbackSchema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  

  


  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback:'',
      feedbackCategory:'',
      why:'',
      email:'',
      phoneNumber:''
        },
  });
  

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error('Failed to submit feedback');
  
      toast({ title: 'Success', description: 'Feedback submitted successfully' });
      form.reset();
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const { data: session } = useSession();  
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] bg-black text-white overflow-auto pt-2 ">
  <div className="w-full max-w-md p-4 space-y-6 text-black bg-white rounded-lg shadow-md overflow-y-auto max-h-[80vh]">
    <div className="text-center">
      <h1 className="text-2xl font-extrabold tracking-tight  bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
        Feedback
      </h1>
      <p className="mb-4">Your Feedback Fuels Innovation</p>
    </div>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share Your Thoughts OR any new Feature you want</FormLabel>
              <FormControl>
                <Input type="text" className="w-full" placeholder="Tell us about your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="feedbackCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300 focus:outline-none">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Feature_Request">Feature Request</SelectItem>
                  <SelectItem value="General_Feedback">General Feedback</SelectItem>
                  <SelectItem value="Bug_Report">Bug Report</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="why"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How can we improve? OR Explain  about new feature you want</FormLabel>
              <FormControl>
                <Input type="text" className="w-full" placeholder="What changes or new features you want?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <Input type="email" className="w-full" placeholder="If you want to discuss this further?" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (optional)</FormLabel>
              <Input type="integer" className="w-full" placeholder="If you want to discuss this further?" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-center">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  </div>
</div>

  );
} 