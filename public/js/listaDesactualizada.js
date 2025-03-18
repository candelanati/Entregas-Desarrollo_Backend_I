
function renderProducts(products){
        console.log("renderProducts")
        
        let listaDesactualizada=document.getElementById('lista-desactualizada')
        listaDesactualizada.innerHTML = ""

        products.forEach((product) => {
            const item = document.createElement("div")
            item.innerHTML = `
                <h4><strong>título:</strong> ${product.title}</h4>
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
            listaDesactualizada.appendChild(item)
            listaDesactualizada.appendChild(espacio)
            
        });
    
}