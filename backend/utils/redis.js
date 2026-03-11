const redis=require("redis")

const { createClient } =require('redis');

// async function newredis(){

const client = createClient({
    username: 'default',
    password: 'KmeFCvjIkm4qftYREvc6nka53Qao6kP5',
    socket: {
        host: 'redis-12083.crce220.us-east-1-4.ec2.cloud.redislabs.com',
        port: 12083
    } 
});



module.exports=client;



