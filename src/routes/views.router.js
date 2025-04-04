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
    const { page = 1 } = req.query

    const resultado = await productsModel.paginate({}, {
      page,
      limit: 10, // 10 productos por página
      lean: true
    })
  
    res.render('index', {
      products: resultado.docs,
      hasPrevPage: resultado.hasPrevPage,
      hasNextPage: resultado.hasNextPage,
      prevPage: resultado.prevPage,
      nextPage: resultado.nextPage,
      page: resultado.page
    })
})
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const producto = await productsModel.findById(pid).lean()
    res.render('productDetail', { producto })
  })

module.exports=router