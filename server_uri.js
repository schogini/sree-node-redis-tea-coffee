const http = require('http');
const os = require('os');
const url = require('url');


var handleRequest = function(req, res) {
	// response.end("Hello from Sree from: " + os.hostname() + "!\n");
	// var queryData = url.parse(req.url, true).query;
	// console.log(queryData);

	if(req.url === '/' ) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
		res.write("<h2>Hostname: " + os.hostname() + "</h2>");
		res.end();
	}
	if(req.url === '/tea' ) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
		res.write("<h2>Here is your hot cup of <b>TEA</b><br><br>from: " + os.hostname() + "</h2>");
		res.end();
	}
	if(req.url === '/coffee' ) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
		res.write("<h2>Here is your hot cup of <b>COFFEE</b><br><br>from: " + os.hostname() + "</h2>");
		res.end();
	}
	res.writeHead(404);
	res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
	res.write("<h2>Sorry! We only serve tea or coffee. Not: <b>"+req.url+ "</b><br><br>from: " + os.hostname() + "</h2>");
	res.end();
}
const server = http.createServer(handleRequest);

console.log("Listening on port 8080\n");
server.listen(8080);

