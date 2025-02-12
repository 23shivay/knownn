import db from "@repo/db/client"; // Adjust this to your actual DB client import path
import { authOptions } from "app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// Route handler for fetching vote by sessionId and contentId
export async function POST(request: Request, { params }: { params: { contentId: string } }) {
  const contentId = params.contentId;
  
  // Fetch session to get sessionId
  const session = await getServerSession(authOptions);
  const userId = session?.user?.sessionId;

  // Check for missing session or userId
 /* if (!session || !userId) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401 }
    );
  }*/

  try {
    // Find the vote using the composite key (sessionId and contentId)
    const voteBySessionId = await db.vote.findUnique({
      where: {
        sessionId_contentId: {
          sessionId: userId,
          contentId: contentId
        }
      }
    });

    // If no vote is found, return a 404 status
    if (!voteBySessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You haven't voted yet",
        }),
        { status: 404 }
      );
    }

    // Return success response with vote data
    return new Response(
      JSON.stringify({
        success: true,
        message: "Vote successfully fetched",
        data: voteBySessionId,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vote by sessionId and contentId", error);

    // Return error response with appropriate message
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching vote",
      }),
      { status: 500 }
    );
  }
}
