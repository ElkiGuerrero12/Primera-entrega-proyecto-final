import express from 'express';
//const express = require('express');
import CartManager from "../CartManager.js"
//const CartManager = require("../CartManager");
const cartManager = new CartManager('./carts.json');
const cartRouter = express.Router();



// cartRouter.post("/", async (req, res) => {
//     try {
//         const product = await cartManager.createCart();

//         return res.status(201).json({ mesage: "complete cart creation" });
//     } catch (error) {
//         if (error.message === "error, reading or writting file") {
//             res.status(409).json({ message: "cant create cart" })
//         }
//         else {
//             console.log(error);
//             res.status(500).json({ message: 'error desconocido' })
//         }
//     }
// });

    cartRouter.post("/", async (req, res,) =>
{
    try {
        const data = await cartManager.getCarts()
        let newProduct = req.body;
        let findCode = (data.find((ele) => ele.id === newProduct.id))
        if (findCode) {
            return res.status(400).json({
                status: "Error",
                msg: "Error. A product with the same code you are trying to save already exists. Please try again"
            })
        }
        
        else if(!findCode){
            await data.addProductToCart({ ...newProduct, status: true })
            return res.status(201).json({
                status: "Success",
                msg: "product saved",
                data: newProduct
            })
        }        
         else {
            return res.status(409).json({
                status: "Error",
                msg: "An error occurred while trying to save the product. Check that all required fields are filled out and you are not manually giving an id"
            })
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Invalid input' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})


cartRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const carts = await cartManager.getCarts();
        if (limit) {
            res.status(200).json(carts.slice(0, limit));
        } else {
            res.status(200).json(carts);
        }
    } catch (error) {
        res.status(500).json({ message: 'error' })
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid
        const pId = req.params.pid
        await cartManager.addProductToCart(cId, pId);
        return res.status(201).json({ message: "product added to cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            res.status(500).json({ message: "unknown error" });
        }
    }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid
        const pId = req.params.pid
        await cartManager.removeProductFromCart(cId, pId);
        return res.status(201).json({ message: "product removed from cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            res.status(500).json({ message: "unknown error" });
        }
    }
});

export default cartRouter
