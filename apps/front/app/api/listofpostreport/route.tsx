import db from "@repo/db/client";

export async function POST(request: Request) {
    try {
        const {sessionId}=await request.json();
        const reportedPost = await db.report.findMany({
            where: {
              reporterId:sessionId, 
            },
           
          });
          return Response.json({
            success:true,
            message:"succesfully fetched all reported post by SessionId",
            data:reportedPost ||[],

            
        },{ status: 200 })
        
       

    } catch (error) {
        console.error('Error in fetching list of reported post', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error in fetching list of reported post',
            }),
            { status: 500 }
        );
    }
}
    
