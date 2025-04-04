const {Router} = require("express")
const productsModel = require("../dao/models/productsModel")
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

        res.render('index', {
            products: resultado.docs,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevPage: resultado.prevPage,
            nextPage: resultado.nextPage,
            page: resultado.page,
            category,  // Pasamos category a la vista
            status,    // Pasamos status a la vista
            sort       // Pasamos sort a la vista
        });
        
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor: "+ error.message });
    }
})

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await productsModel.findById(pid).lean()
    res.render('productDetail', { producto })
  })

module.exports=router