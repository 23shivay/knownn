// "use client"

// import ContentSuggestionButton from 'components/contentSuggestion/ContentSuggestionButton'
// import { useSession } from 'next-auth/react'
// import Spinner from 'components/overall/Spinner';


// import React, { useState } from 'react'

   
 
// const page = () => {
//   const [isLoading,setIsLoading]=useState(true)
//   const { data: session } = useSession();
//   const userEmail=session?.user?.email  
  
   
  
//   return  (
    
//     <div className='mt-10'>
      
//     <ContentSuggestionButton userId={userEmail} />
    

//     </div> 
    
//   )
   
 
// }

// export default page  

// "use client"
// import React, { useCallback, useEffect, useState } from 'react'
// import { IoMdAdd } from "react-icons/io";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle, 
//     DialogTrigger,
//   } from "components/ui/dialog"
//   import { useForm } from 'react-hook-form'
//   import { zodResolver } from '@hookform/resolvers/zod'
// import { Button } from 'components/ui/button'
// import { v4 as uuidv4 } from "uuid";
// import { contentSuggestionSchema } from 'schemas/contentSuggestionSchema'
// import *as z from "zod"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
// import { Input } from 'components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
// import { useSession } from 'next-auth/react'
// import { Loader2 } from 'lucide-react'
// import { useToast } from 'components/ui/use-toast'
// import axios, { AxiosError } from 'axios'
// import { ApiResponse } from 'types/ApiResponse'
// import { contentCardType } from 'types/contentCardType';
// import ContentCard from '../../components/contentSuggestion/ContentCard';
// import Spinner from 'components/overall/Spinner';    
 
// const ContentSuggestionPage = () => {
//     const [open,setOpen]=useState(false)
//     const[isSubmitting,setIsSubmitting]=useState(false);
//     const [isLoading,setIsLoading]=useState(true)
//     const [content,setContent]=useState([])
//     const [sessionIdVotes,setSessionIdVotes]=useState([])
//     const {toast}=useToast();
//     const { data: session } = useSession();
//     const userid=session?.user?.sessionId
//    const userId=session?.user?.email  
  
    

    
//      //zod implementation
//    const form=useForm<z.infer<typeof contentSuggestionSchema>>({
//     resolver:zodResolver(contentSuggestionSchema),
//     defaultValues:{
//      contentName:"",
//      contentType:"",
//      genre:"",
//      description:"",
//      platform:"",
//      language:"",
//      userId:""
     
     
//     }
//    })

   
//    const onSubmit=async(data:z.infer<typeof contentSuggestionSchema>)=>{
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post<ApiResponse>('/api/content-suggestion', {contentData:data,userId:userId,contentId:uuidv4()});
//       toast({
//         title: 'Success',
//         description: response.data.message,

//       });
//       console.log(data);
//       console.log(userId);
//       if(response.data.success==true){
//         setOpen(!open)
//       }
      
      
//     } catch (error) {
//       console.error('Error durring suggesting Content:', error);
//       const axiosError = error as AxiosError<ApiResponse>;
//       const errorMessage = axiosError.response?.data.message || 'There was a problem in Suggestiong Content. Please try again.';
//       toast({
//         title: 'Issue in Suggesting Content',
//         description: errorMessage,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }

//    }
 
   
   


  
   
   
//    const fetchContent = useCallback(
//     async (refresh: boolean = false) => {
//       setIsLoading(true);  // Correct the loading state setter
//       try {
//         const response = await axios.get('/api/get-content');
       
//         const content = response.data.data;
  
//         // Optionally, do something with 'content', e.g., set it in state:
//         setContent(content);  // If you have a state to store the content
  
//         if (refresh) {
//           toast({
//             title: 'Refreshed Content',
//             description: 'Showing latest content',
//           });
//         }
//       } catch (error) {
//         const axiosError = error as AxiosError<ApiResponse>;
//         toast({
//           title: 'Error',
//           description: axiosError.response?.data.message ?? 'Failed to fetch content',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsLoading(false);  // Reset loading state in both success and error cases
//       }
//     },
//     [toast,setIsLoading]  
//   );
 

//     // Fetching vote status based on sessionId and contentId
// const fetchingSessionIdVotingonAll = useCallback(async () => {
//   setIsLoading(true);
//   try {
//     // Send a POST request to fetch vote data
//     const response = await axios.post(`/api/get-listofvoted`,{sessionId:userid});
//     const sessionIdVotingAll = response.data.data;
    
   
//     setSessionIdVotes(sessionIdVotingAll)

    
//   } catch (error) {
//     const axiosError = error as AxiosError<ApiResponse>;
//     toast({
//       title: "Error",
//       description: axiosError.response?.data.message ?? "Failed to fetch voting",
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// }, [toast,setIsLoading]);
  

//    //Fetch initial state from the server
//    useEffect(() => {
//     if (!session || !session.user) return;

//     fetchContent();
//     fetchingSessionIdVotingonAll()

    
//   }, [session,toast,isSubmitting==false]);

//     useEffect(() => {
//       const fetchData = async () => {
//         setIsLoading(true); // Start loading
//         await Promise.all([
//           fetchingSessionIdVotingonAll(),
//           fetchContent()
        
//         ]);
//         setIsLoading(false); // End loading
//       };
//       fetchData();
//     }, [fetchingSessionIdVotingonAll,fetchContent]);


//     return isLoading ? (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner/> 
//       </div>
//     ) : (
//       <div className='flex flex-col  w-full min-h-screen'>
//       <div className='flex  items-end  justify-end mt-10'>
//       <Dialog open={open} onOpenChange={setOpen}>
//   <DialogTrigger asChild>
//     <Button>
//     <div className='flex items-center justify-between space-x-1'>
//   <span >
//     Suggest Content
//   </span>
  
//   <span className='flex items-center justify-center   '>
//     <IoMdAdd size={22} />
//   </span>
// </div>
   
//         </Button>
//   </DialogTrigger>
//   <DialogContent>
//     <DialogHeader>
//       <DialogTitle>Suggest Content </DialogTitle>
//       </DialogHeader>

//       <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
//       <FormField
//   control={form.control}
//   name="contentName"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Content Name</FormLabel>
//       <FormControl>
//       <Input type="text" placeholder="Content Name " {...field}  />
//       </FormControl>
     
//       <FormMessage />
//     </FormItem>
//   )}/>  
//        <FormField
//           control={form.control}
//           name="contentType"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-gray-700">Content Type</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300 focus:outline-none">
//                     <SelectValue placeholder="Select Content Type" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="Movie">Movie</SelectItem>
//                   <SelectItem value="WebSeries">Web-Series</SelectItem>
//                   <SelectItem value="Show">Show</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

// <FormField
//           control={form.control}
//           name="genre"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-gray-700">Genre</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger className="w-full p-3 border border-gray-300 rounded focus:ring focus:ring-blue-300 focus:outline-none">
//                     <SelectValue placeholder="Select Content Type" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                  <SelectItem value="Action/Adventure">Action/Adventure</SelectItem>
//                   <SelectItem value="Comedy">Comedy</SelectItem>
//                   <SelectItem value="Drama/Romance">Drama/Romance</SelectItem>
//                   <SelectItem value="Thriller/Mystery">Thriller/Mystery</SelectItem>
//                   <SelectItem value="SciFi/Fantasy">Sci-Fi/Fantasy</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />



// <FormField
//   control={form.control}
//   name="language"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Language</FormLabel>
//       <FormControl>
//       <Input type="text" placeholder="If You Know  " {...field}  />
//       </FormControl>
     
//       <FormMessage />
//     </FormItem>
//   )}/>  

// <FormField
//   control={form.control}
//   name="platform"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Availabe on Platform</FormLabel>
//       <FormControl>
//       <Input type="text" placeholder="If You Know " {...field}  />
//       </FormControl>
     
//       <FormMessage />
//     </FormItem>
//   )}/>  

// <FormField
//   control={form.control}
//   name="description"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Describe</FormLabel>
//       <FormControl>
//       <Input type="text" placeholder=" plzz Describe Content... " {...field}  />
//       </FormControl>
     
//       <FormMessage />
//     </FormItem>
//   )}/>  
     

//      <div className="flex justify-center ">
//         <Button type="submit" className='min-w-full' disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please wait
//                 </>
//               ) : (
//                 'Submit'
//               )}
//             </Button>
          
//         </div>
//       </form>

//       </Form>
    
//   </DialogContent>
//       </Dialog>

//       </div>

//       <ContentCard content={content} sessionIdVotes={sessionIdVotes} />

//       </div>
//     );
    
 
// }
  


// export default ContentSuggestionPage;




"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/ui/button';
import { v4 as uuidv4 } from "uuid";
import { contentSuggestionSchema } from 'schemas/contentSuggestionSchema';
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useToast } from 'components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from 'types/ApiResponse';
import ContentCard from '../../components/contentSuggestion/ContentCard';
import Spinner from 'components/overall/Spinner';

const ContentSuggestionPage = () => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState([])
  const [sessionIdVotes, setSessionIdVotes] = useState([])
  const { toast } = useToast()
  const { data: session } = useSession()
  const userid = session?.user?.sessionId
  const userId = session?.user?.email
  const organizationName = session?.user?.organizationName;

  const form = useForm<z.infer<typeof contentSuggestionSchema>>({
      resolver: zodResolver(contentSuggestionSchema),
      defaultValues: {
          contentName: "",
          contentType: "",
          genre: "",
          description: "",
          platform: "",
          language: "",
          userId: ""
      }
  })

  // Reset form when dialog closes
  useEffect(() => {
      if (!open) {
          form.reset()
      }
  }, [open, form])

  const fetchContent = useCallback(async () => {
      try {
          const response = await axios.post('/api/get-content')
          const contentData = response.data.data
          setContent(contentData)
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast({
              title: 'Error',
              description: axiosError.response?.data.message ?? 'Failed to fetch content',
              variant: 'destructive',
          })
      }
  }, [toast])

  const fetchSessionIdVoting = useCallback(async () => {
      if (!userid) return

      try {
          const response = await axios.post(`/api/get-listofvoted`, { sessionId: userid })
          const votingData = response.data.data
          setSessionIdVotes(votingData)
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast({
              title: "Error",
              description: axiosError.response?.data.message ?? "Failed to fetch voting",
              variant: "destructive",
          })
      }
  }, [userid, toast])

  const onSubmit = async (data: z.infer<typeof contentSuggestionSchema>) => {
      setIsSubmitting(true)
      try {
          const response = await axios.post<ApiResponse>('/api/content-suggestion', {
              contentData: data,
              organizationName: organizationName,
              contentId: uuidv4()
          })
          
          toast({
              title: 'Success',
              description: response.data.message,
          })

          if (response.data.success) {
              setOpen(false)
              // Refresh content after successful submission
              await fetchContent()
          }
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast({
              title: 'Issue in Suggesting Content',
              description: axiosError.response?.data.message ?? 'There was a problem in Suggesting Content. Please try again.',
              variant: 'destructive',
          })
      } finally {
          setIsSubmitting(false)
      }
  }

  // Initial data fetch
  useEffect(() => {
      const loadInitialData = async () => {
          setIsLoading(true)
          try {
              await Promise.all([
                  fetchContent(),
                  fetchSessionIdVoting()
              ])
          } finally {
              setIsLoading(false)
          }
      }

      if (session?.user) {
          loadInitialData()
      }
  }, [session, fetchContent, fetchSessionIdVoting])

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ) : (
    <div className='flex flex-col w-full min-h-screen'>
      <div className='flex items-end justify-end mt-10'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <div className='flex items-center justify-between space-x-1'>
                <span>Suggest Content</span>
                <span className='flex items-center justify-center'>
                  <IoMdAdd size={22} />
                </span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suggest Content</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Content Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Content Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Movie">Movie</SelectItem>
                          <SelectItem value="WebSeries">Web-Series</SelectItem>
                          <SelectItem value="Show">Show</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Action/Adventure">Action/Adventure</SelectItem>
                          <SelectItem value="Comedy">Comedy</SelectItem>
                          <SelectItem value="Drama/Romance">Drama/Romance</SelectItem>
                          <SelectItem value="Thriller/Mystery">Thriller/Mystery</SelectItem>
                          <SelectItem value="SciFi/Fantasy">Sci-Fi/Fantasy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="If You Know" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available on Platform</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="If You Know" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Please Describe Content..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
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
      <ContentCard content={content} sessionIdVotes={sessionIdVotes} />
    </div>
  );
};

export default ContentSuggestionPage;