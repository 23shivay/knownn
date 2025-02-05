import {Redis} from "ioredis"

const redis=new Redis({
    host:`${process.env.REDIS_HOST}`,
    port:22451,
    username:`${process.env.REDIS_USERNAME}`,
    password:`${process.env.REDIS_PASSWORD}`

})
export default redis; 