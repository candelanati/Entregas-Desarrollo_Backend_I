const {Router} = require("express")
const router = Router()

router.get("/realtimeproducts", async(req,res)=>{
    res.render('realTimeProducts')
})
router.get("/", async(req,res)=>{
    res.render('home')
})

module.exports=router