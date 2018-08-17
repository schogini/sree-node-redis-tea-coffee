const http = require('http');
const os = require('os');
const url = require('url');
const redis = require('redis');

// docker run -d -p6379:6379 --rm --name redis redis
// export REDIS_URL=redis://localhost:6379 
// var db = redis.createClient({url: process.env.REDIS_URL});

var redis_host = process.env.REDIS_HOST || 'localhost'
var redis_port = process.env.REDIS_PORT || 6379

var redis_ready = true;
var tea=0;
var coffee=0;
var db;
var http_res;
process.on('uncaughtException', function(event) {
  // console.log(event);
  console.log('Connection to redis failed..');
  // process.exit(1);

		// http_res.writeHead(404, {"Content-Type": "text/html"});
		// http_res.write("<h1>Tea & Coffee Shop is Closed 123!</h1>");
		// // res.write("<h2>Tea: " + tea + " Coffee: " + coffee + " sold so far</h2>");
		// http_res.write("<h2>Hostname: " + os.hostname() + "</h2>");
		// http_res.end();



});



var handleRequest = function(req, res) {
	// response.end("Hello from Sree from: " + os.hostname() + "!\n");
	// var queryData = url.parse(req.url, true).query;
	console.log("Request received..");

	http_res=res;

	setTimeout(function() {
	console.log('Waiting..');
	}, 300);
	db=false;
	db = redis.createClient({

		host: redis_host, 
		redis_port: redis_port,

	    retry_strategy: function (options) {
	        if (options.error) {
	        // if (options.error && options.error.code === 'ECONNREFUSED') {
	            // End reconnecting on a specific error and flush all commands with
	            // a individual error
	            console.log('The server refused the connection');

				res.writeHead(404);
				res.write("<h1>Tea & Coffee Closed 444</h1>");
				res.write("<h2>Hostname: " + os.hostname() + "</h2>");
				res.end();

	        }
	        // if (options.total_retry_time > 1000 * 60 * 60) {
	        //     // End reconnecting after a specific timeout and flush all commands
	        //     // with a individual error
	        //     console.log('Retry time exhausted');
	        // }
	        if (options.attempt > 3) {
	            // End reconnecting with built in error
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
					// res.status(204).end();
					// console.log(result);
					// return;
					res.writeHead(200, {"Content-Type": "text/html"});

					// res.writeHead(200, {"Content-Type": "text/html"});
					res.write("<h1>Welcome to Tea Shop</h1>");
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
				res.write("<h1>Welcome to Coffee Shop</h1>");
				res.write("<h2>Here is your hot cup of <b>COFFEE("+result+")</b><br><br>from: " + os.hostname() + "</h2>");
				res.end();
				return;

			}
		}); //coffee

		
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

