const http = require('http');
const os = require('os');
const url = require('url');
const redis = require('redis');

var redis_host = process.env.REDIS_HOST || 'localhost'
var redis_port = process.env.REDIS_PORT || 6379

var redis_ready = true;
var tea=0;
var coffee=0;
var db;
var http_res;
process.on('uncaughtException', function(event) {
  console.log('Connection to redis failed..');
});

var handleRequest = function(req, res) {

	db = redis.createClient({

		host: redis_host, 
		redis_port: redis_port,

	    retry_strategy: function (options) {
	        if (options.error) {
	            console.log('The server refused the connection');
				res.writeHead(404);
				res.write("<h1>Tea & Coffee Closed</h1>");
				res.write("<h2>Hostname: " + os.hostname() + "</h2>");
				res.end();

	        }
	        if (options.attempt > 3) {
	            console.log("Error..");
	        }
	        // reconnect after
	        return Math.min(options.attempt * 100, 1000);
	    }

	});
	if(!db){

		return;
	}
	if(req.url === '/' ) {
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
						res.write("<h1><a href='/'>Home</a>|<a href='/tea'>Tea</a>|<a href='/coffee'>Coffee</a></h1>");
						res.end();
						return;
					}
				});
			}
		}); // tea

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
					res.writeHead(200, {"Content-Type": "text/html"});
					res.write("<h1>Welcome to Tea Shop</h1>");
					res.write("<h2>Here is your hot cup of <b>TEA("+result+")</b><br><br>from: " + os.hostname() + "</h2>");
					res.write("<h1><a href='/'>Home</a>|<a href='/tea'>Tea</a>|<a href='/coffee'>Coffee</a></h1>");
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
			  res.writeHead(200, {"Content-Type": "text/html"});
				res.write("<h1>Welcome to Coffee Shop</h1>");
				res.write("<h2>Here is your hot cup of <b>COFFEE("+result+")</b><br><br>from: " + os.hostname() + "</h2>");
				res.write("<h1><a href='/'>Home</a>|<a href='/tea'>Tea</a>|<a href='/coffee'>Coffee</a></h1>");
				res.end();
				
				return;

			}
		}); //coffee

		
		return;
	}
	res.writeHead(404);
	res.write("<h1>Welcome to Tea & Coffee Shop</h1>");
	res.write("<h2>Sorry! We only serve tea or coffee. Not: <b>"+req.url+ "</b><br><br>from: " + os.hostname() + "</h2>");
	res.write("<h1><a href='/'>Home</a>|<a href='/tea'>Tea</a>|<a href='/coffee'>Coffee</a></h1>");
	res.end();
}
const server = http.createServer(handleRequest);

console.log("Listening on port 8080\n");
server.listen(8080);

