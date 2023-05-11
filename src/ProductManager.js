//const { error } = require("console");
//const fs = require("fs")

import  fs  from "fs";



class ProducManager{
    products;
    constructor(file){
        this.products = file
    }

    async getNewId(){
        let productosId = await this.getProducts()
        if (productosId.length == 0){
            return 1
        } else{
          return productosId[productosId.length - 1].id + 1 
        }
    }

    async addProduct(nuevoProducto){
        try{
            nuevoProducto.id = await this.getNewId()
            let productos = await this.getProducts()            
            let validateCode = productos.find(elem => elem.code === nuevoProducto.code)//Busca el producto igual según código
            if(validateCode){
                console.log("This code already exists")                
            } else{
                productos.push(nuevoProducto)
            }     
            await fs.promises.writeFile(this.products, JSON.stringify(productos))
        } catch(error){
            console.log("Hubo un error:", error)

        }

               
    }

    async getProducts(){
        try{
            let productos = await fs.promises.readFile(this.products, "utf-8")
            let objProduct = JSON.parse(productos)
            //typeof console.log(objProduct)
          return objProduct
        } catch(error){
            console.log("Hubo un error:", error)
        }    
    }

    async getProdctById(id){
        try{            
            let array =  await this.getProducts();
            if(!array.find(busq => busq.id == id)){
                return "Producto no existe"
            } else{
                return array.find(busq => busq.id == id)
            }           
            } catch(error){
                console.log("Hubo un error:", error)
            }       
        
    }

    
    async updateProduct(id, actualizar){
        try{
            let array = await this.getProducts()
            let product = array.find(products => products.id === id);
            const newProduct = { ...product, ...actualizar }
            //console.log(newProduct)
            let cambiar = array.findIndex(ele => ele.id === id)
            //console.log(cambiar)
            //console.log(array[cambiar] )
            array[cambiar] = newProduct
            await fs.promises.writeFile(this.products, JSON.stringify(array))
        } catch(error){
            console.log("Hubo un error:", error)
        } 

    }

    async deleteProduct(id){
        try{
            let array =  await this.getProducts()
            let eliminar = array.findIndex(ele => ele.id === id)
            if(eliminar == -1){
                throw new Error("This Id not exist")
                //console.log("This product not exist")
            } else{array.splice(eliminar,1)}           

            await fs.promises.writeFile(this.products, JSON.stringify(array))
        } catch(error){
            console.log("Hubo un error:", error)
        }
        
    } 


    
}

const manager = new ProducManager("./products.json")

const main = async () =>{

    let product1 = {
        title : "Maca",
        descripction : "Maca Gelatinizada", 
        price : 70,
        thumbnail : "image",
        code : 12,
        stock : 20
    }

    let product2 = {
        title : "Malta",
        descripction : "Malta Atomizada", 
        price : 50,
        thumbnail : "image",
        code : 13,
        stock : 10
    }

    let product3 = {
        title : "Algas",
        descripction : "Extracto de Algas", 
        price : 69,
        thumbnail : "image",
        code : 14,
        stock : 15
    }

    let actualizar = {
        title : "Uña de gato",
        descripction : "Uña de gato Atomizada", 
        price : 79,
        thumbnail : "image",
        code : 15,
        stock : 20
    }

    //await manager.addProduct(product1)
    //await manager.addProduct(product2)
    //await manager.addProduct(product3)   
   //console.log (await manager.getProducts())
    //console.log(await manager.getProdctById(1))
    //await manager.updateProduct(2,actualizar)
    //await manager.deleteProduct(3)
    //console.log(await manager.getProducts())
}

main()


export default ProducManager
 