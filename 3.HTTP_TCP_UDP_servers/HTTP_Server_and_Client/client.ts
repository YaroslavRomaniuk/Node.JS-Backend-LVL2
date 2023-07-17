import http from 'http';

// The data to be sent in the request body
const postData = 'Hello, Server!';
const timestamp = new Date().toISOString();

// Options for the HTTP request
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(postData) // Calculate the length of the request body
  }
};

// Send an HTTP request to the server
const req = http.request(options, (res) => {
  let responseData = '';
  

  // Handle the data received from the server
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  // Handle the end of the response
  res.on('end', () => {
    const endTime = performance.now(); // Get the end time of the response
    const elapsedTime = endTime - startTime; // Calculate the elapsed time
    console.log(`[${timestamp}] Response:`, responseData);
    if (postData === responseData){
      console.log(`[${timestamp}] REQUEST AND RESPONSE MASSAGES IS EQUAL`);
    } else {
      console.log(`[${timestamp}] ERROR: REQUEST AND RESPONSE MASSAGES IS NOT EQUAL`);
    }
    console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)} milliseconds`);
  });
});

// Handle errors that occur during the request
req.on('error', (error) => {
  console.error('Error:', error);
});

const startTime = performance.now(); // Get the start time of the request

// Write the request body data and end the request
console.log(`[${timestamp}] Request: ${postData}`)
req.write(postData);
req.end();
