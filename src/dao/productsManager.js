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

        //validaciones
        if (typeof title !== "string" || !title.trim()) {
            return { error: "El título debe ser un string no vacío" };
        }
        if (typeof description !== "string" || !description.trim()) {
            return { error: "La descripción debe ser un string no vacío" };
        }
        if (typeof code !== "string" || !code.trim()) {
            return { error: "El código debe ser un string no vacío" };
        }
        if (typeof price !== "number" || price <= 0) {
            return { error: "El precio debe ser un número mayor a 0" };
        }
        if (typeof status !== "boolean") {
            return { error: "El estado debe ser un booleano (true o false)" };
        }
        if (typeof stock !== "number" || stock < 0) {
            return { error: "El stock debe ser un número mayor o igual a 0" };
        }
        if (typeof category !== "string" || !category.trim()) {
            return { error: "La categoría debe ser un string no vacío" };
        }
        if (!Array.isArray(thumbnails) || !thumbnails.every(el => typeof el === "string")) {
            return { error: "Las miniaturas deben ser un array de strings" };
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
