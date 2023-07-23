import dgram from 'dgram';

const server = dgram.createSocket('udp4');
const port = 8000;

server.on('message', (msg, rinfo) => {
  const startTime = Date.now(); // Start measuring the response time
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] Client IP: ${rinfo.address}`);
  console.log(`[${timestamp}] Request Body: ${msg.toString()}`);

  server.send(msg, 0, msg.length, rinfo.port, rinfo.address, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`[${timestamp}] Response Sent`);
      const endTime = Date.now(); // Get the end time of the response
      const elapsedTime = endTime - startTime; // Calculate the elapsed time
      console.log(`[${timestamp}] Elapsed Time: ${elapsedTime.toFixed(4)}ms`);
    }
  });

  
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(port);

// Function to gracefully shutdown the server
function shutdownServer() {
    server.close(() => {
      console.log('Server is shutting down.');
      process.exit(0);
    });
  }
  
  // Listen for SIGINT signal (Ctrl+C) to initiate server shutdown
  process.on('SIGINT', shutdownServer);