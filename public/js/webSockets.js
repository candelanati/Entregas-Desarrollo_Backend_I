document.addEventListener("DOMContentLoaded", function() {
    const socket=io()
    const listaActualizada = document.getElementById('lista-actualizada')
    const nombreListaActualizada = document.getElementById('nombre-lista')

    socket.on("connect", () => {
        console.log("Conectado al servidor WebSocket")
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

    document.getElementById("formulario").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que la página se recargue

        // Extrae los valores de cada campo usando el ID
        const product = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            code: document.getElementById("code").value,
            price: document.getElementById("price").value,
            status: document.querySelector("select").value === "true", // Convertir a booleano
            stock: document.getElementById("stock").value,
            category: document.getElementById("category").value,
            thumbnails: document.getElementById("thumbnails").value
        };

        console.log("Datos del producto:", product) // Verificar en consola

        // Enviar los datos a través de WebSocket
        
        socket.emit("nuevoProducto", product.title,product.description,product.code,product.price,product.status,product.stock,product.category,product.thumbnails)


    });

    socket.on("updateProducts", (products) => {
        console.log("Productos recibidos: ", products); 
        renderProducts(products); // Llamar a una función para renderizar los productos en el HTML
        
    });

    function renderProducts(products) {
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
    }

    socket.on("disconnect", () => {
        console.log("Desconectado del servidor WebSocket")
    })
})