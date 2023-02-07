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
    type: String,
    require: [true, "Imagenes requeridas"]
  },
  brand: String,
  type: String,
  valorations: {
    username: String,
    text: String,
    stars: Number
  },
  sale: {
    type: Boolean,
    require: true
  }
})

//campo calculado stars
schema.virtual('stars').get(function(){
  const valorations = {...this.valorations}
  const starsTotal = valorations.stars.reduce((a, c) => a + c, 0)
  const stars = (starsTotal/valorations.stars.length)
  if(isNaN(stars)){
    return 0
  }else{
    return stars
  }
})

//formateamos el modelo del json que mandamos al frontend
schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Products', schema)
