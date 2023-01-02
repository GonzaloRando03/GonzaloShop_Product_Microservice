const Product = require("../models/product")

//función para conseguir los productos
const getProducts = async (root, args) => {
    //cantidad es igual a la pasada por argumento o en su defecto a todos los documentos.
    const amount = args.amount? args.amount: Product.collection.countDocuments()
    
    if (args.search){
        const products = await Product.aggregate([
            {
              $match : { 
                    $or: [
                        {"name": { $regex: args.search, $options: 'i' }},
                        {"category": { $regex: args.search, $options: 'i' }},
                        {"type": { $regex: args.search, $options: 'i' }},
                    ]
                  
                }
            }
        ]).limit(amount)
        return products

    }else{
        const products = await Product.find().limit(amount)
        return products
    }
}

//función para conseguir un único producto
const getProductOne = async (root, args) => {
    if (!args.id){
        return {
            error: "Producto no encontrado"
        }
    }
    const product = await Product.findById(args.id)
    return product
}


module.exports = {getProducts, getProductOne}