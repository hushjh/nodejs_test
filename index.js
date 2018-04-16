const Koa=require('koa')
const cors=require('koa-cors')
const router=require('koa-router')()
const bodyParser=require('koa-bodyparser')
const controller=require('./controller')
const rest=require('./rest').restify

const app=new Koa()
app.use(cors({
    origin: function (ctx) {
        console.log('ctx.url:',ctx.url)
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://127.0.0.1:5500'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


app.use(bodyParser())
app.use(rest())
app.use(async (ctx,next)=>{
    console.log(`process ${ctx.request.method} ${ctx.request.url}`)
    await next()
})
router.get('/hello/:name',async(ctx,next)=>{
    var name=ctx.params.name
    ctx.response.body=`<h1> hello,${name}!`
})
router.get('/',async(ctx,next)=>{
    ctx.response.body=`<h1>Index</h1>
    <form action="/signin" method="post">
        <p>Name: <input name="name" value="koa"></p>
        <p>Password: <input name="password" type="password"></p>
        <p><input type="submit" value="Submit"></p>
    </form>`
})
router.post('/signin',async(ctx,next)=>{
    var name=ctx.request.body.name || '',
        password=ctx.request.body.password || '';
        console.log(`signin with name; ${name},password:${password}`)
        if(name==='koa' && password==='12345'){
            ctx.response.body=`<h1>welcome,${name}</h1>`
        }else {
            ctx.response.body=`<h1>login failed</h1>
            <p><a href='/'>try</a></p>`

        }
})
//app.use(router.routes())
app.use(controller())
app.listen(3000)
console.log('app started at port 3000...');
