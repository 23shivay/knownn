import db from "@repo/db/client"
import { authOptions } from "app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
export async function GET(request:Request, { params }: { params: { contentId: string } }){
    const contentId = params.contentId;

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    try {
        const particularContent=await db.contentSuggestion.findUnique({
            where:{
                id:contentId
            }
        })
        if(!particularContent){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "content with this Name does not exists ",
                }),
                { status: 400 }
            );
        }
        return Response.json({
            success:true,
            message:"succesfully fetched all suggested content",
            data:particularContent,

            
        },{ status: 200 })
        
    } catch (error) {

        console.error("Error Fetching particula Content", error);

        let errorMessage = "Error Fetching particular Content";
        

        return new Response(
            JSON.stringify({
                success: false,
                message: errorMessage,
            }),
            { status: 500 }
        );
        
    }

}