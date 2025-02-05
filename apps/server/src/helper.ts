import { consumer, producer, voteconsumer } from "./config/kafka.config"
import db from "@repo/db/client"

export const produceMessage = async (topic: string, message:any) => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  };

 /* export const consumeMessages = async (topic: string) => {
    await consumer.connect();
    await consumer.subscribe({ topic: topic });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log({
          partition,
          offset: message.offset,
          value: data,
        });
 
        // Create the chat entry
        await db.chats.create({
            data: {
              id: data.id,
              message: data.message,
              chatRoomName: data.group_id,
            },
          });

      },
    });
  };*/

  export const consumeMessages = async (topic: string) => {
    await consumer.connect();
    await consumer.subscribe({ topic });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) { // Ensure message.value is not null
          const data = JSON.parse(message.value.toString());
          //offset
          console.log({
            partition,
            offset: message.offset,
            value: data,
          });
  
          // Create the chat entry

          if(data.group_id.includes("%20")){
          await db.chat.create({
            data: {
              id: data.id,
              message: data.message,
              chatRoomName: data.group_id,
            },
          })
        }
        else if(data.group_id.includes("-gossip")){

          await db.gossipComment.create(
            {
              data: {
                id: data.id,
                message: data.message,
                gossipId: data.group_id,
              },
            }
            
          ) 
        }
        else{
          await db.contentComment.create(
            {
              data: {
                id: data.id,
                message: data.message,
                contentSuggestionId: data.group_id,
              },
            }
            
          ) 
        }
        } else {
          console.error("Received null message value");
        }
      },
    });
  };
 
  //consumer for votes
/*
  export const consumeVoteMessages = async (topic:string) => {
    await voteconsumer.connect();
    await voteconsumer.subscribe({ topic: 'votes' });
  
    await voteconsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) { // Ensure message.value is not null
          const data = JSON.parse(message.value.toString());
          console.log({
            partition,
            offset: message.offset,
            value: data,
          });
          console.log("data  inside kafka:",data)

  
          // managing database
         
          
          
        } else {
          console.error("Received null  vote value");
        }
      },
    });
  };*/
  export const consumeVoteMessages = async (topic: string) => {
    await voteconsumer.connect();
    await voteconsumer.subscribe({ topic: 'votes' });
  
    await voteconsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value) { // Ensure message.value is not null
          const data = JSON.parse(message.value.toString());
          console.log({
            partition,
            offset: message.offset,
            value: data,
          });
          console.log("data inside kafka:", data);
  
          // Managing database (Upsert the vote and adjust like/dislike counts)
          const voteTransaction = await db.$transaction(async (prisma) => {
            
            // Check if there's an existing vote for this session and content
            const existingVote = await prisma.vote.findUnique({
              where: {
                sessionId_contentId: {
                  sessionId: data.sessionId,
                  contentId: data.contentId,
                },
              },
            });
  
            // If a previous vote exists, we need to update the content suggestion counts
            if (existingVote) {

              // If user is changing from 'like' to 'dislike', or vice versa
              if (existingVote.voteType !== data.type) {
                await prisma.vote.update({
                  where: {
                    sessionId_contentId: {
                      sessionId: data.sessionId,
                      contentId: data.contentId,
                    },
                  },
                  data: {
                    voteType: data.type,
                  },
                });
  
                if(data.contentId.includes("gossip")){
                  await prisma.gossip.update({
                    where: { id: data.contentId },
                    data: {
                      likeCount: data.type === 'like' 
                        ? { increment: 1 }
                        : existingVote?.voteType === 'like' ? { decrement: 1 } : undefined,
                      
                      dislikeCount: data.type === 'dislike'
                        ? { increment: 1 }
                        : existingVote?.voteType === 'dislike' ? { decrement: 1 } : undefined,
                    },
                  });
              
                }else{
                // Adjust the like/dislike count in contentSuggestion
                await prisma.contentSuggestion.update({
                  where: { id: data.contentId },
                  data: {
                    likeCount: data.type === 'like' 
                      ? { increment: 1 }
                      : existingVote?.voteType === 'like' ? { decrement: 1 } : undefined,
                    
                    dislikeCount: data.type === 'dislike'
                      ? { increment: 1 }
                      : existingVote?.voteType === 'dislike' ? { decrement: 1 } : undefined,
                  },
                });
              }
                
              }
              // If vote type is the same, no need to update the count
            } else {
              // No previous vote, so create a new one and adjust the count accordingly
              await prisma.vote.create({
                data: {
                  sessionId: data.sessionId,
                  contentId: data.contentId,
                  voteType: data.type,
                  createdAt: new Date(),
                },
              });
              if(data.contentId.includes("gossip")){
                await prisma.gossip.update({
                  where: { id: data.contentId },
                  data: {
                    likeCount: data.type === 'like' ? { increment: 1 } : undefined,
                    dislikeCount: data.type === 'dislike' ? { increment: 1 } : undefined,
                  },
                });

              }else{
  
              // Update the like/dislike count in contentSuggestion
              await prisma.contentSuggestion.update({
                where: { id: data.contentId },
                data: {
                  likeCount: data.type === 'like' ? { increment: 1 } : undefined,
                  dislikeCount: data.type === 'dislike' ? { increment: 1 } : undefined,
                },
              });
            }
              
            }
          });
        
        } else {
          console.error("Received null vote value");
        }
      },
    });
  };
  
  