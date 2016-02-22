"use strict";

//-- global
var os = require("os");
var http = require("http");
var https = require("https");
var fs = require("fs");
var mongoose = require('mongoose');
var _ = require("underscore");
var config = require('./config');
global.sessions = [];
//-- vars
var dbOnline = true;
var startup = process.argv[1];
var exe = process.argv[0];
var numCPUs = os.cpus().length;
var machineName = os.hostname().toUpperCase();
var port = process.env.PORT !== undefined ? process.env.PORT || 8080 : 8080;
var mongoConnection = process.env.mongo !== undefined ? process.env.mongo : "mongodb://1.1.1.1:27017/collectionname";

//-- messaging
var consoleLog = function (message, force) { console.log(message); };

//-- get cmd line overrides
if (process.argv.length > 2) {
    process.argv.forEach(function (val, index, array) {
        if (val.indexOf("=") > 0) {
            var param = val.split("=");
            if (param[0].toLowerCase() === "port") { port = parseInt(param[1]); }
            if (param[0].toLowerCase() === "mongo") { mongoConnection = param[1]; }
        }
    });
}
process._maxListeners = 99;

var serverInfo = function () {
    consoleLog("");
    consoleLog("\x1b[36mMachine " + os.hostname().toUpperCase() + " with " + numCPUs + " CPUs.\x1b[0m", true);
    consoleLog("\x1b[92m Start Path.......: \x1b[0m" + startup);
    consoleLog("\x1b[92m Execute Path.....: \x1b[0m" + process.cwd());
    consoleLog("\x1b[92m Port.............: \x1b[0m" + port);
    consoleLog("\x1b[92m Debug Port.......: \x1b[0m" + process.debugPort);
    consoleLog("\x1b[93m EXE..............: \x1b[0m" + exe);
    consoleLog("\x1b[93m Version..........: \x1b[0m" + process.versions.node);
    consoleLog("\x1b[93m Http Parser......: \x1b[0m" + process.versions.http_parser);
    consoleLog("\x1b[93m V8...............: \x1b[0m" + process.versions.v8);
    consoleLog("\x1b[93m UV...............: \x1b[0m" + process.versions.uv);
    consoleLog("\x1b[93m zlib.............: \x1b[0m" + process.versions.zlib);
    consoleLog("\x1b[93m Ares.............: \x1b[0m" + process.versions.ares);
    consoleLog("\x1b[93m Modules..........: \x1b[0m" + process.versions.modules);
    consoleLog("\x1b[93m OpenSSL..........: \x1b[0m" + process.versions.openssl);
    consoleLog("\x1b[93m Arch.............: \x1b[0m" + process.arch);
    consoleLog("\x1b[93m Platform.........: \x1b[0m" + os.platform());
};

//-- HTTP Server for redirect
var serverRequest = function (req, res) {
    var requestHost = req.headers.host ? req.headers.host.toLowerCase()  : "";
    var requestReferer = req.headers.referer;
    var requestHttpVersion = req.httpVersion;
    var fullPath = req.url;
    var route = fullPath.indexOf("?") > 0 ? fullPath.split("?")[0] : fullPath;
    var params = "";
    try {
        //-- process routes
        if (route.toLowerCase() == "/" || route.toLowerCase() == "/robots.txt" || route.toLowerCase() == "/sitemap.xml") {
            console.log("\x1b[1;41m " + req.method + " HACK ATTEMPT \x1b[0m", fullPath);
            res.end("");
        } else {
            //-- adjust route for diffrent API uses
            var routeFilePath = "query" + route;
            //-- only run route if file exist
            fs.exists(routeFilePath + ".js", function (exists) {
                if (!exists) {
                    console.log("\x1b[1;41m " + req.method + " ROUTE MISSING \x1b[0m", fullPath);
                    res.end("");
                } else {
                    //-- get chuncks
                    req.on('data', function(chunk) { params += chunk.toString(); });
                    //-- process now that we chuncks 
                    req.on('end', function() {
                        if (req.method == "GET" && fullPath.indexOf("?") > 0) { params = fullPath.split("?")[1]; }
                        //- do we have json
                        if (params == "") {
                            params = {};                
                        } else {
                            try { params = JSON.parse(params); } catch (e) { params = QueryStringToJSON(params); }
                        }
                        //-- all responses are json
                        if (req.method == "OPTIONS") {
                           console.log("\x1b[1;42m CORS " + req.method + " \x1b[0m", route);
                           res.writeHead(200, { 
                              "Content-Type": "application/json",
                              "Access-Control-Allow-Credentials": "True",
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                              "Access-Control-Allow-Headers": "access-control-allow-credentials,access-control-allow-methods,access-control-allow-origin,access-control-max-age,content-type,token",
                              "Access-Control-Max-Age": 86400
                           });
                           res.end("{}");
                        } else {
                           console.log("\x1b[1;42m " + req.method + " API \x1b[0m", route);
                           res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
                           // process route
                           var token = req.headers["token"];
                           if (route.toLowerCase() == "/twilio-sms-complete") {
                              require("./query/twilio.js").query(params, req.method, {}).then(function (data) { res.end(data); });
                           } else if (route.startsWith("/login") || route.startsWith("/forgotPassword") || route.startsWith("/signup") || route.startsWith("/updatePassword")) {
                              //-- always process login
                              require("./query" + route + ".js").query(params, req.method, {}).then(function (data) { res.end(data); });
                           } else if (token) {
                              //-- verify token
                              var session = _.findWhere(sessions, {token: token});
                              //-- process all request that have a verified token
                              if (session) {
                                 require("./" + routeFilePath + ".js")
                                 .query(params, req.method, session)
                                 .then(function (data) {
                                    res.end(data);
                                 });
                              } else {
                                 console.log("\x1b[1;43m " + req.method + " SESSION EXPIRED \x1b[0m", req.url);
                                 res.end('{"error":"session expired"}');
                              }
                           } else {
                              console.log(req.headers);
                              console.log("\x1b[1;43m " + req.method + " MISSING TOKEN \x1b[0m", req.url);
                              res.end('{"error":"access denied"}');
                           }
                        }
                    });
                }
            });
        }
    } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
        console.log("\x1b[1;41m " + req.method + " ERROR \x1b[0m", req.url, e);
        res.end("{error:\"server error\"}");
    }
};

//-- Mongo Connection
mongoose.connect(mongoConnection, function(err) {
   if (err) {
      console.log(err);
      dbOnline = false;
      console.log("----> mongoDB DOWN! <----");
   } else {
      dbOnline = true;
      console.log("Connected to mongoDB "+mongoConnection);
   }
});

//-- start listener based on config
if (!process.env.PORT) { serverInfo(); }
var server = http.createServer(function (req, res) {
   if (dbOnline) {
      serverRequest(req, res);
   } else {
      console.log("DB Not Connected");
      res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
      res.end("{\"error\":\"DB Offline\"}");
   }
}).listen(port);


//-- cron job for server side processes
var CronJob = require("cron").CronJob;
var job = new CronJob('00 00 03 * * 1-7',
   function() {
      /* '00 30 11 * * 1-5' Runs every weekday (Monday through Friday) at 11:30:00 AM. It does not run on Saturday or Sunday. */
      var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
      var tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
      console.log("Alerts CRON Process started", yesterday, tomorrow);

      //-- do tasks here

   },
   function () {
      /* job ended */
      console.log("Alerts CRON Process complete");
   },
   true /* Start the job right now */
);

//-- SMS
function sendSMS(smsData) {
   var twilio = require('twilio');
   var accountSid = config.twilio.accountSid; 
   var authToken = config.twilio.authToken;
   var twilioNumber = config.twilio.twilioNumber; 
   var client = new twilio.RestClient(accountSid, authToken);
   client.sms.messages.create({
      to:smsData.number,
      from:twilioNumber,
      body:smsData.message
   }, function(error, message) {
      if (error) {
         console.log("CRON SMS ERROR: ", error);
      } else {
         var messageDate = message.dateCreated;
         var messageSID = message.sid;
         console.log("CRON SMS ALERT SENT: ", smsData.number);
      }
   });
   
   
}

//-- EMAIL
function sendEmail(emailData) {
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.enableSSL,
      auth: {
         user: config.email.username,
         pass: config.email.password
      }
   });
   //email data
   var mailOptions = {
      from: config.email.fromEmail,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.body
   };
   transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
         console.log("CRON EMAIL ERROR: ", error);
      } else {
         console.log("CRON EMAIL ALERT SENT: ", emailData.email);
      }
   });
}

//-- things I miss in javascript
function QueryStringToJSON(params) {
   var pairs = params.split('&');
   var result = {};
   pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
   });
   return JSON.parse(JSON.stringify(result));
}

String.prototype.endsWith = function (suffix) { return this.indexOf(suffix, this.length - suffix.length) !== -1; };
String.prototype.startsWith = function (str) { return (this.match("^" + str) == str) };
String.prototype.trim = function () { return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")) };
String.prototype.toProperCase = function () { return this.toLowerCase().replace(/^(.)|\s(.)/g, function ($1) { return $1.toUpperCase(); }); };
String.prototype.startsWithAny = function (matchThis) {
   var hasMatch = false;
   for (var index = 0; index < matchThis.length; ++index) {
      if (this.match("^" + matchThis[index]) == matchThis[index]) { hasMatch = true; }
   }
   return hasMatch;
};