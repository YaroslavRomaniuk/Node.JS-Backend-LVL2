import net from 'net';

const port = 3000;

const server = net.createServer(socket => {
  const startTime = Date.now(); // Start measuring the response time
  const timestamp = new Date().toISOString();
  let requestData = '';

  // Listen for data chunks received from the client
  socket.on('data', (chunk) => {
    requestData += chunk;
    const clientIP = socket.remoteAddress; // Get the client's IP address
    
    console.log(`[${timestamp}] Client IP: ${clientIP}`);
  });

  // Listen for the end of the request
  socket.on('end', () => {
    console.log(`[${timestamp}] Request Body: ${requestData}`);

    // Send back the received request data as the response
    socket.write(requestData);

    console.log(`[${timestamp}] Response Sent`);

    const endTime = Date.now(); // Get the end time of the response
    const elapsedTime = endTime - startTime; // Calculate the elapsed time
    console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)}ms`);
  });
});

// Start the server and listen for incoming connections
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
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