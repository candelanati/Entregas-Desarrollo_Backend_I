const express = require('express')
const {Server} = require('socket.io')
const {engine}=require('express-handlebars')
const routerProducts = require("./routes/products.router.js")
const routerCarts = require("./routes/carts.router.js")
const viewsRouter = require('./routes/views.router.js')

const app = express()

const PORT = 8080

let io = undefined

//Middlewares para poder trabajar con datos JSON 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

//products
app.use(
    "/api/products", 
    (req,res,next)=>{
        req.io=io
        next()
    },
    routerProducts
)
//carts
app.use("/api/carts",routerCarts)
app.use('/',viewsRouter)

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views","./src/views")

app.get("/", (req, res)=>{
    res.setHeader('Content-Type','text/plain')
    res.status(200).send('Home page')
})

//inicializacion del servidor
const serverHTTP=app.listen(PORT, ()=>{ //servidor HTTP
	console.log('servidor corriendo en el puerto '+PORT)
})

io=new Server(serverHTTP)  //servidor de websocket montado sobre servidor HTTP
