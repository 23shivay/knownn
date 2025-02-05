import { contentCardType } from "./contentCardType";

export interface ApiResponse {
  success: boolean;
  message: string;
  value?: string
  content?:Array<contentCardType>
  
};