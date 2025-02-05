// import db from "@repo/db/client";

// export async function GET(request: Request, { params }: { params: { name: string } }) {
//     const url = params.name;
//     const roomname = encodeURIComponent(url);
//  // O
//     console.log("The room name we are fetching is:", roomname);

//     try {
//         // Fetch the chat room with the given name
//         const particularRoom = await db.chat.findMany({
//             where: {
//                 chatRoomName: roomname,
//             },
//         }); 

//         // If the room doesn't exist, return a 400 error response
//         if (!particularRoom) {
//             return new Response(
//                 JSON.stringify({
//                     success: false,
//                     message: "Chatroom with this name does not exist",
//                 }),
//                 { status: 400 }
//             );
//         }

//         // Return the fetched chat room data in a successful response
//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 message: "Successfully fetched the chat room",
//                 data: particularRoom,
//             }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error fetching the chat room:", error);

//         return new Response(
//             JSON.stringify({
//                 success: false,
//                 message: "Error fetching the chat room",
//             }),
//             { status: 500 }
//         );
//     }
// }


import db from "@repo/db/client";

export async function GET(request: Request, { params }: { params: { name: string } }) {
    const url = params.name;
    const roomname = encodeURIComponent(url);
    
    // Get URL parameters
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        // Fetch total count of messages
        const totalCount = await db.chat.count({
            where: {
                chatRoomName: roomname,
            },
        });

        // Fetch messages with pagination, ordered by creation date in descending order
        const messages = await db.chat.findMany({
            where: {
                chatRoomName: roomname,
            },
            orderBy: {
                createdAt: 'desc', // Most recent messages first
            },
            skip,
            take: limit,
        });

        // Check if there are more messages to load
        const hasMore = skip + messages.length < totalCount;

        // Return messages in reverse order for proper display
        const orderedMessages = messages.reverse();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Successfully fetched the chat messages",
                data: orderedMessages,
                hasMore,
                totalCount,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching the chat messages:", error);
        
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error fetching the chat messages",
            }),
            { status: 500 }
        );
    }
}