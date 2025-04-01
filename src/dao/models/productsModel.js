const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema(
    {
        // caracteristicas del producto
        title:String,
        description:String,
        code:{
            type:String,
            required:true, 
            unique:true
        },
        price:Number,
        stock:{
            type:Number,
            default:0
        },
        category:String,
        thumbnails:{
            type:[String],
            default:[]
        }
    },
    {
        timestamps:true
    }
)

module.exports= mongoose.model(
    'productos',
    productsSchema
)