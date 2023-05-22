//imports 
const {formatDocuments} = require("../utils/formatter")
const Product = require('../models/product')
const searchRouter = require('express').Router()

//constantes con los tipos de orden
const ORDEN = {
    PRECIO_MAS_ALTO: "Precio más alto",
    PRECIO_MAS_BAJO: "Precio más bajo",
    VALORACION: "Valoración",
    DESTACADOS: "Destacados"
}

//función para filtrar los productos con descuento
function filtrarSale(data, oferta){
    if (oferta === 'true') return data.filter(product => product.sale)
    return data
}

//función para filtrar por categoría
function filtrarCategoria(data, categoria){
    if (categoria) return data.filter(p => p.category === categoria)
    return data
}

//función para ordenar por precio mas alto
function ordenarPrecioMasAlto(data){
    return data.sort(function(a, b) {
        return b.price - a.price
    })
}

//función para ordenar por precio mas bajo
function ordenarPrecioMasBajo(data){
    return data.sort(function(a, b) {
        return a.price - b.price
    })
}

//función para ordenar por valoración
function ordenarValoracion(data){
    return data.sort(function(a, b) {
        return b.stars - a.stars;
    })
}

//función para aplicar orden
function aplicarOrden(data, orden){
    switch (orden) {
        case ORDEN.PRECIO_MAS_ALTO:
            return ordenarPrecioMasAlto(data)

        case ORDEN.PRECIO_MAS_BAJO:
            return ordenarPrecioMasBajo(data)

        case ORDEN.VALORACION:
            return ordenarValoracion(data)
        
        default:
            return data
    }
}


//devolver varios productos
searchRouter.get('/:amount/:order/:maxPrice/:minPrice/:search/:sale/:category', async (request, response) => {
  const { search, amount, order, maxPrice, minPrice, sale, category } = request.params

  //mediante una ternaria igualamos a false el parametro search en el caso que no se este buscando
  const searchQuery = search != "no-search"
    ? search
    : false

  //mediante una ternaria igualamos a false el parametro search en el caso que no se este buscando
  const categoryQuery = category != "Todas las categorías"
    ? category
    : false

  //mediante una ternaria comprobamos que la cantidad sea mayor de 40, esto significa que no estamos filtrando por ese campo por lo que si 
  //es true el valor del campo amount es el de todos los documentos de la base de datos, mientras que si es false, no se cambia el valor.
  const amountQuery = parseInt(amount) >= 40 
    ? await Product.collection.countDocuments()
    : parseInt(amount)

  //recogemos el valor del precio máximo y mínimo
  const maxPriceQuery = parseFloat(maxPrice)
  const minPriceQuery = parseFloat(minPrice)


  try {
    //si estamos usando el buscador ejecutamos la siguiente consulta
    if (searchQuery){
        const products = await Product.find(
            {   
                $and:[
                    {
                        $or: [
                            {"name": { $regex: searchQuery, $options: 'i' }},
                            {"category": { $regex: searchQuery, $options: 'i' }},
                            {"type": { $regex: searchQuery, $options: 'i' }},
                        ]
                    },{
                        "price":{$gte: minPriceQuery}
                    },{
                        "price":{$lte: maxPriceQuery}
                    }
                ]
                
            }
        ).limit(amountQuery)
        //aplicamos todos los filtros y ordenamos
        response.status(200).json(
            formatDocuments(
                aplicarOrden(
                    filtrarCategoria(
                        filtrarSale(products, sale), categoryQuery
                    ), order
                )
            )
        )

    //si no estamos usando el buscador ejecutamos la siguiente consulta
    }else{
        const products = await Product.find({   
            $and:[
                {
                    "price":{$gte: minPriceQuery}
                },{
                    "price":{$lte: maxPriceQuery}
                }
            ]
            
        }).limit(amountQuery)

        //aplicamos todos los filtros y ordenamos
        response.status(200).json(
            formatDocuments(
                aplicarOrden(
                    filtrarCategoria(
                        filtrarSale(products, sale), categoryQuery
                    ), order
                )
            )
        )
    }

  //ejecutamos catch en caso de error
  } catch (error) {
    response.status(500).json({error: "Error al encontrar los productos deseados"})
  }
  
})

module.exports = searchRouter
