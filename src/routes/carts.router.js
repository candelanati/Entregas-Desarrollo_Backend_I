const {Router} = require("express")
const {CartManager}=require("../dao/cartManagerMongo.js")
const cartManager = new CartManager()
const { ProductsManager }=require("../dao/productsManager.js")
const cartsModel = require("../dao/models/cartsModel.js")
const productManager = new ProductsManager("./src/data/products.json")
const {isValidObjectId} = require('mongoose')
const router = Router()


//chequear
router.get("/:cid",async(req,res)=>{
    let {cid}=req.params
    let cart = await cartsModel.findById(cid).lean()
    //validacion
    if(!cart){
        return res.status(404).send({error:'no existen carritos con id: '+cid})
    }
    res.status(200).json(cart)
})
//ARREGLAR
router.post("/",  async(req,res)=>{
    try{ 
        let {products}=req.body
        //caso en el que no se envie nada por body
        if(!products){
            products=[]
        }
        console.log(products)
        let productosRecibidosCart=products
        let productsExistentes= await productManager.getProducts()
        console.log('\n productos recibidos:')
        console.log(productosRecibidosCart)
        console.log('\n productos existentes:')
        console.log(productsExistentes)
        //validaciones
            
            //existencias
            let productoNoExistente = productosRecibidosCart.find(recibido => {
                return !productsExistentes.some(existente => 
                    existente.id == recibido.id &&
                    existente.title == recibido.title &&
                    existente.description == recibido.description &&
                    existente.code == recibido.code &&
                    existente.price == recibido.price &&
                    existente.status == recibido.status &&
                    existente.stock == recibido.stock &&
                    existente.category == recibido.category &&
                    JSON.stringify(existente.thumbnails) === JSON.stringify(recibido.thumbnails)
                );
            });
            if (productoNoExistente) {
                return res.status(404).send({
                    error: `El producto: ${productoNoExistente.title} no existe en la lista de productos existentes o no coincide con sus datos`
                });
            }
    
        let productoNuevo = await cartManager.addCart(productosRecibidosCart)
        res.status(201).json(productoNuevo)
    
    
    }catch (error){
       res.status(500).send({error:'Error en el servidor '+error})
    }
})

//chequear
router.post("/:cid/product/:pid", async(req,res)=>{
    try{
        let {cid,pid}=req.params
        //busca cid
        let carrito = await cartsModel.findById(cid)
        if(!carrito){
            return res.status(404).send("carrito con id " +cid+" no encontrado")
        }
        
        // Buscar si el producto ya está en el carrito
        let productIndex = carrito.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            // Si el producto no existe, lo agregamos con cantidad 1
            await cartsModel.findByIdAndUpdate(cid, {
                $push: { products: { product: pid, quantity: 1 }}
            },{new:true,upsert: false });
        }else {
            // Si el producto ya existe, incrementamos la cantidad en 1
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
        let position = await cartsModel.findById(cid)
        //validacion existencia cart con cid
        if(!position){
            return res.status(400).json({error:'no existen carritos con id: '+cid})
        }
        //para actualizar:
            //chequea que se hayan enviado productos
            if(!aActualizar.products || !Array.isArray(aActualizar.products)){
                return res.status(400).json({error:'Por favor, envie un Array de productos para actualizar el carrito con id: '+cid})
            }
            //chequea id validos
            for(let element of aActualizar.products){
                if(!isValidObjectId(element.product)){
                    return res.status(400).json({error:"No existe un producto con id "+element.product+". Por favor, ingrese productos con id validos para actualizar."})
                }
                if(typeof element.quantity !=='number'||element.quantity<0){
                    return res.status(400).json({error:"La cantidad debe ser un numero mayor o igual a 0. Cantidad ingresada: "+element.quantity+" para el producto con id: "+element.product})
                }
            }
        let cartActualizado = await cartManager.update(cid,aActualizar)
        res.status(200).json(cartActualizado)
    } catch (error) {
        res.status(500).json({error:"Error en el servidor: "+error.message})
    }
})

module.exports=router