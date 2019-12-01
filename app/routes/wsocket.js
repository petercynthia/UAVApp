/*
 * Server content over a socket
 */

const net = require('net');
const mavlink=require('mavlink');
const mqtt=require('mqtt');
const config=require('../../config/config.js');
const  fs  = require('fs');

//mavparser协议包
//const mavparser = require('../Protocols/mavlink/mavlink.js');
const IOTMessageParaser = require('../Protocols/IOTProtocol.js');

const errorMsg={error:'error data format'};
module.exports = function(wsocket) {
wsocket.on('error',function (error) {
  	
		console.log(error);
	});
  
 var mavparaser = new mavlink(1,1);
 //-----------------------------------------------------------------------------------------------
 //mqtt获取数据
  var mqttClient=mqtt.connect(config.mqtt.connection);
  mqttClient.on('connect', function () {
	mqttClient.subscribe(config.mqtt.topic, function (err) {
	//   if (!isNull(err)) {		
	// 	console.log('error'+err);
	//   }
	})
  });

//解析接收到的数据
mqttClient.on('message', function (topic, iotMessage) {			
	mavparaser.parse(iotMessage);					
	console.log(iotMessage);
});
 //监听消息并发送至前端
 mavparaser.on("message", function(message) {			
	wsocket.broadcast.emit('data', message);
	console.log(message);
   });

  mavparaser.on("ready", function() {	   	    
		console.log('mav ready');
	}); 
//-----------------------------------------------------------------------------------------
//自定义数据 读网口数据
const port = 3001;
  var iotMessage={}; 
  var sockets = [];

  var server = net.createServer(function(socket){
	    let message = Date()+':TCP server created';
		socket.write(message);
		console.log(message);
		server.close(function () {
			console.log('服务器已关闭');
		})
  });

  server.on('connection',function(socket){
    
    sockets.push(socket)
	
    socket.on('data',function(data){
		//var date=data.toString();
        var address=socket.address();
		console.log(Date()+socket.remoteAddress+':'+socket.remotePort+' 接收原始数据');
        console.log(data);
        
        if(IOTMessageParaser.isMyMessage(data)){

          iotMessage=IOTMessageParaser.process(data); 
          wsocket.emit('data', iotMessage);
          wsocket.broadcast.emit('data', iotMessage);

          console.log(Date()+socket.remoteAddress+':'+socket.remotePort+' 解析后数据');
          console.log(iotMessage);

        } else {
        	 wsocket.emit('error', errorMsg);
             wsocket.broadcast.emit('error', errorMsg); 
           }
        
        
	});

	socket.on('end',function(){
		var message='end connection';
		wsocket.broadcast.emit('end', message)   
		console.log(message);
	});

	socket.on('close',function(){
		var message='close connection';
		wsocket.broadcast.emit('end', message) 
        var index = sockets.indexOf(socket);
		sockets.splice(index,1);
		
		console.log(message);
		
	});

	socket.on('error',function(err){
		var message='error';
		wsocket.broadcast.emit('error', message)   
		console.log(err);
		socket.end();
	});
  });

/*
server.on('error',function(err){

	console.log(Date()+err);
});*/


server.on('error', function(err) {
	sockets=[];
    if (err.code === 'EADDRINUSE') {
    console.log(Date()+err);
    // setTimeout(() => {
    //   server.close();
    //   server.listen(port,function(){
    //   	console.log('TCP Server 重新启动');

    //   });
    // }, 3001);
  }
}); 

server.on('close',function() {
	console.log('Tcp server close');
});

server.listen(port,function(){

	console.log('TCP server 启动监听：'+port);

});
 	 

 };