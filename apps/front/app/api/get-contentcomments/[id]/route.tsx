import db from "@repo/db/client";
import { authOptions } from "app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

const COMMENTS_PER_PAGE = 10; // Number of comments to load per page

export async function GET(
  request: Request,
  { params }: { params: { id: string } } 
) {
  const url = params.id;
  const contentSuggestionId = encodeURIComponent(url);
  
  // Get the page number from URL search params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const skip = (page - 1) * COMMENTS_PER_PAGE;

  try {
    // Fetch paginated comments
    const [comments, totalCount] = await Promise.all([
      db.contentComment.findMany({
        where: {
          contentSuggestionId: contentSuggestionId,
        },
        orderBy: {
          createdAt: 'desc', // Most recent comments first
        },
        skip,
        take: COMMENTS_PER_PAGE,
      }),
      db.contentComment.count({
        where: {
          contentSuggestionId: contentSuggestionId,
        },
      }),
    ]);

    if (!comments) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "contentsuggestion with this id does not exist",
        }),
        { status: 400 }
      );
    }

    // Calculate if there are more comments to load
    const hasMore = totalCount > skip + comments.length;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully fetched the comments for content",
        data: comments,
        hasMore,
        totalCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching in content comments:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching in content comments",
      }),
      { status: 500 }
    );
  }
}