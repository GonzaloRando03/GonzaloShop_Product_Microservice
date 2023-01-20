const Product = require("../models/product")
const {formatDocumentOne, formatDocuments} = require("../utils/formatter")

//función para conseguir un único producto
const getProductOne = async (root, args) => {
    if (!args.ident){
        return {
            error: "Producto no encontrado"
        }
    }

    const product = await Product.findById(args.ident)
    return formatDocumentOne(product)
}


//función para añadir una valoración
const addValoration = async (root, args, context) => {
    if (!args.ident | !args.username | !args.stars){
        return {
            error: "Producto no encontrado"
        }
    } 
    const newValoration = {
        username: args.username,
        text: args.text? args.text: "",
        stars: args.stars
    }

    await Product.updateOne({_id: {$eq: args.ident}}, {$push: {valorations: newValoration}})
    const document = await Product.findOne({_id: {$eq: args.ident}})
    return formatDocumentOne(document)
}


//función para conseguir los productos
const getProducts = async (root, args) => {
    //cantidad es igual a la pasada por argumento o en su defecto a todos los documentos.
    const amount = args.amount? args.amount: await Product.collection.countDocuments()
    const maxPrice = args.price? args.price[0]: 1000000
    const minPrice = args.price? args.price[1]: 0

    if(minPrice > maxPrice){
        return [{error: "Precios incorrectos"}]
    }

    //productos con oferta
    if (args.sale){
        const products = await Product.find(
            {"sale": {$eq: true}}
        ).limit(amount)
        return formatDocuments(products)
    }

    //ordenamiento
    if(args.order==="Precio más alto"){
        if (args.category && args.category !== "Todas las categorías"){
            if (args.search){
                //productos sin la propiedad oferta
                const products = await Product.find(
                    {   
                        $and:[
                            {
                                $or: [
                                    {"name": { $regex: args.search, $options: 'i' }},
                                    {"category": { $regex: args.search, $options: 'i' }},
                                    {"type": { $regex: args.search, $options: 'i' }},
                                ]
                            },{
                                "price":{$gte: minPrice}
                            },{
                                "price":{$lte: maxPrice}
                            },{
                                "category":{$eq: args.category}
                            }
                        ]
                        
                    }
                ).limit(amount).sort({"price": -1})
                return formatDocuments(products)
        
            }else{
                const products = await Product.find({   
                    $and:[
                        {
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        },{
                            "category":{$eq: args.category}
                        }
                    ]
                    
                }).limit(amount).sort({"price": -1})
                return formatDocuments(products)
            }
        }
    
        if (args.search){
            //productos sin la propiedad oferta
            const products = await Product.find(
                {   
                    $and:[
                        {
                            $or: [
                                {"name": { $regex: args.search, $options: 'i' }},
                                {"category": { $regex: args.search, $options: 'i' }},
                                {"type": { $regex: args.search, $options: 'i' }},
                            ]
                        },{
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        }
                    ]
                    
                }
            ).limit(amount).sort({"price": -1})
            return formatDocuments(products)
    
        }else{
            const products = await Product.find({   
                $and:[
                    {
                        "price":{$gte: minPrice}
                    },{
                        "price":{$lte: maxPrice}
                    }
                ]
                
            }).limit(amount).sort({"price": -1})
            return formatDocuments(products)
        }
    }

    if(args.order==="Precio más bajo"){
        if (args.category && args.category !== "Todas las categorías"){
            if (args.search){
                //productos sin la propiedad oferta
                const products = await Product.find(
                    {   
                        $and:[
                            {
                                $or: [
                                    {"name": { $regex: args.search, $options: 'i' }},
                                    {"category": { $regex: args.search, $options: 'i' }},
                                    {"type": { $regex: args.search, $options: 'i' }},
                                ]
                            },{
                                "price":{$gte: minPrice}
                            },{
                                "price":{$lte: maxPrice}
                            },{
                                "category":{$eq: args.category}
                            }
                        ]
                        
                    }
                ).limit(amount).sort({"price": 1})
                return formatDocuments(products)
        
            }else{
                const products = await Product.find({   
                    $and:[
                        {
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        },{
                            "category":{$eq: args.category}
                        }
                    ]
                    
                }).limit(amount).sort({"price": 1})
                return formatDocuments(products)
            }
        }
    
        if (args.search){
            //productos sin la propiedad oferta
            const products = await Product.find(
                {   
                    $and:[
                        {
                            $or: [
                                {"name": { $regex: args.search, $options: 'i' }},
                                {"category": { $regex: args.search, $options: 'i' }},
                                {"type": { $regex: args.search, $options: 'i' }},
                            ]
                        },{
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        }
                    ]
                    
                }
            ).limit(amount).sort({"price": 1})
            return formatDocuments(products)
    
        }else{
            const products = await Product.find({   
                $and:[
                    {
                        "price":{$gte: minPrice}
                    },{
                        "price":{$lte: maxPrice}
                    }
                ]
                
            }).limit(amount).sort({"price": 1})
            return formatDocuments(products)
        }
    }

    if(args.order==="Valoración"){
        if (args.category && args.category !== "Todas las categorías"){
            if (args.search){
                //productos sin la propiedad oferta
                const products = await Product.find(
                    {   
                        $and:[
                            {
                                $or: [
                                    {"name": { $regex: args.search, $options: 'i' }},
                                    {"category": { $regex: args.search, $options: 'i' }},
                                    {"type": { $regex: args.search, $options: 'i' }},
                                ]
                            },{
                                "price":{$gte: minPrice}
                            },{
                                "price":{$lte: maxPrice}
                            },{
                                "category":{$eq: args.category}
                            }
                        ]
                        
                    }
                ).limit(amount).sort({"stars": 1})
                return formatDocuments(products)
        
            }else{
                const products = await Product.find({   
                    $and:[
                        {
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        },{
                            "category":{$eq: args.category}
                        }
                    ]
                    
                }).limit(amount).sort({"stars": 1})
                return formatDocuments(products)
            }
        }
    
        if (args.search){
            //productos sin la propiedad oferta
            const products = await Product.find(
                {   
                    $and:[
                        {
                            $or: [
                                {"name": { $regex: args.search, $options: 'i' }},
                                {"category": { $regex: args.search, $options: 'i' }},
                                {"type": { $regex: args.search, $options: 'i' }},
                            ]
                        },{
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        }
                    ]
                    
                }
            ).limit(amount).sort({"stars": 1})
            return formatDocuments(products)
    
        }else{
            const products = await Product.find({   
                $and:[
                    {
                        "price":{$gte: minPrice}
                    },{
                        "price":{$lte: maxPrice}
                    }
                ]
                
            }).limit(amount).sort({"stars": 1})
            return formatDocuments(products)
        }
    }
    
    if (args.category && args.category !== "Todas las categorías"){
        if (args.search){
            //productos sin la propiedad oferta
            const products = await Product.find(
                {   
                    $and:[
                        {
                            $or: [
                                {"name": { $regex: args.search, $options: 'i' }},
                                {"category": { $regex: args.search, $options: 'i' }},
                                {"type": { $regex: args.search, $options: 'i' }},
                            ]
                        },{
                            "price":{$gte: minPrice}
                        },{
                            "price":{$lte: maxPrice}
                        },{
                            "category":{$eq: args.category}
                        }
                    ]
                    
                }
            ).limit(amount)
            return formatDocuments(products)
    
        }else{
            const products = await Product.find({   
                $and:[
                    {
                        "price":{$gte: minPrice}
                    },{
                        "price":{$lte: maxPrice}
                    },{
                        "category":{$eq: args.category}
                    }
                ]
                
            }).limit(amount)
            return formatDocuments(products)
        }
    }

    if (args.search){
        //productos sin la propiedad oferta
        const products = await Product.find(
            {   
                $and:[
                    {
                        $or: [
                            {"name": { $regex: args.search, $options: 'i' }},
                            {"category": { $regex: args.search, $options: 'i' }},
                            {"type": { $regex: args.search, $options: 'i' }},
                        ]
                    },{
                        "price":{$gte: minPrice}
                    },{
                        "price":{$lte: maxPrice}
                    }
                ]
                
            }
        ).limit(amount)
        return formatDocuments(products)

    }else{
        const products = await Product.find({   
            $and:[
                {
                    "price":{$gte: minPrice}
                },{
                    "price":{$lte: maxPrice}
                }
            ]
            
        }).limit(amount)
        return formatDocuments(products)
    }
}


module.exports = {getProducts, getProductOne, addValoration}