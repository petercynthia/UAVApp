
 const util = require('util');
 var iotMessage={};
 const defHead= Buffer.from([0x64,0x61,0x65,0x68]);
 const defTail=Buffer.from([0x6c,0x69,0x61,0x74]);

function iotMessageParaser() {
     
   

   function isIotMessage(rawData){
   	
     console.log('raw data:'+rawData.length);
	 if(util.isNull(rawData)||rawData.length!=28) return false;
	 else return true;
    }

   function process(rawData){
    
	try{
          
		 let head=rawData.slice(0,4);
		 let tail=rawData.slice(24,28);			
		 if(!defHead.equals(head)||!defTail.equals(tail)) return {error:'error data format'};
		 let devId=rawData.slice(4,8).readUInt32LE(0);
		 let timestamp=rawData.slice(8,12).readUInt32LE(0)*1E3;			 
		 let longitude=rawData.slice(12,16).readUInt32LE(0)/1E7;
		 let latitude=rawData.slice(16,20).readUInt32LE(0)/1E7;			 
		 let altitude=rawData.slice(20,24).readUInt32LE(0)/1E3;
				
		 iotMessage={
			head:head.reverse().toString(),
			devId:devId,
			timestamp:(new Date(timestamp)).toLocaleString(),
			longitude:longitude,
			latitude:latitude,
			altitude:altitude,
			tail:tail.reverse().toString()	
		    };				
			return iotMessage;
			
		}
	catch(err){			
			console.log(err);
			return {error:err};
		} 
	  }

	return{
		process:process,
		isMyMessage:isIotMessage
	}  

}

module.exports=iotMessageParaser();