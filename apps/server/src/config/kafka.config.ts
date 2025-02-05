import { Kafka,logLevel } from 'kafkajs'
import fs from 'fs'
import path from 'path'
import { env } from 'process'
export const kafka= new Kafka({
    brokers:[`${process.env.KAFKA_BROKER}`],
    ssl:{
        ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')],
    },
    sasl:{
        username:`${process.env.KAFKA_USERNAME}`,
        password:`${process.env.KAFKA_PASSWORD}`,
        mechanism:"plain"

    }
}) 


export const producer=kafka.producer()
export const consumer=kafka.consumer({groupId:"chats"})
export const voteconsumer=kafka.consumer({groupId:"votes"})

export const connectKafkaProducer=async()=>{
    await producer.connect();
    console.log("Kafka Producer connected..")
}



