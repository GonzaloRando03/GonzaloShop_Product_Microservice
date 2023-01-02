const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nombre requerido"],
    unique: true,
    minlength: 4
  },
  price: {
    type: Number,
    required: [true, "Precio requerido"],
  },
  category: {
    type: String,
    enum:["Tecnología", "Hogar", "Ropa", "Complementos", "Juguetes", "Cocina", "Sin categoria"],
    required: [true, "Categoría requerida"],
  },
  description: {
    type: String,
    required: [true, "Descripción requerida"],
  },
  features: mongoose.Schema.Types.Mixed,
  images: {
    type: [String],
    require: [true, "Imagenes requeridas"]
  },
  brand: String,
  type: String,
  valorations: {
    username: String,
    text: String,
    stars: Number
  },
  stars: Number
  
})

module.exports = mongoose.model('Products', schema)
