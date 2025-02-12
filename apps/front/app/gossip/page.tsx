"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "components/ui/dialog"
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'components/ui/button'

import { contentSuggestionSchema } from 'schemas/contentSuggestionSchema'
import *as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from 'components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useToast } from 'components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from 'types/ApiResponse'
import { contentCardType } from 'types/contentCardType';
import { gossipCreationSchema } from 'schemas/gossipCreationSchema';
import { v4 as uuidv4 } from "uuid";
import GossipCard from 'components/gossip/GossipCard';
import Spinner from 'components/overall/Spinner';



export interface GossipItem {
  id: string;
  contentName: string;
  createdAt: string;
  description: string;
  likeCount: number |any;
  dislikeCount: number |any
  intrestingCount: number |any
}

interface ContentCardProps {
  content: GossipItem[];
}

 
const GossipPage = () => {
    const [open,setOpen]=useState(false)
    const[isSubmitting,setIsSubmitting]=useState(false);
    const [isLoading,setIsLoading]=useState(true)
    const [gossip,setGossip]=useState([])
    const {toast}=useToast();
    const [sessionIdVotes,setSessionIdVotes]=useState([])
    const [listOfSessionIdReports,setListOfSessionIdReports]=useState([])
    const { data: session } = useSession();
    const userid=session?.user?.sessionId
    
    
    const organizationName = session?.user?.organizationName;

     //zod implementation
   const form=useForm<z.infer<typeof gossipCreationSchema>>({
    resolver:zodResolver(gossipCreationSchema),
    defaultValues:{
     contentName:"",
     description:"",
     organizationName:"",
     
     
    }
   })

   const onSubmit=async(data:z.infer<typeof gossipCreationSchema>)=>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/create-gossip', {gossipData:data,organizationName:organizationName,gossipId:uuidv4()});
      toast({
        title: 'Success',
        description: response.data.message, 

      });
      if(response.data.success==true){
        setOpen(!open)
      }
      
      
    } catch (error) {
      console.error('Error durring creating GOSSIP:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'There was a problem in creating GOSSIP . Please try again.';
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }

   }
 
   //fetching Gossip
    const fetchContent = useCallback(
    async (refresh: boolean = false) => {
       
      try {
        const response = await axios.post('/api/get-gossip',{
          organizationName:organizationName
        });
        console.log(response.data.data)
        // Assuming contentCardType is correctly defined somewhere in your code
        const content = response.data.data;
  
        // Optionally, do something with 'content', e.g., set it in state:
        setGossip(content);  // If you have a state to store the content
  
        if (refresh) {
          toast({
            title: 'Refreshed Content',
            description: 'Showing latest content',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message ?? 'Failed to fetch content',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);  // Reset loading state in both success and error cases
      }
    },
    [setIsLoading, toast,]  // Ensure you're correctly passing state setters or functions as dependencies
  );

      // Fetching vote status based on sessionId and contentId
const fetchingSessionIdVotingonAll = useCallback(async () => {
  
  try {
    // Send a POST request to fetch vote data
    const response = await axios.post(`/api/get-listofvoted`,{sessionId:userid});
    const sessionIdVotingAll = response.data.data;
    
    // Log the fetched vote to debug
    console.log(sessionIdVotingAll);
    setSessionIdVotes(sessionIdVotingAll)

    
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: "Error",
      description: axiosError.response?.data.message ?? "Failed to fetch voting",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}, [toast,setIsLoading]);
  
//fetching list of reports done by userId

   // Fetch initial state from the server
   useEffect(() => {
    if (!session || !session.user) return;

    fetchContent();
    fetchingSessionIdVotingonAll()
    

    
  }, [session,toast,isSubmitting==false]);

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true); // Start loading
        await Promise.all([
          fetchingSessionIdVotingonAll(),
          fetchContent()
        
        ]);
        setIsLoading(false); // End loading
      };
      fetchData();
    }, [fetchingSessionIdVotingonAll,fetchContent]);


    return isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <Spinner/> {/* Loader is displayed while loading */}
      </div>
    ) : (
      <div className='flex flex-col  w-full min-h-screen'>
      <div className='flex  items-end  justify-end mt-10'>
        
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>
    <div className='flex items-center justify-between space-x-1'>
  <span >
      Create Gossip
  </span>
  
  <span className='flex items-center justify-center   '>
    <IoMdAdd size={22} />
  </span>
</div>
   
        </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Greate Gossip </DialogTitle>
      </DialogHeader>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
      <FormField
  control={form.control}
  name="contentName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Gossip Title</FormLabel>
      <FormControl>
      <Input type="text" placeholder="Content Name " {...field}  />
      </FormControl>
      
      <FormMessage />
    </FormItem>
  )}/>  
       

     <FormField
       control={form.control}
       name="description"
       render={({ field }) => (
         <FormItem>
           <FormLabel>Describe</FormLabel>
           <FormControl>
           <Input type="text" placeholder=" plzz Describe Content... " {...field}  />
           </FormControl>
          
           <FormMessage />
         </FormItem>
  )}/>  
     

     <div className="flex justify-center ">
        <Button type="submit" className='min-w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Submit'
              )}
            </Button>
          
        </div>
      </form>

      </Form>
    
  </DialogContent>
      </Dialog>

      </div>
      <GossipCard gossips={gossip} sessionIdVotes={sessionIdVotes} />
      </div>
    );
     
  
} 

export default GossipPage