import db from "@repo/db/client";

export async function POST(request: Request) {
    try {
        const { organizationName, chatRoomName } = await request.json();
        
        const roomName = chatRoomName.concat("%20").concat(organizationName);
        console.log( "roomName",roomName);

        const existingRoom = await db.chatRoom.findUnique({
            where: { name: roomName }
        });

        if (!existingRoom) {
            const newRoom = await db.chatRoom.create({
                data: {
                    name: roomName,
                    organizationName: organizationName,
                },
            });

            return new Response(
                JSON.stringify({
                    value: newRoom.name, // Return the room name directly
                    success: true,
                    message: 'New room created',
                }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({
                    value: existingRoom.name, // Return the room name directly
                    success: true,
                    message: 'Chat room exists',
                }),
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error creating/getting chat room:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error creating/getting chat room',
            }),
            { status: 500 }
        );
    }
}
