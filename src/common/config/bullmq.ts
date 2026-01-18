import { Redis } from 'ioredis';
import { APP_CONFIGS } from ".";

export const redisConnection = new Redis({
    maxRetriesPerRequest: null,
    host: APP_CONFIGS.REDIS_HOST , 
    port: parseInt(APP_CONFIGS.REDIS_PORT), 
    password: APP_CONFIGS.REDIS_PASSWORD,
    username: APP_CONFIGS.REDIS_USERNAME,
    tls: {}
});

redisConnection.on('error', (error) =>  {
    console.log(error + ' happend in redis')
})

