const {Router} = require("express")
const {CartManager}=require("../dao/cartManagerMongo.js")
const cartManager = new CartManager()
// const { ProductsManager }=require("../dao/productsManager.js")
const cartsModel = require("../dao/models/cartsModel.js")
// const productManager = new ProductsManager("./src/data/products.json")
const {isValidObjectId} = require('mongoose')
const productsModel = require("../dao/models/productsModel.js")
const router = Router()
const mongoose=require("mongoose")


router.get("/:cid",async(req,res)=>{
    let {cid}=req.params
    let cart = await cartsModel.findById(cid).lean()
    //validacion
    if(!cart){
        return res.status(404).send({error:'no existen carritos con id: '+cid})
    }
    res.status(200).json(cart)
})

router.post("/",  async(req,res)=>{
    try{ 
        let {products}=req.body
        //caso en el que no se envie nada por body
        if(!Array.isArray(products)||products.length===0){
            products=[]
        }
        // console.log(products)
        let productosRecibidosCart=products
        //busca los IDs de los productos recibidos y valida que sean productos existentes
        let productIds = products.map(product => product.product.toString()) 
        if (productIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ error: "Uno o más IDs de productos no son válidos. Por favor ingrese productos con IDs válidos y vuelva a intentarlo." })
        }
        //busca las cantidades y se fija que sean mayores a 0
        let productQuantities = products.map(product => product.quantity) 
        if (productQuantities.some(cantidad => cantidad<=0)) {
            return res.status(400).json({ error: "Una o más cantidades de productos no son mayores a 0. Por favor ingrese productos con cantidades válidas y vuelva a intentarlo." })
        }
        //busca los productos en la BD
        let productsExistentes = await productsModel.find({ _id: { $in: productIds } }).lean()
        // console.log('\n productos recibidos:')
        // console.log(productosRecibidosCart)
        // console.log('\n productos existentes:')
        // console.log(productsExistentes)

        //valida existencias
        let productoNoExistente = productosRecibidosCart.find(recibido => {
            return !productsExistentes.some(existente => 
                existente._id.toString() == recibido.product 
            )
        })
        if (productoNoExistente) {
            return res.status(404).send({
                error: `El producto con id: ${productoNoExistente._id} no existe en la lista de productos existentes o no coincide con sus datos`
            })
        }
    
        let productoNuevo = await cartManager.save(productosRecibidosCart)
        res.status(201).json(productoNuevo)
    
    
    }catch (error){
       res.status(500).send({error:'Error en el servidor '+error})
    }
})

router.post("/:cid/product/:pid", async(req,res)=>{
    try{
        let {cid,pid}=req.params
        //valida ids
        if (!isValidObjectId(cid) ) {
            return res.status(400).json({ error: "ID de cart inválido. Por favor ingrese un id de carrito valido." })
        }
        if(!isValidObjectId(pid)){
            return res.status(400).json({ error: "ID de producto inválido. Por favor ingrese un id de producto valido." })
        }

        //busca cid
        let carrito = await cartsModel.findById(cid)
        if(!carrito){
            return res.status(404).send("carrito con id " +cid+" no encontrado")
        }
        
        //busca si existe
        let productIndex = carrito.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            // si no existe se agrega
            await cartsModel.findByIdAndUpdate(cid, {
                $push: { products: { product: pid, quantity: 1 }}
            },{new:true,upsert: false });
        }else {
            // si ya existe +1
            await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } },
                {new:true }
            );
        }
        
        let cartActualizado = await cartsModel.findById(cid).lean()
        res.status(201).json(cartActualizado)
    }catch(error){
        res.status(500).send({error:"Error en el servidor "+error})
    }
})

router.put('/:cid', async(req,res)=>{
    try {
        let {cid} = req.params
        let aActualizar=req.body

        if (!aActualizar.products || !Array.isArray(aActualizar.products)) {
            return res.status(400).json({
                error: 'Por favor, envíe un array de productos para actualizar el carrito con id: ' + cid
            });
        }

        for (let element of aActualizar.products) {
            if (!isValidObjectId(element.product)) {
                return res.status(400).json({
                    error: "No existe un producto con id " + element.product + 
                           ". Por favor, ingrese productos con id válidos para actualizar."
                });
            }
            if (typeof element.quantity !== 'number' || element.quantity < 0) {
                return res.status(400).json({
                    error: "La cantidad debe ser un número mayor o igual a 0. " +
                           "Cantidad ingresada: " + element.quantity + 
                           " para el producto con id: " + element.product
                });
            }
        }

        let cartActualizado = await cartManager.update(cid,aActualizar)
        res.status(200).json(cartActualizado)
    } catch (error) {
        res.status(500).json({error:"Error en el servidor: "+error.message})
    }
})

router.put('/:cid/products/:pid',async(req,res)=>{
    try {
        let cantidad = req.body
        let {cid,pid}=req.params
        //validacion existencia IDs
        if(!isValidObjectId(cid)){
            return res.status(400).json({error:"Ingrese un ID para carrito válido."})
        }
        if(!isValidObjectId(pid)){
            return res.status(400).json({error:"Ingrese un ID para producto válido."})
        }

        //busca carrito en la base de datos
        let carrito = await cartsModel.findById(cid)
        if(!carrito){
            return res.status(400).json({error:"Carrito no encontrado."})
        }
        //buscar el producto en el carrito
        let productoIndex = carrito.products.findIndex(p => p.product.toString() === pid);
        if(productoIndex===-1){
            return res.status(400).json({error:"No existe un producto con id: "+pid+" en el carrito con id: "+cid+". Por favor, ingrese un producto existente."})
        }

        // actualiza quantity
        carrito.products[productoIndex].quantity = cantidad.quantity
        let carritoActualizado = await carrito.save()
        
        res.status(200).json({carritoActualizado})
    } catch (error) {
        res.status(500).json({error:"Error en el servidor: "+error.message})
    }
})

router.delete('/:cid', async(req,res)=>{
    try{
        const {cid} = req.params
        //validacion cid
        if(!isValidObjectId(cid)){
            return res.status(400).send({error:"Id no valido. Por favor, introduzca un id valido para carrito."})
        }
        let cart= await cartsModel.findById(cid).lean()
        if(!cart){
            return res.status(400).send('El carrito a eliminar con id '+cid+' no existe')
        }
        let resultado = await cartManager.delete(cid)
        console.log("resultado eliminacion: "+resultado);
        let cartEliminado = await cartManager.get()
        res.status(200).json(cartEliminado)
    }catch(error){
        res.status(500).json({error:'Error en el servidor: '+error.message})
    }
})

router.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const {cid,pid} = req.params
        //validacion IDs
        if(!isValidObjectId(cid)){
            return res.status(400).send({error:"Id no valido. Por favor, introduzca un id valido para carrito."})
        }
        if(!isValidObjectId(pid)){
            return res.status(400).send({error:"Id no valido. Por favor, introduzca un id valido para producto."})
        }

        //buscar carrito en la BD
        const carrito = await cartsModel.findById(cid);
        if (!carrito) {
            return res.status(404).send({ error: `No se encontró un carrito con ID ${cid}` });
        }

        //buscar el indice del producto en el carrito
        let productoIndex = carrito.products.findIndex(p => p.product.toString() === pid)
        if(productoIndex===-1){
            return res.status(400).json({error:"No existe un producto con id: "+pid+" en el carrito con id: "+cid+". Por favor, ingrese un producto existente."})
        }
        //elimina el producto
        carrito.products.splice(productoIndex, 1)
        const carritoActualizado = await carrito.save()
        
        res.status(200).json({carritoActualizado})
    } catch (error) {
        res.status(500).json({error:"Error en el servidor: "+error.message})
    }
})

module.exports=router