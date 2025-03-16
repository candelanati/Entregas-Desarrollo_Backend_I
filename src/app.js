const express = require('express')
// const {CartManager}=require("./dao/cartManager.js")
const routerProducts = require("./routes/products.router.js")
const routerCarts = require("./routes/carts.router.js")

// const cartManager = new CartManager("./src/data/cart.json")

const app = express()

const PORT = 8080

//Middlewares para poder trabajar con datos JSON 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//products
app.use("/api/products", routerProducts)
//carts
app.use("/api/carts",routerCarts)

app.get("/", (req, res)=>{
    res.setHeader('Content-Type','text/plain')
    res.status(200).send('Home page')
})




//inicializacion del servidor
app.listen(PORT, ()=>{
	console.log('servidor corriendo en el puerto '+PORT)
})