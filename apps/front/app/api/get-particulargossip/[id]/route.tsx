import db from "@repo/db/client";
import { authOptions } from "app/api/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const gossipId = params.id;
    console.log(gossipId);

    
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
      return new Response(
        JSON.stringify({
          success: false, 
          message: 'Not authenticated'
        }), 
        { status: 401 }
      );
    }
    

    try {
        const particularContent = await db.gossip.findUnique({
            where: {
                id: gossipId
            }
        });

        if (!particularContent) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Gossip does not exist",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Successfully fetched particular Gossip",
                data: particularContent,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error Fetching particular Gossip", error);

        let errorMessage = "Error Fetching particular Gossip";

        return new Response(
            JSON.stringify({
                success: false,
                message: errorMessage,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
