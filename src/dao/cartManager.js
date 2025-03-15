const fs = require("fs")

class CartManager{
    constructor(rutaArchivo){
        this.path=rutaArchivo
    }

    async getCart(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        }else{
            return []
        }
    }

    async addCart(products){
        let cart = await this.getCart()
        let id = 1
        if (cart.length>0){
            id=Math.max(...cart.map(el=>el.id))+1
        }
        let productsCart = products.map(p=>({
            product:p.id,
            quantity:1
        }))

        console.log(productsCart)

        let newCart={
            id,
            products
        }

         cart.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(cart, null, "\t"))
        return newCart
    }
}
module.exports={
    CartManager
}