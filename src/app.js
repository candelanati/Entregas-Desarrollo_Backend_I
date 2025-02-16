const express = require('express')
const { ProductsManager}=require("./dao/productsManager.js")

const productManager=new ProductsManager("./data/products.json")

const app = express()

const PORT = 8080

//Middleware para poder trabajar con datos JSON 
app.use(express.json())

app.get("/", (req, res)=>{
    res.send("Home Page")
})

app.get("/api/products", async(req,res)=>{
	let {limit}=req.query
	let products=await productManager.getProducts()
	// const fs=require("fs")
    // fs.readFileSync()

	if(limit){
        limit=Number(limit)
        if(isNaN(limit)){
            return res.send("Error: ingrese un limit numérico")
        }
        products=products.slice(0, limit)
    }

	res.json(products)
})

//inicializacion del servidor
app.listen(PORT, ()=>{
	console.log('servidor corriendo en el puerto '+PORT)
})