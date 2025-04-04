const cartsModel = require("./models/cartsModel");

class CartManager{
    async get(){
        if(!cartsModel){
            console.log("modelo de carritos no definido");
            return []
        }
        let carritos =  (await cartsModel.find().lean()) // .lean() para deshidratar
        console.log("carritos"+carritos);
        return carritos
    }

    async save(products){
        let nuevoCart = await cartsModel.create({products})
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

    async delete(id){
        console.log("eliminando producto con id "+id);
        return await cartsModel.findByIdAndDelete(id).lean()
    }
}
module.exports={
    CartManager
}