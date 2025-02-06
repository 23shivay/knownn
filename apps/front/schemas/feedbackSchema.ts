import { platform } from 'os';
import { z } from 'zod';



export const feedbackSchema = z.object({
  

  feedback:z.string().min(0).max(200,{message:"Feedback cannot be that long"}),
  feedbackCategory:z.string().min(0).max(200,{message:"Feedback cannot be that long"}),
  why:z.string().min(0).max(500,{message:"Feedback cannot be that long"}),
  
  email: z.string().min(0),
  phoneNumber: z.string().min(0).max(10),
 
});