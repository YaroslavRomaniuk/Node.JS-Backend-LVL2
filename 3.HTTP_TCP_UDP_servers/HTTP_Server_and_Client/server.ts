import http from 'http';

const hostname = 'localhost';
const port = 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  const startTime = performance.now(); // Start measuring the response time
  const timestamp = new Date().toISOString();
  let requestData = '';

  // Listen for data chunks received from the client
  req.on('data', (chunk) => {
    requestData += chunk;
    const clientIP = req.socket.remoteAddress; // Get the client's IP address
    
    console.log(`[${timestamp}] Client IP: ${clientIP}`);
  });

  // Listen for the end of the request
  req.on('end', () => {
    console.log(`[${timestamp}] Request Body: ${requestData}`);

    // Set the response status code and headers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // Send back the received request data as the response
    res.end(requestData);

    console.log(`[${timestamp}] Response Sent`);

    const endTime = performance.now(); // Get the end time of the response
    const elapsedTime = endTime - startTime; // Calculate the elapsed time
    console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)}`);
  });
});

// Start the server and listen for incoming requests
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Function to gracefully shutdown the server
function shutdownServer() {
  server.close(() => {
    console.log('Server is shutting down.');
    process.exit(0);
  });
}

// Listen for SIGINT signal (Ctrl+C) to initiate server shutdown
process.on('SIGINT', shutdownServer);