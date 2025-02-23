# ENUNCIADO - entrega 1

# **Entrega N° 1**

## **Descripción General**

Desarrollar un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra para tu API.

## **Requisitos de la Primera Entrega**

### **Desarrollo del Servidor**

El servidor debe estar basado en Node.js y Express, y debe escuchar en el puerto

`8080`

. Se deben disponer dos grupos de rutas:

`/products`

y

`/carts`

. Estos endpoints estarán implementados con el router de Express, con las siguientes especificaciones:

### **Rutas para Manejo de Productos (`/api/products/`)**

- **GET** :
    
    **`/`**
    
    - Debe listar todos los productos de la base de datos.
- **GET** :
    
    **`/:pid`**
    
    - Debe traer solo el producto con el  proporcionado.
        
        `id`
        
- **POST** :
    
    **`/`**
    
    - Debe agregar un nuevo producto con los siguientes campos:
        - `id`: Number/String (No se manda desde el body, se autogenera para asegurar que nunca se repitan los ids).
            
            
        - `title`: String
            
            
        - `description`: String
            
            
        - `code`: String
            
            
        - `price`: Number
            
            
        - `status`: Boolean
            
            
        - `stock`: Number
            
            
        - `category`: String
            
            
        - `thumbnails`: Array de Strings (rutas donde están almacenadas las imágenes del producto).
            
            
- **PUT** :
    
    **`/:pid`**
    
    - Debe actualizar un producto por los campos enviados desde el body. **No se debe actualizar ni eliminar el** al momento de hacer la actualización.
        
        **`id`**
        
- **DELETE** :
    
    **`/:pid`**
    
    - Debe eliminar el producto con el  indicado.
        
        `pid`
        

### **Rutas para Manejo de Carritos (`/api/carts/`)**

- **POST** :
    
    **`/`**
    
    - Debe crear un nuevo carrito con la siguiente estructura:
        - : Number/String (Autogenerado para asegurar que nunca se dupliquen los ids).
            
            `id`
            
        - : Array que contendrá objetos que representen cada producto.
            
            `products`
            
- **GET** :
    
    **`/:cid`**
    
    - Debe listar los productos que pertenecen al carrito con el  proporcionado.
        
        `cid`
        
- **POST** :
    
    **`/:cid/product/:pid`**
    
    - Debe agregar el producto al arreglo  del carrito seleccionado, utilizando el siguiente formato:
        
        `products`
        
        - : Solo debe contener el ID del producto.
            
            `product`
            
        - : Debe contener el número de ejemplares de dicho producto (se agregará de uno en uno).
            
            `quantity`
            
    - Si un producto ya existente intenta agregarse, se debe incrementar el campo  de dicho producto.
        
        `quantity`
        

### **Persistencia de la Información**

- La persistencia se implementará utilizando el sistema de archivos, donde los archivos  y  respaldarán la información.
    
    `products.json`
    
    `carts.json`
    
- Se debe utilizar el  desarrollado en el desafío anterior y crear un  para gestionar el almacenamiento de estos archivos JSON.
    
    `ProductManager`
    
    `CartManager`
    
- **Nota**: No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.

## **Formato del Entregable**

- Proporcionar un enlace al repositorio de GitHub con el proyecto completo, **sin** la carpeta .
    
    `node_modules`
