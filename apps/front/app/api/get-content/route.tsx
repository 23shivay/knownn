import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import db from "@repo/db/client" 

export async function POST(request:Request){
  /*  const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }*/
    try { 

        const suggestedConted=await db.contentSuggestion.findMany({
          orderBy: { createdAt: 'desc' }, 
        });

        return Response.json({
            success:true,
            message:"succesfully fetched all suggested content",
            data:suggestedConted ||[],

            
        },{ status: 200 })

        

    } catch (error) {
        console.error("Error Fetching Suggested Content", error);

        let errorMessage = "Error Fetching Suggested Content";
        

        return new Response(
            JSON.stringify({
                success: false,
                message: errorMessage,
            }),
            { status: 500 }
        );
        
    }
}