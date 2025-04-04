const {Router} = require("express")
const productsModel = require("../dao/models/productsModel")
const { isValidObjectId } = require("mongoose")
const cartsModel = require("../dao/models/cartsModel")
const router = Router()

router.get("/realtimeproducts", async(req,res)=>{
    res.render('realTimeProducts')
})

router.get("/", async(req,res)=>{
    res.render('home')
})

router.get('/products',async(req,res)=>{
    try {
        const { page = 1, category, status, sort } = req.query;

        let filter = {};

        //categoria
        if (category) {
            filter.category = category
        }

        //disponibilidad
        if (status) {
            filter.status = status === "true"
        }

        //precio
        let sortOption = {};
        if (sort) {
            sortOption.price = sort === "asc" ? 1 : -1
        }

        // paginación, filtros y ordenamiento
        const resultado = await productsModel.paginate(filter, {
            page,
            limit: 10, 
            sort: sortOption,
            lean: true
        });

        const defaultCartId = "67eef5807fa2ca2bef6c9114";

        res.render('index', {
            products: resultado.docs,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevPage: resultado.prevPage,
            nextPage: resultado.nextPage,
            page: resultado.page,
            category,  // Pasamos category a la vista
            status,    // Pasamos status a la vista
            sort,       // Pasamos sort a la vista
            defaultCartId //id de carrito default para post de productos desde la vista /products
        });
        
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: "+ error.message });
    }
})

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    // Validación del ObjectId
    if (!isValidObjectId(pid)) {
      return res.status(400).send('ID de producto inválido');
    }
  
    try {
        const producto = await productsModel.findById(pid).lean();
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        
        // También pasamos el carrito por defecto (su ID) para usarlo en botones de "Agregar al carrito"
        const defaultCartId = "67eef5807fa2ca2bef6c9114";


        res.render('productDetail', { producto,  defaultCartId});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
})

router.get('/carts/:cid',async(req,res)=>{
    const { cid } = req.params

    if (!isValidObjectId(cid)) {
        return res.status(400).send('ID de carrito inválido')
    }

    try {
        const cart = await cartsModel.findById(cid).populate("products.product").lean()
        if (!cart) {
            return res.status(404).send("Carrito no encontrado")
        }

        // También pasamos el carrito por defecto (su ID) para usarlo en botones de "Agregar al carrito"
        const defaultCartId = "67eef5807fa2ca2bef6c9114";

        res.render("cart", {
            cart,
            defaultCartId
        });
    } catch (error) {
        console.error(error)
        res.status(500).send("Error en el servidor"+error.message)
    }
})
module.exports=router