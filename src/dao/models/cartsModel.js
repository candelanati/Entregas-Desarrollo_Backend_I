const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,  // Referencia a un producto
                    ref: 'productos',  // Nombre de la colección de productos
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1  // Evitar cantidades menores a 1
                }
            }
        ]
    },
    {
        timestamps:true
    }
)

module.exports= mongoose.model(
    'carritos',
    productsSchema
)