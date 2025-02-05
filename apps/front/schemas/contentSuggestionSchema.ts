import { platform } from 'os';
import { z } from 'zod';



export const contentSuggestionSchema = z.object({
  

  contentName:z.string().min(1,{message:"Content Name must be minimum 1 char"}).max(100,{message:"content name cannot be that long"}),
  genre:z.string().min(1,{message:"Must select gener"}),
  contentType:z.string().min(1,{message:"Must select content type"}),
  platform:z.string(),
  language:z.string(),
  description:z.string().min(10,{message:"plzz express ur thought"}).max(300,{message:"Description cannot be that long,more than 300 char"}),
  userId:z.string()
  
  
 
});