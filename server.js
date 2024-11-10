//importar todas las librerias
import express from "express"
import mysql2 from "mysql2"
import {z} from "zod"

//app
const app = express()
const port =1234



/// public index.html
app.use (express.static(`public`));
app.use(express.json());

// configuracionn a la base de datos
const db  = mysql2.createConnection({
    host: 'autorack.proxy.rlwy.net',
    port: 28259,
    user: "root",
    password: "owbAUNxlSnOErUNVHwYQnqlRXtuUoNrj",
    database: "railway"
});

db.connect(err => {
    if(err){
        console.error("Error al conectarse a la base de datos" + err)
        return
    }

    console.info("connetion Exitosa")
})

// // para saber si esta conectado o no
//node -watch server.js

const articulosSchema = z.object(
    {
        nombre: z.string().min(1),
        descripcion: z.string().optional(),
        precio: z.number().nonnegative(),
        cantidad: z.number().int().nonnegative,
        cateria: z.string().optional(),
        imagen: z.string().url().optional(),
})

// Rutas de las api
app.get('/articulos', (req, res) =>{
    db.query('select * from articulos',(err, result) =>{

        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result)
    })
    console.info(res )
})

app.get('/articulos/buscar', (req, res) =>{

    const {nombre, cateria} = req.query;

    let consulta = 'select * from articulos where '

    const params = []

    if (nombre) {
        consulta += `nombre="${nombre}"`
      
        
    }

    if (cateria) {
        consulta += `cateria="${cateria}" `
    }

    console.log(consulta)
    
    db.query(consulta,(err, result) =>{
console.log(consulta)
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result)
    })
})

app.get('/categorias', (req, res) =>{
    db.query(`SELECT DISTINCT categoria AS nombre FROM articulos`, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result);
    })
});



//tarea hacer que el get busque por el nombre de un articulo y que busque por categoria

// app.post()

// app.delete()

// app.put()


//Agregar productos al carrito
function agregarAlCarrito(id, nombre, precio) {

    //obtener productos del carrito de compras
    let carrito = JSON.parse(localStorage.getItem('carrito') || {} )

    // si el producto esta en el carrito sumar uno mas
    if (carrito[id]) {
        carrito[id].cantidad += 1
    }

    //De lo contrario anade producto al carrito
    carrito[id] = (ide, nombre, precio, cantidad = 1)

    //Guardar producto en el carrito
    localStorage.setItem("carrito", 
        JSON.stringify(carrito),
        alert(`${nombre} se agrego al carrito ` )
    )
}

//mostrar los productos del carrito

function verCarrito() {
    //Obtener los productos del carrito de compra
    const carrito = localStorage.getItem('carrito') || {}

    const productosCarrito = document.getElementById("productoContainer")
    productosCarrito.innerHTML = `
    <h3> Carrito de compras </h3>
    `
}

// Limpiar el carrito

function vaciarCarrito() {
    localStorage.removeItem("carrito"),
    alert("Carrito vacio"),
    verCarrito()
}

app.listen(port, () => {
    console.info('Servidor corriendo por el hhttp:localhost' + port)
})