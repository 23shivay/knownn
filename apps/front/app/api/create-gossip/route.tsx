import db from "@repo/db/client";

export async function POST(request: Request) {
  try {
    const { organizationName, gossipData, gossipId } = await request.json();
    const Id = gossipId.concat("-gossip");
    console.log("GOSSIP ID:", Id);
    console.log("Organization:", organizationName);

    // Check if the organization exists
    const existingOrganization = await db.organization.findUnique({
      where: {
        name: organizationName,
      },
    });  

    if (!existingOrganization) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Organization does not exist.",
        }),
        { status: 400 }
      );
    }

    // Check if a gossip with the same content name already exists
    const existingGossip = await db.gossip.findUnique({
      where: {
        contentName: gossipData.contentName,
      },
    });

    if (existingGossip) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Gossip already exists with the same title.",
        }),
        { status: 400 }
      );
    }

    // Create new gossip
    const newGossip = await db.gossip.create({
      data: {
        id: Id,
        contentName: gossipData.contentName,
        description: gossipData.description,
        organizationName: organizationName, // Ensure correct organization name
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `${gossipData.contentName} created successfully.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in creating gossip", error);

    let errorMessage = "Error occurred while creating gossip.";

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      { status: 500 }
    );
  }
}
