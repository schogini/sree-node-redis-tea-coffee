const http = require('http');
const os = require('os');
const url = require('url');
const redis = require('redis');

// docker run -d -p6379:6379 --rm --name redis redis
// export REDIS_URL=redis://localhost:6379 
// var db = redis.createClient({url: process.env.REDIS_URL});

var redis_host = process.env.REDIS_HOST || 'localhost'
var redis_port = process.env.REDIS_PORT || 6379

var db = redis.createClient({host: redis_host, redis_port: redis_port});

var handleRequest = function(req, res) {
	// response.end("Hello from Sree from: " + os.hostname() + "!\n");
	// var queryData = url.parse(req.url, true).query;
	// console.log(queryData);

	if(req.url === '/' ) {

		var tea=0;
		var coffee=0;
		db.get('tea', function(err, result) {
			if(err) {
			  res.status(500).send(err);
			  return;
			} else {
			  tea=result;

				db.get('coffee', function(err, result) {
					if(err) {
					  res.status(500).send(err);
					  return;
					} else {
					  coffee=result;

						res.writeHead(200, {"Content-Type": "text/html"});
						res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
						res.write("<h2>Tea: " + tea + " Coffee: " + coffee + " sold so far</h2>");
						res.write("<h2>Hostname: " + os.hostname() + "</h2>");
						res.end();
						return;
					}
				});
			}
		});
		return;

	}
	if(req.url === '/tea' ) {
		// req.body.n
		db.incrby('tea', 1 , function(err, result) {
			if(err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			} else {
				// res.status(204).end();
				// console.log(result);
				// return;
				res.writeHead(200, {"Content-Type": "text/html"});

				// res.writeHead(200, {"Content-Type": "text/html"});
				res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
				res.write("<h2>Here is your hot cup of <b>TEA("+result+")</b><br><br>from: " + os.hostname() + "</h2>");
				res.end();
				return;
			}
		});

		return;
	}
	if(req.url === '/coffee' ) {
		// req.body.n
		db.incrby('coffee', 1 , function(err, result) {
			if(err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			} else {
			  // res.status(204).end();
			  res.writeHead(200, {"Content-Type": "text/html"});
				res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
				res.write("<h2>Here is your hot cup of <b>COFFEE("+result+")</b><br><br>from: " + os.hostname() + "</h2>");
				res.end();
				return;

			}
		});

		
		return;
	}
	res.writeHead(404);
	res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
	res.write("<h2>Sorry! We only serve tea or coffee. Not: <b>"+req.url+ "</b><br><br>from: " + os.hostname() + "</h2>");
	res.end();
}
const server = http.createServer(handleRequest);

console.log("Listening on port 8080\n");
server.listen(8080);

