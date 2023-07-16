import http from 'http';

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Function to gracefully shutdown the server
function shutdownServer(): void {
    server.close(() => {
      console.log('Server is shutting down.');
      process.exit(0);
    });
  }
  
  // Listen for SIGINT signal (Ctrl+C) to initiate server shutdown
  process.on('SIGINT', shutdownServer)