"use client"

import ContentSuggestionButton from 'components/contentSuggestion/ContentSuggestionButton'
import { useSession } from 'next-auth/react'
import Spinner from 'components/overall/Spinner';


import React, { useState } from 'react'

   

const page = () => {
  const [isLoading,setIsLoading]=useState(true)
  const { data: session } = useSession();
  const userEmail=session?.user?.email  
  
   
  
  return  (
    
    <div className='mt-10'>
      
    <ContentSuggestionButton userId={userEmail} />
    

    </div> 
    
  )
   
 
}

export default page

