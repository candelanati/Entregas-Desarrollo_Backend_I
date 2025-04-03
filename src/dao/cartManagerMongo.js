class CartManager{

    async get(){
            if(!productsModel){
                console.log("modelo de productos no definido");
                return []
            }
            let productos =  (await productsModel.find().lean()) // .lean() para deshidratar
            console.log("productos"+productos);
            return productos
        }

    async save(products){
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

    async update(cartEncontrado){
        let carts = await this.getCart()
        let position = carts.findIndex(cart=>cart.id===cartEncontrado.id)
        if(position!==-1){
            carts[position]=cartEncontrado
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
        return carts[position]
    }

}
module.exports={
    CartManager
}