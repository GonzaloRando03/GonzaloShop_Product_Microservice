const Product = require("../models/product")
const axios = require("axios")
const {formatDocumentOne, formatDocuments} = require("../utils/formatter")

const createUser = async (root, args) => {
    const URL = 'http://127.0.0.1:8000/api/users/'
    try {
        const user = {
            name: args.name,
            lastname: args.lastname,
            username: args.username,
            password: args.password,
            email: args.email,
            bank_account: args.bank_account
        }
    
        const response = await axios.post(URL, user)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}


const addMoney = async (root, args) => {
    const URL = 'http://127.0.0.1:8000/api/users/'
    try {
        const user = {
            money: args.money, 
            username: args.username
        }

        const response = await axios.put(URL, user)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}


const delUser = async (root, args) => {
    const URL = 'http://127.0.0.1:8000/api/users/'
    try {
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.delete(URL, config)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}


const loginUser = async (root, args) => {
    const URL = 'http://127.0.0.1:8000/api/login/'
    try {
        const login = {
            username: args.username,
            password: args.password
        }
        const response = await axios.post(URL, login)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}


const sendBuy = async (root, args) => {
    const URL = 'http://127.0.0.1:8001/api/compras/'
    try {
        const buy = {
            idUsuario: args.idUsuario,
            precioTotal: args.precioTotal,
            fechaPedido: args.fechaPedido,
            fechaEntrega: args.fechaEntrega,
            articulos: args.articulos
        }
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.post(URL, buy, config)
        return response.data

    } catch (error) {
        return {
            error: "No tienes dinero suficiente para realizar el pedido."
        }
    }
}


const getBuy = async (root, args) => {
    const URL = 'http://127.0.0.1:8001/api/compras/'
    try {
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.get(URL+String(args.idUsuario), config)
        return response.data

    } catch (error) {
        return {
            error: "Usuario no encontrado o sin permisos"
        }
    }
}

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
                return formatDocuments(products.sort(function(a, b) {
                    return b.stars - a.stars;
                }))
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
            return formatDocuments(products.sort(function(a, b) {
                return b.stars - a.stars;
            }))
    
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
            return formatDocuments(products.sort(function(a, b) {
                return b.stars - a.stars;
            }))
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


module.exports = {
    createUser, 
    addMoney, 
    delUser, 
    loginUser, 
    sendBuy,
    getBuy,
    getProducts, 
    getProductOne, 
    addValoration
}