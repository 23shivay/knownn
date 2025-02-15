// import { Kafka,logLevel } from 'kafkajs'
// import fs from 'fs'
// import path from 'path'
// import { env } from 'process'
// export const kafka= new Kafka({
//     brokers:[`${process.env.KAFKA_BROKER}`],
//     ssl:{
//         ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
//     },
//     sasl:{
//         username:`${process.env.KAFKA_USERNAME}`,
//         password:`${process.env.KAFKA_PASSWORD}`,
//         mechanism:"plain"

//     }
// }) 


// export const producer=kafka.producer()
// export const consumer=kafka.consumer({groupId:"chats"})
// export const voteconsumer=kafka.consumer({groupId:"votes"})

// export const connectKafkaProducer=async()=>{
//     await producer.connect();
//     console.log("Kafka Producer connected..")
// }



// import { Kafka, logLevel, Partitioners } from 'kafkajs';
// import fs from 'fs';
// import path from 'path';
// import { env } from 'process';

// export const kafka = new Kafka({
//     brokers: [`${process.env.KAFKA_BROKER}`],
//     ssl: {
//         ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
//     },
//     sasl: {
//         username: `${process.env.KAFKA_USERNAME}`,
//         password: `${process.env.KAFKA_PASSWORD}`,
//         mechanism: 'plain'
//     }
// });

// // ✅ Fix: Explicitly define the legacy partitioner
// export const producer = kafka.producer({
//     createPartitioner: Partitioners.LegacyPartitioner
// });

// export const consumer = kafka.consumer({ groupId: "chats" });
// export const voteconsumer = kafka.consumer({ groupId: "votes" });

// export const connectKafkaProducer = async () => {
//     await producer.connect();
//     console.log("Kafka Producer connected..");
// };



import { Kafka, logLevel, Partitioners } from "kafkajs";
import fs from "fs";
import path from "path";

// Kafka Configuration
export const kafka = new Kafka({
    clientId: "knownn-server", // Use a fixed client ID to avoid rebalancing issues
    brokers: [`${process.env.KAFKA_BROKER}`],
    ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
    },
    sasl: {
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
        mechanism: "plain",
    },
    retry: {
        retries: 5, // Retry up to 5 times
        initialRetryTime: 300, // Start retrying after 300ms
    },
    logLevel: logLevel.WARN, // Reduce log verbosity
});

// Kafka Producer
export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

// Kafka Consumers with Optimized Configurations
export const consumer = kafka.consumer({
    groupId: "chats",
    sessionTimeout: 45000, // Reduce timeout to 45s
    heartbeatInterval: 3000, // Send heartbeat every 3s
    maxInFlightRequests: 5, // Allow up to 5 requests at the same time
});

export const voteconsumer = kafka.consumer({
    groupId: "votes",
    sessionTimeout: 45000,
    heartbeatInterval: 3000,
    maxInFlightRequests: 5,
});

// ✅ Producer Connection Handler
export const connectKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log("✅ Kafka Producer connected");
    } catch (error) {
        console.error("❌ Kafka Producer connection failed:", error);
    }
};

// ✅ Consumer Connection Handler
export const connectKafkaConsumer = async (consumer: any, topic: string) => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        console.log(`✅ Kafka Consumer connected to topic: ${topic}`);

        consumer.on("consumer.disconnect", () => {
            console.warn(`⚠️ Kafka Consumer for ${topic} disconnected`);
        });

        consumer.on("consumer.error", (error: any) => {
            console.error(`❌ Kafka Consumer error for ${topic}:`, error);
        });
    } catch (error) {
        console.error(`❌ Error connecting Kafka Consumer for ${topic}:`, error);
    }
};
