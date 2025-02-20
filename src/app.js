const express = require('express')
const { ProductsManager}=require("./dao/productsManager.js")
const {CartManager}=require("./dao/cartManager.js")

const cartManager = new CartManager("./data/cart.json")
const productManager=new ProductsManager("./data/products.json")

const app = express()

const PORT = 8080

//Middlewares para poder trabajar con datos JSON 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res)=>{
    res.setHeader('Content-Type','text/plain')
    res.status(200).send('Ok')
})

app.get("/api/products", async(req,res)=>{
	let {limit}=req.query
	let products=await productManager.getProducts()
	if(limit){
        limit=Number(limit)
        if(isNaN(limit)){
            return res.send("Error: ingrese un limit numérico")
        }
        products=products.slice(0, limit)
    }
	res.status(200).json(products)
})

app.get("/api/carts", async(req,res)=>{
	let cart=await cartManager.getCart()
	res.json(cart)
})

app.get("/api/products/:pid",async(req,res)=>{
    let {pid}=req.params
    let products=await productManager.getProducts()
    //validaciones
    let producto=products.find(p=>p.id==pid)
    if(!producto){
        return res.status(404).send({error:'no existen productos con id: '+pid})
    }
    res.status(200).send(producto)
})

//inicializacion del servidor
app.listen(PORT, ()=>{
	console.log('servidor corriendo en el puerto '+PORT)
})