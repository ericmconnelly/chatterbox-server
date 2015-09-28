var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    express = require('express'),
    bodyParser = require('body-parser');

var app = express();

//PARSE DATA

//create a chats.json file that store all the chat logs
var filename = "chats.json";
var data;
fs.readFile(filename, function(err, bit){
  if(err){
    bit = JSON.stringify({results: []});
  }
  data = JSON.parse(bit);
});

app.use(express.static('../client'));

app.use(bodyParser.json());


//HANDLE OPTIONS
app.options('/*', function (req, res){
  handleResponse(res, 200)
});

//HANDLE GET
app.get('/classes/*', function(req, res){
  handleResponse(res, 200, JSON.stringify(data))
});


//HANDLE POSTS
app.post('/classes/*', function (req, res){
  data.results.push(req.body);
  var stringifiedData = JSON.stringify(data)
  fs.writeFile(filename, stringifiedData, function (err) {
    if(err){
      console.log('***CANNOT WRITE DATA***')
    }
  });
  handleResponse(res, 201, stringifiedData);
});

// HELPER FUNCRION, HANDLE RESPONSE TO SERVER
    // by writing to head with the status code and 
    // 
     with the stringified data already passed in
function handleResponse(res, status, data) {
  res.writeHead(status, defaultCorsHeaders);
  res.end(data);
};



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('ChatterBox app listening at http://%s:%s', host, port);
});

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Allow": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};





