//imports 
const {formatDocumentOne} = require("../utils/formatter")
const Product = require('../models/product')
const productRouter = require('express').Router()

//devolver un único producto
productRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  if (!id){
    response.status(500).json({error: "Id no encontrado"})
  }

  try {
    const product = await Product.findById(id)
    response.status(200).json(formatDocumentOne(product)) 

  } catch (error) {
    response.status(500).json({error: "Producto no encontrado"})
  }
  
})


//añadir una valoración
productRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const valoration = request.body

  console.log(valoration)

  if (!id || !valoration){
    response.status(500).json({error: "Error al publicar la valoración"})
  }

  try {
    await Product.updateOne({_id: {$eq: id}}, {$push: {valorations: valoration}})
    const document = await Product.findOne({_id: {$eq: id}})
    response.status(200).json(formatDocumentOne(document)) 

  } catch (error) {
    response.status(500).json({error: "Producto no encontrado"})
  }
  
})

module.exports = productRouter
