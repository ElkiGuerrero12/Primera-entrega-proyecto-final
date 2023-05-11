import express from 'express';
//const express = require('express');
import ProductManager  from "../ProductManager.js";
//const ProductManager = require("../ProductManager");
//import ProducManager from '../ProductManager.js';
const products = new ProductManager('./products.json');
const productsRouter = express.Router();



productsRouter.get("/", async (req, res, next) => {
    try {
        const data = await products.getProducts();
        const limit = req.query.limit;
        const limitedData = limit ? data.slice(0, limit) : data
        res.status(200).json(limitedData)
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Invalid input' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})

productsRouter.get("/:pid", async (req, res, next) => {
    try {
        const id = parseInt(req.params.pid);
        const filteredData = await products.getProdctById(id)
        res.status(200).json(filteredData)
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Invalid input' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})

productsRouter.post("/", async (req, res, next) => {
    try {
        const data = await products.getProducts()
        let newProduct = req.body;
        let findCode = (data.find((ele) => ele.code === newProduct.code))
        if (findCode) {
            return res.status(400).json({
                status: "Error",
                msg: "Error. A product with the same code you are trying to save already exists. Please try again"
            })
        }

        //"title":"Malta","descripction":"Malta Atomizada","price":50,"thumbnail":"image","code":13,"stock":10,"id":2
        const requiredField = ['title', 'descripction', 'price', 'thumbnail', 'image', 'code', 'stock']
        const hasAllFields = requiredField.every(prop => newProduct[prop]);
        if (newProduct.id == undefined && hasAllFields) {
            await products.addProduct({ ...newProduct, status: true })
            return res.status(201).json({
                status: "Success",
                msg: "product saved",
                data: newProduct
            })
        } else {
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

productsRouter.put("/:pid", async (req, res, next) => {
    try {
        const id = req.params.pid
        const data = await products.getAll()
        let updatedProduct = req.body;
        await products.updatedProduct(id, updatedProduct);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Invalid input' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})

productsRouter.delete("/:pid", async (req, res, next) => {
    try {
        const data = await products.getProducts();
        const id = req.params.pid;
        await products.deleteProduct(id)
        return res.status(204).json()
    } catch {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Invalid input' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})



productsRouter.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})

export default productsRouter
//module.exports = productsRouter