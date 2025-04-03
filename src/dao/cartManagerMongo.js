const cartsModel = require("./models/cartsModel");

class CartManager{
    async get(){
        if(!productsModel){
            console.log("modelo de productos no definido");
            return []
        }
        let productos =  (await productsModel.find().lean()) // .lean() para deshidratar
        console.log("productos"+productos);
        return productos
    }

    async save(products){
        let nuevoCart = await cartsModel.create({products})
        cart.push(nuevoCart)
        return nuevoCart
    }

    async update(id,productsModificados){
        let position = await cartsModel.findById(id)
        //validacion existencia
        if(!position){
            return res.status(400).json({error: "no existe un carrito con id: "+id+". Por favor ingrese un id de carrito valido para actualizar."})
        }
        let productoActualizado = await cartsModel.findByIdAndUpdate(id,{products:productsModificados.products}, {new:true})
        return productoActualizado
    }
}
module.exports={
    CartManager
}