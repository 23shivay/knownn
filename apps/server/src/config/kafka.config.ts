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

export const kafka = new Kafka({
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
        initialRetryTime: 300,
    },
    logLevel: logLevel.WARN, // Reduce log verbosity
});

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

export const consumer = kafka.consumer({
    groupId: "chats",
    sessionTimeout: 60000, // 60s timeout
    heartbeatInterval: 10000, // Send heartbeats every 10s
});

export const voteconsumer = kafka.consumer({
    groupId: "votes",
    sessionTimeout: 60000,
    heartbeatInterval: 10000,
});

// ✅ Producer connection handler
export const connectKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka Producer connected");
    } catch (error) {
        console.error("Kafka Producer connection failed:", error);
    }
};

// ✅ Consumer connection handler
export const connectKafkaConsumer = async (consumer: any, topic: string) => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        console.log(`Kafka Consumer connected to topic: ${topic}`);

        consumer.on("consumer.disconnect", () => {
            console.warn(`Kafka Consumer for ${topic} disconnected`);
        });

        consumer.on("consumer.error", (error:any) => {
            console.error(`Kafka Consumer error for ${topic}:`, error);
        });
    } catch (error) {
        console.error(`Error connecting Kafka Consumer for ${topic}:`, error);
    }
};
