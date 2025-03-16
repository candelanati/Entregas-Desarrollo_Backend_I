const {Router} = require("express")
const {CartManager}=require("../dao/cartManager.js")
const cartManager = new CartManager("./src/data/cart.json")
const { ProductsManager }=require("../dao/productsManager.js")
const productManager = new ProductsManager("./src/data/products.json")

const router = Router()

router.get("/", async(req,res)=>{
	let carts=await cartManager.getCart()
    //limit
    let {limit}=req.query
    if(limit){
        limit=Number(limit)
        if(isNaN(limit)){
            return res.send("Error: ingrese un limit numérico")
        }
        carts=carts.slice(0, limit)
    }
	res.status(200).json(carts)
})

router.get("/:cid",async(req,res)=>{
    let carts=await cartManager.getCart()
    let {cid}=req.params
    let cart=carts.find(c=>c.id==cid)
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

router.post("/:cid/product/:pid", async(req,res)=>{
    try{
        let {cid,pid}=req.params
        let carts = await cartManager.getCart()
        let cartEncontrado=carts.find(c=>c.id==cid)
        if(!cartEncontrado){
            res.status(404).send("carrito con id " +cid+" no encontrado")
        }
        let productEncontrado=cartEncontrado.products.find(p=>p.product==pid)
        console.log(productEncontrado)
        if(!productEncontrado){
            cartEncontrado.products.push({product:Number(pid),quantity:1})
        }else{
            productEncontrado.quantity+=1
        }
        
        let cartActualizado = await cartManager.updateCart(cartEncontrado)
        res.status(201).json(cartActualizado)
    }catch(error){
        res.status(500).send({error:"Error en el servidor "+error})
    }
})

module.exports=router