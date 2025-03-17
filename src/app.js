const express = require('express')
const {engine}=require('express-handlebars')
const routerProducts = require("./routes/products.router.js")
const routerCarts = require("./routes/carts.router.js")

const app = express()

const PORT = 8080

//Middlewares para poder trabajar con datos JSON 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//products
app.use("/api/products", routerProducts)
//carts
app.use("/api/carts",routerCarts)

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views","./src/views")

app.get("/", (req, res)=>{
    res.setHeader('Content-Type','text/plain')
    res.status(200).send('Home page')
})

//inicializacion del servidor
app.listen(PORT, ()=>{
	console.log('servidor corriendo en el puerto '+PORT)
})