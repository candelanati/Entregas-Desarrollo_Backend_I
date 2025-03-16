const fs = require("fs")

class ProductsManager{
    constructor(rutaArchivo){
        this.path=rutaArchivo
    }

    async getProducts(){
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
        console.log("Archivo actualizado correctamente.")
        return newProduct
    }

    async updateProduct(pid,updatedData){
        let products = await this.getProducts()
        let position = products.findIndex(product=>product.id===Number(pid))
        let productToUpdate = products[position]
        Object.keys(updatedData).forEach(key=>{
            if(key!=='id'){
                productToUpdate[key]=updatedData[key]
            }
        })
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        console.log("Archivo actualizado correctamente.")
        return productToUpdate
    }

    async deleteProduct(pid){
        let products = await this.getProducts()
        products = products.filter(product => product.id!==Number(pid))
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        console.log("Archivo actualizado correctamente.")
        return products
    }
}

module.exports={
    ProductsManager
}
