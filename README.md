# ENUNCIADOS - entregas 1, 2 y entrga final

Este documento contiene los enunciados de las entregas realizadas durante el cursado de Desarrollo Avanzado Backend I de CODERHOUSE.


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

# **Entrega N° 2 - Websockets**



- Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
    - Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.

**Consigna**

- Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

Aspectos a incluir

- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
- Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento

**Sugerencias**

- Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.
- Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?

# ENTREGA FINAL

Resumen de la consigna realizado con ayuda de IA.

## 1. Modificar el método GET de products (/api/products) con:

### Filtros, paginación, ordenamiento:

- limit (default: 10)
- page (default: 1)
- query (filtro por categoría/disponibilidad, default: sin filtro)
- sort (asc/desc por precio, default: sin ordenar si no se recibe el parámetro)

***respuesta estructurada:***

```jsx
{
	status: "success/error"
	payload: [productos] //Resultado de los productos solicitados
	totalPages: Number //Total de páginas
	prevPage: Number/null //Página anterior
	nextPage: Number/null //Página siguiente
	page: Number //Página actual
	hasPrevPage: Boolean //Indicador para saber si la página previa existe
	hasNextPage: Boolean //Indicador para saber si la página siguiente existe.
	prevLink: String/null //Link directo a la página previa (null si hasPrevPage=false)
	nextLink: String/null //Link directo a la página siguiente (null si hasNextPage=false)
}
```

Búsquedas:

- Por categoría o disponibilidad.
- Ordenamiento por precio (asc/desc)

---

## 2. Nuevos endpoints para carritos (/api/carts):

- **DELETE** `/api/carts/:cid****/products/:pid`:  Eliminar un producto especifico del carrito.
- **PUT** `/api/carts/:cid`: Actualizar el carrito con un arreglo completo de productos (body).
- **PUT** `/api/carts/:cid****/products/:pid`:  Actualizar solo la cantidad de un producto (body:`{”quantity”: Number}`)
- **DELETE** `/api/carts/:cid`: Vaciar el carrito (eliminar todos los productos).

***Modificar el modelo de carts:***

- Usar referencia a Products en el array `products`
- Modificar la ruta `/********:cid` para que al traer los productos, se usen ***populate*** para mostrar la información correcta.

---

## 3. Modificaciones en las vistas (Handlebars):

***Vista index.handlebars (***`/products`***):***

- Mostrar productos con ***paginación*** (botones anterior/siguiente, pagina actual, etc.)
- Cada producto debe tener **dos opciones:**
    1.  Enlace a una vista detallada (`/products/:pid`) con:
        - Descripción completa, precio, categoría, etc.
        - Botón “Agregar al carrito”.
    2. Botón “Agregar al carrito” directamente en la lista de productos.

***Nueva vista cart.handlebars (***`/carts/:cid****`***):***

- Listar solo los productos que pertenecen al carrito especifico.
- Mostrar nombre, cantidad, precio y subtotal de cada producto.

---

## 4. Requisitos técnicos:

- Usar MongoDB como persistencia principal.
- Mantener la lógica de negocio existente (solo cambiar la persistencia).
- Los nuevos endpoints deben seguir la misma estructura y convenciones ya usadas.
- No incluir node_modules en el repositorio.
- Usar populate en los carritos para traer los productos completos.
- Formato de entrega:
    - Subir el proyecto a GitHub
    - Incluir video explicativo sobre la implementación.
- Sugerencia: Agregar comentarios en el código para explicar los cambios
