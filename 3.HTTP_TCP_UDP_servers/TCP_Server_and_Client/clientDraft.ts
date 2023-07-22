import net from 'net';

// The data to be sent in the request body
const postData = 'Hello, Server!';
const timestamp = new Date().toISOString();

// Options for the TCP connection
const options = {
  host: 'localhost',
  port: 3000,
};

const startTime = Date.now(); // Get the start time of the request

// Create a TCP socket and connect to the server
const socket = net.createConnection(options, () => {
  // Send the request data to the server
  console.log(`[${timestamp}] Request: ${postData}`);
  socket.write(postData);
});

// Handle data received from the server
socket.on('data', (data) => {
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
  socket.end();
});

// Handle errors that occur during the connection
socket.on('error', (error) => {
  console.error('Error:', error);
});

