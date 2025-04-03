// const fs = require("fs")
const productsModel = require('./models/productsModel')

class ProductsManagerMongo{
    
    async get(){
        if(!productsModel){
            console.log("modelo de productos no definido");
            return []
        }
        let productos =  (await productsModel.find().lean()) // .lean() para deshidratar
        // console.log("productos desde get en productsManagerMongo: ")
        // console.log(productos);
        return productos
    }

    async save(producto){
        let nuevoProducto = await productsModel.create(producto)
        return nuevoProducto.toJSON() //deshidratacion del producto creado
    }

    async update(id, aModificar){
        return await productsModel.findByIdAndUpdate(id,aModificar,{new:true, runValidators:true }).lean() //new:true para que devuelva el documento una vez modificado y no antes.
    }
    

    async delete(id){
        return await productsModel.findByIdAndDelete(id).lean()
    }
}
module.exports={
    ProductsManagerMongo
}
