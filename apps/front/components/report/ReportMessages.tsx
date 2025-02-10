import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import axios, { AxiosError } from "axios";
import { useToast } from "components/ui/use-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { ApiResponse } from "types/ApiResponse";


export interface MessageItem {
  id: string;
  message: string;
  group_id: string;
  sender_session_id?: string;
  createdAt: string;
}

const ReportMessage = ({
  item,
  sessionId,
  contentType,
}: {
  item: MessageItem;
  sessionId: string | any;
  contentType: string;
}) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReport = async (selectedReason: string) => {
    setReason(selectedReason);
    setIsLoading(true);

    try {
      console.log("Sending report to backend:", {
        item,
        sessionId,
        contentType,
        reason: selectedReason,
      });

      const response = await axios.post<ApiResponse>("/api/reporting-text", {
        messageId: item.id,
        messageType: contentType,
        reason: selectedReason,
        reporterId: sessionId,
      });

      console.log("Response from backend:", response.data);

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error reporting message:", axiosError);
      toast({
        title: "Some Issue in Reporting",
        description:  axiosError.response?.data.message?? "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDots className="h-3 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 bg-black border border-gray-800 ">
        <DropdownMenuGroup className="bg-black hover:bg-gray-900">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-red-500">
              <div className="flex space-x-2">
                <MdOutlineReportGmailerrorred className="h-5 w-5" />
                <span className="space-x-2 font-semibold">Report</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {[
                  "Inappropriate Content",
                  "Harassment or Bullying",
                  "False Information",
                  "Spam or Scams",
                  "Violence or Threats",
                  "Privacy Violation",
                ].map((reason) => (
                  <DropdownMenuItem key={reason} onClick={() => handleReport(reason)}>
                    <span>{reason}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportMessage;
