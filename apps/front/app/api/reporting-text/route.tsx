import db from "@repo/db/client"; // Your Prisma client

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { messageId, messageType, reason, reporterId } = await request.json();

    // Log the received request payload
    console.log("Request received with:", { messageId, messageType, reason, reporterId });

    // Validate required fields
    if (!messageId || !messageType || !reason || !reporterId) {
      console.error("Missing required fields:", { messageId, messageType, reason, reporterId });
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Check if the message has already been reported by the user
    const reportedAlready = await db.reportMessage.findFirst({
      where: {
        reporterId: reporterId,
        messageId: messageId,
        messageType: messageType,
      },
    });

    console.log("Check if already reported:", reportedAlready);

    if (reportedAlready) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You have already reported this message.",
        }),
        { status: 400 }
      );
    }

    // Create a new report entry and update the message's report count
    const result = await createMessageReport(messageId, messageType, reason, reporterId);

    console.log("Report creation result:", result);

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
    console.error("Error in reporting message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error reporting the message",
      }),
      { status: 500 }
    );
  }
}

// Function to handle report creation and increment report count
const createMessageReport = async (messageId: string, messageType: string, reason: string, reporterId: string) => {
  try {
    console.log("Starting report creation transaction for:", { messageId, messageType, reason, reporterId });

    await db.$transaction(async (prisma) => {
      // Create the report entry
      await prisma.reportMessage.create({
        data: {
          messageId,
          messageType,
          reason,
          reporterId,
        },
      });

      console.log("Report entry created successfully");

      // Update reportCount and handle hiding logic based on messageType
      if (messageType === "CHAT") {
        const chat = await prisma.chat.update({
          where: { id: messageId },
          data: { reportCount: { increment: 1 } },
        });

        console.log("Updated chat report count:", chat);

        // Hide chat message if reportCount threshold is met
        if (chat.reportCount >= 10) {
          await prisma.chat.update({
            where: { id: messageId },
            data: { isHidden: true, status: "under_review" },
          });
          console.log("Chat message hidden due to report threshold");
        }
      } else if (messageType === "CONTENT_COMMENT") {
        const contentComment = await prisma.contentComment.update({
          where: { id: messageId },
          data: { reportCount: { increment: 1 } },
        });

        console.log("Updated content comment report count:", contentComment);

        // Hide content comment if reportCount threshold is met
        if (contentComment.reportCount >= 10) {
          await prisma.contentComment.update({
            where: { id: messageId },
            data: { isHidden: true, status: "under_review" },
          });
          console.log("Content comment hidden due to report threshold");
        }
      } else if (messageType === "GOSSIP_COMMENT") {
        const gossipComment = await prisma.gossipComment.update({
          where: { id: messageId },
          data: { reportCount: { increment: 1 } },
        });

        console.log("Updated gossip comment report count:", gossipComment);

        // Hide gossip comment if reportCount threshold is met
        if (gossipComment.reportCount >= 10) {
          await prisma.gossipComment.update({
            where: { id: messageId },
            data: { isHidden: true, status: "under_review" },
          });
          console.log("Gossip comment hidden due to report threshold");
        }
      }
    });

    console.log("Transaction completed successfully");
    return { success: true, message: "Message reported successfully!" };
  } catch (error) {
    console.error("Error creating message report:", error);
    return { success: false, message: "Failed to submit the report" };
  }
};
