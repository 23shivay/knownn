import db from "@repo/db/client";
import { authOptions } from "app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

const COMMENTS_PER_PAGE = 10; // Number of comments to load per page

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = params.id;
  const gossipId = encodeURIComponent(url);
  console.log("The room name we are fetching is:", gossipId);

  // Get the page number from URL search params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const skip = (page - 1) * COMMENTS_PER_PAGE;

  /*
  // Authentication check if needed
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  */

  try {
    // Fetch paginated comments and total count simultaneously
    const [comments, totalCount] = await Promise.all([
      db.gossipComment.findMany({
        where: {
          gossipId: gossipId,
        },
        orderBy: {
          createdAt: 'desc', // Most recent comments first
        },
        skip,
        take: COMMENTS_PER_PAGE,
      }),
      db.gossipComment.count({
        where: {
          gossipId: gossipId, 
        },
      }),
    ]);

    // If no comments found for this page
    if (!comments) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No comments found for this gossip",
        }),
        { status: 400 }
      );
    }

    // Calculate if there are more comments to load
    const hasMore = totalCount > skip + comments.length;

    // Return successful response with pagination info
    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully fetched the comments for gossip",
        data: comments,
        hasMore,
        totalCount,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching gossip comments:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching gossip comments",
      }),
      { status: 500 }
    );
  }
}