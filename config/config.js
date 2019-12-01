var path = require('path'),
        rootPath = path.normalize(__dirname + '/..'),
        env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'UAVApp-dev'
        },
        port: 3000,
        mqtt:{
            connection:{
                host:'message.chinaunicom.live',
                port:'1883'
            },            
            topic:'lynmaxtest'
        }
    },

    test: {
        root: rootPath,
        app: {
            name: 'UAVApp-test'
        },
        port: 3000
    },

    production: {
        root: rootPath,
        app: {
            name: 'UAVApp'
        },
        port: 3000,
        mqtt:{
            connection:{
                host:'message.chinaunicom.live',
                port:'1883'
            },   
            topic:'lynmaxtest'
        }
    }
};

module.exports = config[env];
