'use client'
import { Button } from 'components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form'; 
import { Input } from 'components/ui/input';
import { useToast } from 'components/ui/use-toast';
import { verifySchema } from 'schemas/verifySchema';
import { ApiResponse } from 'types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'; 
import *as z from 'zod';
import { Loader2 } from 'lucide-react';

const page = () => {
    const [isSubmitting,setIsSubmitting]=useState(false);
    const {toast}=useToast();
    const router=useRouter();
    const params=useParams();

     const form=useForm({

      resolver:zodResolver(verifySchema),
      defaultValues:{
        code:'',
      }
     }) 

     //
     const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
      setIsSubmitting(true);
      try {
        const response=await axios.post<ApiResponse>('/api/verify-code',
          {
            email:params.email,
            code:data.code
          }
        )
        toast({
          title: 'Success',
          description: response.data.message,
        });
  
        router.replace('/sign-in');
        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Verification Failed',
          description:
            axiosError.response?.data.message ??
            'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
      finally {
        setIsSubmitting(false);
      }
      

     }
  
    



    
 
  return (
    <div  className="flex justify-center items-center h-[calc(100vh-6rem)] ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white text-black rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6  bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text ">  Verify Your Account </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input type="text" placeholder='
                   Enter Verification Code' {...field} />
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
                  "Verify"
                )}
              </Button>
            </div>
          </form>
        </Form>

      </div>
    </div>
  )
}

export default page