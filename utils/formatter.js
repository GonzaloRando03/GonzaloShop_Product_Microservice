const images = require('../data/images.json')

//función para formatear un documento de mongo
function formatDocumentOne(doc){
    if(!doc){
        return {
            error: "Producto no encontrado"
        }
    }
    const response = {...doc}._doc
    //creamos un objeto con los valores de doc y le añadimos el campo virtual stars
    response.stars = doc.stars
    response.id = doc._id
    //images product guarda una array con las imagenes de ese producto
    const imagesProduct = images[parseInt(doc.images)].images
    response.images = imagesProduct
    response.image = imagesProduct[0]
 
    
    return response
}


//función para formatear documentos de mongo
function formatDocuments(documents){
    if(documents.length === 0){
        return [{
            error: "Productos no encontrados"
        }]
    }
    return documents.map(d => formatDocumentOne(d))
}



module.exports = {formatDocumentOne, formatDocuments}