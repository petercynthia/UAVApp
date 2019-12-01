var express = require('express'),
    config = require('./config/config'),//配置文件
    glob = require('glob'),
    wsocket = require('./app/routes/wsocket'),
    bodyParser = require('body-parser');   

var models = glob.sync(config.root + '/app/models/*.js');

models.forEach(function (model) {
    require(model);
});
var app = express();


require('./config/Express')(app, config);

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

io.on('connection', wsocket);

server.listen(config.port, function() {
 console.log('网站监听端口： ' + config.port);
});
