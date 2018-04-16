const http=require('http');
const querystring=require('querystring');
const httpProxy=require('http-proxy');
const superAgent=require('superagent');
const url=require('url');
const db=require('./db');

var proxy=httpProxy.createServer({});
http.createServer(function(req,res){
　　var postData='';

    var params=url.parse(req.url,true).query;
    var proxy_url=params.url.replace(/\$/g,'&')
    console.log('proxy:',proxy_url)
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    var sreq=superAgent.get(proxy_url)
    sreq.pipe(res);
    sreq.on('end',()=>{
        console.log('done')
    })
    db.sql('select * from wccy_token',(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })  
}).listen(3000);
console.log("服务启动。。。")