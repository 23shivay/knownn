import db from "@repo/db/client"

export async function POST(request:Request){
    try {
         
       // const {contentType,genre,contentName,description,language,platform}=await request.json()
        const{userId,contentData,contentId}=await request.json()
        const Id = contentId.concat("-content");
        
         
        //checking movie already exist or not
        const existingMovie=await db.contentSuggestion.findUnique({
            where:{
               contentName:contentData.contentName 
            }
        })
        if(existingMovie){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Content Already suggested ",
                }),
                { status: 400 }
            );
        }
  
        const newMovie=await db.contentSuggestion.create({
            data:{
                id:Id,
                contentType:contentData.contentType,
                genre:contentData.genre,
                contentName:contentData.contentName,
                platform:contentData.platform,
                userId:userId,
                description:contentData.description,
                language:contentData.language
            }
        })

        return new Response(
            JSON.stringify({
                success: true,
                message: `${contentData.contentName} suggested Sussessfully`,
            }),
            { status: 200 }
        );
    } catch (error) {

        console.error("Error suggesting New Movie", error);

        let errorMessage = "Issue in suggesting Movie";
        

        return new Response(
            JSON.stringify({
                success: false,
                message: errorMessage,
            }),
            { status: 500 }
        );
        
    }
}