const express = require('express')

const app = express()

const PORT = 8080

//Middleware para poder trabajar con datos JSON 
app.use(express.json())

let products = []

let carts = []

let api = [products, carts]

//GET!!
app.get('/api/products',(req,res)=>{
	res.json(products)
})

//inicializacion del servidor
app.listen(PORT, ()=>{
	console.log('servidor corriendo en el puerto '+PORT)
})