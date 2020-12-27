const http = require('http');

http.createServer((req, res) => {
  res.end('Hello Node!!');
}).listen(3001, () => console.log('Server is running'))

