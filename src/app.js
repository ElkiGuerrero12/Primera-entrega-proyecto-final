import express from 'express';
import ProductManager from '../src/ProductManager.js'
//const ProductManager = require("../src/ProductManager");
const productManager = new ProductManager('./products.json');
//const productsRouter = require("../src/routes/products_router.js");
//import productManger from './ProductManager('./products.json')'
import productsRouter from './routes/products_router.js';
import cartRouter from '../src/routes/cart_router.js';


const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.listen(PORT, () => console.log(`Server on! Listening on localhost:${PORT}`))

app.get("/", (req, res, next) =>{
    res.status(200).json({message:"Yes, server's up and running"})
})
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)

app.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})



// app.get('/products', async (req, res) =>{
//     const limit = req.query.limit;    
//     const products = await productManager.getProducts();    
//     if(limit){
//         res.json(products.slice(0, limit));
//     }else{ res.json(products)};
// } )

// app.get('/products/:id', async (req, res)=>{
//     const id = req.params.id;
//     console.log(id)
//     const product = await productManager.getProdctById(id);
//     if(product){
//         res.json(product)
//     } else{ res.json({error: 'Producto not found'})};
// })