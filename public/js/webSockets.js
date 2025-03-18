const socket=io()
const listaActualizada = document.getElementById('lista-actualizada')
const nombreListaActualizada = document.getElementById('nombre-lista')

socket.on("connect", () => {
    console.log("Conectado al servidor WebSocket");
});


socket.on("ProductosGet", products=>{
    console.log(products)
    
    listaActualizada.innerHTML = ""
    nombreListaActualizada.innerHTML=""
    nombreListaActualizada.innerHTML=`Lista actualizada: `
    products.forEach((product) => {
        const item = document.createElement("div")
        item.innerHTML = `
            <h2><strong>título:</strong> ${product.title}</h2>
            <p><strong>descripción:</strong> ${product.description}</p>
            <p><strong>precio:</strong> ${product.price}</p>
            <p><strong>categoría:</strong> ${product.category}</p>
            <p><strong>código:</strong> ${product.code}</p>
            <p><strong>id:</strong> ${product.id}</p>
            <p><strong>status:</strong> ${product.status}</p>
            <p><strong>stock:</strong> ${product.stock}</p>
            <p><strong>thumbnails:</strong> ${product.thumbnails}</p>
        `
        const espacio = document.createElement("hr")
        listaActualizada.appendChild(item)
        listaActualizada.appendChild(espacio)
        
    });
})

socket.on("Product", product=>{
    console.log(product)
    listaActualizada.innerHTML = ""
    nombreListaActualizada.innerHTML=""
    nombreListaActualizada.innerHTML=`producto con id ${product.id}`
        const item = document.createElement("div")
        item.innerHTML = `
            <h2><strong>título:</strong> ${product.title}</h2>
            <p><strong>descripción:</strong> ${product.description}</p>
            <p><strong>precio:</strong> ${product.price}</p>
            <p><strong>categoría:</strong> ${product.category}</p>
            <p><strong>código:</strong> ${product.code}</p>
            <p><strong>id:</strong> ${product.id}</p>
            <p><strong>status:</strong> ${product.status}</p>
            <p><strong>stock:</strong> ${product.stock}</p>
            <p><strong>thumbnails:</strong> ${product.thumbnails}</p>
        `
        const espacio = document.createElement("hr")
        listaActualizada.appendChild(item)
        listaActualizada.appendChild(espacio)
        
})



socket.on("disconnect", () => {
    console.log("Desconectado del servidor WebSocket");
});