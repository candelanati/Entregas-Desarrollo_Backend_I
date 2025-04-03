const procesaErrores = (error,res)=>{
    console.log(error)
    res.setHeader('Content-Type','application/json')
    return res.status(500).json(
        {
            error:'Error inesperado en el servidor',
            detalle:error.message //solo por motivos didacticos, no se enviaria esta info en un caso real
        }
    )
}
module.exports=procesaErrores