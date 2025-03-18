const express = require('express')
const {Server} = require('socket.io')
const {engine}=require('express-handlebars')
const routerProducts = require("./routes/products.router.js")
const routerCarts = require("./routes/carts.router.js")
const viewsRouter = require('./routes/views.router.js')
const { ProductsManager } = require('./dao/productsManager.js')
const { validacionesPost } = require('./utilities/validationsPost.js')
const productManager = new ProductsManager("./src/data/products.json")

const app = express()

const PORT = 8080

let io = undefined

//Middlewares para poder trabajar con datos JSON 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

// //products
// app.use("/api/products",routerProducts)
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

 //products
 app.use(
     "/api/products", 
     (req,res,next)=>{
         req.io=io
         next()
     },
     routerProducts
 )

//websockets para realTimeProducts
io.on("connection", async(socket)=>{
    console.log("cliente conectado a websockets")
    let productos = await productManager.getProducts()
    socket.emit("updateProducts", productos)
    socket.emit("ProductosGet",productos)
    socket.on("nuevoProducto", async (title,description,code,price,status,stock,category,thumbnails) => {
        let productosExistentes = await productManager.getProducts()
        let productoNuevo = {title,description,code,price,status,stock,category,thumbnails}
        validationRes = validacionesPost(productosExistentes,productoNuevo)
        if(validationRes === ''){
            io.emit("nuevoProducto", await productManager.addProduct(title,description,code,price,status,stock,category,thumbnails))
            let productos = await productManager.getProducts()
            socket.emit("updateProducts",productos)
        }
        else {
            console.log(validationRes)
        }
    })
    
})
