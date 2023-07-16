import http from 'http';

const postData = 'Hello, Server!';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log('Response:', responseData);
    console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} milliseconds`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

const startTime = performance.now();

req.write(postData);
req.end();