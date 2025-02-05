import db from "@repo/db/client";

export async function POST(request: Request) {
    try {
        const {sessionId}=await request.json();
        const votedContent = await db.vote.findMany({
            where: {
              sessionId:sessionId, 
            },
           
          });
          return Response.json({
            success:true,
            message:"succesfully fetched all suggested content",
            data:votedContent ||[],

            
        },{ status: 200 })
        
       

    } catch (error) {
        console.error('Error in fetching list of voted content by sessionId', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error in fetching list of voted content by sessionId',
            }),
            { status: 500 }
        );
    }
}
