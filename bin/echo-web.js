#!/usr/bin/node
'use strict';

const http  = require('http');
const https = require('https');
const argv  = require('yargs').argv;


const httpPort  = Number(argv.http) || Number(argv.port) || Number(argv.p) || 8080;
const httpsPort = Number(argv.https);

if (!httpPort && !httpsPort) {
    console.log(`USAGE:', argv.$0, '[options...]
    
OPTIONS:
--http, --port, -p  Port number for http server
--https             Port number for https server

EXAMPLES:
${argv.$0} -p 8080
${argv.$0} --http 8080 --https 8443
`);
}

/**
 * HTTP Server
 */
if (httpPort) {
	const httpServer = http.createServer(function (req, res) {
		return Promise.resolve()
		.then(() => {
			return handlerRequest(req);
		})
		.then((data) => {
			sendResponse(res, data);
		});
	});

	httpServer.listen(httpPort, function (err) {
		if (err) {
			throw new err;
		}

		console.log('HTTP server started at port', httpPort);
	});
}

/**
 * HTTPS Server
 */
if (httpsPort) {
	const httpsServer = http.createServer(function (req, res) {
		return Promise.resolve()
		.then(() => {
			return handlerRequest(req)
		})
		.then((data) => {
			let httpsData = handleHttps(req);

			Object.assign(data, httpsData);
			sendResponse(res, data);
		})
	});

	httpsServer.listen(httpsPort, function (err) {
		if (err) {
			throw new err;
		}

		console.log('HTTPS server started at port', httpsPort);
	})
}

function handlerRequest (req) {
	return new Promise((resolve, reject) => {
		let data = {};

		data.headers = req.headers;
		data.method = req.method;
		data.url    = req.url;
		data.body   = '';

		req.on('data', function (chunk) {
			data.body += chunk;
		});
		req.on('end', function () {
			return resolve(data);
		});
		req.on('error', function (err) {
			return reject(err);
		});
	});
}

function sendResponse (res, data) {
	console.dir(data, {depth: null});

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(data));
}
