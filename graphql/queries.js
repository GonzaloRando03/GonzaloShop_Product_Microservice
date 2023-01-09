const Product = require("../models/product")
const {formatDocumentOne, formatDocuments} = require("../utils/formatter")


//función para conseguir los productos
const getProducts = async (root, args) => {
    //cantidad es igual a la pasada por argumento o en su defecto a todos los documentos.
    const amount = args.amount? args.amount: await Product.collection.countDocuments()
    if (args.search){
        const products = await Product.find(
            {
                $or: [
                    {"name": { $regex: args.search, $options: 'i' }},
                    {"category": { $regex: args.search, $options: 'i' }},
                    {"type": { $regex: args.search, $options: 'i' }},
                ]
            }
        ).limit(amount)

        if(products.length === 0){
            return [{
                error: "Productos no encontrados"
            }]
        }
        return formatDocuments(products)

    }else{
        const products = await Product.find().limit(amount)
        return formatDocuments(products)
    }
}


//función para conseguir un único producto
const getProductOne = async (root, args) => {
    if (!args.name){
        return {
            error: "Producto no encontrado"
        }
    }

    const product = await Product.findOne({name: {$eq: args.name}})

    if(!product){
        return {
            error: "Producto no encontrado"
        }
    }
    return formatDocumentOne(product)
}


//función para añadir una valoración
const addValoration = async (root, args, context) => {
    if (!args.name | !args.username | !args.stars){
        return {
            error: "Producto no encontrado"
        }
    } 
    const newValoration = {
        username: args.username,
        text: args.text? args.text: "",
        stars: args.stars
    }

    await Product.updateOne({name: {$eq: args.name}}, {$push: {valorations: newValoration}})
    const document = await Product.findOne({name: {$eq: args.name}})

    if(!document){
        return {
            error: "Producto no encontrado"
        }
    }
    return formatDocumentOne(document)
    
}


module.exports = {getProducts, getProductOne, addValoration}