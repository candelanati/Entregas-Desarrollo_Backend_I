function validacionesPost(productosExistentes, productoRecibido){
    productoRecibido.thumbnails = productoRecibido.thumbnails.replace(/\s+/g, '').split(',') //elimina los espacios y convierte los strings en un array de strings
    
//pre-existencias
    if(productosExistentes.some(existente => 
        existente.title == productoRecibido.title &&
        existente.description == productoRecibido.description &&
        existente.code == productoRecibido.code &&
        existente.price == productoRecibido.price &&
        existente.status == productoRecibido.status &&
        existente.stock == productoRecibido.stock &&
        existente.category == productoRecibido.category &&
        JSON.stringify(existente.thumbnails) === JSON.stringify(productoRecibido.thumbnails)
    )){
        // return res.status(400).send('el producto ya existe en la lista de productos')
        return 'el producto ya existe en la lista de productos'
    }else{
        //pre existencia del código
        if(productosExistentes.some(existente =>existente.code == productoRecibido.code)){
            // return res.status(400).send({error:'ya existe un producto con el código: '+productoRecibido.code})
            return 'ya existe un producto con el código: ' + productoRecibido.code
        }
    }
    //completar keys
if (!productoRecibido.title) {
    const errorText = "complete title";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.description) {
    const errorText = "complete description";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.code) {
    const errorText = "complete code";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.price) {
    const errorText = "complete price";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.status) {
    const errorText = "complete status";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.stock) {
    const errorText = "complete stock";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.category) {
    const errorText = "complete category";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}
if (!productoRecibido.thumbnails) {
    const errorText = "complete thumbnails";
    return errorText
    // res.setHeader('Content-Type', 'application/json');
    // return res.status(400).send({ error: errorText });
}

// Tipos
if (typeof productoRecibido.title !== "string" || !productoRecibido.title.trim()) {
    const errorText = "El título debe ser un string no vacío";
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof productoRecibido.description !== "string" || !productoRecibido.description.trim()) {
    const errorText = "La descripción debe ser un string no vacío";
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof Number(productoRecibido.code) !== "number" || isNaN(productoRecibido.code) || productoRecibido.code <= 0) {
    const errorText = "El código debe ser un número mayor a 0"
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof Number(productoRecibido.price) !== "number" || isNaN(productoRecibido.price) || productoRecibido.price < 0) {
    const errorText = "El precio debe ser un número mayor o igual a 0"
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof productoRecibido.status !== "boolean") {
    const errorText = "El estado debe ser un booleano (true o false)"
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof Number(productoRecibido.stock) !== "number" || isNaN(productoRecibido.stock) || productoRecibido.stock < 0) {
    const errorText = "El stock debe ser un número mayor o igual a 0"
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (typeof productoRecibido.category !== "string" || !productoRecibido.category.trim()) {
    const errorText = "La categoría debe ser un string no vacío"
    // return res.status(400).send({ error: errorText });
    return errorText
}
if (!Array.isArray(productoRecibido.thumbnails)) {
    const errorText = `Las thumbnails deben ser un array de strings (ejemplo: ["ruta","ruta"])`+' tipo: ' +typeof(productoRecibido.thumbnails)
    // return res.status(400).send({ error: errorText });
    return errorText
} else {
     if (productoRecibido.thumbnails && !productoRecibido.thumbnails.every(el => typeof el === "string")) {
         const errorText = `Las thumbnails deben ser un array de strings (ejemplo: ["ruta","ruta"])`
         // return res.status(400).send({ error: errorText });
         return errorText
     }
}
    return ''
}

module.exports={
    validacionesPost
}