import dgram from 'dgram';

const client = dgram.createSocket('udp4');
const port = 8000;
const host = 'localhost';

const postData = Buffer.from('Hello, server!');
const timestamp = new Date().toISOString();
const startTime = Date.now(); // Get the start time of the request

client.send(postData, port, host, (error) => {
    if (error) {
        console.error(error);
    } else {

        console.log(`[${timestamp}] Request: ${postData.toString()}`);
    }
});

client.on('message', (msg, rinfo) => {
    const responseData = msg.toString();
    const endTime = Date.now(); // Get the end time of the response
    const elapsedTime = endTime - startTime; // Calculate the elapsed time
    console.log(`[${timestamp}] Response: ${msg.toString()}`);

    if (postData.toString() === responseData) {
        console.log(`[${timestamp}] REQUEST AND RESPONSE MESSAGES ARE EQUAL`);
    } else {
        console.log(`[${timestamp}] ERROR: REQUEST AND RESPONSE MESSAGES ARE NOT EQUAL`);
    }

    console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)} milliseconds`);
    client.close();
});

client.on('close', () => {
    console.log(`[${timestamp}] Connection closed`);
});