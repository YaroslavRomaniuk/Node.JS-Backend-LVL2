import * as net from 'net';

const client = new net.Socket();

const port = 5000;
const host = 'localhost';

const postData = 'Hello, Server!';
const timestamp = new Date().toISOString();

const startTime = Date.now(); // Get the start time of the request

client.connect(port, host, () => {
    console.log(`[${timestamp}] Request: ${postData}`);

    //const message = 'Hello, server!';
    client.write(postData);
});

client.on('data', (data) => {
    const responseData = data.toString();
    const endTime = Date.now(); // Get the end time of the response
    const elapsedTime = endTime - startTime; // Calculate the elapsed time
    console.log(`[${timestamp}] Response:`, responseData);

    if (postData === responseData) {
        console.log(`[${timestamp}] REQUEST AND RESPONSE MESSAGES ARE EQUAL`);
    } else {
        console.log(`[${timestamp}] ERROR: REQUEST AND RESPONSE MESSAGES ARE NOT EQUAL`);
    }

    console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)} milliseconds`);
    // Close the connection after receiving the response
    client.end();
});

client.on('close', () => {
    console.log(`[${timestamp}] Connection closed`);
});