const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema(
    {
        // caracteristicas del producto
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        code:{
            type:String,
            required:true, 
            unique:true //unico code por producto
        },
        price:{
            type:Number,
            required:true,
            min:0 //el precio no puede ser un numero negativo
        },
        status:{
            type:Boolean,
            required:true,
            default:true //por defecto activos
        },
        stock:{
            type:Number,
            default:0,
            required:true
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