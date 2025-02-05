"use client"
import React, { useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import axios, { AxiosError } from 'axios';
import { useToast } from 'components/ui/use-toast';
import { GossipItem } from 'components/gossip/GossipCard';
import { ContentItem } from 'components/contentSuggestion/ContentCard';
import { ApiResponse } from 'types/ApiResponse';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
const ReportPost = ({ item, sessionId, contentType,  }: { item: GossipItem | ContentItem, sessionId: string | any, contentType: string,  }) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleReport = async (selectedReason: string) => {
    setReason(selectedReason);
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/api/report-post', {
        contentId: item.id,
        contentType: contentType,
        reason: selectedReason,
        reporterId: sessionId,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      
 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("this is an axios error",axiosError);
      console.log(error);
      toast({
        title: 'Some Issue in Reporting',
        description: axiosError.response?.data.message ?? 'Some Issue in reporting.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDots className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 bg-black border border-gray-800 ">
        <DropdownMenuGroup className='bg-black hover:bg-gray-900'>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className=' text-red-500'>
              <div className='flex space-x-2'>
                <MdOutlineReportGmailerrorred className="h-5 w-5" />
                <span className=' space-x-2 font-semibold'>Report</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleReport('Inappropriate Content')}>
                  <span>Inappropriate Content</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('Harassment or Bullying')}>
                  <span>Harassment or Bullying</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('False Information')}>
                  <span>False Information</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('Spam or Scams')}>
                  <span>Spam or Scams</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('Violence or Threats')}>
                  <span>Violence or Threats</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReport('Privacy Violation')}>
                  <span>Privacy Violation</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportPost;
