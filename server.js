var http = require('http');
var os = require('os');
var handleRequest = function(request, response) {
  response.writeHead(200);
  response.end("Hello from Sree from: " + os.hostname() + "!\n");
}
var www = http.createServer(handleRequest);
console.log("Listening on port 8080\n");
www.listen(8080);

