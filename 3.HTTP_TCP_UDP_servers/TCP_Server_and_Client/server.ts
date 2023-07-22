import * as net from 'net';

const port = 5000;

const server = net.createServer((socket) => {
    const startTime = Date.now(); // Start measuring the response time
    const timestamp = new Date().toISOString();
    let requestData = '';

    socket.on('data', (data) => {
        requestData += data;
        const clientIP = socket.remoteAddress; // Get the client's IP address
        
        console.log(`[${timestamp}] Client IP: ${clientIP}`);
        
        console.log(`[${timestamp}] Request Body: ${requestData}`);
        socket.write(data);
        console.log(`[${timestamp}] Response Sent`);
    });
    
    socket.on('end', () => {
        const endTime = Date.now(); // Get the end time of the response
        const elapsedTime = endTime - startTime; // Calculate the elapsed time
        console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(2)}ms`);
      });
});


server.listen(port, () => {
    console.log(`TCP echo server is running on port ${port}`);
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