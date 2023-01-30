//imports 
const {formatDocuments} = require("../utils/formatter")
const Product = require('../models/product')
const searchRouter = require('express').Router()


//devolver varios productos
searchRouter.get('/:amount/:order/:maxPrice/:minPrice/:search/:sale', async (request, response) => {
  const { search, amount, order, maxPrice, minPrice, sale } = request.params

  const searchQuery = search != "no-search"
    ? search
    : false
  const amountQuery = parseInt(amount) >= 40 
    ? await Product.collection.countDocuments()
    : parseInt(amount)
  const maxPriceQuery = parseFloat(maxPrice)
  const minPriceQuery = parseFloat(minPrice)


  try {
    if (sale === 'true'){
        const products = await Product.find(
            {"sale": {$eq: true}}
        ).limit(amount)
        response.status(200).json(formatDocuments(products))
    }else{
        if (order !== "Destacados"){
            if(order==="Precio más alto"){
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
                  ).limit(amountQuery).sort({"price": -1})
                  response.status(200).json(formatDocuments(products))
          
                }else{
                    const products = await Product.find({   
                        $and:[
                            {
                                "price":{$gte: minPriceQuery}
                            },{
                                "price":{$lte: maxPriceQuery}
                            }
                        ]
                        
                    }).limit(amountQuery).sort({"price": -1})
                    response.status(200).json(formatDocuments(products))
                }
            }
          
            if(order==="Precio más bajo"){
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
                    ).limit(amountQuery).sort({"price": 1})
                    response.status(200).json(formatDocuments(products))
            
                }else{
                    const products = await Product.find({   
                        $and:[
                            {
                                "price":{$gte: minPriceQuery}
                            },{
                                "price":{$lte: maxPriceQuery}
                            }
                        ]
                        
                    }).limit(amountQuery).sort({"price": 1})
                    response.status(200).json(formatDocuments(products))
                }
            }
          
            if(order==="Valoración"){
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
                    ).limit(amountQuery).sort({"stars": 1})
                    response.status(200).json(formatDocuments(products.sort(function(a, b) {
                      return b.stars - a.stars;
                  })))
            
                }else{
                    const products = await Product.find({   
                        $and:[
                            {
                                "price":{$gte: minPriceQuery}
                            },{
                                "price":{$lte: maxPriceQuery}
                            }
                        ]
                        
                    }).limit(amountQuery).sort({"stars": 1})
                    response.status(200).json(formatDocuments(products.sort(function(a, b) {
                      return b.stars - a.stars;
                  })))
                }
            }
          }else{
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
              response.status(200).json(formatDocuments(products))
        
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
              response.status(200).json(formatDocuments(products))
        }
      }
    }

  } catch (error) {
    response.status(500).json({error: "Error al encontrar los productos deseados"})
  }
  
})

module.exports = searchRouter
