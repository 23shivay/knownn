import db from "@repo/db/client" // Assuming you're using Prisma with a custom db client

export async function POST(request: Request) {
  try {
    // Parse request body
    const { contentId, contentType, reason, reporterId } = await request.json();

     // Check if the user has already reported this content
    const reportedAlready = await db.report.findFirst({
      where: {
        reporterId: reporterId,
        contentId: contentId,
        contentType: contentType
      }
    });

    if (reportedAlready) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You have reported this already",
        }),
        { status: 400 }
      );
    }
    // Check for required fields
    if (!contentId || !contentType || !reason || !reporterId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Call the createReport function to handle the report logic
    const result = await createReport(contentId, contentType, reason, reporterId);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message,
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message,
        }),
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in Reporting of Post:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error in Reporting of Post',
      }),
      { status: 500 }
    );
  }
}

const createReport = async (contentId: string, contentType: string, reason: string, reporterId: string) => {
  try {
    // Start a transaction to ensure both Report and content update happen together
    await db.$transaction(async (prisma) => {
      
      // Create the report entry
      await prisma.report.create({
        data: {
          contentId: contentId,
          contentType: contentType,
          reason: reason,
          reporterId: reporterId,
        },
      });

      // Handle content reporting logic based on content type
      if (contentType === 'GOSSIP') {
        const gossip = await prisma.gossip.update({
          where: { id: contentId },
          data: { reportCount: { increment: 1 } },
        });

        // Check if reportCount threshold is reached and hide the content
        if (gossip.reportCount >= 10) {
          await prisma.gossip.update({
            where: { id: contentId },
            data: { isHidden: true, status: "under_review" },
          });
        }

      } else if (contentType === 'CONTENT_SUGGESTION') {
        const contentSuggestion = await prisma.contentSuggestion.update({
          where: { id: contentId },
          data: { reportCount: { increment: 1 } },
        });

        // Check if reportCount threshold is reached and hide the content
        if (contentSuggestion.reportCount >= 10) {
          await prisma.contentSuggestion.update({
            where: { id: contentId },
            data: { isHidden: true, status: "under_review" },
          });
        }
      }

    });

    return { success: true, message: "Report submitted successfully!" };

  } catch (error) {
    console.error('Error creating report:', error);
    return { success: false, message: "Failed to submit the report" };
  }
};
