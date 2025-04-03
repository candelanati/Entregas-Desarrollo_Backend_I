const {Router} = require("express")

// const { renderProducts } = require("../utilities/listaDesactualizada.js")
const { ProductsManagerMongo } = require("../dao/productsManagerMongo.js")
const productManager =  new ProductsManagerMongo()
// const productManager = new ProductsManager("./src/data/products.json")
const {isValidObjectId} = require('mongoose')
const procesaErrores = require('../utilities/procesadoErrores.js')
const productsModel = require("../dao/models/productsModel.js")

const router = Router()

router.get('/',async(req,res)=>{
    try {
        let products = await productManager.get()
        req.io.emit("ProductosGet", products)
        // console.log(products)
        res.setHeader('Content-Type','application/json')
		res.status(200).json({products})
    } catch (error) {
        procesaErrores(error,res)
    }
})

router.get('/:pid',async(req,res)=>{
    let {pid}=req.params
    if(!isValidObjectId(pid)){
        return res.status(400).json({error:'Ingrese un id valido de MongoDB'})
    }
    //validaciones
    try {
        let producto=await productsModel.findById(pid).lean()
        if(!producto){
            return res.status(404).send({error:'no existen productos con id: '+pid})
        }
        req.io.emit("Product", producto)
        
        res.status(200).json(producto)
    } catch (error) {
		procesaErrores(error,res)
    }
})

router.post("/",  async(req,res)=>{
    try{ 
       
        console.log(req.body)
       
        const productoRecibido={
           title:req.body.title,
           description: req.body.description,
           code: req.body.code,
           price: Number(req.body.price),
           status: req.body.status === "true" || req.body.status === true ? true : false, 
           stock: Number(req.body.stock),
           category: req.body.category,
           thumbnails:  req.body.thumbnails
        }
       //validaciones
           //pre-existencias
            const productPreExistente = await productsModel.findOne(
                {
                    title: productoRecibido.title,
                    description: productoRecibido.description,
                    code: productoRecibido.code,
                    price: productoRecibido.price,
                    stock: productoRecibido.stock,
                    category: productoRecibido.category,
                    thumbnails: { $eq: productoRecibido.thumbnails } // Comparación exacta de arrays
                }
            ).lean()
            if(productPreExistente){
                return res.status(400).send({error: 'El producto ya existe en la lista de productos'});
            }
            const codePreExistente = await productsModel.findOne({code: productoRecibido.code}).lean()
            if(codePreExistente){
                return res.status(400).send({error:'ya existe un producto con el código: '+productoRecibido.code})
            }

            //completar keys
            const requiredFields = ["title", "description", "code", "price", "stock", "category","thumbnails","status"];
            for (let field of requiredFields) {
                if (!productoRecibido[field]) {
                    return res.status(400).json({ error: `Complete el campo: ${field}` });
                }
            }

            //tipos
            if (typeof productoRecibido.title !== "string" || !productoRecibido.title.trim()) {
                return res.status(400).send({ error: "El título debe ser un string no vacío" })
            }
            if (typeof productoRecibido.description !== "string" || !productoRecibido.description.trim()) {
                return res.status(400).send({ error: "la descripcion debe ser un string no vacío" })
            }
            if (typeof productoRecibido.code !== "string" || !productoRecibido.code.trim()) {
                return res.status(400).send({ error: "El código debe ser un string no vacío" });
            }
            if (isNaN(productoRecibido.price) || productoRecibido.price < 0) {
                return res.status(400).send({ error: "El precio debe ser un número mayor o igual a 0" });
            }
            if (typeof productoRecibido.status !== "boolean") {
                return res.status(400).send({ error: "El estado debe ser un booleano (true o false)" })
            }
            if (isNaN(productoRecibido.stock) || productoRecibido.stock < 0) {
                return res.status(400).send({ error: "El stock debe ser un número mayor o igual a 0" });
            }
            if (typeof productoRecibido.category !== "string" || !productoRecibido.category.trim()) {
                return res.status(400).send({ error: "La categoria debe ser un string no vacío" })
            }
            if (!Array.isArray(productoRecibido.thumbnails) || !productoRecibido.thumbnails.every(el => typeof el === "string")) {
                return res.status(400).send({ error: "Las thumbnails deben ser un array de strings" });
            }

        
        let productoNuevo = await productManager.save(productoRecibido)
       
        let products=await productManager.get()
        req.io.emit("ProductosGet", products)
        res.status(201).json(productoNuevo)
    }catch (error){
        res.status(500).send({error:'Error en el servidor: '+error})
    }
})

router.put("/:pid", async(req,res)=>{
    try{
        const {pid}=req.params
        let position= await productsModel.findById(pid).lean()
        //validacion existencia
        if(position===null){
            return res.status(400).send('El producto a actualizar con id '+pid+' no existe')
        }
        //validacion existencia de valores a actualizar
        const updatedData = req.body
        console.log('Datos enviados por el body:')
        console.log(updatedData)
        if(!updatedData||Object.keys(updatedData).length===0){
            return res.status(400).send('Debe enviar un valor para actualizar')
        }

        //validaciones valores y tipos
        const productoRecibido={
            title:req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: Number(req.body.price),
            status: req.body.status === "true" || req.body.status === true ? true : false, 
            stock: Number(req.body.stock),
            category: req.body.category,
            thumbnails:  req.body.thumbnails
        }
        if (productoRecibido.title !== undefined) {
            if (typeof productoRecibido.title !== "string" || !productoRecibido.title.trim()) {
                return res.status(400).send({ error: "El título debe ser un string no vacío" });
            }
        }
        
        if (productoRecibido.description !== undefined) {
            if (typeof productoRecibido.description !== "string" || !productoRecibido.description.trim()) {
                return res.status(400).send({ error: "La descripción debe ser un string no vacío" });
            }
        }   
        
        if (productoRecibido.code !== undefined) {
            if(typeof productoRecibido.code !== "string" || !productoRecibido.code.trim()) {
                return res.status(400).send({ error: "El código debe ser un string no vacío" });
            }
        }
        
        if (req.body.price !== undefined) {
            const price = Number(req.body.price);
            if (isNaN(price) || price <= 0) {
                return res.status(400).send({ error: "El precio debe ser un número mayor a 0" });
            }
        }
        
        if (req.body.status !== undefined) {
            if (typeof productoRecibido.status !== "boolean") {
                return res.status(400).send({ error: "El estado debe ser un booleano (true o false)" });
            }
        }
        
        if (req.body.stock !== undefined) {
            const stock = Number(req.body.stock);
            if (isNaN(stock) || stock < 0) {
                return res.status(400).send({ error: "El stock debe ser un número mayor o igual a 0" });
            }
        }
        
        if (productoRecibido.category !== undefined) {
            if (typeof productoRecibido.category !== "string" || !productoRecibido.category.trim()) {
                return res.status(400).send({ error: "La categoría debe ser un string no vacío" });
            }
        }
        
        if (productoRecibido.thumbnails !== undefined) {
            if (!Array.isArray(productoRecibido.thumbnails) || !productoRecibido.thumbnails.every(el => typeof el === "string")) {
                return res.status(400).send({ error: "Las thumbnails deben ser un array de strings" });
            }
        }

        const productoActualizado = await productManager.update(pid,updatedData)
        products=await productManager.get()
        req.io.emit("ProductosGet", products)
        res.status(200).json(productoActualizado)
    }catch(error){
        res.status(500).send({error:'Error en el servidor: '+error})
    }
})

router.delete("/:pid", async(req,res)=>{
    try{
        const {pid} = req.params
        let product= await productsModel.findById(pid).lean()
        if(!product){
           return res.status(400).send('El producto a eliminar con id '+pid+' no existe')
        }
        await productManager.delete(pid)
        let productsEliminado = await productManager.get()
        req.io.emit("ProductosGet", productsEliminado)
        res.status(200).json(productsEliminado)
    }catch(error){
        res.status(500).json({error:'Error en el servidor: '+error.message})
    }
})

module.exports=router