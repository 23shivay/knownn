
import { z } from 'zod';



export const gossipCreationSchema = z.object({
  

  contentName:z.string().min(5,{message:"Content Name must be minimum 5 char"}).max(100,{message:"content name cannot be that long"}),
  description:z.string().min(1,{message:"plzz express ur thought"}).max(800,{message:"Description cannot be that long"}),
  organizationName:z.string()
  
  
 
});