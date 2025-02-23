const fs = require("fs")

class ProductsManager{
    constructor(rutaArchivo){
        this.path=rutaArchivo
    }

    async getProducts(){
        console.log(this.path)
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        }else{
            return []
        }
    }

    async addProduct(title,description,code,price,status,stock,category,thumbnails){
        let products = await this.getProducts()
        let id = 1
        if (products.length>0){
            id=Math.max(...products.map(el=>el.id))+1
        }
        

        let newProduct={
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }

        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        return newProduct
    }

}

module.exports={
    ProductsManager
}
