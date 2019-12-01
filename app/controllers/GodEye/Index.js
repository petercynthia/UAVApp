/**
 * Created by Admin on 2017/6/20.
 */
var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/godeye', router);
};

router.get('/',function(req,res,next){
      res.render('GodEye/Index');
});
