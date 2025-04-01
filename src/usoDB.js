const mongoose = require("mongoose")

const conectarDB=async(uriMongoDB, dbName)=>{
    try {
        await mongoose.connect(
            uriMongoDB,
            {
                dbName: dbName
            }
        )
        console.log("DB online!");
    } catch (error) {
        console.log('ERROR al conectar con base de datos: '+error.message);
    }
}

module.exports=conectarDB